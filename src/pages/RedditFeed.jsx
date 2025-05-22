import React, { useState, useEffect } from "react";
import { GameProvider } from "../components/contexts/GameContext";
import Layout from "../components/Layout";
import he from 'he';

const RedditFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (utcSeconds) => {
    const date = new Date(utcSeconds * 1000);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`https://www.reddit.com/r/GamingLeaksAndRumours/new.json`);
        const json = await res.json();
        const rawPosts = json.data.children.map((child) => child.data);
        const filteredPosts = rawPosts.filter((post) => !post.stickied);
        console.log(filteredPosts);
        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error fetching subreddit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center text-lg mt-6">Loading /r/GamingLeaksAndRumours...</div>;

  return (
    <Layout>
      <GameProvider>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-center mb-6">Leaks & Rumours</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 border border-gray-200"
              >
                <a
                  href={`https://www.reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg font-semibold"
                >
                  {he.decode(post.title)}
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Published: {formatDate(post.created_utc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </GameProvider>
    </Layout>
  );
};

export default RedditFeed;
