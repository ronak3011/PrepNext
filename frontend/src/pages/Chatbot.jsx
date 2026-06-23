import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Send, Upload, FileText, Bot, User, Trash2 } from 'lucide-react'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I am your AI Study Assistant. You can ask me general questions, or upload a PDF document and I can summarize it, generate MCQs, or explain its concepts!' 
    }
  ])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [documentText, setDocumentText] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.')
      return
    }

    setFile(selectedFile)
    setUploading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('/api/chat/extract-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setDocumentText(response.data.text)
      
      // Notify the user in the chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I've successfully read "${selectedFile.name}". What would you like to know about it? You can ask me to summarize it, explain key concepts, or generate practice questions!` 
      }])
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to read the PDF file. Please try again.')
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setDocumentText('')
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: "I've cleared the document from my memory. We can continue our general chat or you can upload a new PDF!" 
    }])
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input.trim() }
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // We pass the history excluding the very first greeting message to save tokens
      const chatHistory = messages.slice(1)

      const response = await axios.post('/api/chat/message', {
        message: userMessage.content,
        documentText: documentText, // Will be empty if no file uploaded
        history: chatHistory
      })

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.text }])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error.response?.data?.message || 'Sorry, I encountered an error. Please make sure the backend is running and the Gemini API key is configured correctly.';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col fade-in">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Bot className="text-primary w-8 h-8" />
            AI Study Assistant
          </h1>
          <p className="text-textSecondary mt-1">Chat with your study materials instantly.</p>
        </div>

        {/* Upload Button Area */}
        <div className="flex items-center gap-4">
          {file ? (
            <div className="flex items-center gap-3 bg-surface border border-borders px-4 py-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex flex-col max-w-[150px] sm:max-w-[200px]">
                <span className="text-sm font-medium text-textPrimary truncate">{file.name}</span>
                <span className="text-xs text-textSecondary">Document Loaded</span>
              </div>
              <button onClick={removeFile} className="ml-2 text-red-500 hover:text-red-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label 
                htmlFor="pdf-upload" 
                className={`flex items-center gap-2 px-4 py-2 bg-cards border border-borders rounded-lg cursor-pointer hover:bg-surface transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-textPrimary text-sm font-medium">
                  {uploading ? 'Reading...' : 'Upload PDF'}
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-surface border border-borders rounded-xl overflow-hidden flex flex-col shadow-lg">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Avatar (Left side for AI) */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}

              {/* Message Bubble */}
              <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-cards border border-borders text-textPrimary rounded-tl-none whitespace-pre-wrap leading-relaxed'
                }`}
              >
                {msg.content}
              </div>

              {/* Avatar (Right side for User) */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-surface border border-borders flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-textSecondary" />
                </div>
              )}

            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-cards border border-borders rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-cards border-t border-borders">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or type a prompt..."
              className="flex-1 bg-surface border border-borders rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-textSecondary">
            AI can make mistakes. Always double-check important study facts.
          </div>
        </div>

      </div>
    </div>
  )
}

export default Chatbot
