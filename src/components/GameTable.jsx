import React, { useState, useRef, useEffect } from "react";
import GameRow from "./GameRow";
import GameCard from "./GameCard";
import AddGameForm from "./AddGameForm";
import Login from "./Login";
import BackToTopButton from "./BackTopButton";
import { FaPlus } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { Timestamp } from "firebase/firestore";

const GameTable = ({ games }) => {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [opened, setOpened] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(localStorage.getItem("admin") === "true");
  const [withRelease, setWithRelease] = useState(true);
  const openButtonRef = useRef(null);
 
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  const quarterWeight = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 };
  const getSortValue = (release_date) => {
    if (release_date instanceof Timestamp) {
      return new Date(release_date.seconds * 1000).getTime();
    }

    if (typeof release_date === "string") {
      const quarterMatch = release_date.match(/Q([1-4]) (\d{4})/);
      const tbaMatch = release_date.match(/TBA (\d{4})/);

      if (quarterMatch) {
        const [_, q, year] = quarterMatch;
        return parseInt(year) * 100 + quarterWeight[`Q${q}`];
      }

      if (tbaMatch) {
        const [_, year] = tbaMatch;
        return parseInt(year) * 100 + 99;
      }

      if (release_date === "TBA") {
        return Infinity;
      }
    }

    return Infinity;
  };

  const filtered = games
    .filter(game => {
      if (withRelease) {
        return game.release_date instanceof Timestamp;
      } else {
        return typeof game.release_date === "string";
      }
    })
    .filter(game =>
      game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.developers.some(dev => dev.name.toLowerCase().includes(search.toLowerCase())) ||
      game.editors.some(editor => editor.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const aSort = getSortValue(a.release_date);
      const bSort = getSortValue(b.release_date);

      if (aSort !== bSort) {
        return aSort - bSort;
      }

      return a.name.localeCompare(b.name);
    });

  const featured = games.reduce((closest, game) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const release = new Date(game.release_date.seconds * 1000);
    const releaseDate = new Date(release);
    releaseDate.setHours(0, 0, 0, 0);

    const diffTime = releaseDate - today;

    if (
      diffTime >= 0 &&
      (closest === null || diffTime < closest.diffTime)
    ) {
      return { game, diffTime };
    }

    return closest;
  }, null)?.game;

  const getReleaseMessage = releaseDate => {
    const today = new Date();
    const release = new Date(releaseDate.seconds * 1000);
    const diffTime = release - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Releases today !";
    if (diffDays === 1) return "Releases tomorrow";
    if (diffDays > 1) return `Releases in ${diffDays} days`;
    return "Already released";
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const useOutsideClick = (callback, exceptions = []) => {
    const ref = useRef();
  
    useEffect(() => {
      const handleClick = (event) => {
        const clickedInsideModal = ref.current && ref.current.contains(event.target);
        const clickedException = exceptions.some(
          exceptionRef => exceptionRef.current && exceptionRef.current.contains(event.target)
        );
  
        if (!clickedInsideModal && !clickedException) {
          callback();
        }
      };
  
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [callback, exceptions]);
  
    return ref;
  };
  
  const modalRef = useOutsideClick(handleCloseModal, [openButtonRef]);

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
      {featured && (
        <div className="flex flex-col items-center w-full">
          <div className="text-2xl font-semibold italic">Next release</div>
          <div className="w-full p-5 rounded-xl shadow-lg bg-white flex flex-row gap-3 justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold">{featured.name}</h2>
                  <div className="flex flex-row gap-1 text-sm text-slate-500">
                    <div>By</div>
                    {featured.developers.map((dev, index) => (
                      <div key={`featured-${dev.name}`} className="font-semibold">
                        {dev.name}
                        {index < featured.developers.length - 2
                          ? ", "
                          : index === featured.developers.length - 2
                            ? " & "
                            : ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => {
                    const element = document.getElementById(`game-${featured.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                      setFeaturedOpen(featured.id);
                    }
                  }}
                  className="self-start mt-2 bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md hover:scale-105 transition hidden sm:block"
                >
                  View Game
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById(`gamecard-${featured.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                      setFeaturedOpen(featured.id);
                    }
                  }}
                  className="self-start mt-2 bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md hover:scale-105 transition block sm:hidden"
                >
                  View Game
                </button>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${getReleaseMessage(featured.release_date) === "Releases today !"
                  ? "bg-green-200 text-green-700"
                  : "bg-amber-200 text-amber-700"
                }`}
            >
              {getReleaseMessage(featured.release_date)}
            </span>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        <div className="flex flex-row w-full gap-4 items-center justify-center">
          <button
            className={`${withRelease && "bg-blue-500 text-white"} disabled:opacity-80 disabled:hover:bg-blue-500 hover:bg-slate-200 w-fit px-3 py-2 border rounded-md transition`}
            onClick={() => setWithRelease(true)}
            disabled={withRelease}
          >
            With release dates
          </button>
          <button
            className={`${!withRelease && "bg-blue-500 text-white"} disabled:opacity-80 disabled:hover:bg-blue-500 hover:bg-slate-200 w-fit px-3 py-2 border rounded-md transition`}
            onClick={() => setWithRelease(false)}
            disabled={!withRelease}
          >
            Without release dates
          </button>
        </div>
      </div>

      <div className="sticky top-[64px] bg-white z-40 flex flex-row justify-between min-w-full -mb-4 sm:px-7">
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
          {!edit && (
            <button
              ref={openButtonRef}
              className="size-6 p-1 sm:text-sm sm:w-fit sm:py-2 sm:px-2.5 sm:flex flex-row items-center bg-green-500 text-white rounded-md hover:scale-110 transition"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="block sm:hidden" />
              <div className="hidden sm:block">Add new game</div>
            </button>
          )}
          <button
            className={`${edit && "animate-pulse"} size-6 p-1 sm:text-sm sm:w-fit sm:py-2 sm:px-2.5 sm:flex flex-row items-center bg-amber-400 text-white rounded-md hover:scale-110 transition`}
            onClick={() => setEdit(prev => !prev)}
          >
            {edit ? (
              <FaPlus className="rotate-45 block sm:hidden" />
            ) : (
              <AiFillEdit className="block sm:hidden" />
            )}
            <div className="hidden sm:block">
              {edit ? "Quit Edit Mode" : "Edit games"}
            </div>
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
                {edit && (
                  <th className="p-3 sticky right-0 bg-white z-10">Edit actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map(game => (
                <GameRow
                  key={game.id}
                  game={game}
                  edit={edit}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards */}
      <div className="overflow-y-auto min-w-full sm:hidden pb-8 -mt-8">
        <div className="flex flex-col gap-5">
          {filtered.map(game => (
            <GameCard
              key={game.id}
              game={game}
              edit={edit}
              opened={opened}
              forceOpen={featuredOpen === game.id}
              setForceOpen={() => setFeaturedOpen(null)}
            />
          ))}
        </div>
      </div>

      {/* Back to top button */}
      <BackToTopButton />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg w-full max-w-2xl relative max-h-[75%] overflow-auto transition"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-lg hover:scale-110 rotate-45 transition"
            >
              <FaPlus />
            </button>
            {isLogged ? (
              <AddGameForm
                games={games}
                onClose={handleCloseModal}
                onSuccess={handleCloseModal}
              />
            ) : (
              <Login
                onSuccess={() => {
                  localStorage.setItem("admin", "true");
                  setIsLogged(true);
                }}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTable;
