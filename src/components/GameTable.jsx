import React, { useState } from "react";
import GameRow from "./GameRow";

const GameTable = ({ games }) => {
  const [search, setSearch] = useState("");

  const filtered = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );
  const featured = filtered.reduce((closest, game) => {
    const today = new Date();
    const release = new Date(game.release_date.seconds * 1000);
    const diffTime = release - today;

    if (diffTime > 0 && (closest === null || diffTime < closest.diffTime)) {
      return { game, diffTime };
    }

    return closest;
  }, null)?.game;

  const getReleaseMessage = releaseDate => {
    const today = new Date();
    const release = new Date(releaseDate.seconds * 1000);
    const diffTime = release - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Releases today";
    if (diffDays === 1) return "Releases tomorrow";
    if (diffDays > 1) return `Releases in ${diffDays} days`;
    return "Already released";
  };

  return (
    <div className="p-6 max-w-screen overflow-x-auto">
      {/* Featured section */}
      {featured && (
        <div className="mb-6 bg-muted rounded-xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold text-highlight">{featured.name}</h2>
          <p className="text-sm opacity-70">{getReleaseMessage()}</p>
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

      <table className="w-full table-auto border-collapse overflow-auto">
        <thead className="border-b border-muted">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Release Date</th>
            <th className="p-3">Developers</th>
            <th className="p-3">Editors</th>
            <th className="p-3">Platforms</th>
            <th className="p-3 flex flex-col">
              <div>Ratings</div>
              <div className="flex flex-row gap-x-3 justify-center">
                <div className="text-xs opacity-50">Critics</div>
                <div className="text-xs opacity-50">Players</div>
              </div>
            </th>
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
