import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import handlebars from 'handlebars';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

async function generateWebsite(description) {
  const siteType = await classifySiteType(description);
  const templateDir = path.join(process.cwd(), 'templates', siteType);
  const htmlTemplate = fs.readFileSync(path.join(templateDir, 'index.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(templateDir, 'style.css'), 'utf8');

  const sections = ['title', 'header_text', 'main_content', 'footer_text'];
  const generatedText = {};
  for (const section of sections) {
    const prompt = `Generate ${section} for a ${siteType} website based on: ${description}`;
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompt,
      max_length: 100,
    });
    generatedText[section] = response.generated_text;
  }

  const imagePrompt = `Image for a ${siteType} website based on: ${description}`;
  const imageBlob = await hf.textToImage({
    model: 'stabilityai/stable-diffusion-2',
    inputs: imagePrompt,
  });
  const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

  const template = handlebars.compile(htmlTemplate);
  const filledHtml = template({
    title: generatedText.title,
    header_text: generatedText.header_text,
    main_content: generatedText.main_content,
    footer_text: generatedText.footer_text,
    image_src: 'data:image/png;base64,' + imageBuffer.toString('base64'),
  });

  const archive = archiver('zip');
  const output = [];
  archive.on('data', (chunk) => output.push(chunk));
  archive.append(filledHtml, { name: 'index.html' });
  archive.append(cssContent, { name: 'style.css' });
  archive.append(imageBuffer, { name: 'images/image.png' });
  await archive.finalize();
  const zipBuffer = Buffer.concat(output);
  const zipBase64 = zipBuffer.toString('base64');

  return { html: filledHtml, zipBase64 };
}

async function classifySiteType(description) {
  const prompt = `Classify the website type based on: ${description}. Options: blog, corporate, portfolio`;
  const response = await hf.textGeneration({
    model: 'gpt2',
    inputs: prompt,
    max_length: 20,
  });
  return response.generated_text.trim().toLowerCase() || 'blog';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { description } = req.body;
  try {
    const { html, zipBase64 } = await generateWebsite(description);
    res.status(200).json({ html, zipBase64 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}