import React from "react";
import { useState, useEffect } from "react";

import { db } from "../firebase/firebase";
import { get, update, ref, push, onValue, remove } from "firebase/database";

export const DataContext = React.createContext();

export function DataProvider(props) {
  const [games, setGames] = useState(null);
  const [players, setPlayers] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [playersNames, setPlayersNames] = useState(null);

  useEffect(() => {
    fetchPlayersNames();
  }, []);

  const fetchPlayersNames = async () => {
    const playersNamesSnapshot = await get(ref(db, "/usersList"));

    const playersNames = playersNamesSnapshot.val();

    if (!playersNames) {
      setPlayersNames([]);
      return;
    }

    const names = Object.entries(playersNames).map((item) => item[1]);

    setPlayersNames(names);
  };

  const fetchGames = async (dataSnapshot) => {
    let gamesDataSnapshot = null;

    if (dataSnapshot) {
      gamesDataSnapshot = dataSnapshot;
    } else {
      gamesDataSnapshot = await get(ref(db, "/games"));
    }

    const games = gamesDataSnapshot.val();

    if (games) {
      const fetchedGames = Object.entries(games).map(([key, value]) => value);
      // Filted declined games
      const filteredGames = fetchedGames.filter(
        (game) => !(game.verificationDone && !game.verified)
      );
      const sortedGames = filteredGames.sort(
        (g1, g2) => g2.uploadedAt - g1.uploadedAt
      );
      return setGames(sortedGames);
    }

    setGames([]);
  };

  const fetchPlayers = async (dataSnapshot) => {
    const usersDataSnapshot = dataSnapshot ?? (await get(ref(db, "/users")));

    const users = usersDataSnapshot.val();

    if (!users) return setPlayers([]);

    setPlayers(users);
  };

  const initDataLoad = async () => {
    // Loading games
    await fetchGames();

    // Loading users
    await fetchPlayers();

    // On data change handlers
    onValue(ref(db, "/games"), fetchGames);
    onValue(ref(db, "/users"), fetchPlayers);
    onValue(ref(db, "/usersList"), fetchPlayersNames);

    setDataLoaded(true);
  };

  const addNewGame = async (currentUser, data) => {
    if (!currentUser) return;

    const res = await push(ref(db, "/games"), data);

    await update(ref(db, "games/" + res.key), {
      id: res.key,
    });
  };

  const gameVerification = async (gameId, verified) => {
    await update(ref(db, "games/" + gameId), {
      verified,
      verificationDone: true,
    });
  };

  const removeGame = async (gameId) => {
    await remove(ref(db, "games/" + gameId));
  };

  const updateProfile = async (userId, endPoint, newData) => {
    if (endPoint !== "details" && endPoint !== "avatarConfig") return;

    await update(ref(db, `users/${userId}/${endPoint}/`), newData);
  };

  const value = {
    addNewGame,
    games,
    players,
    initDataLoad,
    dataLoaded,
    gameVerification,
    playersNames,
    removeGame,
    updateProfile,
  };

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
}
