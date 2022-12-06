import PlayerListItem from "./PlayerListItem";
import styled from "styled-components";
import { useDataContext } from "../../../store/context";
import { useState } from "react";
import OnlyVerifiedSwitch from "../../UI/OnlyVerifiedSwitch";
import { useMediaQuery } from "react-responsive";

export default function Playerslist() {
  const [onlyVerified, setOnlyVerified] = useState(true);

  const { players } = useDataContext();

  const smallScreen = useMediaQuery({ query: "(max-width: 750px)" });

  return (
    <Wrapper>
      <OnlyVerifiedSwitch
        initValue={true}
        switchAction={() => setOnlyVerified((prev) => !prev)}
        lightMode={smallScreen}
      />
      <ul>
        {Object.entries(players).map((player) => (
          <PlayerListItem
            key={player[0]}
            player={player[1]}
            onlyVerified={onlyVerified}
          />
        ))}
      </ul>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 0 1rem 3rem;
  width: 100%;
  height: 100%;
  margin: 0 auto;

  overflow-y: auto;
  overflow-x: hidden;

  & ul {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(30rem, 30rem));
    justify-content: center;

    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      background-color: darkgrey;
    }

    ::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 10px black;
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

  @media (max-width: 410px) {
    padding: 3rem 0;
  }
`;
