import styled from "styled-components";
import { Link } from "react-router-dom";
import { MdOutlineSportsTennis } from "react-icons/md";
import { SlPeople } from "react-icons/sl";
import { IoStatsChartOutline } from "react-icons/io5";
import { useState } from "react";
import { useUIContext } from "../../store/context";

export default function Sidebar(props) {
  const [activeLink, setActiveLink] = useState("games");
  const { setShowSidebar } = useUIContext();

  return (
    <Wrapper className={props.className}>
      <ul className="links">
        <li className={activeLink === "games" ? "active" : ""}>
          <Link
            to="/"
            className="link"
            onClick={() => {
              setActiveLink("games");
              props.onSidebarClick("games");
              setShowSidebar();
            }}
          >
            <div className="link__container">
              <MdOutlineSportsTennis className="icon" />
              <p>Games</p>
            </div>
          </Link>
        </li>
        <li className={activeLink === "players" ? "active" : ""}>
          <Link
            to="/"
            className="link"
            onClick={() => {
              setActiveLink("players");
              props.onSidebarClick("players");
              setShowSidebar();
            }}
          >
            <div className="link__container">
              <SlPeople className="icon" />
              <p>Players</p>
            </div>
          </Link>
        </li>
        <li className={activeLink === "stats" ? "active" : ""}>
          <Link
            to="/"
            className="link"
            onClick={() => {
              setActiveLink("stats");
              props.onSidebarClick("stats");
              setShowSidebar();
            }}
          >
            <div className="link__container">
              <IoStatsChartOutline className="icon" />
              <p>Statistics</p>
            </div>
          </Link>
        </li>
      </ul>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;

  background-color: var(--grey-background);
  color: var(--primary-color);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow);
  transition: all 0.2s;

  z-index: 1100;

  .links {
    width: 100%;

    & li {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 1rem;
      padding-right: 2rem;

      width: 100%;
      color: var(--primary-color);

      &.active {
        background-color: var(--primary-light-color);
      }

      :hover:not(.active) {
        & .icon {
          transform: translateY(-2px) scale(1.3);
        }
      }

      :not(:last-of-type) {
        margin-bottom: 1rem;
      }

      position: relative;

      & .icon {
        color: inherit;
        transition: all 0.2s;
        transform: translateY(-2px) scale(1);
        font-size: 2.5rem;
      }
    }
  }

  .link {
    cursor: pointer;
    font-size: 2.1rem;
    display: block;
    text-align: left;
    width: 100%;
    text-decoration: none;
    color: inherit;

    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.7rem;
    padding: 1.4rem 0;

    &__container {
      display: flex;
      align-items: center;
      column-gap: 2rem;
    }
  }
`;
