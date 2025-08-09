import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: '只支持 POST 请求' });
    return;
  }

  const { scene, text } = req.body;
  if (!text) {
    res.status(400).json({ error: '缺少文本参数' });
    return;
  }

  // 这里你可以根据场景定义不同的提示词
  const prompts = {
    restaurant: "You are a waiter. Please reply to this English sentence politely.",
    shopping: "You are a shop assistant. Please reply politely.",
    asking_directions: "You are a helpful local. Please answer clearly.",
    hotel: "You are a hotel receptionist. Please reply politely.",
    small_talk: "You are having a friendly small talk.",
  };
  const promptPrefix = prompts[scene] || "You are a friendly English speaker.";

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: promptPrefix },
        { role: "user", content: text }
      ],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;

    // 简单打分和建议（示例）
    let score = "Good";
    let tips = "Keep practicing speaking clearly.";

    res.status(200).json({ reply, score, tips });
  } catch (error) {
    res.status(500).json({ error: error.message || '服务器错误' });
  }
}
