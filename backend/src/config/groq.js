const Groq = require('groq-sdk');

let client = null;

const getGroqClient = () => {
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return client;
};

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

module.exports = { getGroqClient, GROQ_MODEL };