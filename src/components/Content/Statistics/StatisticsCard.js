import styled from "styled-components";
import Avatar from "react-nice-avatar";
import { Link } from "react-router-dom";
import StatisticsLine from "./StatisticsLine";
import { VictoryPie, VictoryLabel } from "victory";
import { useDataContext } from "../../../store/context";

const avatarSize = "7.2rem";

export default function StatisticsCard({
  title,
  player,
  value,
  list,
  chart = false,
}) {
  const { players } = useDataContext();

  let displayValue;

  if (!chart) displayValue = value;

  if (chart)
    displayValue = (
      <svg width={150} height={150} className="chart">
        <text x={76} y={80} textAnchor="middle">
          {Math.trunc(value)}%
        </text>
        <VictoryPie
          //   animate={{ duration: 400 }}
          standalone={false}
          padAngle={0}
          labelComponent={<VictoryLabel capHeight={100} />}
          innerRadius={37}
          width={150}
          height={150}
          data={[
            { key: "", y: value },
            { key: "", y: 100 - value },
          ]}
          colorScale={[
            getComputedStyle(document.body).getPropertyValue("--primary-color"),
            "#ff3333",
          ]}
        />
      </svg>
    );

  return (
    <Div percentageCard={chart}>
      <div className="top">
        <div className="top__title">{title}</div>
        <div className="top__player">
          <div className="top__player__details">
            <Link className="avatar" to={`players/${player.id}`}>
              <Avatar
                style={{ width: avatarSize, height: avatarSize }}
                {...players[player.id].avatarConfig}
                shape="circle"
              />
              <div className="player__name">{player.name}</div>
            </Link>
          </div>
          <div className="top__player__value">{displayValue}</div>
        </div>
      </div>
      <div className="middleLine"></div>
      <div className="bottom">
        {list.length > 0 && (
          <StatisticsLine
            stars={3}
            player={list[0].player}
            count={list[0].count}
            percents={chart}
          />
        )}
        {list.length > 1 && (
          <StatisticsLine
            stars={2}
            player={list[1].player}
            count={list[1].count}
            percents={chart}
          />
        )}
        {list.length > 2 && (
          <StatisticsLine
            stars={1}
            player={list[2].player}
            count={list[2].count}
            percents={chart}
          />
        )}
      </div>
    </Div>
  );
}

const Div = styled.div`
  background-color: white;

  .top {
    padding: 6rem 1.5rem 0;
    position: relative;

    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-decoration: none;
    }

    &__title {
      text-align: left;
      font-weight: bold;
      font-size: 1.9rem;
      background-color: var(--primary-color);
      padding: 0.5rem 1rem;
      color: #fff;

      position: absolute;
      top: 0;
      left: 0;
    }

    &__player {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      width: ${(props) => (props.percentageCard ? "100%" : "90%")};

      &__details {
        min-width: 15rem;
      }

      &__value {
        font-weight: bold;
        font-size: 4rem;
        text-align: center;
        width: 8rem;
        transform: ${(props) =>
          props.percentageCard ? "inherit" : "translateY(-10px)"};
      }
    }

    .player__name {
      margin-top: 0.6rem;
      color: black;
      font-weight: bold;
      font-size: 1.6rem;
    }
  }

  .middleLine {
    height: 3px;
    background-color: var(--primary-color);
    margin: 2.5rem 0;
  }

  .stars {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 1rem;
  }

  .star {
    color: darkgreen;
  }

  .bottom {
    padding: 0 1.5rem 1.5rem;
  }

  .chart {
    position: absolute;
    top: 2.1rem;
    right: 0rem;

    & text {
      font-size: 1.7rem;
      font-weight: bold;
    }
  }

  @media (max-width: 1150px) {
    display: flex;
    justify-content: center;
    align-items: center;

    height: auto;

    .middleLine {
      display: none;
    }

    .top {
      border-right: 3px solid var(--primary-color);
      padding: 5rem 1.5rem 1.5rem;

      &__player {
        margin-right: 3rem;
      }
    }

    .bottom {
      padding: 0 1.5rem;
    }
  }

  @media (max-width: 750px) {
    display: block;

    .middleLine {
      display: block;
    }

    .top {
      border-right: none;
      padding: 6rem 1.5rem 0;

      &__player {
        margin-right: 0;
      }

      &__title {
        border: 4px solid #fff;
      }
    }

    .bottom {
      padding: 0 1.5rem 1.5rem;
    }
  }
`;
