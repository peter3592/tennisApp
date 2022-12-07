import styled from "styled-components";
import GameResult from "../Content/Games/GameResult";
import { useAuthContext, useDataContext } from "../../store/context";

export default function Notification({ games, className }) {
  const { currentUser } = useAuthContext();
  const { players, gameVerification, removeGame } = useDataContext();

  const verificationHandler = (e) => {
    if (e.target.localName !== "button") return;

    const btnPurpose = e.target.dataset.purpose;

    if (btnPurpose === "ACCEPT") gameVerification(e.target.dataset.id, true);
    if (btnPurpose === "DECLINE") removeGame(e.target.dataset.id);
  };

  return (
    <List onClick={verificationHandler} className={className}>
      {games.map((game) => {
        const winner = players[game.winner];
        return (
          <li key={game.id} id={game.id}>
            <p className="text">
              <strong>{game.uploadedBy.name}</strong> uploaded game played with
              you on <strong>{game.gameDate}</strong>
            </p>
            <p className="text">
              <strong>
                {currentUser.uid === winner.id ? "You " : `${winner.name} `}
              </strong>
              {currentUser.uid === winner.id ? "have " : "has "} won!
            </p>
            <GameResult
              result={game.result}
              player1={game.player1}
              player2={game.player2}
              showType="notification"
            />
            <div className="buttons">
              <button
                className="btn--accept"
                data-id={game.id}
                data-purpose="ACCEPT"
              >
                ACCEPT
              </button>
              <button
                className="btn--decline"
                data-id={game.id}
                data-purpose="DECLINE"
              >
                DECLINE
              </button>
            </div>
          </li>
        );
      })}
    </List>
  );
}

const List = styled.ul`
  max-height: 40rem;
  overflow-y: auto;

  & li {
    max-width: 45rem;
    padding: 1.5rem;

    :not(:last-of-type) {
      border-bottom: 2px solid white;
    }
  }

  .text {
    margin-bottom: 1rem;
  }

  .buttons {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    & button {
      margin: 0 2rem;
      cursor: pointer;
      font-size: 1rem;

      padding: 0.8rem 1.6rem;
      text-decoration: none;
      background: #0069ed;
      color: #ffffff;
    }

    .btn--accept {
      background: var(--primary-color);
      border: 2px solid var(--primary-color);
      color: #ffffff;
    }

    .btn--decline {
      background: white;
      border: 2px solid red;
      color: red;
    }
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: darkgrey;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
`;
