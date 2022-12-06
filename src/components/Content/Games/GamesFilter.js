import { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { ImCancelCircle } from "react-icons/im";
import styled from "styled-components";
import Avatar from "react-nice-avatar";
import ToggleSwitch from "../../UI/ToggleSwitch";
import Button from "../../UI/Button";
import {
  useAuthContext,
  useDataContext,
  useUIContext,
} from "../../../store/context";

const avatarSize = "2.7rem";

export default function GamesFilter({ showFilter, setShowFilter, setFilter }) {
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [gameType, setGameType] = useState("all");
  const [allPlayers, setAllPlayers] = useState(true);
  const [active, setActive] = useState(false);

  const { currentUser } = useAuthContext();
  const { players } = useDataContext();
  const { setModal } = useUIContext();

  const [selectedPlayers, setSelectedPlayers] = useState(
    !currentUser.isAnonymous ? [currentUser.displayName] : []
  );

  if (!players || (!players[currentUser.uid] && !currentUser.isAnonymous))
    return <></>;

  const resetFilter = () => {
    setActive(false);
    setOnlyVerified(false);
    setGameType("all");
    setAllPlayers(true);
    setSelectedPlayers([currentUser.displayName]);

    setFilter({
      active,
      onlyVerified,
      gameType,
      allPlayers,
      selectedPlayers,
    });
  };

  const saveFilter = () => {
    if (!allPlayers && selectedPlayers.length === 0)
      return setModal({ type: "error", msg: "Select at least one player" });

    setShowFilter(false);
    setModal(null);

    setFilter({
      active:
        onlyVerified !== false || gameType !== "all" || allPlayers !== true,
      onlyVerified,
      gameType,
      allPlayers,
      selectedPlayers,
    });
  };

  const playerListHandler = (player) => {
    if (!selectedPlayers.includes(player.name))
      return setSelectedPlayers((prev) => [...prev, player.name]);

    const newPlayersArray = selectedPlayers.filter(
      (item) => item !== player.name
    );

    setSelectedPlayers(newPlayersArray);
  };

  return (
    <Div showFilter={showFilter}>
      <ImCancelCircle
        className="closeFilter"
        onClick={() => setShowFilter(false)}
      />
      <div className="filter__item">
        <p className="filter__title">Only verified games</p>
        <div className="verified__buttons">
          <ToggleSwitch
            initValue={onlyVerified}
            switchAction={() => setOnlyVerified((prev) => !prev)}
          />
        </div>
      </div>
      <div className="filter__item">
        <p className="filter__title">Games Types</p>
        <div className="options options--gameTypes">
          <div
            className={`option ${gameType === "all" ? "option--active" : ""}`}
            onClick={() => setGameType("all")}
          >
            <div className="icon">
              {gameType === "all" && <AiFillCheckCircle />}
            </div>
            <div className="potion__text">All games</div>
          </div>
          <div
            className={`option ${
              gameType === "classic" ? "option--active" : ""
            }`}
            onClick={() => setGameType("classic")}
          >
            <div className="icon">
              {gameType === "classic" && <AiFillCheckCircle />}
            </div>
            <div className="option__text">Classic Games</div>
          </div>
          <div
            className={`option ${
              gameType === "points" ? "option--active" : ""
            }`}
            onClick={() => setGameType("points")}
          >
            <div className="icon">
              {gameType === "points" && <AiFillCheckCircle />}
            </div>
            <div className="option__text">Points Games</div>
          </div>
        </div>
      </div>
      <div className="filter__item">
        <p className="filter__title">Players</p>
        <div className="players__options">
          <div
            className={`option ${allPlayers ? "option--active" : ""}`}
            onClick={() => setAllPlayers(true)}
          >
            <div className="icon">{allPlayers && <AiFillCheckCircle />}</div>
            <div className="option__text">All Players</div>
          </div>
          <div
            className={`option ${!allPlayers ? "option--active" : ""}`}
            onClick={() => setAllPlayers(false)}
          >
            <div className="icon">{!allPlayers && <AiFillCheckCircle />}</div>
            <div className="option__text">Selected Players</div>
          </div>
          <ul
            className={`players__list ${
              !allPlayers ? "players__list--show" : ""
            }`}
          >
            <>
              {!currentUser.isAnonymous && (
                <li
                  className="player"
                  onClick={() => playerListHandler(players[currentUser.uid])}
                >
                  <div className="player__left">
                    <Avatar
                      className="avatar"
                      style={{ width: avatarSize, height: avatarSize }}
                      {...players[currentUser.uid].avatarConfig}
                      shape="circle"
                    />
                    <p>Me</p>
                  </div>
                  <div className="player__right">
                    <BsCheckLg
                      className={`player__checked ${
                        selectedPlayers.includes(players[currentUser.uid].name)
                          ? "player__checked--show"
                          : ""
                      }`}
                    />
                  </div>
                </li>
              )}
              {Object.entries(players).map(([playerId, player]) => {
                if (
                  currentUser.displayName === player.name &&
                  !currentUser.isAnonymous
                )
                  return null;

                return (
                  <li
                    onClick={() => playerListHandler(player)}
                    className="player"
                    key={player.id}
                  >
                    <div className="player__left">
                      <Avatar
                        className="avatar"
                        style={{ width: avatarSize, height: avatarSize }}
                        {...players[player.id].avatarConfig}
                        shape="circle"
                      />
                      <p>
                        {currentUser.displayName === player.name
                          ? "Me"
                          : player.name}
                      </p>
                    </div>
                    <div className="player__right">
                      <BsCheckLg
                        className={`player__checked ${
                          selectedPlayers.includes(player.name)
                            ? "player__checked--show"
                            : ""
                        }`}
                      />
                    </div>
                  </li>
                );
              })}
            </>
          </ul>
        </div>
      </div>
      <div className="filter__buttons">
        <Button onClick={saveFilter} category="main" small>
          APPLY
        </Button>
        <Button onClick={resetFilter} category="secondary" small>
          RESET
        </Button>
      </div>
    </Div>
  );
}

const Div = styled.div`
  background-color: #eee;
  z-index: 1000;
  padding: 2.5rem 2rem 2rem;

  position: absolute;
  top: 0;
  left: 50%;

  transition: all 0.5s ease-in;

  transform: ${(props) =>
    props.showFilter
      ? "translateX(-50%) translateY(0);"
      : "translateX(-50%) translateY(-100%);"};

  .closeFilter {
    font-size: 2.2rem;
    color: #aaa;
    position: absolute;
    top: 0.7rem;
    right: 0.7rem;
    cursor: pointer;
  }

  .filter__title {
    color: #aaa;
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .filter__buttons {
    display: flex;
    justify-content: center;
    border-top: 2px solid white;
    padding-top: 2rem;

    & button:not(:last-of-type) {
      margin-right: 2rem;
    }
  }

  .filter__item {
    margin-bottom: 2rem;
  }

  .verified__buttons {
    display: flex;
    justify-content: center;
  }

  .verified__button {
    width: 3rem;
    height: 2rem;
    border: 2px solid black;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--primary-color);
    background-color: white;
    color: var(--primary-color);

    &:first-of-type {
      margin-right: 1rem;
    }

    &--active {
      background-color: var(--primary-color);
      color: white;
    }
  }

  .option {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    line-height: 1.2rem;
    cursor: pointer;

    &--active {
      color: var(--primary-color);
    }

    :not(:last-of-type) {
      margin-bottom: 0.7rem;
    }

    & .icon {
      width: 1.2rem;
      height: 1.2rem;
      margin-right: 0.5rem;
      transform: translateY(-1px);
    }
  }

  .players__list {
    min-width: 20rem;
    max-height: 0px;
    background-color: white;
    transition: all 0.5s;
    font-size: 1.3rem;
    overflow-y: auto;
    border: 0 solid #aaa;
    margin-top: 1rem;

    ::-webkit-scrollbar {
      width: 0;
    }

    &--show {
      max-height: 12em;
      border: 4px solid #aaa;
    }
  }

  .player {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.5rem;

    &:hover {
      background-color: #eee;
    }

    &:not(:last-of-type) {
      border-bottom: 1px solid #ccc;
    }

    &__left {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    & .avatar {
      margin-right: 0.7rem;
    }

    &__checked {
      color: var(--primary-color);
      transition: all 0.2s ease-out;
      transform: scale(0);

      &--show {
        transform: scale(1);
      }
    }
  }
`;
