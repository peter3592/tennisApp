import { useDataContext, useUIContext } from "../../store/context";
import GamesList from "./Games/GamesList";
import Statistics from "./Statistics/Statistics";

import styled from "styled-components";
import PlayersList from "./Players/PlayersList";
import { useOutletContext } from "react-router-dom";

export default function Content() {
  const { dataLoaded } = useDataContext();
  const { contentPage, setShowSidebar } = useUIContext();

  const classes = useOutletContext();

  if (!dataLoaded)
    return (
      <Wrapper className={classes}>
        <div className="container" />
      </Wrapper>
    );

  return (
    <Wrapper className={classes} onClick={() => setShowSidebar(false)}>
      <div className="container">
        {contentPage === "games" && <GamesList />}
        {contentPage === "players" && <PlayersList />}
        {contentPage === "stats" && <Statistics />}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  overflow: hidden;

  .container {
    border-radius: var(--border-radius);
    width: 100%;
    max-width: 100rem;
    height: 100%;
    margin: 0 auto;
    background-color: #f3f6f0;
    background-color: var(--grey-background);
    box-shadow: var(--shadow);
  }

  @media (max-width: 750px) {
    .container {
      background-color: var(--primary-color);
    }
  }
`;
