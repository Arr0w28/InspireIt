import React, { useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';

function ChatSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'AI response to: ' + input }]);
    }, 1000);
    setInput('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 bg-blue-500 p-4 rounded-full text-white shadow-lg hover:bg-blue-700 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gray-900 text-white transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl font-bold">AI Chat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex flex-col h-[calc(100%-112px)]">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>
                <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-300" 
              placeholder="Type a message..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              onClick={sendMessage} 
              className="px-6 py-4 bg-blue-500 rounded-lg text-white hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatSidebar;
