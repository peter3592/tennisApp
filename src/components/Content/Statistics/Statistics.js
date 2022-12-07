import { useState, useEffect } from "react";
import styled from "styled-components";
import { useDataContext } from "../../../store/context";
import OnlyVerifiedSwitch from "../../UI/OnlyVerifiedSwitch";
import StatisticsCard from "./StatisticsCard";
import { useMediaQuery } from "react-responsive";

export default function Statistics() {
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [gamesPlayed, setGamesPlayed] = useState([]);
  const [gamesWins, setGamesWins] = useState([]);
  const [winsPercentage, setWinsPercentage] = useState([]);

  const { games, players } = useDataContext();

  const smallScreen = useMediaQuery({ query: "(max-width: 750px)" });

  useEffect(() => {
    calcMostGamesPlayed();
    calcMostWins();
  }, [games, players, onlyVerified]);

  useEffect(() => {
    calcMostPercentageWins();
  }, [gamesPlayed, gamesWins]);

  const calcMostGamesPlayed = () => {
    const list = [];

    games.forEach((game) => {
      if (onlyVerified && !game.verified) return;

      const pl1 = list.find((el) => el.name === game.player1.name);
      if (pl1) {
        pl1.count++;
      } else {
        list.push({
          name: game.player1.name,
          player: game.player1,
          count: 1,
        });
      }

      const pl2 = list.find((el) => el.name === game.player2.name);
      if (pl2) {
        pl2.count++;
      } else {
        list.push({
          name: game.player2.name,
          player: game.player2,
          count: 1,
        });
      }
    });

    const sortedList = list.sort((a, b) => b.count - a.count);

    setGamesPlayed(sortedList);
  };

  const calcMostWins = () => {
    const list = [];

    games.forEach((game) => {
      if (onlyVerified && !game.verified) return;

      const pl = list.find((el) => el.name === players[game.winner].name);
      if (pl) {
        pl.count++;
      } else {
        list.push({
          name: players[game.winner].name,
          player: players[game.winner],
          count: 1,
        });
      }
    });

    const sortedList = list.sort((a, b) => b.count - a.count);

    setGamesWins(sortedList);
  };

  const calcMostPercentageWins = () => {
    if (!gamesPlayed.length || !gamesWins.length) return setWinsPercentage([]);

    const list = [];

    gamesPlayed.forEach((gamesPlayedObject) => {
      const name = gamesPlayedObject.name;
      const player = gamesPlayedObject.player;

      const gamesWinsObject = gamesWins.find((el) => el.name === name);

      if (!gamesWinsObject) {
        // There is no win for this player
        list.push({ name, player, count: 0 });
      } else {
        list.push({
          name,
          player,
          count: (100 * gamesWinsObject.count) / gamesPlayedObject.count,
        });
      }
    });

    const sortedList = list.sort((a, b) => b.count - a.count);

    setWinsPercentage(sortedList);
  };

  return (
    <Wrapper>
      <OnlyVerifiedSwitch
        initValue={true}
        switchAction={() => setOnlyVerified((prev) => !prev)}
        lightMode={smallScreen}
      />
      <div className="statistics__items">
        <div className="statistics__item">
          {gamesPlayed.length > 0 && (
            <StatisticsCard
              title="Most Games"
              player={gamesPlayed[0].player}
              value={gamesPlayed[0].count}
              list={gamesPlayed}
            />
          )}
        </div>
        <div className="statistics__item">
          {gamesWins.length > 0 && (
            <StatisticsCard
              title="Most Wins"
              player={gamesWins[0].player}
              value={gamesWins[0].count}
              list={gamesWins}
            />
          )}
        </div>
        <div className="statistics__item">
          {winsPercentage.length > 0 && (
            <StatisticsCard
              title="Top Win Percentage"
              player={winsPercentage[0].player}
              value={winsPercentage[0].count}
              list={winsPercentage}
              chart={true}
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-size: 2.4rem;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: 0 1rem 3rem;

  .statistics {
    &__items {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
    }
  }

  .pieChart {
    background-color: blue;
    position: relative;
  }

  .pieChart__label {
    color: transparent;
    font-size: 4rem;
  }

  .statistics__full {
    cursor: pointer;
  }

  @media (max-width: 1150px) {
    .statistics__items {
      flex-direction: column;
    }
  }

  @media (max-width: 750px) {
    .verification {
      p {
        color: #ddd;
      }
    }
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background-color: darkgrey;
  }

  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px black;
  }
`;
