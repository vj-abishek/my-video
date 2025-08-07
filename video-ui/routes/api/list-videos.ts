import { FreshContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: FreshContext): Promise<Response> => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const outputDir = "../videos/out";
    
    // Check if directory exists
    try {
      const dirInfo = await Deno.stat(outputDir);
      if (!dirInfo.isDirectory) {
        return new Response("Output directory not found", { status: 404 });
      }
    } catch (error) {
      return new Response("Output directory not found", { status: 404 });
    }

    // Read directory contents
    const files: string[] = [];
    for await (const entry of Deno.readDir(outputDir)) {
      if (entry.isFile && entry.name.endsWith('.mp4')) {
        files.push(entry.name);
      }
    }

    // Return the list of files
    return new Response(JSON.stringify({ files }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}; 