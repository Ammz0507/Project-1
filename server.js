require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  experience: String,
  targetRole: String
});
const Resume = mongoose.model('Resume', resumeSchema);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/save', async (req, res) => {
  try {
    const newResume = new Resume(req.body);
    await newResume.save();
    res.json({ success: true, id: newResume._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/roast-and-fix', async (req, res) => {
  try {
    const { text, targetRole } = req.body;
    
    const prompt = `You are a strict, top-tier FAANG recruiter. A candidate applying for ${targetRole} wrote this in their resume: "${text}". 
    Do two things:
    1. ROAST: Brutally but professionally criticize why this bullet point is weak, lacks metrics, or is generic.
    2. GOD_TIER_FIX: Rewrite it using the exact Google XYZ formula (Accomplished X as measured by Y by doing Z). Invent realistic placeholder metrics (like 20%, 500 users, etc.) if they didn't provide any.
    
    Respond STRICTLY in valid JSON format:
    {
      "roast": "...",
      "godTierFix": "..."
    }`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });
    
    const aiData = JSON.parse(response.choices[0].message.content);
    res.json(aiData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000);