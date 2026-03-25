import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_SPEECH_API_KEY;
const GOOGLE_SPEECH_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Speech API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { audio, lang } = body;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio data provided" },
        { status: 400 }
      );
    }

    // Map app language to Google Speech language code
    const langMap: Record<string, string> = {
      te: "te-IN",
      hi: "hi-IN",
      en: "en-IN",
    };

    const languageCode = langMap[lang] || "te-IN";

    // Call Google Cloud Speech-to-Text
    const response = await fetch(GOOGLE_SPEECH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode,
          alternativeLanguageCodes: ["te-IN", "hi-IN", "en-IN"],
          model: "default",
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: audio, // base64 encoded audio
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Speech API error:", errorText);
      return NextResponse.json(
        { error: "Speech API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract transcript from response
    const transcript =
      data.results?.[0]?.alternatives?.[0]?.transcript || "";

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("Speech API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
