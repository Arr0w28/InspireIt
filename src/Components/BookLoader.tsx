import React, { useEffect, useState } from 'react';


const messages = [
    "Analyzing....",
    "Understanding...",
  "Processing...",
  "Generating...",
  "Reasoning...",
  "Refining...",
];

const BookLoader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex < messages.length - 1 ? prevIndex + 1 : prevIndex));
    }, Math.floor(Math.random() * 8000) + 2000);

    const dotInterval = setInterval(() => {
      if (messageIndex === messages.length - 1) {
        setShowDot((prev) => !prev);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(dotInterval);
    };
  }, [messageIndex]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm">
      <div className="bookshelf_wrapper">
        <ul className="books_list">
          <li className="book_item first"></li>
          <li className="book_item second"></li>
          <li className="book_item third"></li>
          <li className="book_item fourth"></li>
          <li className="book_item fifth"></li>
          <li className="book_item sixth"></li>
        </ul>
        <div className="shelf">
          {messages[messageIndex]}
          {messageIndex === messages.length - 1 && showDot ? "." : ""}
        </div>
      </div>
    </div>
  );
};

export default BookLoader;
