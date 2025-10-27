import { useState, useEffect } from "react";
import { CommentList } from "./components/CommentList";
import { CommentForm } from "./components/CommentForm";
import { Pagination } from "./components/Pagination";
import { ExportButton } from "./components/ExportButton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Analytics } from "@vercel/analytics/react";
import Credits from "./components/Credits";
import Header from "./components/Header";

// Interface for individual comment structure
interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  publishedAt: string;
  textDisplay: string;
}

// Interface for YouTube API response structure
interface YouTubeApiResponse {
  result: {
    items: YouTubeCommentThread[];
    nextPageToken?: string;
  };
}

// Interface for YouTube comment thread structure
interface YouTubeCommentThread {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        authorProfileImageUrl: string;
        publishedAt: string;
        textDisplay: string;
      };
    };
  };
}

// Interface for parameters to commentThreads.list
interface CommentThreadsListParams {
  part: "snippet";
  videoId: string;
  maxResults: number;
  pageToken?: string;
}

// Extend Window interface to include gapi
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (args: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        youtube: {
          commentThreads: {
            list: (
              params: CommentThreadsListParams,
            ) => Promise<YouTubeApiResponse>;
          };
        };
      };
    };
  }
}

export default function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [maxResults, setMaxResults] = useState<number>(100);

  useEffect(() => {
    const initializeGapi = async () => {
      try {
        await new Promise<void>((resolve) => {
          window.gapi.load("client", resolve);
        });
        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
          ],
        });
        console.log("GAPI client loaded for API");
      } catch (err) {
        console.error("Error loading GAPI client for API", err);
        setError("Failed to load YouTube API. Please try again later.");
      }
    };

    initializeGapi();
  }, []);

  // Watch for videoId changes and load comments when it updates
  useEffect(() => {
    if (videoId) {
      loadComments(maxResults);
    }
  }, [videoId]);

  const loadComments = async (maxResults: number, pageToken: string = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await window.gapi.client.youtube.commentThreads.list({
        part: "snippet",
        videoId: videoId,
        maxResults: maxResults,
        pageToken: pageToken,
      });

      const newComments: Comment[] = response.result.items.map(
        (item: YouTubeCommentThread) => ({
          id: item.id,
          authorDisplayName:
            item.snippet.topLevelComment.snippet.authorDisplayName,
          authorProfileImageUrl:
            item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
          textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
        }),
      );

      setComments((prevComments) => [...prevComments, ...newComments]);
      setNextPageToken(response.result.nextPageToken || "");
    } catch (err) {
      console.error("Error fetching comments", err);
      setError("Failed to fetch comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (newVideoId: string, maxResults: number) => {
    setVideoId(newVideoId); // Update the videoId and let useEffect handle loading comments
    setComments([]); // Reset comments
    setNextPageToken(""); // Reset pagination
    setMaxResults(maxResults); // Store maxResults for later use
  };

  const handleLoadMore = () => {
    loadComments(maxResults, nextPageToken);
  };

  return (
    <>
      <Credits />
      <div className="container mx-auto px-4 md:py-8 py-4 max-w-2xl flex flex-col justify-center h-screen appears">
        <Header />
        <CommentForm onSubmit={handleSubmit} />
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <CommentList comments={comments} />
        <Pagination onLoadMore={handleLoadMore} hasMore={!!nextPageToken} />
        <ExportButton comments={comments} videoId={videoId} />
      </div>
      <Analytics />
    </>
  );
}
