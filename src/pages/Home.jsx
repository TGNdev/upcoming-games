import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../js/firebase";
import Main from "../components/Main";

const Home = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "games"), snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(list);
    })

    return () => unsub();
  }, []);

  return <Main games={games} />;
};

export default Home;
