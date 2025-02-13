import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import GenerateIdeas from './pages/GenerateIdeas.tsx';
import IdeaResult from './pages/IdeaResult.tsx';
import FinalPaper from './pages/FinalPaper.tsx';
import ReviewAnalyze from './pages/ReviewAnalyze.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/generate" element={<GenerateIdeas />} />
      <Route path="/result" element={<IdeaResult />} />
      <Route path="/final-paper" element={<FinalPaper />} />
      <Route path="/review-analyze" element={<ReviewAnalyze />} />
    </Routes>
  );
}

export default App;
