import { FreshContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: FreshContext): Promise<Response> => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const filename = url.searchParams.get("filename") || "YTShorts.mp4";
    
    // Construct the file path
    const filePath = `../videos/out/${filename}`;
    
    // Check if file exists
    try {
      const fileInfo = await Deno.stat(filePath);
      if (!fileInfo.isFile) {
        return new Response("File not found", { status: 404 });
      }
    } catch (error) {
      return new Response("File not found", { status: 404 });
    }

    // Read the file
    const fileContent = await Deno.readFile(filePath);
    
    // Return the file with appropriate headers
    return new Response(fileContent, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileContent.length.toString(),
        "Cache-Control": "no-cache",
      },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}; 