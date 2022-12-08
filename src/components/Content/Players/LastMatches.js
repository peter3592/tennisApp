import MyTippy from "../../UI/MyTippy";
import { hideAll } from "tippy.js";
import { useAuthContext, useDataContext } from "../../../store/context";
import styled from "styled-components";
import Avatar from "react-nice-avatar";
import GameScore from "../Games/GameScore";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { GiTennisBall } from "react-icons/gi";

const avatarSize = "4.5rem";

export default function LastMatches(props) {
  const { currentUser } = useAuthContext();
  const { players } = useDataContext();

  let games = [...props.gamesPlayed];

  const arrayLength = games.length;

  // Fill empty matches
  for (let i = 0; i < 5 - arrayLength; i++) games.push(null);

  // Remove old matches
  if (arrayLength > 5) games = games.slice(0, 5);

  return (
    <Wrapper className={props.className}>
      {games.map((game) => {
        if (!game)
          return <GiTennisBall className="match no-game" key={nanoid()} />;

        let classes = "match";
        if (props.profilePlayer.id === game.winner) {
          classes += " win";
        } else {
          classes += " loss";
        }

        const content = (
          <div className="content popup--grey" onClick={hideAll}>
            <div className="players">
              <div className="player__container">
                <Link
                  className="player__details"
                  to={`/players/${game.player1.id}`}
                >
                  <Avatar
                    className=""
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      filter:
                        game.winner === game.player1.id
                          ? "none"
                          : "grayscale(1)",
                    }}
                    {...players[game.player1.id].avatarConfig}
                    shape="circle"
                  />
                  <div
                    className={`player__name ${
                      game.player1.id === game.winner ? "strong" : ""
                    }`}
                  >
                    {game.player1.name === currentUser.displayName
                      ? "You"
                      : game.player1.name}
                  </div>
                </Link>
              </div>
              <div className="vs">vs.</div>
              <div className="player__container">
                <Link
                  className="player__details"
                  to={`/players/${game.player2.id}`}
                >
                  <Avatar
                    className=""
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      filter:
                        game.winner === game.player2.id
                          ? "none"
                          : "grayscale(1)",
                    }}
                    {...players[game.player2.id].avatarConfig}
                    shape="circle"
                  />
                  <div
                    className={`player__name ${
                      game.player2.id === game.winner ? "strong" : ""
                    }`}
                  >
                    {game.player2.name === currentUser.displayName
                      ? "You"
                      : game.player2.name}
                  </div>
                </Link>
              </div>
            </div>
            <GameScore result={game.result} type="lastMatches" />
          </div>
        );

        return (
          <MyTippy content={content} key={nanoid()}>
            <div className={classes}>
              <GiTennisBall className="ball" />
            </div>
          </MyTippy>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 0.4rem;

  .content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .match {
    width: 2.5rem;
    height: 2.5rem;
    z-index: 5;

    .ball {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  .win {
    color: darkgreen;
  }

  .loss {
    color: red;
  }

  .no-game {
    color: #aaa;
  }

  .players {
    display: flex;
    align-items: center;
  }

  .player {
    &__name {
      margin-top: 0.8rem;
      color: black;
    }

    &__container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      min-width: 10rem;
    }

    &__details {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-decoration: none;
    }
  }

  .vs {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 1.5rem;
  }

  .strong {
    font-weight: bold;
  }
`;
