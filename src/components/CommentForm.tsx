import React, { useState } from "react";
import { ErrorToast } from "./ErrorToast";
import { RefreshCcw } from "lucide-react";

interface CommentFormProps {
  onSubmit: (videoId: string, maxResults: number) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [maxResults, setMaxResults] = useState(100);
  const [errorMessage, setErrorMessage] = useState("");

  // Validates if the provided input is a YouTube URL or valid video ID
  const isYouTubeUrl = (value: string): boolean => {
    if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return true;
    try {
      const url = new URL(value);
      return (
        url.hostname.includes("youtube.com") ||
        url.hostname.includes("youtu.be")
      );
    } catch {
      return false;
    }
  };

  // Extracts the video ID from a YouTube link or returns it directly if already provided
  const extractVideoId = (urlOrId: string): string | null => {
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;

    const patterns = [
      /[?&]v=([a-zA-Z0-9_-]{11})/, // youtube.com/watch?v=...
      /(?:be\/)([a-zA-Z0-9_-]{11})/, // youtu.be/...
      /(?:embed\/)([a-zA-Z0-9_-]{11})/, // youtube.com/embed/...
    ];

    for (const pattern of patterns) {
      const match = urlOrId.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();

    // Validate domain first
    if (!isYouTubeUrl(trimmed)) {
      setErrorMessage("Please provide a valid YouTube URL or video ID.");
      return;
    }

    // Try extracting the ID
    const id = extractVideoId(trimmed);
    if (!id) {
      setErrorMessage("Unable to extract a valid YouTube video ID.");
      return;
    }

    // Clear any previous errors and submit
    setErrorMessage("");
    onSubmit(id, maxResults);
  };

  return (
    <div className="relative">
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-3 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter URL (e.g. https://youtube.com/watch?v=FGMLcb9LX3Q)"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 focus:border-gray-400 bg-gray-800 text-white placeholder-gray-500 border-gray-600 text-xs"
          />
          <input
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            placeholder="Max Results"
            min="1"
            max="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 focus:border-gray-400 bg-gray-800 text-white placeholder-gray-500 border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-2 md:px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center text-sm md:text-base"
        >
          <RefreshCcw size={16} className="inline-block mr-2" />
          Load Comments
        </button>
      </form>

      {/* Error Toast */}
      <ErrorToast message={errorMessage} onClose={() => setErrorMessage("")} />
    </div>
  );
};
