import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

// Predefined help questions with unique IDs
const questions = [
  { id: "order_status", text: "Can you update me on the status of my orders?" },
  { id: "how_to_shop", text: "How do I shop on Cartify?" },
  { id: "about_cartify", text: "What is Cartify?" },
  { id: "become_seller", text: "How do I become a seller?" },
  { id: "why_seller", text: "Why should I become a seller?" },
];

function HelpPage() {
  // State to store the chat messages (both user + AI)
  const [answers, setAnswers] = useState([]);

  // Tracks which question is currently loading to disable that button
  const [loadingId, setLoadingId] = useState(null);

  // Ref to the answer section div so we can scroll to the bottom on new message
  const scrollRef = useRef(null);

  // Scrolls to bottom every time `answers` changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [answers]);

  // Called when a user clicks a question
  const handleQuestion = async (id) => {
    if (loadingId) return; // Prevent multiple clicks
    setLoadingId(id); // Lock the current question

    // Find the full question text by id
    const questionText = questions.find((q) => q.id === id)?.text || "";

    // 1. Show user question in chat immediately
    setAnswers((prev) => [...prev, { sender: "user", text: questionText, id: Date.now() }]);

    // 2. Temporarily show AI is “thinking” (fake loading bubble)
    setAnswers((prev) => [...prev, { sender: "ai", text: "Generating answer...", id: Date.now() + 1 }]);

    try {
      // 3. Send POST request to your Django backend with question ID
      const res = await api.post("/api/help_ai/", { question_id: id });

      // Add an artificial delay so the AI doesn’t reply instantly (feels smoother)
      await new Promise((r) => setTimeout(r, 800));

      // 4. Remove "Generating..." bubble, and add real AI response
      setAnswers((prev) => {
        const filtered = prev.filter((msg) => msg.text !== "Generating answer..."); // remove placeholder
        return [...filtered, { sender: "ai", text: res.data.answer, id: Date.now() + 2 }];
      });
    } catch {
      // If API call fails, show fallback error message
      await new Promise((r) => setTimeout(r, 800));
      setAnswers((prev) => {
        const filtered = prev.filter((msg) => msg.text !== "Generating answer...");
        return [...filtered, { sender: "ai", text: "Oops! Something went wrong. Please try again later.", id: Date.now() + 3 }];
      });
    } finally {
      // Unlock question buttons
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-5xl mx-auto px-8 py-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-12 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-blue-700">Cartify Help Center</h1>
        <Link
          to="/shop"
          className="text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 px-4 py-2 rounded-md transition"
        >
          ← Back to Shop
        </Link>
      </header>

      {/* Grid layout: left (questions), right (answers) */}
      <div className="flex gap-12 flex-1">
        {/* LEFT: List of Questions */}
        <section className="w-72 bg-[#F9FBFF] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-blue-700">Popular Questions</h2>
          <ul className="space-y-4">
            {questions.map(({ id, text }) => (
              <li key={id}>
                <button
                  onClick={() => handleQuestion(id)} // When clicked, trigger handleQuestion
                  disabled={loadingId === id} // Disable if that question is currently loading
                  className={`w-full text-left px-5 py-3 rounded-lg transition 
                    ${
                      loadingId === id
                        ? "bg-blue-200 cursor-not-allowed text-blue-400"
                        : "bg-white hover:bg-blue-50 text-blue-700 shadow-sm"
                    } font-medium`}
                  aria-label={text}
                >
                  {loadingId === id ? "Loading..." : text}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT: AI + User Chat Bubble Panel */}
        <section
          ref={scrollRef} // We use this to auto-scroll to bottom on new answer
          className="flex-1 bg-white rounded-lg shadow-md p-8 overflow-y-auto max-h-[70vh]"
          aria-live="polite"
        >
          {/* If no messages yet */}
          {answers.length === 0 && (
            <p className="text-gray-500 text-center mt-20 select-none">
              Select a question to see the answer here.
            </p>
          )}

          {/* Render each message as a bubble */}
          {answers.map(({ sender, text, id }) => (
            <div
              key={id}
              className={`mb-8 ${sender === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block max-w-[70%] px-6 py-4 rounded-xl
                  ${
                    sender === "user"
                      ? "bg-blue-100 text-blue-900 font-semibold"
                      : "bg-gray-100 text-gray-800"
                  } shadow-md`}
              >
                {text}
              </div>
              <div
                className={`mt-1 text-xs select-none ${
                  sender === "user" ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {sender === "user" ? "You asked" : "Cartify Help"}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default HelpPage;
