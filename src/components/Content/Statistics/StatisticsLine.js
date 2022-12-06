import styled from "styled-components";
import { BsFillStarFill } from "react-icons/bs";
import Avatar from "react-nice-avatar";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { useDataContext } from "../../../store/context";

const avatarSmallSize = "2.5rem";

export default function StatisticsLine({
  stars,
  player,
  count,
  percents = false,
}) {
  const { players } = useDataContext();

  return (
    <Div>
      <div className="stars">
        {Array(stars)
          .fill(" ")
          .map(() => (
            <div className="" key={nanoid()}>
              <BsFillStarFill className="star" />
            </div>
          ))}
      </div>
      <div className="link__container">
        <Link className="line__player" to={`players/${player.id}`}>
          <Avatar
            className="avatar"
            style={{ width: avatarSmallSize, height: avatarSmallSize }}
            {...players[player.id].avatarConfig}
            shape="circle"
          />
          <p className="line__player__name">{player.name}</p>
        </Link>
      </div>
      <div className="line__player__value">{`${Math.trunc(count)}${
        percents ? "%" : ""
      }`}</div>
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 25rem;

  :not(:last-of-type) {
    margin-bottom: 1rem;
  }

  .stars {
    width: 8rem;
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
    font-size: 1.4rem;

    .star {
      color: #c8b618;
    }
  }

  .link__container {
    text-align: left;
    flex-grow: 1;
  }

  .line__player {
    display: flex;
    align-items: center;

    text-decoration: none;

    font-size: 1.1rem;
    color: black;

    .avatar {
      margin-right: 1rem;
    }

    &__value {
      font-size: 1.5rem;
    }
  }
`;
