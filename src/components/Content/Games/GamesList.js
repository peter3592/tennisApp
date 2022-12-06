import Game from "./Game";
import styled from "styled-components";
import { useAuthContext, useDataContext } from "../../../store/context";
import GamesFilter from "./GamesFilter";
import { useState } from "react";
import { AiOutlineFileAdd, AiOutlineFilter } from "react-icons/ai";
import NewGameForm from "../NewGame/NewGameForm";

export default function GamesList() {
  const [showFilter, setShowFilter] = useState(false);
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [filter, setFilter] = useState({
    active: false,
    onlyVerified: null,
    gameType: null,
    allPlayers: null,
    selectedPlayers: null,
  });

  const { currentUser } = useAuthContext();
  const { games } = useDataContext();

  let filteredGames = games;

  if (filter.active) {
    if (filter.onlyVerified)
      filteredGames = filteredGames.filter((game) => game.verified);

    if (filter.gameType === "classic" || filter.gameType === "points")
      filteredGames = filteredGames.filter(
        (game) => game.type === filter.gameType
      );

    if (!filter.allPlayers)
      filteredGames = filteredGames.filter(
        (game) =>
          filter.selectedPlayers.includes(game.player1.name) ||
          filter.selectedPlayers.includes(game.player2.name)
      );
  }

  return (
    <Div>
      {(showFilter || showNewGameForm) && (
        <ListBackdrop
          onClick={() => {
            setShowFilter(false);
            setShowNewGameForm(false);
          }}
        />
      )}
      <GamesFilter
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        setFilter={setFilter}
      />
      <NewGameForm
        showNewGameForm={showNewGameForm}
        setShowNewGameForm={setShowNewGameForm}
      />
      {currentUser && (
        <div className="actions">
          <div
            className={`action ${
              currentUser.isAnonymous ? "action--hidden" : ""
            }`}
            onClick={() => setShowNewGameForm(true)}
          >
            <AiOutlineFileAdd className="action__icon" />
          </div>
          {!(filteredGames.length === 0 && !filter.active) && (
            <div className="action" onClick={() => setShowFilter(true)}>
              <AiOutlineFilter className="action__icon" />
              {filter.active && (
                <div className="action__icon__filter--active" />
              )}
            </div>
          )}
        </div>
      )}
      {filteredGames.length === 0 && !filter.active && (
        <p className="errorMsg">No games yet</p>
      )}
      {filteredGames.length === 0 && filter.active && (
        <p className="errorMsg">No results</p>
      )}
      <ListWrapper>
        <ul>
          {filteredGames.map((game) => (
            <Game key={game.id} {...game} />
          ))}
        </ul>
      </ListWrapper>
    </Div>
  );
}

const Div = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 7rem 0 6rem;

  position: relative;
  overflow: hidden;

  .actions {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .action {
    background-color: var(--primary-color);
    border-radius: 4rem;
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    transition: all 0.3s;

    &--hidden {
      visibility: hidden;
    }

    :first-of-type {
      margin-right: 2rem;
    }

    :hover {
      transform: scale(1.1);
    }

    &__icon {
      font-size: 2.3rem;
      color: white;

      &__filter--active {
        width: 1.3rem;
        height: 1.3rem;
        background-color: var(--primary-color);
        border-radius: 50%;
        position: absolute;
        top: -0.5rem;
        right: -0.4rem;
      }
    }
  }

  .errorMsg {
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
    color: var(--primary-color);
  }

  @media (max-width: 750px) {
    padding-bottom: 0;

    .action {
      background-color: white;
      &__icon {
        color: var(--primary-color);
      }
      &__icon__filter--active {
        background-color: white;
      }
    }

    .errorMsg {
      color: white;
    }
  }
`;

const ListWrapper = styled.div`
  max-height: 100%;
  max-width: 75rem;

  margin: 0 auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  scrollbar-gutter: stable both-edges;

  background-color: #f3f6f0;
  position: relative;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: darkgrey;
    background-color: var(--primary-light-color);
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px green;
  }
`;

const ListBackdrop = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
`;
