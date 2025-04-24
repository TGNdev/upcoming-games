import React, { useState } from "react";
import GameRow from "./GameRow";
import GameCard from "./GameCard";
import { FaPlus } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";

const GameTable = ({ games }) => {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [opened, setOpened] = useState(false);

  const filtered = games
    .filter(game =>
      game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.developers.some(dev => dev.name.toLowerCase().includes(search.toLowerCase())) ||
      game.editors.some(editor => editor.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.release_date.seconds * 1000);
      const dateB = new Date(b.release_date.seconds * 1000);

      if (dateA - dateB !== 0) {
        return dateA - dateB;
      }

      return a.name.localeCompare(b.name);
    });
  
  const featured = games.reduce((closest, game) => {
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
      {/* Search bar */}
      <input
        className="px-3 py-1 rounded border w-full sm:w-2/3 lg:w-2/5"
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Featured section */}
      {/* {featured && (
        <div className="rounded-xl p-4 shadow-lg">
          <h2 className="text-2xl font-bold">{featured.name}</h2>
          <p className="text-sm opacity-70">{getReleaseMessage(featured.release_date)}</p>
        </div>
      )} */}

      <div className="flex flex-row justify-between min-w-full -mb-4 sm:px-7">
        <div>
          <button
            type="button"
            className={`${opened ? "animate-pulse bg-amber-400" : "bg-blue-500"} text-sm hover:scale-110 transition text-white px-2 py-1 rounded-md sm:hidden`}
            onClick={() => setOpened(prev => !prev)}
          >
            {opened ? "Collaspe all" : "Expand all"}
          </button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button
            className="size-6 p-1 bg-green-500 text-white rounded-md hover:scale-110 transition"
          >
            <FaPlus />
          </button>
          <button
            className="size-6 p-1 bg-amber-400 text-white rounded-md hover:scale-110 transition"
          >
            <AiFillEdit />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col max-w-full overflow-x-auto">
        <div className="relative hidden sm:block">
          <table className="w-full table-fixed border-collapse min-w-[900px]">
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

      {/* Cards */}
      <div className="overflow-y-auto min-w-full sm:hidden pb-8 -mt-8">
        <div className="flex flex-col gap-5">
          {filtered.map(game => (
            <GameCard key={game.id} game={game} edit={edit} opened={opened} />
          ))}
        </div>
      </div>
    </div>
  );
  
  
};

export default GameTable;
