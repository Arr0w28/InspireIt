import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatSidebar from '../Components/chatsidebar';
import BookLoader from '../Components/BookLoader';
import { postRecommend } from '../api/api';

function FinalPaper() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract both possible sources of idea
  const { idea, generatedIdea } = location.state || {};
  console.log("FinalPaper.tsx: Received idea:", idea);
  console.log("FinalPaper.tsx: Received generated idea:", generatedIdea);

  const [finalPaperData, setFinalPaperData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  // New state to manage chat sidebar visibility
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => setChatOpen(prev => !prev);

  // If generatedIdea exists, we assume the page is routed from ReviewAnalyze.
  // Otherwise, it's routed from IdeaResults.
  const isReviewAnalyze = Boolean(generatedIdea);

  useEffect(() => {
    if (generatedIdea) {
      console.log("FinalPaper.tsx: Using generated idea from ReviewAnalyze.tsx");
      setFinalPaperData(generatedIdea); // Directly use generated idea
    } else if (idea) {
      console.log("FinalPaper.tsx: Using idea from Idea Results page");
      
      const paperData = {
        title: idea.title,
        summary: idea.summary,
        drawbacks: idea.drawbacks || [],
        opportunities: idea.opportunities || [],
      };

      console.log("FinalPaper.tsx: Sending paperData to recommend API:", paperData);
      setLoading(true);
      postRecommend(paperData)
        .then((response) => {
          const data = response.data ? response.data : response;
          console.log("FinalPaper.tsx: Raw response from recommend API:", data);

          if (data.improved_idea) {
            if (Array.isArray(data.improved_idea) && data.improved_idea.length > 0) {
              setFinalPaperData(data.improved_idea[0]);
            } else if (typeof data.improved_idea === 'object') {
              setFinalPaperData(data.improved_idea);
            } else {
              setFinalPaperData(null);
            }
          } else {
            setFinalPaperData(data);
          }
        })
        .catch((error) => {
          console.error('FinalPaper.tsx: Failed to fetch final paper details:', error);
        })
        .finally(() => setLoading(false));
    } else {
      console.log("FinalPaper.tsx: No idea data received!");
    }
  }, [idea, generatedIdea]);

  const typingAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-800 text-white p-8 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to home
      </button>

      <div className="max-w-4xl mx-auto" ref={contentRef}>
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial="hidden"
          animate="visible"
          variants={typingAnimation}
        >
          Final Paper Details
        </motion.h1>

        {loading ? (
          <div className="flex justify-center">
            <BookLoader />
          </div>
        ) : finalPaperData ? (
          <>
            {/* Always display Title */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Title</h2>
              <p className="text-gray-400">{finalPaperData.title || "No title available"}</p>
            </div>

            {isReviewAnalyze ? (
              <>
                {/* Routed from Review and Analyze: Title, Abstract, Opportunities, and Drawbacks */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Abstract</h2>
                  <p className="text-gray-400">{finalPaperData.description || "No abstract available"}</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Opportunities</h2>
                  <ul className="list-disc list-inside text-gray-400">
                    {finalPaperData?.opportunities && finalPaperData.opportunities.length > 0 ? (
                      finalPaperData.opportunities.map((opportunity: string, index: number) => (
                        <li key={index}>{opportunity}</li>
                      ))
                    ) : (
                      <li>No opportunities available.</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Drawbacks</h2>
                  <ul className="list-disc list-inside text-gray-400">
                    {finalPaperData?.drawbacks && finalPaperData.drawbacks.length > 0 ? (
                      finalPaperData.drawbacks.map((drawback: string, index: number) => (
                        <li key={index}>{drawback}</li>
                      ))
                    ) : (
                      <li>No drawbacks listed.</li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Routed from Idea Results: Title, Recommended Methodology, and Existing Work */}
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Recommended Methodology</h2>
                  <p className="text-gray-400">{finalPaperData.Methodology_recommended || "No methodology recommended"}</p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Existing Work</h2>
                  <ul className="list-disc list-inside text-gray-400">
                    {finalPaperData?.Existing_work && finalPaperData.Existing_work.length > 0 ? (
                      finalPaperData.Existing_work.map((work: string, index: number) => (
                        <li key={index}>{work}</li>
                      ))
                    ) : (
                      <li>No existing work available.</li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400">No final paper details available.</p>
        )}
      </div>

      <ChatSidebar 
        isOpen={chatOpen} 
        onClose={toggleChat} 
        showFloatingButton={true} 
      />
    </div>
  );
}

export default FinalPaper;
