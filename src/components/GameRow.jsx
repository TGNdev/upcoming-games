import React from "react";
import { ReactComponent as XboxIcon } from "../assets/icons/xbox.svg";
import { ReactComponent as PsIcon } from "../assets/icons/ps.svg";
import { ReactComponent as PcIcon } from "../assets/icons/pc.svg";
import { ReactComponent as SwitchIcon } from "../assets/icons/switch.svg";
import { ReactComponent as Switch2Icon } from "../assets/icons/switch_2.svg";

const getRatingStyle = (rating) => {
  const baseClasses = "size-5 px-5 py-4 rounded-xl text-white hover:cursor-default text-sm flex items-center justify-center";
  if (rating == 0) return `${baseClasses} bg-slate-300`;
  if (rating < 70) return `${baseClasses} bg-red-500`;
  if (rating >= 70 && rating < 80) return `${baseClasses} bg-amber-400`;
  if (rating >= 80 && rating < 90) return `${baseClasses} bg-green-400`;
  return `${baseClasses} bg-green-600`;
};

const getPlatformsSvg = (platform) => {
  const baseClasses = "size-8 rounded p-1.5";
  var classes = "";

  switch (platform) {
    case "xbox":
      classes = `${baseClasses} bg-green-500`;
      return <XboxIcon className={classes} fill="white" />;
    case "ps":
      classes = `${baseClasses} bg-blue-500`;
      return <PsIcon className={classes} fill="white" />;
    case "pc":
      classes = `${baseClasses} bg-slate-400`;
      return <PcIcon className={classes} fill="white" />;
    case "switch":
      classes = `${baseClasses} bg-red-500`;
      return <SwitchIcon className={classes} fill="white" />;
    case "switch_2":
      classes = `${baseClasses} bg-red-500`;
      return <Switch2Icon className={classes} fill="white" />;
    default:
      return null;
  }
};

const GameRow = ({ game, edit }) => {
  const platforms = ["pc", "ps", "xbox", "switch", "switch_2"];
  const isReleased = () => {
    const today = new Date();
    const releaseDate = new Date(game.release_date.seconds * 1000);
    return releaseDate <= today;
  };

  return (
    <tr className="text-center relative text-sm">
      {edit ? (
        <td className="p-3 sticky left-0 bg-white z-20">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="px-4 py-2 rounded border"
              name="name"
              value={game.name}
            />
            <input
              type="text"
              className="px-4 py-2 rounded border"
              name="link"
              value={game.link}
            />
          </div>
        </td>
      ) : (
        <td className="p-3 sticky left-0 bg-white z-20">
          {isReleased() && (
            <div
              className="absolute top-0 left-0 z-30 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded transform -rotate-12 shadow-lg"
              style={{ transformOrigin: "left top" }}
            >
              Released
            </div>
          )}
          <a href={game.link}>
            <div className="hover:scale-110 transition text-base">{game.name}</div>
          </a>
        </td>
      )}
      {edit ? (
        <td className="p-3">
          <input
            type="date"
            className="px-4 py-2 rounded border"
            name="releaseDate"
            value={new Date(game.release_date.seconds * 1000).toISOString().split("T")[0]}
          />
        </td>
      ) : (
        <td className="p-3">
          <div className="hover:cursor-default text-sm">
            {new Date(game.release_date.seconds * 1000).toLocaleDateString("en-EN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </td>
      )}
      {edit ? (
        <td className="p-3">
          {game.developers.map((dev, index) => (
            <div key={index} className="flex flex-col gap-2 justify-center">
              <input
                type="text"
                className="px-4 py-2 rounded border"
                value={dev.name}
              />
              <input
                type="text"
                className="px-4 py-2 rounded border"
                name="link"
                value={dev.link}
              />
            </div>
          ))}
        </td>
      ) : (
        <td className="p-3">
          <div className="flex flex-col divide-y">
            {game.developers.map((developer, index) => (
              <a href={developer.link} key={index} className={game.developers.length > 1 ? "py-1.5" : ""}>
                <div className="hover:scale-110 transition text-sm">{developer.name}</div>
              </a>
            ))}
          </div>
        </td>
      )}
      {edit ? (
        <td className="p-3">
          {game.editors.map((edi, index) => (
            <div key={index} className="flex flex-col gap-2 justify-center">
              <input
                type="text"
                className="px-4 py-2 rounded border"
                value={edi.name}
              />
              <input
                type="text"
                className="px-4 py-2 rounded border"
                name="link"
                value={edi.link}
              />
            </div>
          ))}
        </td>
      ) : (
        <td className="p-3">
          <div className="flex flex-col divide-y">
            {game.editors.map((editor, index) => (
              <a href={editor.link} key={index} className={game.editors.length > 1 ? "py-1.5" : ""}>
                <div className="hover:scale-110 transition text-sm">{editor.name}</div>
              </a>
            ))}
          </div>
        </td>
      )}
      {edit ? (
        <td className="p-3">
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            {platforms.sort()
              .map((platform) => {
                const isActive = game.platforms[platform];
                return (
                  <button
                    key={platform}
                    className={`relative ${isActive ? "opacity-100" : "opacity-20"} flex items-center gap-1 rounded hover:scale-110 transition`}
                    onClick={() => {
                      alert("Coming Soon ...")
                    }}
                  >
                    {getPlatformsSvg(platform)}
                  </button>
                );
              })
            }
          </div>
        </td>
      ) : (
        <td className="p-3">
          <div className="flex flex-row gap-2 justify-center flex-wrap">
            {Object.keys(game.platforms)
              .filter((platform) => game.platforms[platform])
              .sort()
              .map((platform) => getPlatformsSvg(platform))}
          </div>
        </td>
      )}
      {edit ? (
        <td className="p-3">
          <div className="flex flex-row gap-2 justify-center">
            <input
              type="number"
              className="px-4 py-2 rounded border"
              name="critics"
              value={game.ratings.critics}
              min={0}
              max={100}
            />
            <input
              type="number"
              className="px-4 py-2 rounded border"
              name="players"
              value={game.ratings.players}
              min={0}
              max={100}
            />
          </div>
        </td>
      ) : (
        <td className="p-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 justify-center">
              {["critics", "players"].map((ratingType, index) => (
                <div key={index} className={`${getRatingStyle(game.ratings[ratingType])}`}>
                  {game.ratings[ratingType] == 0 ? "/" : game.ratings[ratingType]}
                </div>
              ))}
            </div>
            {game.ratings.link ? (
              <a href={game.ratings.link}>
                <div className="text-xs text-slate-500 hover:scale-110 transition"><span className="font-normal">Details on</span> <span className="font-bold">OpenCritic</span></div>
              </a>
            ) : (
              <div className="text-xs text-slate-500">Edit to add link</div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default GameRow;
