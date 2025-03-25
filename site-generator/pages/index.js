import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Пожалуйста, введите тему');
      return;
    }
    setLoading(true);
    setShowContent(false);
    setGeneratedContent('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось сгенерировать контент');
      }

      setGeneratedContent(data.generated);
      setShowContent(true);
    } catch (error) {
      console.error(error);
      alert('Ошибка генерации контента: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedContent('');
    setShowContent(false);
  };

  return (
    <div className="container">
      <h1>Lamzy</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введите тему для генерации сайта"
      />
      <br />
      <button onClick={handleClear}>Очистить</button>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? (
          <>
            Генерируется... <span className="loader"></span>
          </>
        ) : (
          'Сгенерировать'
        )}
      </button>
      {generatedContent && (
        <div
          className="generated-content"
          style={{ opacity: showContent ? 1 : 0 }}
        >
          <h3>Сгенерированный сайт про {prompt}</h3>
          <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
        </div>
      )}
    </div>
  );
}