import React, { useState } from "react";
import { ReactComponent as XboxIcon } from "../assets/icons/xbox.svg";
import { ReactComponent as PsIcon } from "../assets/icons/ps.svg";
import { ReactComponent as PcIcon } from "../assets/icons/pc.svg";
import { ReactComponent as SwitchIcon } from "../assets/icons/switch.svg";
import { ReactComponent as Switch2Icon } from "../assets/icons/switch_2.svg";
import { AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { deleteGameFromFirestore } from "../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isEditing, setIsEditing] = useState(false);
  const [useDateObject, setUseDateObject] = useState(typeof game.release_date === "object");
  const [editedGame, setEditedGame] = useState(JSON.parse(JSON.stringify(game)));

  const isReleased = () => {
    const today = new Date();
    const releaseDate = new Date(game.release_date.seconds * 1000);
    return releaseDate < today;
  };

  return (
    <tr id={`game-${game.id}`} className="text-center relative text-sm">
      <td className="p-3 sticky left-0 bg-white z-20">
        {isReleased() ? (
          <div
            className="absolute top-0 left-0 z-30 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded transform -rotate-12 shadow-lg"
            style={{ transformOrigin: "left top" }}
          >
            Released
          </div>
        ) : (
          <div
            className="absolute top-0 left-0 z-30 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded transform -rotate-12 shadow-lg"
            style={{ transformOrigin: "left top" }}
          >
            Coming soon
          </div>
        )}
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Game name"
              value={editedGame.name}
              onChange={(e) => setEditedGame({ ...editedGame, name: e.target.value })}
            />
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Game link"
              value={editedGame.link}
              onChange={(e) => setEditedGame({ ...editedGame, link: e.target.value })}
            />
          </div>
        ) : (
          <a target="blank" href={game.link}>
            <div className="hover:scale-110 transition text-base">{game.name}</div>
          </a>
        )}
      </td>

      <td className="p-3">
        {isEditing ? (
          <div className="flex flex-col gap-1 items-center">
            <button
              onClick={() => setUseDateObject(!useDateObject)}
              className="text-xs text-blue-600 underline"
            >
              {useDateObject ? "Switch to text" : "Switch to date picker"}
            </button>
            {useDateObject ? (
              <input
                type="date"
                className="border rounded px-2 py-1"
                value={new Date(editedGame.release_date.seconds * 1000)
                  .toISOString()
                  .split("T")[0]}
                onChange={(e) =>
                  setEditedGame({
                    ...editedGame,
                    release_date: {
                      seconds: Math.floor(new Date(e.target.value).getTime() / 1000),
                    },
                  })
                }
              />
            ) : (
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={editedGame.release_date}
                onChange={(e) =>
                  setEditedGame({ ...editedGame, release_date: e.target.value })
                }
              />
            )}
          </div>
        ) : (
          <div className="hover:cursor-default text-sm">
            {game.release_date?.seconds
              ? new Date(game.release_date.seconds * 1000).toLocaleDateString("en-EN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : game.release_date || "Unknown"}
          </div>
        )}
      </td>

      <td className="p-3">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            {editedGame.developers.map((dev, i) => (
              <div key={i} className="flex flex-col gap-1">
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Developer name"
                  value={dev.name}
                  onChange={(e) => {
                    const newDevs = [...editedGame.developers];
                    newDevs[i].name = e.target.value;
                    setEditedGame({ ...editedGame, developers: newDevs });
                  }}
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Developer link"
                  value={dev.link}
                  onChange={(e) => {
                    const newDevs = [...editedGame.developers];
                    newDevs[i].link = e.target.value;
                    setEditedGame({ ...editedGame, developers: newDevs });
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y">
            {game.developers.map((developer) => (
              <a target="blank" href={developer.link} key={developer.name}>
                <div className="hover:scale-110 transition text-sm">{developer.name}</div>
              </a>
            ))}
          </div>
        )}
      </td>

      <td className="p-3">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            {editedGame.editors.map((editor, i) => (
              <div key={i} className="flex flex-col gap-1">
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Editor name"
                  value={editor.name}
                  onChange={(e) => {
                    const newEditors = [...editedGame.editors];
                    newEditors[i].name = e.target.value;
                    setEditedGame({ ...editedGame, editors: newEditors });
                  }}
                />
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Editor link"
                  value={editor.link}
                  onChange={(e) => {
                    const newEditors = [...editedGame.editors];
                    newEditors[i].link = e.target.value;
                    setEditedGame({ ...editedGame, editors: newEditors });
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y">
            {game.editors.map((editor, index) => (
              <a target="blank" href={editor.link} key={index}>
                <div className="hover:scale-110 transition text-sm">{editor.name}</div>
              </a>
            ))}
          </div>
        )}
      </td>

      <td className="p-3">
        <div className="flex flex-row gap-2 justify-center flex-wrap">
          {Object.keys(game.platforms)
            .filter((platform) => game.platforms[platform])
            .sort()
            .map((platform) => getPlatformsSvg(platform))}
          {Object.values(game.platforms).every((value) => !value) && (
            <span className="text-sm">TBA</span>
          )}
        </div>
      </td>

      <td className="p-3">
        {isEditing ? (
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-2">
              <input
                type="number"
                className="border rounded px-2 py-1 w-20"
                placeholder="Critics"
                value={editedGame.ratings.critics}
                onChange={(e) =>
                  setEditedGame({
                    ...editedGame,
                    ratings: { ...editedGame.ratings, critics: parseInt(e.target.value) || 0 },
                  })
                }
              />
              <input
                type="number"
                className="border rounded px-2 py-1 w-20"
                placeholder="Players"
                value={editedGame.ratings.players}
                onChange={(e) =>
                  setEditedGame({
                    ...editedGame,
                    ratings: { ...editedGame.ratings, players: parseInt(e.target.value) || 0 },
                  })
                }
              />
            </div>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              placeholder="Ratings link"
              value={editedGame.ratings.link}
              onChange={(e) =>
                setEditedGame({
                  ...editedGame,
                  ratings: { ...editedGame.ratings, link: e.target.value },
                })
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2 justify-center">
              {["critics", "players"].map((ratingType, index) => (
                <div key={index} className={`${getRatingStyle(game.ratings[ratingType])}`}>
                  {game.ratings[ratingType] == 0 ? "/" : game.ratings[ratingType]}
                </div>
              ))}
            </div>
            {game.ratings.link ? (
              <a target="blank" href={game.ratings.link}>
                <div className="text-xs text-slate-500 hover:scale-110 transition">
                  <span className="font-normal">Details on </span>
                  <span className="font-bold">OpenCritic</span>
                </div>
              </a>
            ) : (
              <div className="text-xs text-slate-500">Edit to add link</div>
            )}
          </div>
        )}

      </td>

      {edit && (
        <td className="p-3 sticky right-0 bg-white z-20">
          <div className="flex flex-row gap-3 justify-center items-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="size-6 p-1 sm:text-sm sm:w-fit sm:py-2 sm:px-2.5 sm:flex flex-row items-center bg-amber-400 text-white rounded-md hover:scale-110 transition"
            >
              <AiFillEdit />
            </button>
            <button
              className="size-6 p-1 sm:text-sm sm:w-fit sm:py-2 sm:px-2.5 sm:flex flex-row items-center bg-red-400 text-white rounded-md hover:scale-110 transition"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${game.name}" ?`)) {
                  deleteGameFromFirestore(game.id);

                  toast.success("Game added successfully!");
                }
              }}
            >
              <FaTrash />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default GameRow;
