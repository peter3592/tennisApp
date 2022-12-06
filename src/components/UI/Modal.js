import { useRef } from "react";
import styled from "styled-components";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdError } from "react-icons/md";

export default function Modal({ modal }) {
  const lastType = useRef();

  if (modal) lastType.current = modal;

  return (
    <Div showModal={!!modal}>
      <div
        className={`center center--${
          lastType.current ? lastType.current.type : ""
        }`}
      >
        {lastType.current?.type === "success" && (
          <div className="container__icon">
            <AiFillCheckCircle className="icon" />
          </div>
        )}
        {lastType.current?.type === "error" && (
          <div className="container__icon">
            <MdError className="icon" />
          </div>
        )}
        <p>{lastType.current ? lastType.current.msg : ""}</p>
      </div>
    </Div>
  );
}

const Div = styled.div`
  min-width: 24rem;
  max-width: 35rem;
  min-height: 7.5rem;
  color: white;

  z-index: 99999;
  overflow: hidden;

  position: absolute;
  top: 0;
  left: 50%;

  font-size: 1.7rem;

  transition: 0.3s all;

  transform: ${({ showModal }) => {
    if (showModal) return "translateX(-50%) translateY(-5px)";

    return "translateX(-50%) translateY(-100%)";
  }};

  .center {
    height: 100%;
    border: 5px solid transparent;
    padding: 1rem;
    border-bottom-left-radius: 2rem;
    border-bottom-right-radius: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    text-align: center;

    &--error {
      background-color: var(--red);
    }

    &--success {
      background-color: #2eb62c;
    }
  }

  .container__icon {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .icon {
    font-size: 2.5rem;
  }
`;
