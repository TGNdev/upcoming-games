import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import GameTable from "../components/GameTable";

const Home = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "games"), snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(list);
    })

    return () => unsub();
  }, []);

  return <GameTable games={games} />;
};

export default Home;
