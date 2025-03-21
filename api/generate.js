export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'HUGGING_FACE_API_KEY is not defined' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text || 'No content generated';

    // Преобразуем текст в HTML (пример)
    const generatedHtml = `
      <h3>Сгенерированный сайт про ${prompt}</h3>
      <p>${generatedText}</p>
    `;

    res.status(200).json({ generated: generatedHtml });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}