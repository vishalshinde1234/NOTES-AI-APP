const { getGroqClient, GROQ_MODEL } = require('../config/groq');

const callGroq = async (system, userMsg) => {
  const client = getGroqClient();
  const res = await client.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 1500,
    messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
  });
  return res.choices[0]?.message?.content?.trim() || '';
};

const generateNote = async (req, res, next) => {
  try {
    const result = await callGroq(
      'You are a professional note-taking AI. Generate a well-structured note with a title and sections using markdown.',
      req.body.prompt
    );
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

const summarizeNote = async (req, res, next) => {
  try {
    const result = await callGroq(
      'Summarize the following note into 3-5 concise bullet points. Use "• " prefix.',
      req.body.content
    );
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

const improveNote = async (req, res, next) => {
  try {
    const result = await callGroq(
      'Rewrite the following text in a professional, corporate tone. Keep original meaning. Return only improved text.',
      req.body.content
    );
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

const makeBullets = async (req, res, next) => {
  try {
    const result = await callGroq(
      'Convert the following text into clean bullet points. Use "• " prefix for each point.',
      req.body.content
    );
    res.json({ success: true, result });
  } catch (err) { next(err); }
};

module.exports = { generateNote, summarizeNote, improveNote, makeBullets };