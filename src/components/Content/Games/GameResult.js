import styled from "styled-components";
import GameScore from "./GameScore";
import { Link } from "react-router-dom";
import Avatar from "react-nice-avatar";
import { useMediaQuery } from "react-responsive";
import { useDataContext } from "../../../store/context";

export default function GameResult({
  result,
  player1,
  player2,
  winner,
  showType,
}) {
  const bigScreen = useMediaQuery({ query: "(min-width: 750px)" });
  const smallScreen = useMediaQuery({ query: "(max-width: 750px)" });
  const smallNotificationScreen = useMediaQuery({
    query: "(max-width: 500px)",
  });

  const { players } = useDataContext();

  //
  let avatarSize;
  if (showType === "classic") {
    if (bigScreen) avatarSize = "6rem";
    if (smallScreen) avatarSize = "3rem";
  }
  if (showType === "notification") avatarSize = "3rem";

  const player1Container = (
    <Link
      className={`player ${
        smallScreen && showType === "classic" ? "player--mediaSmall" : ""
      }`}
      to={`players/${player1.id}`}
    >
      <Avatar
        style={{ width: avatarSize, height: avatarSize }}
        {...players[player1.id].avatarConfig}
        shape="circle"
      />
      <div
        className={`player__name ${
          winner === player1.id ? "player__winner" : ""
        }`}
      >
        {player1.name}
      </div>
    </Link>
  );

  const player2Container = (
    <Link
      className={`player ${
        smallScreen && showType === "classic" ? "player--mediaSmall" : ""
      }`}
      to={`players/${player2.id}`}
    >
      <Avatar
        style={{ width: avatarSize, height: avatarSize }}
        {...players[player2.id].avatarConfig}
        shape="circle"
      />
      <div
        className={`player__name ${
          winner === player2.id ? "player__winner" : ""
        }`}
      >
        {player2.name}
      </div>
    </Link>
  );

  return (
    <>
      {(bigScreen ||
        (showType === "notification" &&
          (!smallNotificationScreen || result.length === 1))) && (
        <Div showType={showType} bigScreen>
          {player1Container}
          <GameScore result={result} type={showType} />
          {player2Container}
        </Div>
      )}
      {((smallScreen && showType === "classic") ||
        (smallNotificationScreen &&
          showType === "notification" &&
          result.length > 1)) && (
        <Div showType={showType} smallScreen>
          <div className="players__container">
            {player1Container}
            {player2Container}
          </div>
          <GameScore result={result} type={showType} />
        </Div>
      )}
    </>
  );
}

const Div = styled.div`
  display: flex;
  flex-grow: ${(props) => (props.bigScreen ? "1;" : "0;")};
  justify-content: ${(props) =>
    props.showType === "classic" ? "space-between" : "center"};
  justify-content: ${({ smallScreen }) => (smallScreen ? "flex-start" : "")};
  align-items: center;
  padding: 0 1.5rem;

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--black);
    min-width: ${(props) => (props.showType === "classic" ? "11rem" : "none")};
    margin: ${(props) =>
      props.showType === "classic" ? "0" : "0 3rem 0.5rem"};

    &__name {
      transform: ${({ smallScreen }) =>
        smallScreen ? "translateY(0)" : "translateY(0.5rem)"};
      font-size: ${(props) => {
        if (props.showType === "notification") return "1.2rem";

        if (props.bigScreen) return "1.7rem";

        return "1.2rem";
      }};
    }

    &__winner {
      font-weight: bold;
    }

    &--mediaSmall {
      :not(:last-of-type) {
        margin-bottom: 1.5rem;
      }
      flex-direction: row !important;
      column-gap: 1rem;
      align-items: center;
      min-width: 15rem;
    }
  }

  .players__container {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 380px) {
    padding-left: 0;
  }
`;
