import styled from "styled-components";
import { useState, useEffect } from "react";

export default function ToggleSwitch({ initValue, switchAction, lightMode }) {
  const [active, setActive] = useState(initValue);

  const clickHandler = () => {
    setActive((prev) => !prev);
    switchAction();
  };

  useEffect(() => {
    setActive(initValue);
  }, [initValue]);

  return (
    <Div active={active} onClick={clickHandler} lightMode={lightMode}>
      <div className="button"></div>
    </Div>
  );
}

const Div = styled.div`
  background-color: ${({ active }) =>
    active ? "var(--primary-color)" : "white"};
  width: 4.2rem;
  height: 1.85rem;
  border-radius: 50rem;
  display: flex;
  align-items: center;
  border: ${({ lightMode }) =>
    lightMode ? "3px solid #fff" : "2px solid var(--primary-color)"};
  transition: 0.2s all;
  cursor: pointer;

  .button {
    transition: inherit;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50rem;
    transform: ${({ active }) =>
      active ? "translateX(24px)" : "translateX(2.5px)"};

    background-color: ${({ active }) =>
      active ? "white" : "var(--primary-color)"};
    border: ${({ lightMode }) =>
      lightMode ? "2px solid var(--primary-color)" : "2px solid none"};
  }
`;
