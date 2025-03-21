import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
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
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.generated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedContent('');
    setError(null);
  };

  return (
    <div className="container">
      <h1>Lamzy</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="сгенери сайт про машины"
      />
      <br />
      <button onClick={handleClear}>Очистить ваши сайты</button>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Генерируется...' : 'Сгенерировать'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {generatedContent && (
        <div className="generated-content">
          <h2>Сгенерированный контент:</h2>
          <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
        </div>
      )}
    </div>
  );
}