import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatSidebar from '../Components/chatsidebar';
import { submitGenerate, postRecommend } from '../api/api';
import toast, { Toaster } from 'react-hot-toast';
import BookLoader from '../Components/BookLoader'; // Using the same loader as GenerateIdeas

function IdeaResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { domains, specification, generatedData: initialData } = location.state || {
    domains: [],
    specification: '',
    generatedData: null,
  };

  let initialIdeas = [];
  if (initialData) {
    if (Array.isArray(initialData)) {
      initialIdeas = initialData;
    } else if (typeof initialData === 'object' && 'ideas' in initialData && Array.isArray(initialData.ideas)) {
      initialIdeas = initialData.ideas;
    }
  }

  const [generatedIdeas, setGeneratedIdeas] = useState(initialIdeas);
  const [loading, setLoading] = useState(false);
  const [recommendedIdea, setRecommendedIdea] = useState(null);
    // New state to manage chat sidebar visibility
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => setChatOpen(prev => !prev);

  // States for per-idea extra specification prompt and optimized response.
  const [extraSpecVisible, setExtraSpecVisible] = useState({});
  const [extraSpecInputs, setExtraSpecInputs] = useState({});
  const [optimizedIdeas, setOptimizedIdeas] = useState({});
  const [loadingOptimized, setLoadingOptimized] = useState({});

  useEffect(() => {
    const shouldFetch =
      !initialData ||
      (typeof initialData === 'object' && !('ideas' in initialData)) ||
      (Array.isArray(initialData) && initialData.length === 0);

    if (shouldFetch && domains.length > 0 && specification) {
      console.log("No valid initial data; calling submitGenerate...");
      setLoading(true);
      submitGenerate(domains, specification)
        .then((data) => {
          console.log("Data returned from submitGenerate:", data);
          if (data && data.ideas && Array.isArray(data.ideas) && data.ideas.length > 0) {
            setGeneratedIdeas(data.ideas);
          } else {
            toast.error("No ideas were generated.");
          }
        })
        .catch((error) => {
          console.error("Error fetching generated idea:", error);
          toast.error("Failed to generate idea.");
        })
        .finally(() => setLoading(false));
    }
  }, [initialData, domains, specification]);

  const handleRecommend = async () => {
    if (!generatedIdeas || generatedIdeas.length === 0) {
      toast.error("No generated data available to improve.");
      return;
    }

    const ideaToImprove = generatedIdeas[0];
    const paperData = {
      title: ideaToImprove.title,
      summary: ideaToImprove.summary,
      drawbacks: ideaToImprove.drawbacks || [],
      opportunities: ideaToImprove.opportunities || [],
    };

    setLoading(true);
    try {
      const response = await postRecommend(paperData);
      setRecommendedIdea(response);
      toast.success("Better recommendation received!");
    } catch (error) {
      toast.error("Failed to fetch a better recommendation.");
      console.error(error);
    }
    setLoading(false);
  };

  // Function to handle extra specification optimization per idea block.
  const handleOptimizeIdea = async (index, idea) => {
    const spec = extraSpecInputs[index];
    if (!spec) {
      toast.error("Please provide extra specification.");
      return;
    }
    setLoadingOptimized((prev) => ({ ...prev, [index]: true }));
    const payload = {
      origDetails: {
        title: idea.title,
        summary: idea.summary,
        // Ensure drawbacks/opportunities are arrays.
        drawbacks: idea.drawbacks && Array.isArray(idea.drawbacks) ? idea.drawbacks : idea.drawbacks ? [idea.drawbacks] : [],
        opportunities: idea.opportunities && Array.isArray(idea.opportunities) ? idea.opportunities : idea.opportunities ? [idea.opportunities] : []
      },
      specifications: spec
    };
    try {
      const response = await fetch('http://34.172.161.191:8000/generate/submit/extra-suggestions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data && data.improved_idea && data.improved_idea.length > 0) {
        setOptimizedIdeas((prev) => ({ ...prev, [index]: data.improved_idea[0] }));
        toast.success("Idea optimized successfully!");
      } else {
        toast.error("No optimized idea returned.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to optimize idea.");
    }
    setLoadingOptimized((prev) => ({ ...prev, [index]: false }));
    // Optionally hide the extra spec prompt after execution.
    setExtraSpecVisible((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-gray-800 text-white p-8">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto relative">
        <button
          onClick={() => navigate('/generate')}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Generator
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center">Your Generated Ideas</h1>

        {loading ? (
          <div className="flex justify-center">
            <BookLoader />
          </div>
        ) : generatedIdeas && generatedIdeas.length > 0 ? (
          generatedIdeas.map((idea, index) => (
            <div key={index} className="bg-gray-900 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Idea {index + 1}: {idea.title}
              </h2>
              <p className="text-lg mb-4">{idea.summary}</p>

              <div className="overflow-x-auto mb-4">
                <table className="min-w-full text-sm text-gray-300 border border-gray-700">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 border border-gray-700">Drawbacks</th>
                      <th className="px-4 py-2 border border-gray-700">Opportunities</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-gray-700">
                        {idea.drawbacks && Array.isArray(idea.drawbacks)
                          ? idea.drawbacks.join(', ')
                          : idea.drawbacks || 'N/A'}
                      </td>
                      <td className="px-4 py-2 border border-gray-700">
                        {idea.opportunities && Array.isArray(idea.opportunities)
                          ? idea.opportunities.join(', ')
                          : idea.opportunities || 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {idea.references && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Related Papers</h3>
                  <ul className="list-disc list-inside">
                    {Array.isArray(idea.references)
                      ? idea.references.map((ref, i) => (
                          <li key={i}>
                            <a
                              href={ref.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {ref.title}
                            </a>
                          </li>
                        ))
                      : Object.values(idea.references).map((ref, i) => (
                          <li key={i}>
                            <a
                              href={ref.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {ref.title}
                            </a>
                          </li>
                        ))}
                  </ul>
                </div>
              )}

              {/* Develop Idea Button */}
              <button
                onClick={() => navigate('/final-paper', { state: { idea } })}
                className="w-80 mt-4 text-xl font-semibold px-6 py-3 rounded-full bg-gray-900 border-2 border-white text-white hover:bg-white hover:text-black transition-all"
              >
                Develop Idea
              </button>

              {/* New Optimize Idea Button */}
              <button
                onClick={() =>
                  setExtraSpecVisible((prev) => ({ ...prev, [index]: true }))
                }
                className="w-80 mt-4 text-xl font-semibold px-6 py-3 rounded-full bg-gray-900 border-2 border-white text-white hover:bg-white hover:text-black transition-all"
              >
                Optimize Idea
              </button>

              {/* Extra Specification Prompt */}
              {extraSpecVisible[index] && (
                <div className="mt-4 p-4 border border-gray-700 rounded">
                  <textarea
                    className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded"
                    placeholder="Enter extra specification"
                    value={extraSpecInputs[index] || ""}
                    onChange={(e) =>
                      setExtraSpecInputs((prev) => ({ ...prev, [index]: e.target.value }))
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleOptimizeIdea(index, idea)}
                      disabled={loadingOptimized[index]}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      {loadingOptimized[index] ? "Optimizing..." : "Execute"}
                    </button>
                    <button
                      onClick={() =>
                        setExtraSpecInputs((prev) => ({ ...prev, [index]: "" }))
                      }
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() =>
                        setExtraSpecVisible((prev) => ({ ...prev, [index]: false }))
                      }
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Display Optimized Idea if available */}
              {optimizedIdeas[index] && (
                <div className="bg-green-900 rounded-lg shadow-md p-6 mt-8">
                  <h2 className="text-2xl font-bold mb-2">Optimized Idea</h2>
                  <p className="mb-2">
                    <strong>Title:</strong> {optimizedIdeas[index].title}
                  </p>
                  <p className="mb-2">
                    <strong>Description:</strong> {optimizedIdeas[index].description}
                  </p>
                  {optimizedIdeas[index].opportunities && (
                    <p className="mb-2">
                      <strong>Opportunities:</strong>{" "}
                      {Array.isArray(optimizedIdeas[index].opportunities)
                        ? optimizedIdeas[index].opportunities.join(', ')
                        : optimizedIdeas[index].opportunities}
                    </p>
                  )}
                  {optimizedIdeas[index].drawbacks && (
                    <p className="mb-2">
                      <strong>Drawbacks:</strong>{" "}
                      {Array.isArray(optimizedIdeas[index].drawbacks)
                        ? optimizedIdeas[index].drawbacks.join(', ')
                        : optimizedIdeas[index].drawbacks}
                    </p>
                  )}
                  {optimizedIdeas[index].references && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">Related Papers</h3>
                      <ul className="list-disc list-inside">
                        {Array.isArray(optimizedIdeas[index].references)
                          ? optimizedIdeas[index].references.map((ref, i) => (
                              <li key={i}>{ref}</li>
                            ))
                          : Object.values(optimizedIdeas[index].references).map((ref, i) => (
                              <li key={i}>{ref}</li>
                            ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No idea generated.</p>
        )}

        {recommendedIdea && (
          <div className="bg-green-900 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold mb-2">Recommended Idea</h2>
            <p className="mb-2">
              <strong>Title:</strong> {recommendedIdea.title}
            </p>
            <p className="mb-2">
              <strong>Abstract:</strong> {recommendedIdea.Abstract}
            </p>
            <p className="mb-2">
              <strong>Methodology:</strong> {recommendedIdea['Methodology recommended']}
            </p>
          </div>
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

export default IdeaResult;
