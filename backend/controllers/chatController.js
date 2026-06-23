const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');

// @desc    Extract text from uploaded PDF
// @route   POST /api/chat/extract-pdf
// @access  Private
const extractPdfText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from the PDF file buffer in memory
    const data = await pdfParse(req.file.buffer);
    
    // We limit the text just slightly to ensure it doesn't break JSON limits
    res.json({ text: data.text });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    res.status(500).json({ message: 'Error extracting PDF text: ' + error.message });
  }
};

// @desc    Send message to Gemini API with PDF context
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { message, documentText, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Construct the System Instruction
    // This tells the AI who it is and what its job is.
    let systemInstruction = "You are an incredibly helpful, friendly, and encouraging AI Study Assistant for a platform called PrepNext. Your goal is to help students understand their study materials, summarize concepts, generate MCQs, and explain difficult topics simply.";
    
    // If the user uploaded a document, we append it to the system instructions so the AI "knows" the context
    if (documentText) {
      systemInstruction += `\n\nHere is the study material the user has uploaded. Base your answers primarily on this text if relevant:\n\n---\n${documentText.substring(0, 800000)}\n---`; 
    }

    // 2. Construct the Conversation Prompt
    // We pass the history so the AI remembers what was just said
    let fullPrompt = "";
    if (history && history.length > 0) {
       fullPrompt += "--- Previous Chat History ---\n";
       history.forEach(msg => {
          fullPrompt += `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}\n`;
       });
       fullPrompt += "---------------------------\n\n";
    }
    
    // Add the current message
    fullPrompt += `Student: ${message}\nAssistant:`;

    // 3. Send to Gemini 
    // We use the latest Flash model because it's insanely fast and has a huge token context window
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: fullPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
        }
    });

    // 4. Return the AI's response text to the frontend
    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: 'Error communicating with AI Assistant: ' + error.message });
  }
};

module.exports = {
  extractPdfText,
  sendMessage
};
