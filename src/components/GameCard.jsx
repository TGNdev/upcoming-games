import React, { useEffect, useState } from "react";
import { ReactComponent as XboxIcon } from "../assets/icons/xbox.svg";
import { ReactComponent as PsIcon } from "../assets/icons/ps.svg";
import { ReactComponent as PcIcon } from "../assets/icons/pc.svg";
import { ReactComponent as SwitchIcon } from "../assets/icons/switch.svg";
import { ReactComponent as Switch2Icon } from "../assets/icons/switch_2.svg";
import { FiChevronDown } from "react-icons/fi";
import { FaThumbsUp } from "react-icons/fa6";

const getPlatformsSvg = (platform) => {
  const base = "size-8 rounded p-1.5";
  switch (platform) {
    case "xbox":
      return <XboxIcon className={`${base} bg-green-500`} fill="white" />;
    case "ps":
      return <PsIcon className={`${base} bg-blue-500`} fill="white" />;
    case "pc":
      return <PcIcon className={`${base} bg-slate-400`} fill="white" />;
    case "switch":
      return <SwitchIcon className={`${base} bg-red-500`} fill="white" />;
    case "switch_2":
      return <Switch2Icon className={`${base} bg-red-500`} fill="white" />;
    default:
      return null;
  }
};

const GameCard = ({ game, opened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDevs, setShowDevs] = useState(false);
  const [showEditors, setShowEditors] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    setIsOpen(opened);
  }, [opened]);

  const isReleased = () => {
    const today = new Date();
    const releaseDate = new Date(game.release_date.seconds * 1000);
    return releaseDate < today;
  };
  
  const platforms = Object.keys(game.platforms).filter(p => game.platforms[p]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 relative">
      {/* Header (Toggle) */}
      <button
        className="w-full flex justify-between items-center px-7 pt-6 pb-3 text-left bg-slate-100 hover:bg-slate-200 transition"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold">{game.name}</span>
          <span className="text-xs">{new Date(game.release_date.seconds * 1000).toLocaleDateString("en-EN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}</span>
        </div>
        <FiChevronDown
          className={`text-xl transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Released badge */}
      {isReleased() ? (
        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded z-20">
          Released
        </div>
      ) : (
        <div className="absolute top-0 left-0 bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5 rounded z-20">
          Coming soon
        </div>
      )}

      {/* Content drawer */}
      <div
        className={`grid transition-all duration-500 ease-in-out overflow-hidden border-x ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="p-4 flex flex-row gap-6 relative">
            <div className="flex flex-1 flex-col gap-6">
              {/* Developers */}
              <div>
                <button
                  onClick={() => setShowDevs(prev => !prev)}
                  className="text-sm font-bold hover:scale-110 transition"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div>Show developer{game.developers.length > 1 ? `s (${game.developers.length})` : ""}</div>
                    <FiChevronDown
                      className={`text-base text-black transform transition-transform duration-300 ${showDevs ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                <div className={`transition-all overflow-auto ${showDevs ? "max-h-96 mt-2" : "max-h-0"}`}>
                  <div className="flex flex-col gap-1 text-sm pt-2">
                    {game.developers.map((dev, idx) => (
                      <a href={dev.link} key={idx} className="hover:scale-105 transition">{dev.name}</a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editors */}
              <div>
                <button
                  onClick={() => setShowEditors(prev => !prev)}
                  className="text-sm font-bold hover:scale-110 transition"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div>Show editor{game.editors.length > 1 ? `s (${game.editors.length})` : ""}</div>
                    <FiChevronDown
                      className={`text-base text-black transform transition-transform duration-300 ${showEditors ? "rotate-180" : ""}`}
                    />
                  </div>                </button>
                <div className={`transition-all duration-300 overflow-hidden ${showEditors ? "max-h-96 mt-2" : "max-h-0"}`}>
                  <div className="space-y-1 text-sm pt-2">
                    {game.editors.map((edit, idx) => (
                      <a href={edit.link} key={idx} className="block hover:scale-105 transition">{edit.name}</a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Wrapper for all platforms */}
                <div className="flex items-center gap-2 overflow-hidden">
                  {/* Always show first 2 */}
                  {platforms.sort().slice(0, 2).map((platform, idx) => (
                    <span key={idx}>{getPlatformsSvg(platform)}</span>
                  ))}

                  {/* Horizontally animated extra platforms */}
                  <div
                    className="flex items-center gap-2 transition-all duration-200 ease-linear"
                    style={{
                      maxWidth: showAllPlatforms ? `${platforms.slice(2).length * 42}px` : "0px",
                      opacity: showAllPlatforms ? 1 : 0,
                    }}
                  >
                    {platforms.slice(2).map((platform, idx) => (
                      <span key={`extra-${idx}`} className="">
                        {getPlatformsSvg(platform)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Toggle Button at the far end */}
                {platforms.length > 2 && (
                  <button
                    onClick={() => setShowAllPlatforms((prev) => !prev)}
                    className={`${showAllPlatforms ? "text-2xl" : "text-sm"} font-bold hover:scale-110 transition`}
                  >
                    {showAllPlatforms ? "-" : `+${platforms.length - 2}`}
                  </button>
                )}
              </div>

            </div>

            {/* Ratings */}
            <div className="w-1/3 flex flex-col items-center justify-center gap-3">
              {["critics", "players"].map((type, idx) => {
                const rating = game.ratings[type];
                const bgClass = rating == 0 ? "bg-gray-300" :
                  rating < 70 ? "bg-red-500" :
                  rating < 80 ? "bg-amber-400" :
                  rating < 90 ? "bg-green-400" : "bg-green-600";
                const ringClass = rating == 0 ? "bg-gray-400" :
                  rating < 70 ? "bg-red-600" :
                  rating < 80 ? "bg-amber-500" :
                  rating < 90 ? "bg-green-500" : "bg-green-700";

                return (
                  <div key={idx} className={`rounded-full p-1 ${ringClass}`}>
                    <div className={`size-14 flex items-center justify-center rounded-full text-white font-bold text-base relative ${bgClass}`}>
                      {game.ratings[type] >= 80 && (
                        <div className="absolute -top-2 -right-1 -rotate-6 text-amber-400 text-xl">
                          <FaThumbsUp />
                        </div>
                      )}
                      {rating == 0 ? "/" : rating}
                    </div>
                  </div>
                );
              })}
              <a href={game.ratings.link} className="text-center">
                <div className="text-xs text-slate-500 hover:scale-110 transition"><span className="font-normal">Details on</span> <span className="font-bold">OpenCritic</span></div>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
