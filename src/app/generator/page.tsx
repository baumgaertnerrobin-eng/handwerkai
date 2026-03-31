"use client";

import { useState } from "react";

export default function GeneratorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const generateContent = async () => {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          topic: input,
          industry: "Handwerker",
          city: "Stuttgart"
        }),
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setResult("Fehler bei der Generierung");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Content Generator</h1>

      <input
        type="text"
        placeholder="Thema eingeben..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <br /><br />

      <button onClick={generateContent}>
        Generieren
      </button>

      <pre>{result}</pre>
    </div>
  );
}