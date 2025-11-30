import { useRef } from "react";

export default function VoiceRecorder({ onResult }) {
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
     
      
      onResult(text);    // send text back to parent

    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return { startListening };
}
