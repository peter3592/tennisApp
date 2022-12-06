import {
  useAuthContext,
  useDataContext,
  useUIContext,
} from "../../../store/context";
import styled from "styled-components";
import { useState } from "react";
import NewGameFormSet from "./NewGameFormSet";
import SelectOpponent from "./SelectOpponent";
import Button from "../../UI/Button";
import { useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";

export default function NewGameForm({ showNewGameForm, setShowNewGameForm }) {
  const [gameType, setGameType] = useState("classic");
  const [sets, setSets] = useState(3);
  const [result, setResult] = useState(["0:0", "0:0", "0:0"]);
  const [opponent, setOpponent] = useState(null);

  const { players, addNewGame } = useDataContext();
  const { currentUser } = useAuthContext();
  const { setModal } = useUIContext();

  useEffect(() => {
    if (showNewGameForm) {
      // Reset Form
      setGameType("classic");
      setSets(3);
      setResult(["0:0", "0:0", "0:0"]);
      setOpponent(null);
    }
  }, [showNewGameForm]);

  const submitNewGameHandler = async (e) => {
    e.preventDefault();

    try {
      if (!opponent)
        throw Object.assign(new Error("No opponent chosen"), {
          appError: true,
        });

      result.forEach((result) => {
        const [scoreP1, scoreP2] = result.split(":");
        if (scoreP1 === scoreP2)
          throw Object.assign(
            new Error(
              gameType === "classic"
                ? "Set can't end in a draw"
                : "Points match can't end in a draw"
            ),
            {
              appError: true,
            }
          );

        if (
          (gameType === "classic" && +scoreP1 === 7 && +scoreP2 < 5) ||
          (+scoreP2 === 7 && +scoreP1 < 5)
        )
          throw Object.assign(
            new Error(`Incorrect set result (${scoreP1}:${scoreP2})`),
            {
              appError: true,
            }
          );
      });

      // Determine the winner
      let winner = null;

      if (gameType === "points") {
        const [p1Score, p2Score] = result[0].split(":");
        winner = +p1Score > +p2Score ? currentUser.uid : opponent.id;
      }

      if (gameType === "classic") {
        let p1Score = 0;
        let p2Score = 0;

        result.forEach((res) => {
          const [r1, r2] = res.split(":");
          if (+r1 > +r2) p1Score++;
          if (+r1 < +r2) p2Score++;
        });

        if (p1Score === p2Score)
          throw Object.assign(new Error("Game must have a winner"), {
            appError: true,
          });

        winner = p1Score > p2Score ? currentUser.uid : opponent.id;
      }

      const newGame = {
        id: null,
        gameDate: new Date().toLocaleDateString("sk-SK"),
        player1: {
          email: players[currentUser.uid].email,
          id: players[currentUser.uid].id,
          name: players[currentUser.uid].name,
        },
        player2: {
          email: opponent.email,
          id: opponent.id,
          name: opponent.name,
        },
        result,
        winner,
        type: gameType,
        uploadedAt: Date.now(),
        uploadedBy: players[currentUser.uid],
        verified: false,
        verificationDone: false,
        accepted: null,
      };

      await addNewGame(currentUser, newGame);

      setShowNewGameForm(false);
      setModal({ type: "success", msg: "New game created" });
    } catch (err) {
      if (err.appError) return setModal({ type: "error", msg: err.message });

      setModal({ type: "error", msg: "Creating game error" });
    }
  };

  const setResultChange = (setNum, score) => {
    setResult((prev) => {
      prev[+setNum] = score;
      return prev;
    });
  };

  const gameTypeChangeHandler = (type) => {
    if (type !== "classic" && type !== "points") return;

    if (type === "points") setResult(["0:0"]);

    setGameType(type);
  };

  const setsCountChange = (count) => {
    setResult((prev) => {
      if (+count > sets) {
        let updatedResult = [...prev];
        for (let i = 0; i < count - sets; i++) updatedResult.push("0:0");

        return updatedResult;
      }

      return prev.slice(0, count);
    });

    setSets(+count);
  };

  const opponentChosenHandler = (id) => setOpponent(players[id]);

  return (
    <Form onSubmit={submitNewGameHandler} showNewGameForm={showNewGameForm}>
      <ImCancelCircle
        className="closeForm"
        onClick={() => setShowNewGameForm(false)}
      />
      <div className="topPart">
        <p className="title">Select Opponent</p>
        <p className="title">Game Type</p>
        <SelectOpponent
          opponent={opponent}
          onOpponentClick={opponentChosenHandler}
        />
        <div className="game-type-selection">
          <div className="types">
            <button
              type="button"
              className={`button button__type ${
                gameType === "classic" ? "button__type--active" : ""
              }`}
              onClick={() => gameTypeChangeHandler("classic")}
            >
              Classic
            </button>
            <button
              type="button"
              className={`button button__type ${
                gameType === "points" ? "button__type--active" : ""
              }`}
              onClick={() => gameTypeChangeHandler("points")}
            >
              Points
            </button>
          </div>
        </div>
      </div>
      {gameType === "classic" && (
        <div className="formItem sets-selection">
          <p className="title">Number of sets</p>
          <div className="sets-count">
            {[1, 2, 3, 4, 5].map((number) => (
              <div
                key={number}
                className={`button button__setNumber ${
                  number === sets ? "button__setNumber--active" : ""
                }`}
                onClick={() => setsCountChange(number)}
              >
                {number}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="formItem result">
        <p className="title">Result</p>
        {gameType === "classic" && (
          <div className="classic-result">
            <div className="classic-result-set">
              {Array(sets)
                .fill(" ")
                .map((_, index) => (
                  <NewGameFormSet
                    key={index}
                    type="classic"
                    set={index}
                    onSetResultChange={setResultChange}
                    first={index === 0 ? true : false}
                    opponent={opponent}
                  />
                ))}
            </div>
          </div>
        )}
        {gameType === "points" && (
          <NewGameFormSet
            type="points"
            set="0"
            onSetResultChange={setResultChange}
            first={true}
            opponent={opponent}
          />
        )}
      </div>
      <div className="btn__container">
        <Button category="main">Submit Match</Button>
      </div>
    </Form>
  );
}

const Form = styled.form`
  padding: 2rem;
  background-color: #eee;

  position: absolute;
  top: 0;
  left: 50%;

  transition: all 0.5s ease-in;

  transform: ${(props) =>
    props.showNewGameForm
      ? "translateX(-50%) translateY(0);"
      : "translateX(-50%) translateY(-100%);"};

  z-index: 5;

  .closeForm {
    font-size: 2.2rem;
    color: #aaa;
    position: absolute;
    top: 0.7rem;
    right: 0.7rem;
    cursor: pointer;
  }

  .topPart {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;

    .title {
      text-align: center;
    }
  }

  .formItem {
    margin-bottom: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .title {
    color: #aaa;
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1rem;
    align-self: flex-start;

    :not(:first-of-type) {
    }
  }

  .types {
    display: flex;
    justify-content: space-around;
  }

  .button {
    border: 2px solid black;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--primary-color);

    &__type {
      padding: 0.5rem;
      border: 2px solid var(--primary-color);
      background-color: white;
      transition: all 0.3s;

      &--active {
        background-color: var(--primary-color);
        color: white;
      }
    }

    &__setNumber {
      padding: 0.5rem 1rem;
      font-size: 1.5rem;
      border: none;
      background-color: transparent;
      transition: all 0.3s;

      &--active {
        font-weight: bold;
        font-size: 2.6rem;
      }
    }

    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }

  & .sets-count {
    display: flex;
    height: 4.3rem;
  }

  .btn__container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
  }
`;
