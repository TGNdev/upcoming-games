import React, { useState } from "react";
import GameRow from "./GameRow";

const GameTable = ({ games }) => {
  const [search, setSearch] = useState("");

  const filtered = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered[0]; // Just first game as placeholder

  return (
    <div className="p-6 max-w-screen overflow-x-auto">
      {/* Featured section */}
      {featured && (
        <div className="mb-6 bg-muted rounded-xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-highlight">{featured.name}</h2>
          <p className="text-sm opacity-70">📅 Releases on {featured.releaseDate}</p>
        </div>
      )}

      {/* Search bar */}
      <div className="flex justify-end mb-2">
        <input
          className="px-3 py-1 rounded bg-background border border-accent text-accent placeholder:text-muted"
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full table-auto border-collapse">
        <thead className="sticky top-0 bg-background border-b border-muted">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Developer / Publisher</th>
            <th className="p-3 text-left">Release Date</th>
            <th className="p-3 text-left">Platforms</th>
            <th className="p-3 text-left">Rating</th>
            <th className="p-3 text-left">Link</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(game => (
            <GameRow key={game.id} game={game} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameTable;
