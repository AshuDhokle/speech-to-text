'use client'
import React, { useState } from "react";
import { PuffLoader } from "react-spinners";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");

  const handleInputFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    
    if (!file) return;
    
    setResponse("")
    setFile(file);
    setMessage("");
  };

  const getTranscription = async () => {
    setLoading(true);

    if (!file) {
      setLoading(false);
      setMessage("No file available for transcription.");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);

    try {
      const response = await fetch("/api", {
        method: "POST",
       
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription request failed.");
      const body = await response.json();
      setResponse(body.output.result);
      console.log(body);
      
      setMessage("Transcription successful 😊");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full p-2 border-b-2 border-black text-lg">
        Speech-To-Text
      </div>

      <div className="m-2 p-2 bg-slate-300 border border-black flex flex-row items-center justify-between">
        <input
          type="file"
          accept=".wav, .mp3"
          onChange={handleInputFile}
          disabled={loading}
        />
        <button
          className={`p-2 w-32 rounded-md bg-white hover:bg-gray-100 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={getTranscription}
          disabled={loading}
        >
          Submit
        </button>
      </div>

      <div
        className="w-full overflow-y-scroll p-4 my-4 bg-slate-100 flex flex-col items-center"
        style={{ height: "630px" }}
        >
        {message.length > 0 && <p>{message}</p>}
        {loading && <PuffLoader />}
        <br className="h-2 border"/>
        <p className="text-xl m-2 self-start">Transcription : </p>
        <p>{response}</p>
      </div>
    </div>
  );
}
