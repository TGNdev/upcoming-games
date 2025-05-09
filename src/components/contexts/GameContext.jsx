import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [viewGames, setViewGames] = useState(true);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [isLogged, setIsLogged] = useState(localStorage.getItem("admin") === "true");
  const [edit, setEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(null);
  const [gameToEdit, setGameToEdit] = useState(null);

  return (
    <GameContext.Provider
      value={{
        viewGames,
        setViewGames,
        search,
        setSearch,
        opened,
        setOpened,
        isLogged,
        setIsLogged,
        edit,
        setEdit,
        isModalOpen,
        setIsModalOpen,
        featuredOpen,
        setFeaturedOpen,
        gameToEdit,
        setGameToEdit
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
