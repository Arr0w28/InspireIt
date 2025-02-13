import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Search, ArrowDown } from 'lucide-react';
import ChatSidebar from '../Components/chatsidebar';

function HomePage() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const titleOpacity = Math.max(0, 1 - scrollPosition / 500);
  const buttonsOpacity = Math.min(1, (scrollPosition - 300) / 500);
  const buttonsTransform = `translateY(${Math.max(0, 100 - scrollPosition / 5)}px)`;


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-white">
      {/* Hero Section */}
      <section
        className="h-screen flex flex-col items-center justify-center fixed inset-0 pointer-events-none"
        style={{
          opacity: titleOpacity,
          transform: `scale(${1 + scrollPosition / 1000})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="text-center">
          <h1 className="text-[15rem] font-bold tracking-tighter mb-4 bg-gradient-to-b from-black via-gray-600 to-black bg-clip-text text-transparent leading-none">
            InspireIT
          </h1>
          <p className="text-3xl text-gray-400 mt-8">bringing inspirations to life.</p>
        </div>
      </section>
      

      {/* Features Section */}
      <div
        className="min-h-screen flex items-center relative"
        style={{
          marginTop: '100vh',
          opacity: buttonsOpacity,
          transform: buttonsTransform,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="w-full px-8 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Generate Ideas */}
            <div className="flex flex-col items-center text-center space-y-8 group">
              <button
                onClick={() => navigate('/generate')}
                className="flex items-center gap-4 text-3xl font-semibold transition-all duration-300 hover:bg-white hover:text-black px-10 py-6 rounded-full bg-transparent border-2 border-white text-white hover:scale-105 pointer-events-auto"
              >
                <Sparkles className="w-8 h-8" />
                Generate Ideas
              </button>
              <p className="text-gray-300 text-lg max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Let AI help you brainstorm innovative business ideas across multiple domains
              </p>
            </div>

            {/* Review & Analyze */}
            <div className="flex flex-col items-center text-center space-y-8 group">
              <button
                onClick={() => navigate('/review-analyze')}
                className="flex items-center gap-4 text-3xl font-semibold transition-all duration-300 hover:bg-white hover:text-black px-10 py-6 rounded-full bg-transparent border-2 border-white text-white hover:scale-105 pointer-events-auto"
              >
                <Brain className="w-8 h-8" />
                Review & Analyze
              </button>
              <p className="text-gray-300 text-lg max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Get detailed analysis and feedback on your business ideas
              </p>
            </div>

            {/* Explore More */}
            <div className="flex flex-col items-center text-center space-y-8 group">
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-4 text-3xl font-semibold transition-all duration-300 hover:bg-white hover:text-black px-10 py-6 rounded-full bg-transparent border-2 border-white text-white hover:scale-105 pointer-events-auto"
              >
                <Search className="w-8 h-8" />
                Explore More
              </button>
              <p className="text-gray-300 text-lg max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Discover additional tools and resources for innovative research ideas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} showFloatingButton={false} />
      <button
  onClick={scrollToBottom}
  className="absolute bottom-6 right-6 transform -translate-x-1/2 bg-gray-800 p-4 rounded-full text-white shadow-lg hover:bg-gray-400 z-50"
>
  <ArrowDown className="w-6 h-6" />
</button>

    </div>
  );
}

export default HomePage;