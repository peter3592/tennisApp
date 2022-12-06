import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { nanoid } from "nanoid";

export default function GameScore({ result, type }) {
  const bigScreen = useMediaQuery({ query: "(min-width: 750px)" });
  const smallScreen = useMediaQuery({ query: "(max-width: 750px)" });
  const smallNotificationScreen = useMediaQuery({
    query: "(max-width: 500px)",
  });

  if (type !== "classic" && type !== "notification" && type !== "lastMatches")
    return console.error("Bad GameScore configuration");

  const createScoreGrid = () => {
    let resultsP1 = [];
    let resultsP2 = [];

    result.forEach((set) => {
      const [pl1Games, pl2Games] = set.split(":");

      resultsP1.push(
        <span key={nanoid()} className={+pl1Games > +pl2Games ? "strong" : ""}>
          {pl1Games}
        </span>
      );
      resultsP2.push(
        <span key={nanoid()} className={+pl2Games > +pl1Games ? "strong" : ""}>
          {pl2Games}
        </span>
      );
    });

    return [...resultsP1, ...resultsP2];
  };

  return (
    <Wrapper gridColumns={result.length}>
      {((type === "notification" &&
        (!smallNotificationScreen || result.length === 1)) ||
        type === "lastMatches" ||
        (type === "classic" && bigScreen)) && (
        <div className="score__big">
          {result.map((set) => {
            const [pl1Games, pl2Games] = set.split(":");
            return (
              <div key={nanoid()} className={`set set__${type}`}>
                <span className={pl1Games > pl2Games ? "strong" : ""}>
                  {pl1Games}
                </span>
                <span>:</span>
                <span className={pl2Games > pl1Games ? "strong" : ""}>
                  {pl2Games}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {type === "classic" && smallScreen && (
        <div className="score__small">{createScoreGrid()}</div>
      )}
      {type === "notification" &&
        smallNotificationScreen &&
        result.length > 1 && (
          <div className="score__small set__notification">
            {createScoreGrid()}
          </div>
        )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: #555555;

  span {
    font-family: monospace;
  }

  .strong {
    font-weight: bold;
    font-size: 120%;
  }

  .set {
    display: flex;
    align-items: center;

    &__classic {
      font-size: 2.3rem;

      .strong {
        color: var(--primary-color);
      }
    }

    &__notification {
      font-size: 1.7rem;
      row-gap: 2.5rem !important;

      .strong {
        color: black !important;
      }
    }

    &__lastMatches {
      font-size: 1.8rem;

      .strong {
        color: var(--primary-color);
      }
    }
  }

  .score {
    &__small {
      display: none;
    }

    &__big {
      display: flex;
      align-items: center;
      column-gap: 2rem;
    }
  }

  @media (max-width: 750px) {
    font-size: 2.3rem;

    .score {
      &__small {
        display: grid;
        grid-template-columns: ${(props) =>
          `repeat(${props.gridColumns}, 1fr)`};
        text-align: center;
        align-items: center;
        row-gap: 1.5rem;
        column-gap: 2rem;

        .strong {
          color: var(--primary-color);
        }
      }
    }
  }

  @media (max-width: 360px) {
    .score {
      &__small {
        column-gap: 1.2rem;
      }
    }
  }

  @media (max-width: 320px) {
    font-size: 1.8rem;
    .score {
      &__small {
        column-gap: 1rem;
      }
    }
  }
`;
