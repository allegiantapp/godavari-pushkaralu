/**
 * Audio recorder for iOS/unsupported browsers.
 * Uses MediaRecorder API (supported on iOS Safari 14.3+) to capture audio,
 * then sends it to our API route which proxies to Google Cloud Speech-to-Text.
 */

export interface RecordingSession {
  stop: () => void;
}

/**
 * Check if MediaRecorder is available (for cloud speech fallback)
 */
export function isMediaRecorderSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!navigator.mediaDevices) return false;
  if (typeof MediaRecorder === "undefined") return false;
  return true;
}

/**
 * Start recording audio from the microphone.
 * Returns a session object with a stop() method.
 *
 * @param lang - Language code (te, hi, en)
 * @param onTranscript - Called with the final transcript
 * @param onError - Called on error
 * @param maxDuration - Max recording duration in ms (default 7s)
 */
export function startRecording(
  lang: string,
  onTranscript: (text: string) => void,
  onError: (error: string) => void,
  maxDuration = 7000
): RecordingSession | null {
  let mediaRecorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  let stopped = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    stopped = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch { /* ignore */ }
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  };

  // Start the recording process
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((mediaStream) => {
      if (stopped) {
        mediaStream.getTracks().forEach((t) => t.stop());
        return;
      }

      stream = mediaStream;
      const chunks: Blob[] = [];

      // Pick a supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";

      mediaRecorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : undefined);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        mediaStream.getTracks().forEach((t) => t.stop());

        if (stopped && chunks.length === 0) return;

        const actualMime = mimeType || mediaRecorder?.mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: actualMime });

        // Convert to base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = (reader.result as string).split(",")[1];
          if (!base64) {
            onError("no_audio");
            return;
          }

          try {
            const response = await fetch("/api/speech", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audio: base64, lang, mimeType: actualMime }),
            });

            if (!response.ok) {
              onError("api_error");
              return;
            }

            const data = await response.json();
            if (data.transcript) {
              onTranscript(data.transcript);
            } else {
              onError("no_speech");
            }
          } catch {
            onError("network_error");
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorder.onerror = () => {
        cleanup();
        onError("recorder_error");
      };

      // Start recording with timeslice to ensure data is captured in chunks
      mediaRecorder.start(1000);

      // Auto-stop after maxDuration
      timeoutId = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, maxDuration);
    })
    .catch((err) => {
      const errMsg = err?.name === "NotAllowedError" ? "not_allowed" : "mic_error";
      onError(errMsg);
    });

  return {
    stop: () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      } else {
        cleanup();
      }
    },
  };
}
