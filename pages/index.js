import React, { useState } from "react";
import Header from "../components/Header";
import TextArea from "../components/TextArea";
import GenerateButton from "../components/GenerateButton";
import DownloadButton from "../components/DownloadButton";

const Home = () => {
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState("");
  const [zipBase64, setZipBase64] = useState("");

  const handleGenerate = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    const data = await response.json();
    setHtml(data.html);
    setZipBase64(data.zipBase64);
  };

  return (
    <div>
      <Header />
      <TextArea value={description} setValue={setDescription} />
      <GenerateButton onClick={handleGenerate} disabled={!description} />
      {html && (
        <div>
          <h2>Предпросмотр</h2>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <DownloadButton zipBase64={zipBase64} disabled={!zipBase64} />
        </div>
      )}
    </div>
  );
};

export default Home;