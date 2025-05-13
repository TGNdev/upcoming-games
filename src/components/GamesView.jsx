import GameRow from "./GameRow";
import GameCard from "./GameCard";
import AddGameForm from "./AddGameForm";
import EditGameForm from "./EditGameForm";
import LoginForm from "./LoginForm";
import BackToTopButton from "./BackTopButton";
import { useEffect, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { FaPlus, FaFilter } from "react-icons/fa";
import { useGame } from "./contexts/GameContext";

const GamesView = ({ games, openButtonRef }) => {
  const {
    search,
    opened,
    isLogged,
    edit,
    isModalOpen,
    setIsModalOpen,
    featuredOpen,
    setFeaturedOpen,
    gameToEdit,
    setGameToEdit
  } = useGame();
  const [withRelease, setWithRelease] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState(() => {
    const saved = localStorage.getItem('gameFilters');
    return saved ? JSON.parse(saved).selectedPlatforms || [] : [];
  });
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(() => {
    const saved = localStorage.getItem('gameFilters');
    return saved ? JSON.parse(saved).showOnlyUpcoming ?? null : null
  });
  const [filtersVisible, setFiltersVisible] = useState(() => {
    const saved = localStorage.getItem('gameFilters');
    if (saved) {
      const { selectedPlatforms = [], showOnlyUpcoming = null } = JSON.parse(saved);
      return (selectedPlatforms.length > 0 || showOnlyUpcoming !== null);
    }
    return false;
  });

  useEffect(() => {
    const filters = {
      selectedPlatforms,
      showOnlyUpcoming,
      withRelease
    };
    localStorage.setItem('gameFilters', JSON.stringify(filters));
  }, [selectedPlatforms, showOnlyUpcoming, withRelease]);


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

  const getPlatformArray = (platformsObj) => {
    if (Array.isArray(platformsObj)) return platformsObj;
    if (typeof platformsObj === 'object' && platformsObj !== null) {
      return Object.entries(platformsObj)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key.toUpperCase());
    }
    return [];
  };

  const allPlatforms = Array.from(
    new Set(games.flatMap(game => getPlatformArray(game.platforms)))
  ).sort();

  const platformLabels = {
    pc: "PC",
    ps: "PlayStation",
    xbox: "Xbox",
    switch: "Switch",
    switch_2: "Switch 2"
  };

  const filtered = games
    .filter(game => {
      if (withRelease) {
        return game.release_date instanceof Timestamp;
      } else {
        return typeof game.release_date === "string";
      }
    })
    .filter(game => {
      // Search
      const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.developers.some(dev => dev.name.toLowerCase().includes(search.toLowerCase())) ||
        game.editors.some(editor => editor.name.toLowerCase().includes(search.toLowerCase()));

      // Platforms
      const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.every(platform =>
        getPlatformArray(game.platforms).includes(platform)
      );

      // Release status
      const isTimestamp = game.release_date instanceof Timestamp;
      let matchesReleaseStatus = true;
      if (isTimestamp && showOnlyUpcoming !== null) {
        const release = new Date(game.release_date.seconds * 1000);
        const now = new Date();
        matchesReleaseStatus = showOnlyUpcoming ? release >= now : release < now;
      }

      return matchesSearch && matchesPlatform && matchesReleaseStatus;
    })
    .sort((a, b) => {
      const aSort = getSortValue(a.release_date);
      const bSort = getSortValue(b.release_date);
      if (aSort !== bSort) return aSort - bSort;
      return a.name.localeCompare(b.name);
    });

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

  return (
    <>
      {/* Featured section */}
      {featured && (
        <div className="flex flex-col items-center w-full border rounded-xl">
          <div className="text-2xl font-semibold italic mt-2">Next release</div>
          <div className="w-full p-5 flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-4">
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
              <div className="flex flex-row items-center justify-between">
                <button
                  onClick={() => {
                    const element = document.getElementById(`game-${featured.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                      setFeaturedOpen(featured.id);
                    }
                  }}
                  className="self-start bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md hover:scale-105 transition hidden sm:block"
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
                  className="self-start bg-blue-500 text-white text-sm px-3 py-1.5 rounded-md hover:scale-105 transition block sm:hidden"
                >
                  View Game
                </button>
                <span
                  className={`px-2 py-1 sm:px-4 text-sm sm:text-base rounded-full font-semibold text-center ${getReleaseMessage(featured.release_date) === "Releases today !"
                    ? "bg-green-200 text-green-700"
                    : "bg-amber-200 text-amber-700"
                    }`}
                >
                  {getReleaseMessage(featured.release_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        <div className="flex flex-row w-full gap-4 items-center justify-center">
          <button
            className={`${withRelease && "bg-blue-500 text-white"} disabled:opacity-80 disabled:hover:bg-blue-500 hover:bg-slate-200 w-fit px-2 py-1.5 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base transition`}
            onClick={() => setWithRelease(true)}
            disabled={withRelease}
          >
            With release date
          </button>
          <button
            className={`${!withRelease && "bg-blue-500 text-white"} disabled:opacity-80 disabled:hover:bg-blue-500 hover:bg-slate-200 w-fit px-2 py-1.5 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base transition`}
            onClick={() => setWithRelease(false)}
            disabled={!withRelease}
          >
            Without release date
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col items-end gap-4">
        {/* Toggle Button */}
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center text-sm gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-500 transition"
            onClick={() => setFiltersVisible(prev => !prev)}
          >
            <FaFilter />
            {filtersVisible ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {/* Filters */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
            filtersVisible ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 items-center md:flex-row md:items-center md:justify-center md:flex-wrap w-full">
            {/* Platform Filter */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {allPlatforms.map(platform => (
                <button
                  key={platform}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    selectedPlatforms.includes(platform)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => {
                    setSelectedPlatforms(prev =>
                      prev.includes(platform)
                        ? prev.filter(p => p !== platform)
                        : [...prev, platform]
                    );
                  }}
                >
                  {platformLabels[platform.toLowerCase()] || platform}
                </button>
              ))}
            </div>
            {/* Release Status Filter */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <button
                className={`px-3 py-1 rounded-full border text-sm ${
                  showOnlyUpcoming === true
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setShowOnlyUpcoming(true)}
              >
                Upcoming only
              </button>
              <button
                className={`px-3 py-1 rounded-full border text-sm ${
                  showOnlyUpcoming === false
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setShowOnlyUpcoming(false)}
              >
                Already released
              </button>
              <button
                className={`px-3 py-1 rounded-full border text-sm ${
                  showOnlyUpcoming === null
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => setShowOnlyUpcoming(null)}
              >
                All
              </button>
            </div>
            {/* Reset */}
            <div className="flex justify-center md:justify-start">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                onClick={() => {
                  setSelectedPlatforms([]);
                  setShowOnlyUpcoming(null);
                  localStorage.removeItem('gameFilters');
                }}
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-col max-w-full overflow-x-auto hidden sm:flex -mt-4">
        <div className="relative">
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
                  setGameToEdit={setGameToEdit}
                  setIsModalOpen={setIsModalOpen}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards */}
      <div className="overflow-y-auto min-w-full sm:hidden pb-8">
        <div className="flex flex-col gap-5">
          {filtered.map(game => (
            <GameCard
              key={game.id}
              game={game}
              edit={edit}
              opened={opened}
              forceOpen={featuredOpen === game.id}
              setForceOpen={() => setFeaturedOpen(null)}
              setGameToEdit={setGameToEdit}
              setIsModalOpen={setIsModalOpen}
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
              edit ? (
                <EditGameForm
                  game={gameToEdit}
                  games={games}
                  onSuccess={handleCloseModal}
                />
              ) : (
                <AddGameForm
                  games={games}
                  onClose={handleCloseModal}
                  onSuccess={handleCloseModal}
                />
              )
            ) : (
              <LoginForm
                onSuccess={handleCloseModal}
                onClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default GamesView;