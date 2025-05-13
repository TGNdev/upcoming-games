import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../js/firebase";
import { onAuthStateChanged } from "firebase/auth";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [viewGames, setViewGames] = useState(true);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(null);
  const [gameToEdit, setGameToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogged(!!user);
    });

    return () => unsubscribe();
  }, []);

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
