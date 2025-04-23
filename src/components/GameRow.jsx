import React from "react";
import { ReactComponent as XboxIcon } from "../assets/icons/xbox.svg";
import { ReactComponent as PsIcon } from "../assets/icons/ps.svg";
import { ReactComponent as PcIcon } from "../assets/icons/pc.svg";
import { ReactComponent as SwitchIcon } from "../assets/icons/switch.svg";
import { ReactComponent as Switch2Icon } from "../assets/icons/switch_2.svg";

const getRatingStyle = (rating) => {
  const baseClasses = "px-2 py-1 rounded-xl text-white";
  if (rating < 70) return `${baseClasses} bg-red-500`;
  if (rating >= 70 && rating < 80) return `${baseClasses} bg-yellow-500`;
  if (rating >= 80 && rating < 90) return `${baseClasses} bg-green-300`;
  return `${baseClasses} bg-green-500`;
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
}

const GameRow = ({ game }) => (
  <tr className="text-center">
    <td className="p-3">
      <a href={game.link}>
        <div className="hover:scale-105 transition">{game.name}</div>
      </a>
    </td>
    <td className="p-3">{game.releaseDate}</td>
    <td className="p-3"></td>
    <td className="p-3"></td>
    <td className="p-3">
      <div className="flex flex-row gap-2 justify-center">
        {Object.keys(game.platforms)
          .filter((platform) => game.platforms[platform])
          .sort()
          .map((platform) => getPlatformsSvg(platform))}
      </div>
    </td>
    <td className="p-3">
      <a href={game.ratings.link}>
        <div className="flex flex-row gap-3 justify-center">
          {["critics", "recommend", "players"].map((ratingType, index) => (
            <div key={index} className={getRatingStyle(game.ratings[ratingType])}>
              {ratingType === "recommend" ? `${game.ratings[ratingType]}%` : game.ratings[ratingType]}
            </div>
          ))}
        </div>
      </a>
    </td>
  </tr>
);

export default GameRow;
