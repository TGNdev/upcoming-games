import { useGame } from "./contexts/GameContext";

const Search = () => {
  const {
    search, setSearch,
  } = useGame();

  return (
    <input
      className="px-3 py-2 rounded-lg border w-full focus:shadow-lg focus:outline-none transition"
      type="text"
      placeholder="Type to search..."
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  );
}

export default Search;