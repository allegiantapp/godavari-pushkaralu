import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_SPEECH_API_KEY;
const GOOGLE_SPEECH_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;

// Map browser MIME types to Google Speech encoding types
function getEncoding(mimeType: string): { encoding: string; sampleRateHertz: number } {
  if (mimeType.includes("webm") && mimeType.includes("opus")) {
    return { encoding: "WEBM_OPUS", sampleRateHertz: 48000 };
  }
  if (mimeType.includes("webm")) {
    return { encoding: "WEBM_OPUS", sampleRateHertz: 48000 };
  }
  if (mimeType.includes("ogg")) {
    return { encoding: "OGG_OPUS", sampleRateHertz: 48000 };
  }
  // iOS Safari uses mp4/aac
  if (mimeType.includes("mp4") || mimeType.includes("aac") || mimeType.includes("m4a")) {
    // For MP4/AAC, we need to let Google auto-detect
    // Use encoding "ENCODING_UNSPECIFIED" and let it figure it out
    return { encoding: "ENCODING_UNSPECIFIED", sampleRateHertz: 0 };
  }
  // Default: let Google auto-detect
  return { encoding: "ENCODING_UNSPECIFIED", sampleRateHertz: 0 };
}

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Speech API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { audio, lang, mimeType } = body;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio data provided" },
        { status: 400 }
      );
    }

    const langMap: Record<string, string> = {
      te: "te-IN",
      hi: "hi-IN",
      en: "en-IN",
    };

    const languageCode = langMap[lang] || "te-IN";
    const { encoding, sampleRateHertz } = getEncoding(mimeType || "");

    // Build config — omit sampleRateHertz if auto-detecting
    const config: Record<string, unknown> = {
      languageCode,
      alternativeLanguageCodes: ["te-IN", "hi-IN", "en-IN"],
      model: "default",
      enableAutomaticPunctuation: true,
    };

    if (encoding !== "ENCODING_UNSPECIFIED") {
      config.encoding = encoding;
      config.sampleRateHertz = sampleRateHertz;
    }

    const response = await fetch(GOOGLE_SPEECH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config,
        audio: {
          content: audio,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Speech API error:", errorText);
      return NextResponse.json(
        { error: "Speech API request failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
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
