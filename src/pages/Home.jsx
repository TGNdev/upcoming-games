import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import GameTable from "../components/GameTable";

const Home = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const snapshot = await getDocs(collection(db, "games"));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setGames(list);
    };

    fetchGames();
  }, []);

  return <GameTable games={games} />;
};

export default Home;
