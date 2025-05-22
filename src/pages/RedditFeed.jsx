import React, { useState, useEffect, useMemo } from "react";
import { GameProvider } from "../components/contexts/GameContext";
import Layout from "../components/Layout";
import he from 'he';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RedditFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLimit, setPostLimit] = useState(25);
  const [selectedFlair, setSelectedFlair] = useState("All");

  function formatDate(utcSeconds) {
    const seconds = Math.floor(Date.now() / 1000 - utcSeconds);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];
    for (const { label, seconds: interval } of intervals) {
      const count = Math.floor(seconds / interval);
      if (count >= 1) {
        return `${count} ${label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.reddit.com/r/GamingLeaksAndRumours/new.json?limit=${postLimit}`
        );
        const json = await res.json();
        const rawPosts = json.data.children.map((child) => child.data);
        const filteredPosts = rawPosts.filter((post) => !post.stickied);
        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error fetching subreddit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postLimit]);

  const flairs = useMemo(() => {
    const unique = new Set(posts.map((p) => p.link_flair_text).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [posts]);

  const visiblePosts = useMemo(() => {
    return selectedFlair === "All"
      ? posts
      : posts.filter((post) => post.link_flair_text === selectedFlair);
  }, [posts, selectedFlair]);

  return (
    <Layout>
      <GameProvider>
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-center">Leaks & Rumours</h2>
          {/* Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-row items-center gap-1">
              <p className="text-sm">I want to see</p>
              <select
                value={selectedFlair}
                onChange={(e) => setSelectedFlair(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {flairs.map((flair) => (
                  <option key={flair} value={flair}>
                    {flair}
                  </option>
                ))}
              </select>
              <p className="text-sm">posts</p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <p className="text-sm">Show</p>
              <select
                value={postLimit}
                onChange={(e) => setPostLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {[25, 50, 75, 100].map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
              <p className="text-sm">posts</p>
            </div>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center mt-10">
              <AiOutlineLoading3Quarters className="animate-spin text-blue-500 mb-3" size={36} />
              <div className="text-center text-lg text-gray-700">
                Loading posts...
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 border border-gray-200"
                >
                  <div
                    className="absolute -top-2 -left-2 -rotate-6 text-white py-0.5 px-2 text-sm rounded-md"
                    style={{ backgroundColor: post.link_flair_background_color }}
                  >
                    {post.link_flair_text}
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline sm:text-lg font-semibold"
                  >
                    {he.decode(post.title)}
                  </a>
                  <p className="sm:text-sm text-xs text-gray-500 mt-2">
                    {formatDate(post.created_utc)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </GameProvider>
    </Layout>
  );
};

export default RedditFeed;
