import { useState, useRef } from "react";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import GamesView from "./GamesView";
import EventsView from "./EventsView";
import { useGame } from "./contexts/GameContext";

const Main = ({ games }) => {
  const [viewGames, setViewGames] = useState(true);
  const openButtonRef = useRef(null);
  const {
    search, setSearch,
    opened, setOpened,
    isLogged,
    edit, setEdit,
    setIsModalOpen,
    setFeaturedOpen,
    logout,
  } = useGame();

  return (
    <div className="flex flex-col items-end px-6 pb-6 max-w-full gap-7 sm:gap-10">
      <div className="sticky top-0 bg-white z-50 flex flex-col w-full gap-6 py-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Link to="/">
            <h1 className="text-xl font-bold">{process.env.REACT_APP_TITLE}</h1>
          </Link>

          {/* Search bar */}
          {viewGames && (
            <input
              className="px-3 py-1 rounded border w-full sm:w-2/3 lg:w-2/5"
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}
        </div>
        
        {viewGames && (
          <div className="flex flex-row justify-between min-w-full sm:px-7">
            <div>
              <button
                type="button"
                className={`${opened ? "animate-pulse bg-amber-400" : "bg-blue-500"} text-sm hover:scale-110 transition text-white px-2 py-1 rounded-md sm:hidden`}
                onClick={() => {
                  setOpened(prev => !prev);
                  setFeaturedOpen(null);
                }}
              >
                {opened ? "Collaspe all" : "Expand all"}
              </button>
            </div>
            {isLogged ? (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setEdit(prev => !prev)
                    if (!opened && !edit) {
                      setOpened(true);
                    }
                  }}
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
                {isLogged && (
                  <button
                    onClick={logout}
                    className="size-6 p-1 sm:text-sm sm:w-fit sm:py-2 sm:px-2.5 sm:flex flex-row items-center bg-blue-500 text-white rounded-md hover:scale-110 transition"
                  >
                    <FaSignOutAlt className="block sm:hidden" />
                    <div className="hidden sm:block">Logout</div>
                  </button>
                )}
              </div>
            ) : (
              <button
                ref={openButtonRef}
                className="text-sm sm:w-fit sm:py-2 px-2.5 sm:flex flex-row items-center bg-blue-500 text-white rounded-md hover:scale-110 transition"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="">I am an admin</div>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex justify-center">
        <div className="flex flex-row w-full gap-4 items-center justify-center">
          <button
            className={`${viewGames && "bg-blue-500 text-white"} disabled:opacity-80 disabled:hover:bg-blue-500 hover:bg-slate-200 w-fit px-2 py-1.5 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base transition`}
            onClick={() => setViewGames(true)}
            disabled={viewGames}
          >
            Games
          </button>
          <button
            className={`${!viewGames && "bg-blue-500 text-white"} disabled:opacity-80 disabled:hover:bg-blue-500 hover:bg-slate-200 w-fit px-2 py-1.5 sm:px-3 sm:py-2 border rounded-md text-sm sm:text-base transition`}
            onClick={() => setViewGames(false)}
            disabled={!viewGames}
          >
            Events
          </button>
        </div>
      </div>

      {viewGames ? (
        <GamesView
          games={games}
          openButtonRef={openButtonRef}
        />
      ) : (
        <EventsView />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Main;
