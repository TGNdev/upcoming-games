import React from "react";

const GameRow = ({ game }) => (
  <tr className="hover:bg-muted/20 transition">
    <td className="p-3">{game.name}</td>
    <td className="p-3">
      <div>
        <span className="block text-sm opacity-80">🧑‍💻 {Array.isArray(game.developer) ? game.developer.join(", ") : game.developer}</span>
        <span className="block text-sm opacity-60">🏢 {Array.isArray(game.publisher) ? game.publisher.join(", ") : game.publisher}</span>
      </div>
    </td>
    <td className="p-3">{game.releaseDate}</td>
    <td className="p-3">{game.platforms.join(", ")}</td>
    <td className="p-3">{game.openCriticRating}</td>
    <td className="p-3">
      <a
        href={game.officialSite}
        target="_blank"
        rel="noreferrer"
        className="text-highlight hover:opacity-80"
      >
        Visit
      </a>
    </td>
  </tr>
);

export default GameRow;
