import ToggleSwitch from "./ToggleSwitch";
import styled from "styled-components";

export default function OnlyVerifiedSwitch(props) {
  return (
    <Div absolutePos={props.absolutePos}>
      <ToggleSwitch {...props} />
      <p>Only Verified Games</p>
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  align-items: center;

  position: ${({ absolutePos }) => (absolutePos ? "absolute" : "static")};
  bottom: 2rem;
  left: 2rem;

  margin: ${({ absolutePos }) => (absolutePos ? "0" : "2rem")};
  margin-bottom: ${({ absolutePos }) => (absolutePos ? "0" : "2rem")};

  p {
    color: #888888;
    font-size: 1.8rem;
    margin-left: 2rem;
  }

  .verification {
    background-color: black;
  }
`;
