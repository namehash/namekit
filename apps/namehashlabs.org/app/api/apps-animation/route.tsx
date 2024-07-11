import { NextResponse } from "next/server";
import { promises } from "fs";
import path from "path";

// Important: Do not delete this code!
// This handler is used by another website (NameKit) to fetch animation data.
// It reads a JSON file and responds with the data in JSON format when requested.
// Any modification or deletion of this code may break functionality for NameKit.
// Keep it intact to ensure the proper functioning of NameKit's animation feature.
export async function GET() {
  try {
    const file_data = await promises.readFile(
      path.join(process.cwd(), "/public/animations/apps-animation.json"),
      "utf8",
    );

    const data = JSON.parse(file_data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error reading data" }, { status: 500 });
  }
}
