import { useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import Avatar from "react-nice-avatar";
import {
  useAuthContext,
  useDataContext,
  useUIContext,
} from "../../../store/context";
import LastMatches from "./LastMatches";
import { useState, useEffect, useReducer } from "react";
import { VictoryPie, VictoryLabel } from "victory";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

import PlayerProfileEdit from "./PlayerProfileEdit";

import Wilson from "../../../assets/brands/wilson.png";
import Babolat from "../../../assets/brands/babolat.png";
import Yonex from "../../../assets/brands/yonex.png";
import Head from "../../../assets/brands/head.png";
import Tecnifibre from "../../../assets/brands/tecnifibre.png";
import Dunlop from "../../../assets/brands/dunlop.png";
import OnlyVerifiedSwitch from "../../UI/OnlyVerifiedSwitch";

const avatarSize = "17rem";

const racketBrands = [
  { name: "Wilson", img: Wilson },
  { name: "Babolat", img: Babolat },
  { name: "Yonex", img: Yonex },
  { name: "Head", img: Head },
  { name: "Tecnifibre", img: Tecnifibre },
  { name: "Dunlop", img: Dunlop },
];

// Default library values
const hairStyles = ["normal", "thick", "mohawk", "womanLong", "womanShort"];
const mouthStyles = ["laugh", "smile", "peace"];
const shirtStyles = ["hoody", "short", "polo"];
// My own values
const faceColors = ["#f9c9b6", "#ffc3a0", "#e5af90", "#cc9c80", "#ac6651"];
const shirtColors = [
  "white",
  "red",
  "yellow",
  "blue",
  "purple",
  "magenta",
  "black",
];

const reducer = (state, action) => {
  if (action.type === "init") {
    const player = action.payload;
    return { details: player.details, avatar: player.avatarConfig };
  }

  // Details
  if (action.type === "racketBrand") {
    let index = racketBrands.findIndex(
      (el) => el.name === state.details.racketBrand
    );

    if (action.payload === "left")
      index = index === 0 ? racketBrands.length - 1 : index - 1;

    if (action.payload === "right")
      index = index === racketBrands.length - 1 ? 0 : index + 1;

    return {
      ...state,
      details: { ...state.details, racketBrand: racketBrands[index].name },
    };
  }

  if (action.type === "backhand") {
    const newBackhand =
      state.details.backhand === "One-Handed" ? "Two-Handed" : "One-Handed";

    return {
      ...state,
      details: { ...state.details, backhand: newBackhand },
    };
  }

  // Avatar
  const skinArrays = {
    hairStyle: hairStyles,
    shirtColor: shirtColors,
    mouthStyle: mouthStyles,
    shirtStyle: shirtStyles,
    faceColor: faceColors,
  };

  if (
    action.type === "hairStyle" ||
    action.type === "shirtColor" ||
    action.type === "mouthStyle" ||
    action.type === "shirtStyle" ||
    action.type === "faceColor"
  ) {
    let index = skinArrays[action.type].findIndex(
      (el) => el === state.avatar[action.type]
    );

    if (index === -1) index = 0;

    if (action.payload === "left")
      index = index === 0 ? skinArrays[action.type].length - 1 : index - 1;

    if (action.payload === "right")
      index = index === skinArrays[action.type].length - 1 ? 0 : index + 1;

    return {
      ...state,
      avatar: {
        ...state.avatar,
        [action.type]: skinArrays[action.type][index],
      },
    };
  }

  // Reset
  if (action.type === "resetDetails") {
    return {
      ...state,
      details: {
        racketBrand: action.payload.racketBrand,
        backhand: action.payload.backhand,
      },
    };
  }

  if (action.type === "resetAvatar") {
    return {
      ...state,
      avatar: {
        ...state.avatar,
        ...action.payload.avatar,
      },
    };
  }

  return state;
};

export default function PlayerProfile() {
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [detailsEditMode, setDetailsEditMode] = useState(false);
  const [avatarEditMode, setAvatarEditMode] = useState(false);

  const [profileState, dispatch] = useReducer(reducer, {
    details: { backhand: null, racketBrand: null },
    avatar: {
      hairStyle: null,
      hairColor: null,
      eyeStyle: null,
      faceColor: null,
      mouthStyle: null,
    },
  });

  const classes = useOutletContext();
  const params = useParams();

  const { players, games, dataLoaded, updateProfile } = useDataContext();
  const { currentUser } = useAuthContext();
  const { setShowSidebar, setModal } = useUIContext();

  useEffect(() => {
    if (!dataLoaded) return;
    const player = players[params.id];
    dispatch({ type: "init", payload: player });
  }, [dataLoaded, params.id, players]);

  if (
    !dataLoaded ||
    !profileState ||
    profileState.details.racketBrand === null ||
    profileState.details.backhand === null ||
    profileState.avatar === null
  )
    return (
      <Wrapper className={classes}>
        <div className="container">
          <div className="left" />
          <div className="right">
            <div className="statistics" />
            <div className="details" />
          </div>
        </div>
      </Wrapper>
    );

  const player = players[params.id];

  let gamesAfterVerification = games;

  if (onlyVerified) {
    gamesAfterVerification = gamesAfterVerification.filter(
      (game) => game.verified
    );
  }

  const gamesPlayed = gamesAfterVerification.filter(
    (game) => game.player1.id === player.id || game.player2.id === player.id
  );

  const gamesWon = gamesPlayed.filter((game) => game.winner === player.id);

  const gamesLoss = gamesPlayed.filter((game) => game.winner !== player.id);

  const winPercentage = (100 * gamesWon.length) / gamesPlayed.length;

  const cancelAvatarEditMode = () => {
    dispatch({
      type: "resetAvatar",
      payload: {
        avatar: player.avatarConfig,
      },
    });
    setAvatarEditMode(false);
  };

  const saveAvatar = async () => {
    try {
      await updateProfile(currentUser.uid, "avatarConfig", profileState.avatar);
      setAvatarEditMode(false);
      setModal({ type: "success", msg: "Avatar updated" });
    } catch (err) {
      setModal({ type: "error", msg: "Updating avatar error" });
      cancelAvatarEditMode();
    }
  };

  const calcBrandIndex = () => {
    return racketBrands.findIndex(
      (el) => el.name === profileState.details.racketBrand
    );
  };

  const cancelDetailsEditMode = () => {
    dispatch({
      type: "resetDetails",
      payload: {
        racketBrand: player.details.racketBrand,
        backhand: player.details.backhand,
      },
    });
    setDetailsEditMode(false);
  };

  const saveDetails = async () => {
    try {
      const newDetails = {
        racketBrand: racketBrands[calcBrandIndex()].name,
        backhand: profileState.details.backhand,
      };
      await updateProfile(currentUser.uid, "details", newDetails);

      setDetailsEditMode(false);

      setModal({ type: "success", msg: "Profile details updated" });
    } catch (err) {
      setModal({ type: "error", msg: "Updating profile error" });
      cancelDetailsEditMode();
    }
  };

  return (
    <Wrapper
      className={classes}
      image={racketBrands[calcBrandIndex()].img}
      onClick={() => setShowSidebar(false)}
    >
      <div className="container">
        <div className="left">
          {currentUser.uid === params.id && (
            <PlayerProfileEdit
              editMode={avatarEditMode}
              onClick={() => setAvatarEditMode((prev) => !prev)}
              save={saveAvatar}
              cancel={cancelAvatarEditMode}
              absolute
            />
          )}

          <div className="left__player">
            <div className="left__name">
              <p>{player.name}</p>
            </div>
            <div className="left__avatar">
              {avatarEditMode && (
                <div className="left__photo__arrows left__photo__arrows--left">
                  <FaArrowCircleLeft
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "hairStyle", payload: "left" })
                    }
                  />
                  <FaArrowCircleLeft
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "faceColor", payload: "left" })
                    }
                  />
                  <FaArrowCircleLeft
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "mouthStyle", payload: "left" })
                    }
                  />
                  <FaArrowCircleLeft
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "shirtStyle", payload: "left" })
                    }
                  />{" "}
                  <FaArrowCircleLeft
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "shirtColor", payload: "left" })
                    }
                  />
                </div>
              )}
              <div className="left__photo">
                <Avatar
                  className="avatar"
                  style={{ width: avatarSize, height: avatarSize }}
                  {...profileState.avatar}
                  shape="square"
                  bgColor="transparent"
                />
              </div>
              {avatarEditMode && (
                <div className="left__photo__arrows left__photo__arrows--right">
                  <FaArrowCircleRight
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "hairStyle", payload: "right" })
                    }
                  />
                  <FaArrowCircleRight
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "faceColor", payload: "right" })
                    }
                  />
                  <FaArrowCircleRight
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "mouthStyle", payload: "right" })
                    }
                  />
                  <FaArrowCircleRight
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "shirtStyle", payload: "right" })
                    }
                  />
                  <FaArrowCircleRight
                    className="icon"
                    onClick={() =>
                      dispatch({ type: "shirtColor", payload: "right" })
                    }
                  />
                </div>
              )}
            </div>
            <div className="left__details">
              <div className="left__detail left__detail__last">
                <LastMatches
                  profilePlayer={player}
                  gamesPlayed={gamesPlayed}
                  className="lastMatches"
                />
                <p className="title title--details">Last 5 matches</p>
              </div>
              {gamesPlayed.length > 0 && (
                <div className="left__detail left__detail__chart">
                  <svg width={150} height={150}>
                    <text x={76} y={80} textAnchor="middle">
                      {Math.trunc(winPercentage)}%
                    </text>
                    <VictoryPie
                      // animate={{ duration: 400 }}
                      standalone={false}
                      padAngle={0}
                      labelComponent={<VictoryLabel capHeight={100} />}
                      innerRadius={37}
                      width={150}
                      height={150}
                      data={[
                        { key: "", y: winPercentage },
                        { key: "", y: 100 - winPercentage },
                      ]}
                      colorScale={[
                        getComputedStyle(document.body).getPropertyValue(
                          "--primary-color"
                        ),
                        "#ff3333",
                      ]}
                    />
                  </svg>
                  <p className="title title--details">Win Percentage</p>
                </div>
              )}
            </div>
          </div>
          <OnlyVerifiedSwitch
            initValue={true}
            switchAction={() => setOnlyVerified((prev) => !prev)}
            absolutePos
          />
        </div>
        <div className="right">
          <div className="statistics">
            <p className="title">Statistics</p>
            <div className="line" />
            <div className="statistics__grid">
              <div className="dummy" />
              <div className="statistic-title">All</div>
              <div className="statistic-title">Classic / Points</div>
              <div className="statistic-title--row">Games</div>
              <div className="statistic-number statistic-number--main">
                {gamesPlayed.length}
              </div>
              <div className="statistic-number statistic-number--sub">
                {`${
                  gamesPlayed.filter((game) => game.type === "classic").length
                } / ${
                  gamesPlayed.filter((game) => game.type === "points").length
                }`}
              </div>
              <div className="statistic-title--row">Wins</div>
              <div className="statistic-number statistic-number--main statistic-number--win">
                {gamesWon.length}
              </div>
              <div className="statistic-number statistic-number--sub">
                {`${
                  gamesWon.filter((game) => game.type === "classic").length
                } / ${
                  gamesWon.filter((game) => game.type === "points").length
                }`}
              </div>
              <div className="statistic-title--row">Losses</div>
              <div className="statistic-number statistic-number--main statistic-number--loss">
                {gamesLoss.length}
              </div>
              <div className="statistic-number statistic-number--sub">
                {`${
                  gamesLoss.filter((game) => game.type === "classic").length
                } / ${
                  gamesLoss.filter((game) => game.type === "points").length
                }`}
              </div>
            </div>
          </div>
          <div className="details">
            <div className="details__topbar">
              <p className="title">Details</p>
              <div className="details__edit">
                {currentUser.uid === params.id && (
                  <PlayerProfileEdit
                    editMode={detailsEditMode}
                    onClick={() => setDetailsEditMode((prev) => !prev)}
                    save={saveDetails}
                    cancel={cancelDetailsEditMode}
                  />
                )}
              </div>
            </div>
            <div className="line" />
            <div className="details__content">
              <div className="details__grid">
                <p className="details-title">Racket Brand</p>
                <div className="details-value">
                  <div className="details-value__iconContainer">
                    {detailsEditMode && (
                      <FaArrowCircleLeft
                        onClick={() =>
                          dispatch({
                            type: "racketBrand",
                            payload: "left",
                          })
                        }
                        className="icon"
                      />
                    )}
                  </div>
                  <p>{profileState.details.racketBrand}</p>
                  <div className="details-value__iconContainer">
                    {detailsEditMode && (
                      <FaArrowCircleRight
                        onClick={() =>
                          dispatch({
                            type: "racketBrand",
                            payload: "right",
                          })
                        }
                        className="icon"
                      />
                    )}
                  </div>
                </div>
                <p className="details-title">Backhand</p>
                <div className="details-value">
                  <div className="details-value__iconContainer">
                    {detailsEditMode && (
                      <FaArrowCircleLeft
                        onClick={() =>
                          dispatch({
                            type: "backhand",
                            payload: "left",
                          })
                        }
                        className="icon"
                      />
                    )}
                  </div>
                  <p>{profileState.details.backhand}</p>
                  <div className="details-value__iconContainer">
                    {detailsEditMode && (
                      <FaArrowCircleRight
                        onClick={() =>
                          dispatch({
                            type: "backhand",
                            payload: "right",
                          })
                        }
                        className="icon"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="right__brand" />
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .avatar {
    transform: rotate(-7deg) scale(0.85);
  }

  .container {
    width: 100%;
    height: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    gap: 2rem;

    .left {
      border-radius: var(--border-radius);
      background-color: #eee;

      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      min-width: 33rem;
      position: relative;

      &__avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
      }

      &__verification {
        position: absolute;
        bottom: 2rem;
        left: 2rem;

        display: flex;
        align-items: center;
        width: 100%;

        p {
          color: #aaa;
          font-size: 1.6rem;
          margin-right: 2rem;
        }
      }

      &__photo {
        background-color: var(--primary-color);
        transform: rotate(7deg) scale(0.9);
        justify-self: flex-start;
        margin: 0 2rem;

        &__arrows {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: var(--primary-color);
          font-size: 1.65rem;

          .icon:not(:last-of-type) {
            margin-bottom: 0.85rem;
          }
        }
      }

      &__player {
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      &__name {
        font-size: 2.4rem;
        margin: 4rem 0 6rem;
        text-transform: uppercase;
        font-weight: bold;
        z-index: 1;
      }

      &__details {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
      }

      &__detail {
        .title {
          transform: translateY(-3rem);
        }

        &__last {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 2rem;
        }

        &__chart {
          display: flex;
          flex-direction: column;
          align-items: center;

          & text {
            font-size: 1.4rem;
            font-weight: bold;
          }
        }
      }
    }

    .right {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: 2rem;

      &__brand {
        width: 20rem;
        height: 8rem;
        margin: 0 auto;

        background-image: ${(props) => `url(${props.image})`};
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;

        z-index: 3;
      }
    }
  }

  .line {
    height: 2px;
    width: 100%;
    background-color: var(--primary-color);
    margin: 1rem 0 1.2rem;
  }

  .lastMatches {
    height: 15rem;
    display: flex;
    align-items: center;
  }

  .statistics,
  .details {
    height: 50%;
  }

  .statistics {
    position: relative;
  }

  .statistics-item,
  .details-item {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 75%;
  }

  .details {
    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
    }

    &-title {
      color: #aaa;
      font-size: 1.4rem;
    }

    &-value {
      min-width: 14rem;
      align-self: flex-end;
      font-weight: bold;
      font-size: 1.5rem;

      display: flex;
      justify-content: space-between;
      align-items: center;
      column-gap: 1rem;

      &__iconContainer {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    &__topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .title {
    font-size: 2rem;
    font-weight: bold;

    color: grey;
    font-weight: bold;

    &--details {
      border-bottom: none;
      font-size: 1.6rem;
      padding-bottom: 0.5rem;
    }
  }

  .statistics,
  .details {
    background-color: #eee;
    padding: 2rem;
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    font-size: 1.6rem;
  }

  .statistics__grid {
    display: grid;
    grid-template-columns: 1fr max-content max-content;

    text-align: center;
    align-items: center;
    column-gap: 1rem;
    row-gap: 1.2rem;
  }

  .details__grid {
    display: grid;
    grid-template-columns: max-content max-content;
    justify-content: space-between;
    grid-auto-rows: 3.3rem;
    row-gap: 1.2rem;
    padding: 0 1rem;
    margin-bottom: 2.5rem;
  }

  .statistic-title {
    font-size: 1.1rem;

    &--row {
      color: #aaa;
      font-size: 1.6rem;
      text-align: left;
      padding-left: 1rem;
    }
  }

  .statistic-number {
    font-weight: bold;
    margin: 0 1.5rem;

    &--main {
      font-size: 2.1rem;
    }

    &--win {
      color: green;
    }

    &--loss {
      color: red;
    }
  }

  .icon {
    cursor: pointer;
    color: var(--primary-color);
    transition: 0.3s all;

    :hover {
      transform: scale(1.1) translateY(0);
    }

    :active {
      transform: scale(1) translateY(1px);
    }
    /* color: red; */
  }

  @media (max-width: 750px) {
    overflow-y: auto;

    .container {
      flex-direction: column;
      height: auto;
      max-width: 50rem;

      .left {
        width: 85%;
        margin: 0 auto;
        min-width: auto;
        padding-bottom: 2rem;
        border-radius: 0;

        &__verification {
          position: static;
          margin-left: 3rem;
        }
      }

      .right {
        width: 85%;
        margin: 0 auto;

        .statistics,
        .details {
          height: 100%;
          border-radius: 0;
        }
        .statistics {
          &__grid {
            margin: 0 auto;
            min-width: 30rem;
          }
        }
      }
    }
  }

  @media (max-width: 460px) {
    .container {
      .left {
      }

      .right {
        .statistics,
        .details {
        }
        .statistics {
          &__grid {
            width: 100%;
            min-width: auto;
          }
        }
      }
    }
  }

  @media (max-width: 450px) {
    .container {
      .left,
      .right {
        width: 100%;
      }
    }

    .container {
      gap: 0.7rem;

      .right {
        gap: 0.7rem;
      }
    }

    .line {
      height: 1px;
    }
  }

  @media (max-width: 350px) {
  }
`;
