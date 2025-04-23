import React, { useState } from "react";
import GameRow from "./GameRow";

const GameTable = ({ games }) => {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);

  const filtered = games
    .filter(game =>
      game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.developers.some(dev => dev.name.toLowerCase().includes(search.toLowerCase())) ||
      game.editors.some(editor => editor.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(a.release_date.seconds * 1000) - new Date(b.release_date.seconds * 1000));
  
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
    <div className="flex flex-col items-end p-6 max-w-full overflow-x-auto gap-10">
      {/* Featured section */}
      {featured && (
        <div className="rounded-xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold">{featured.name}</h2>
          <p className="text-sm opacity-70">{getReleaseMessage()}</p>
        </div>
      )}
  
      {/* Search bar */}
      <div className="flex flex-col items-end min-w-[500px] gap-2">
        <input
          className="px-3 py-1 rounded border w-full"
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className={`px-3 py-2 max-w-fit rounded-lg text-white text-sm hover:scale-105 transition ${edit ? "bg-yellow-500 animate-pulse" : "bg-blue-500"}`}
          type="button"
          onClick={() => setEdit(!edit)}
        >
          {edit ? "Close Edit Mode" : "Open Edit Mode"}
        </button>
        {edit && (
          <div className="text-sm">It just transforms texts to inputs. Seriously, you can't even edit anything, it's locked.</div>
          // <button
          //   className="px-3 py-2 maw-w-fit rounded-lg text-white text-sm hover:scale-105 transition bg-blue-500"
          //   type="button"
          //   onClick={() => alert("Coming soon...")}
          // >
          //   Save Edits
          // </button>
        )}
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto max-w-full">
        <table className="w-full table-fixed border-collapse min-w-[800px]">
          <thead className="border-b">
            <tr>
              <th className="p-3 sticky left-0 bg-white z-10">Name</th>
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
              <GameRow key={game.id} game={game} edit={edit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
};

export default GameTable;
