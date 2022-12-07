import styled from "styled-components";
import { BsUpload, BsCalendarCheck } from "react-icons/bs";
import { GiTennisCourt } from "react-icons/gi";
import { GoVerified, GoUnverified } from "react-icons/go";
import GameResult from "./GameResult";
import { useMediaQuery } from "react-responsive";

export default function Game({
  gameDate,
  player1,
  player2,
  winner,
  result,
  type,
  uploadedBy,
  verified,
}) {
  const smallScreen = useMediaQuery({ query: "(max-width: 500px)" });

  return (
    <Container smallScreen={smallScreen}>
      <div className={`details ${smallScreen ? "details--mediaSmall" : ""}`}>
        <div className="details__subContainer">
          <div className={`detail ${verified ? "verified" : "unverified"}`}>
            {verified && <GoVerified className="detail__icon" />}
            {!verified && <GoUnverified className="detail__icon" />}
            <p>
              <strong>{verified ? "Verified" : "Unverified"}</strong>
            </p>
          </div>
          <div className="detail">
            <BsCalendarCheck className="detail__icon" />
            <p>{gameDate}</p>
          </div>
        </div>
        <div className="details__subContainer">
          <div className="detail">
            <GiTennisCourt className="detail__icon" />
            <p>{`${type} match`}</p>
          </div>
          <div className="detail">
            <BsUpload className="detail__icon" />
            <p>{uploadedBy.name}</p>
          </div>
        </div>
      </div>
      <GameResult
        result={result}
        player1={player1}
        player2={player2}
        winner={winner}
        showType={"classic"}
      />
    </Container>
  );
}

const Container = styled.li`
  padding: 1.7rem;
  display: flex;
  flex-direction: ${({ smallScreen }) => (smallScreen ? "column;" : "row;")};

  :first-of-type {
    border-top: 3px solid #fff;
  }

  :not(:last-of-type) {
    border-bottom: 3px solid #fff;
  }

  .details {
    min-width: 12rem;

    &--mediaSmall {
      display: flex;
      column-gap: 2.5rem;
    }
  }

  .details__subContainer:not(:last-of-type) {
    margin-bottom: 1rem;
  }

  .detail {
    display: flex;
    align-items: center;
    font-size: 1.2rem;

    &__icon {
      transform: translateY(-0.7px);
    }

    &:not(:last-of-type) {
      margin-bottom: 1rem;
    }

    & p {
      margin-left: 1rem;
      text-transform: capitalize;
    }
  }

  .result {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 3rem;
  }

  .score {
    font-size: 2.3rem;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: "black";
  }

  .verified {
    color: var(--primary-color);
  }

  .unverified {
    color: var(--red);
  }

  @media (max-width: 750px) {
    :first-of-type {
      border-top: 0px solid #fff;
    }

    :not(:last-of-type) {
      border-bottom: 3px solid var(--primary-color);
    }

    .details {
      margin-bottom: 0;
      border-right: 2px solid #ccc;
    }
  }

  @media (max-width: 500px) {
    .details {
      margin-bottom: 1.5rem;
      border: 0;
    }
  }
`;
