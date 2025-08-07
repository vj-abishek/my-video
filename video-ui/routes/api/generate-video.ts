import { FreshContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: FreshContext): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await req.formData();
    const tweetId = formData.get("tweetId") as string;
    const duration = formData.get("duration") as string;
    const outputType = formData.get("outputType") as string;
    const includeAudio = formData.get("includeAudio") as string;

    if (!tweetId) {
      return new Response("Tweet ID is required", { status: 400 });
    }

    // Create a readable stream for the response
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        
        // Function to send data to the client
        const sendData = (data: string) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'log', message: data })}\n\n`));
          } catch (error) {
            // Client may have disconnected
            console.error("Failed to send data:", error);
          }
        };

        // Function to send completion status
        const sendComplete = (success: boolean, message: string, filename: string = "") => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', success, message, filename })}\n\n`));
            controller.close();
          } catch (error) {
            console.error("Failed to send completion:", error);
          }
        };

        // Start the process asynchronously
        (async () => {
          let process: Deno.Process | null = null;
          
          try {
            sendData("Starting video generation...");
            
            // Create the command with parameters
            const renderTime = duration || "9";
            const includeMusic = includeAudio === "true" ? "y" : "n";
            const renderMode = outputType || "tweet";
            
            // Prepare the command
            const command = `cd ../videos && echo "${renderTime}\n${includeMusic}\n${renderMode}" | ./fetch.sh ${tweetId}`;
            
            sendData(`Executing command: ${command}`);
            
            // Execute the command
            process = Deno.run({
              cmd: ["sh", "-c", command],
              stdout: "piped",
              stderr: "piped",
              cwd: "."
            });

            // Read stdout
            const stdout = process.stdout.readable;
            const reader = stdout.getReader();
            
            // Read stderr
            const stderr = process.stderr.readable;
            const stderrReader = stderr.getReader();

            // Function to read from a stream
            const readStream = async (streamReader: ReadableStreamDefaultReader<Uint8Array>, isError = false) => {
              try {
                while (true) {
                  const { done, value } = await streamReader.read();
                  if (done) break;
                  
                  const text = new TextDecoder().decode(value);
                  const lines = text.split('\n').filter(line => line.trim());
                  
                  for (const line of lines) {
                    if (line.trim()) {
                      sendData(`${isError ? 'ERROR: ' : ''}${line}`);
                    }
                  }
                }
              } catch (error) {
                sendData(`Error reading ${isError ? 'stderr' : 'stdout'}: ${error.message}`);
              }
            };

            // Read both streams concurrently
            await Promise.all([
              readStream(reader, false),
              readStream(stderrReader, true)
            ]);
            
            const status = await process.status();
            
            if (status.success) {
              // Check if the video file was created
              const videoPath = "../videos/out/YTShorts.mp4";
              try {
                const fileInfo = await Deno.stat(videoPath);
                if (fileInfo.isFile) {
                  sendComplete(true, "Video generation completed successfully!", "YTShorts.mp4");
                } else {
                  sendComplete(true, "Video generation completed but file not found!", "");
                }
              } catch (error) {
                sendComplete(true, "Video generation completed but file not found!", "");
              }
            } else {
              sendComplete(false, `Process failed with exit code: ${status.code}`, "");
            }
            
          } catch (error) {
            sendComplete(false, `Process error: ${error.message}`);
          } finally {
            // Clean up the process
            if (process) {
              try {
                process.close();
              } catch (error) {
                console.error("Error closing process:", error);
              }
            }
          }
        })();

      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}; 