import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { sendChatMessage } from '../api/api'; // Import chatbot API function
import ReactMarkdown from 'react-markdown';

// TypingIndicator component using your provided markup
const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

// Custom CodeBlock component for rendering code in markdown messages
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  return !inline ? (
    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto my-2">
      <code className={className} {...props}>
        {children}
      </code>
    </pre>
  ) : (
    <code className="bg-gray-800 p-1 rounded" {...props}>
      {children}
    </code>
  );
};

function ChatSidebar({ isOpen, onClose, showFloatingButton }: { isOpen: boolean; onClose: () => void; showFloatingButton: boolean }) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message function with markdown formatting and typing indicator
  const sendMessage = async () => {
    if (input.trim() === '') return;
    const userMessage = input;
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    // Clear input
    setInput('');
    // Add temporary AI placeholder message
    setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
    setLoading(true);

    try {
      // Call chatbot API with the user's message
      const response = await sendChatMessage(userMessage);
      const botReply = response.response || 'No response received.';
      // Replace the last message (placeholder) with the actual response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'ai', text: botReply };
        return newMessages;
      });
    } catch (error) {
      // Replace placeholder with error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { sender: 'ai', text: 'Error fetching response.' };
        return newMessages;
      });
    }
    setLoading(false);
  };
  

  return (
    <>
      {/* Floating Chat Button */}
      {showFloatingButton && (
        <button
          onClick={onClose}
          title="Open AstraBot chat"
          className="fixed bottom-6 right-6 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-full 
                     text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-gradient-to-b from-gray-900 to-black text-white 
                   transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
                   shadow-xl z-50`}
      >
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <h2 className="text-lg font-semibold text-white">AstraBot</h2>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-b from-gray-900/50 to-black/50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center px-8">
                <p>Start a conversation with AstraBot</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl break-words backdrop-blur-sm
                        ${msg.sender === 'user'
                          ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-lg ml-4'
                          : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-xl mr-4'
                        }`}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {msg.sender === 'ai' && msg.text === '' && loading ? (
                        <TypingIndicator />
                      ) : (
                        <ReactMarkdown components={{ code: CodeBlock }}>
                          {msg.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-gray-700 focus:border-gray-600 transition-all"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl text-white
                         hover:from-gray-600 hover:to-gray-700 transition-all duration-200 
                         flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatSidebar;
