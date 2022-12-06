import Avatar from "react-nice-avatar";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDataContext } from "../../../store/context";
import StatBar from "./StatBar";
import Button from "../../UI/Button";

const avatarSize = "7rem";

export default function PlayerListItem({ player, onlyVerified }) {
  const { games, players } = useDataContext();

  const gamesPlayed = games.filter((game) => {
    if (onlyVerified && !game.verified) return false;

    return game.player1.id === player.id || game.player2.id === player.id;
  }).length;

  const gamesWon = games.filter((game) => {
    if (onlyVerified && !game.verified) return false;

    return game.winner === player.id;
  }).length;

  const gamesLosses = gamesPlayed - gamesWon;

  return (
    <Wrapper>
      <div className="triangle"></div>
      <div className="left">
        <div className="player">
          <Avatar
            className="avatar"
            style={{ width: avatarSize, height: avatarSize }}
            {...players[player.id].avatarConfig}
            shape="circle"
            bgColor="#fff"
          />
          <div className="player__name">{player.name}</div>
        </div>
      </div>
      <div className="right">
        <div className="stats">
          <div className="stat">
            <div className="stat__title">G</div>
            <StatBar fill={gamesPlayed > 0 ? 100 : 0} color="black" />
            <div className="stat__value">{gamesPlayed}</div>
          </div>
          <div className="stat">
            <div className="stat__title">W</div>
            <StatBar fill={(100 * gamesWon) / gamesPlayed} color="green" />
            <div className="stat__value">{gamesWon}</div>
          </div>
          <div className="stat">
            <div className="stat__title">L</div>
            <StatBar fill={(100 * gamesLosses) / gamesPlayed} color="red" />
            <div className="stat__value">{gamesLosses}</div>
          </div>
        </div>
        <Link to={`/players/${player.id}`} className="link">
          <Button category="main" small>
            See Profile
          </Button>
        </Link>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  padding: 1.7rem 0;
  display: flex;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  border: 6px solid var(--primary-color);

  .triangle {
    width: 25rem;
    height: 25rem;
    background-color: var(--primary-color);
    position: absolute;
    transform: rotate(52deg) translateX(-22.8rem) translateY(-3rem);
    z-index: 0;
  }

  .avatar {
    border: 3px solid var(--primary-color);
    z-index: 1;
    position: relative;
  }

  .left {
    height: 100%;
    width: 45%;

    display: flex;
    justify-content: center;
    align-items: center;

    .player {
      min-width: 11rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &__name {
        position: relative;
        margin-top: 1.5rem;
        text-align: center;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 1.3rem;
        z-index: 1;
      }
    }
  }
  .right {
    height: 100%;
    width: 55%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .stats {
    margin-bottom: 2rem;

    .stat {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1.5rem;
      width: 13rem;

      &__title,
      &__value {
        flex: 0 0 2rem;
        text-align: center;
      }
    }
  }

  .link {
    text-decoration: none;
  }

  @media (max-width: 750px) {
    border: 6px solid #fff;
  }
`;
