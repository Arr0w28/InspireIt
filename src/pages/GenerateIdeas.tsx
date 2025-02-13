import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ChatSidebar from "../Components/chatsidebar";
import BookLoader from "../Components/BookLoader";
import { submitGenerate } from "../api/api";

function GenerateIdeas() {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<string[]>([""]);
  const [specification, setSpecification] = useState("");
  // const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
      // New state to manage chat sidebar visibility
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => setChatOpen(prev => !prev);

  const addDomain = () => setDomains([...domains, ""]);
  const removeDomain = (index: number) => setDomains(domains.filter((_, i) => i !== index));
  const updateDomain = (index: number, value: string) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const handleSubmit = async () => {
    const validDomains = domains.filter((domain) => domain.trim() !== "");
    if (validDomains.length === 0 || !specification.trim()) {
      toast.error("Please fill in at least one domain and the specification");
      return;
    }
  
    setLoading(true);
    try {
      const response = await submitGenerate(validDomains, specification);
      if (response.ideas && response.ideas.length > 0) {
        // Pass only the first idea object
        navigate("/result", { state: { domains: validDomains, specification, generatedData: response.ideas[0] } });
      } else {
        toast.error("No ideas were generated.");
      }
    } catch (error) {
      toast.error("Failed to generate ideas.");
      console.error(error);

      console.log(error)
    }
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-800 text-white p-8 relative">
      <Toaster position="top-center" />
      
      <div className="flex items-center justify-right mb-8">
      </div>
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

      <div className="max-w-4xl w-full p-6 bg-gray-900 bg-opacity-50 rounded-xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Define Your Idea</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Domains</h3>
          {domains.map((domain, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => updateDomain(index, e.target.value)}
                placeholder="Enter a domain"
                className="flex-1 bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
              />
              {domains.length > 1 && (
                <button onClick={() => removeDomain(index)} className="p-2 hover:bg-gray-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button onClick={addDomain} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Plus className="w-5 h-5" /> Add Domain
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold">Specification</h3>
          <textarea
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
            placeholder="Describe your requirements..."
            className="w-full h-[150px] bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="text-xl font-semibold px-10 py-4 rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all"
          >
            {loading ? "Generating..." : "Generate Idea"}
          </button>
        </div>
      </div>

      {loading && <BookLoader />}

      <ChatSidebar 
        isOpen={chatOpen} 
        onClose={toggleChat} 
        showFloatingButton={true} 
      />
    </div>
  );
}

export default GenerateIdeas;