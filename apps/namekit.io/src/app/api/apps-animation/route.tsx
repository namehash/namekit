import { NextResponse } from "next/server";
import { promises } from "fs";
import path from "path";

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
