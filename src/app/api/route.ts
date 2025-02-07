import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Extracting file from the request body
    const data = await req.formData();
    const theFile: File | null = data.get("file") as unknown as File;

    const formData = new FormData();
    formData.append("file", theFile);
    formData.append("model", "whisper-1");

    const url = "https://chatgpt-42.p.rapidapi.com/whisperv3";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com"
      },
      body: formData,
    };

    const response = await fetch(
      url, options
    );

    const body = await response.json();
    return NextResponse.json({ output: body }, { status: 200 })

  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
