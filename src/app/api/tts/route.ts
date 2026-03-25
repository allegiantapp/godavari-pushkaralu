import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_SPEECH_API_KEY;
const GOOGLE_TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`;

// Google Cloud TTS voice names — Chirp3-HD (best quality, most natural)
const voiceMap: Record<string, { languageCode: string; name: string }> = {
  te: { languageCode: "te-IN", name: "te-IN-Chirp3-HD-Achernar" },
  hi: { languageCode: "hi-IN", name: "hi-IN-Chirp3-HD-Achernar" },
  en: { languageCode: "en-IN", name: "en-IN-Chirp3-HD-Achernar" },
};

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "TTS API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { text, lang } = body;

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const voice = voiceMap[lang] || voiceMap["en"];

    const response = await fetch(GOOGLE_TTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: voice.languageCode,
          name: voice.name,
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 0.95,
          pitch: 0,
          volumeGainDb: 0,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google TTS API error:", errorText);
      // If specific voice fails, retry without voice name (use any available)
      const retryResponse = await fetch(GOOGLE_TTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voice.languageCode,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.95,
          },
        }),
      });

      if (!retryResponse.ok) {
        return NextResponse.json(
          { error: "TTS request failed" },
          { status: retryResponse.status }
        );
      }

      const retryData = await retryResponse.json();
      return NextResponse.json({ audio: retryData.audioContent });
    }

    const data = await response.json();
    return NextResponse.json({ audio: data.audioContent });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
