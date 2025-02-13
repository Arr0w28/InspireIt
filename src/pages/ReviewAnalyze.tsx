import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ChatSidebar from "../Components/chatsidebar";
import { generateWithSuggestions } from "../api/api";
import BookLoader from "../Components/BookLoader";

function ReviewAnalyze() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [topics, setTopics] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
      // New state to manage chat sidebar visibility
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => setChatOpen(prev => !prev);

  const handleSubmit = async () => {
    if (!idea.trim() || !topics.trim() || !specifications.trim()) {
      toast.error("Please fill in all fields before proceeding");
      return;
    }

    setLoading(true);
    try {
      const response = await generateWithSuggestions(
        {
          title: "Refined Idea",
          summary: idea,
          drawbacks: ["Potential limitations..."],
          opportunities: ["Possible improvements..."]
        },
        specifications
      );

      if (response.improved_idea) {
        toast.success("Suggestions generated successfully!");
        navigate("/final-paper", { state: { generatedIdea: response.improved_idea[0] } }); // ✅ Pass idea properly
      } else {
        toast.error("Unexpected response format. Try again.");
      }
    } catch (error) {
      toast.error("Failed to generate suggestions. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-800 text-white p-8">
      <Toaster position="top-right" />
      <button 
        onClick={() => navigate("/")} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Review and Analyze</h1>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Refine Your Idea</h2>
          <textarea 
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-300" 
            placeholder="Refine your idea here..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Topics Covered</h2>
          <textarea 
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-300" 
            placeholder="Mention covered topics..."
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <textarea 
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-300" 
            placeholder="Enter additional specifications..."
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleSubmit} 
            className="text-xl font-semibold px-10 py-4 rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all"
            disabled={loading}
          >
            {loading ? <BookLoader /> : "Generate Suggestions"} {/* ✅ Show loader while generating */}
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={chatOpen} 
        onClose={toggleChat} 
        showFloatingButton={true} 
      />
    </div>
  );
}

export default ReviewAnalyze;
