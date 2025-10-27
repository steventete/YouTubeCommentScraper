import React from "react";
import { FileText } from "lucide-react";
import { Sheet } from "lucide-react";
import { FileJson } from "lucide-react";

interface Comment {
  authorDisplayName: string;
  textDisplay: string;
}

interface ExportButtonProps {
  comments: Comment[];
  videoId: String;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  comments,
  videoId,
}) => {
  const fileBaseName = videoId ? `comments_${videoId}` : "comments";

  // Exportar a TXT
  const exportToTxt = () => {
    const blob = new Blob(
      [
        comments
          .map(
            (comment) => `${comment.authorDisplayName}: ${comment.textDisplay}`,
          )
          .join("\n\n"),
      ],
      { type: "text/plain" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileBaseName}.txt`;
    link.click();
  };

  // Exportar a CSV
  const exportToCsv = () => {
    const csvRows = [
      ["Author", "Comment"],
      ...comments.map((comment) => [
        comment.authorDisplayName,
        comment.textDisplay,
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileBaseName}.csv`;
    link.click();
  };

  // Exportar a JSON
  const exportToJson = () => {
    const jsonContent = JSON.stringify(comments, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileBaseName}.json`;
    link.click();
  };

  return (
    <div className="md:space-x-4 space-x-1 flex">
      <button
        onClick={exportToTxt}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium md:py-2 px-1 md:px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center md:text-lg text-xs"
      >
        <FileText size={16} className="inline-block mr-2" />
        Export TXT
      </button>
      <button
        onClick={exportToCsv}
        className="w-full bg-green-900 hover:bg-green-700 text-white font-medium py-1 md:py-2 px-1 md:px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center md:text-lg text-xs"
      >
        <Sheet size={16} className="inline-block mr-2" />
        Export CSV
      </button>
      <button
        onClick={exportToJson}
        className="w-full bg-blue-900 hover:bg-blue-700 text-white font-medium py-2 px-1 md:px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center md:text-lg text-xs"
      >
        <FileJson size={16} className="inline-block mr-2" />
        Export JSON
      </button>
    </div>
  );
};
