import { useState } from "react";
import styled from "styled-components";
import MyTippy from "../../UI/MyTippy";
import { useDataContext, useAuthContext } from "../../../store/context";
import Avatar from "react-nice-avatar";
import EmptyPlayer from "../../../assets/emptyPlayer.png";
import { nanoid } from "nanoid";

const avatarSize = "6rem";

export default function SelectOpponent(props) {
  const [visible, setVisible] = useState(false);
  const { players } = useDataContext();
  const { currentUser } = useAuthContext();

  const visibleHandler = () => setVisible((prev) => !prev);

  const playersPopup = (
    <div className="players__container popup--grey">
      {Object.entries(players).map(([key, player]) => {
        if (currentUser.displayName === player.name) return null;
        return (
          <div
            key={nanoid()}
            className="player"
            onClick={() => {
              props.onOpponentClick(player.id);
              setVisible(false);
            }}
          >
            <Avatar
              className="avatar"
              style={{ width: avatarSize, height: avatarSize }}
              {...players[player.id].avatarConfig}
              shape="circle"
            />
            <p>{player.name}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <Wrapper>
      <MyTippy
        content={playersPopup}
        visible={visible}
        onClickOutside={visibleHandler}
      >
        <div className="opponent__default" onClick={visibleHandler}></div>
      </MyTippy>
      {props.opponent && (
        <>
          <Avatar
            className="opponent__chosen"
            style={{ width: avatarSize, height: avatarSize }}
            {...players[props.opponent.id].avatarConfig}
            shape="circle"
          />
          <div
            className="opponent__chosen opponent__chosen--click"
            onClick={visibleHandler}
          ></div>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  & .player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.7rem;
    cursor: pointer;

    & .avatar {
      transition: all 0.25s;
    }
    & .avatar:hover {
      transform: scale(1.1);
    }
  }

  & .avatar {
    margin-bottom: 0.4rem;
  }

  & .players__container {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(3, max-content);
  }

  & .opponent__default,
  & .opponent__chosen--click {
    width: ${() => avatarSize};
    height: ${() => avatarSize};
    border-radius: 50rem;
    cursor: pointer;
  }

  & .opponent__default {
    background-image: ${() => `url(${EmptyPlayer})`};
    background-size: cover;
  }

  & .opponent__chosen {
    position: absolute;
    left: 50%;
    transform: scale(1.02) translateX(-50%);
    cursor: pointer;

    &--click {
      background-color: transparent;
      z-index: 2;
    }
  }
`;
