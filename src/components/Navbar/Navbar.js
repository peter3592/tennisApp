import styled from "styled-components";
import { hideAll } from "tippy.js";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import {
  useAuthContext,
  useDataContext,
  useUIContext,
} from "../../store/context";
import { MdOutlineNotifications } from "react-icons/md";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { AiOutlinePoweroff } from "react-icons/ai";
import Avatar from "react-nice-avatar";
import Notifications from "./Notifications";
import MyTippy from "../UI/MyTippy";
import EmptyPlayer from "../../assets/emptyPlayer.png";

const avatarSize = "3.3rem";

export default function Navbar() {
  const { currentUser, logout } = useAuthContext();
  const { players, games } = useDataContext();
  const { showSidebar, setShowSidebar } = useUIContext();

  const navigate = useNavigate();

  if (!players) return <Nav></Nav>;

  const player = players[currentUser.uid];

  const profileContent = (
    <div className="popup--grey profile" onClick={() => hideAll()}>
      {player && !currentUser.isAnonymous && (
        <Avatar
          className="avatar avatar__popup"
          style={{ width: avatarSize, height: avatarSize }}
          {...players[player.id].avatarConfig}
          shape="circle"
          bgColor="transparent"
        />
      )}
      <div className="popup__name">
        <p>
          {!currentUser.isAnonymous ? currentUser.displayName : "Guest User"}
        </p>
      </div>
      {!currentUser.isAnonymous && (
        <div
          className="popup__item"
          onClick={() => navigate(`/players/${currentUser.uid}`)}
        >
          <div className="popup__item__icon popup__item__icon--profile">
            <BsFillPersonBadgeFill />
          </div>
          <div className="popup__item__text">
            <p>My Profile</p>
          </div>
        </div>
      )}
      <div className="popup__item" onClick={logout}>
        <div className="popup__item__icon popup__item__icon--logout">
          <AiOutlinePoweroff />
        </div>
        <div className="popup__item__text">
          <p>Logout</p>
        </div>
      </div>
    </div>
  );

  const notificationGames = games.filter(
    (game) =>
      !game.verificationDone &&
      game.uploadedBy.id !== player?.id &&
      (game.player1.id === player?.id || game.player2.id === player?.id)
  );

  const notificationContent = (
    <Notifications games={notificationGames} className="popup--grey" />
  );

  const logoClickHandler = () => navigate("/");

  return (
    <Nav>
      <div className="nav-container">
        <div className="left">
          <div
            className={`hamburger ${showSidebar ? "hamburger--active" : ""}`}
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            <div className="hamburger__line hamburger__line--1"></div>
            <div className="hamburger__line hamburger__line--2"></div>
            <div className="hamburger__line hamburger__line--3"></div>
          </div>
          <div className="logo" onClick={logoClickHandler}>
            <div className="logo__img">
              <img src={Logo} alt="Tennis Ball Logo" />
            </div>
            <div className="logo__text">
              tennis<span>app</span>
            </div>
          </div>
        </div>
        <div className="actions__container">
          <MyTippy
            content={notificationContent}
            trigger="click"
            animation="scale"
          >
            <div className="notification__icon">
              <MdOutlineNotifications className="icon" />
              {notificationGames.length > 0 && (
                <div className="notification__icon__number">
                  {notificationGames.length <= 9
                    ? notificationGames.length
                    : "9+"}
                </div>
              )}
            </div>
          </MyTippy>
          <MyTippy content={profileContent} trigger="click" animation="scale">
            <div
              className="avatar__container"
              onClick={() => setShowSidebar(false)}
            >
              {player && !currentUser.isAnonymous && (
                <Avatar
                  className="avatar"
                  style={{ width: avatarSize, height: avatarSize }}
                  {...players[player.id].avatarConfig}
                  shape="circle"
                />
              )}
            </div>
          </MyTippy>
        </div>
      </div>
    </Nav>
  );
}

const Nav = styled.nav`
  width: 100%;
  background-color: var(--light-color);

  display: flex;
  align-items: center;
  height: var(--navbar-height);

  box-shadow: var(--shadow);

  .left {
    display: flex;
    align-items: center;
    column-gap: 1.6rem;
  }

  .hamburger {
    width: 2.6rem;
    height: 2.6rem;
    display: none;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    &__line {
      width: 100%;
      height: 4px;
      background-color: black;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;

    &__text {
      font-family: "Fredoka One", cursive;
      font-size: 2.4rem;

      & span {
        color: var(--primary-color);
        font-family: inherit;
      }
    }

    &__img {
      width: 2.7rem;
      height: 2.7rem;
      background-size: cover;

      & img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .avatar {
    cursor: pointer;

    &__container {
      transition: all 0.2s;
      width: 3.3rem;
      height: 3.3rem;
      border-radius: 50rem;
      background-image: ${() => `url(${EmptyPlayer})`};
      background-size: cover;
      cursor: pointer;

      &:hover {
        transform: scale(1.1);
      }
    }

    &__popup {
      position: absolute;
      transform: translateX(2px) translateY(11px) scale(1.4);
    }
  }

  .profile {
    position: relative;
    overflow: hidden;
  }

  .popup__name {
    font-size: 1.4rem;
    text-align: center;
    font-weight: bold;
    color: var(--primary-color);
    color: black;
    padding: 2rem 0;
    background-color: #bbb;
  }

  .popup__item {
    font-size: 1.5rem;
    color: black;
    text-align: left;
    min-width: 20rem;
    padding: 1rem 3.5rem 1rem 1rem;
    cursor: pointer;
    border-top: 3px solid #ddd;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    &:last-of-type {
      border-bottom: 3px solid #ddd;
    }

    :hover {
      .popup__item__icon--profile {
        color: var(--primary-color);
        transform: scale(1.25) translateX(1px);
      }

      .popup__item__icon--logout {
        color: var(--red);
        transform: scale(1.25) translateX(1px);
      }
    }

    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 2rem;
      transition: 0.3s all;
    }
  }

  .nav-container {
    width: 95%;
    margin: 0 auto;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions__container {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .notification__icon {
    position: relative;
    width: 4rem;
    height: 4rem;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    &__number {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      background-color: var(--primary-color);
      background-color: var(--red);
      color: white;
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.1rem;
      line-height: 2rem;
    }
  }

  .icon {
    font-size: 2.3rem;
    color: var(--primary-color);
  }

  @media (max-width: 1000px) {
    .hamburger {
      display: flex;

      &__line {
        transition: 0.3s all;
        transform-origin: left;
      }

      &--active {
        .hamburger__line--1 {
          transform: rotate(45deg);
          width: 3.1rem;
        }
        .hamburger__line--2 {
          background-color: transparent;
        }
        .hamburger__line--3 {
          transform: rotate(-45deg);
          width: 3.1rem;
        }
      }
    }
  }

  @media (max-width: 400px) {
    .hamburger {
      width: 2.2rem;
      height: 2.2rem;

      &__line {
        height: 3px;
      }

      &--active {
        .hamburger__line--1 {
          width: 2.66rem;
        }

        .hamburger__line--3 {
          width: 2.66rem;
        }
      }
    }

    .logo {
      &__text {
        font-family: "Fredoka One", cursive;
        font-size: 2rem;
      }

      &__img {
        width: 2.2rem;
        height: 2.2rem;
      }
    }
  }
`;
