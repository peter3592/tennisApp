import { useEffect, useRef } from "react";
import { useState } from "react";
import styled from "styled-components";

export default function NewGameFormSet({
  type,
  onSetResultChange,
  set,
  first,
  opponent,
}) {
  const prevScore1 = useRef();
  const prevScore2 = useRef();

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    prevScore1.current = score1;
    prevScore2.current = score2;

    onSetResultChange(set, `${score1}:${score2}`);
  }, [score1, score2, set, onSetResultChange]);

  const scoreChangeHandler = (e) => {
    const setId = +e.target.id;
    let number = e.target.value;

    if (isNaN(number)) return;

    if (type === "classic") {
      if (number.length === 2) {
        if (setId === 1) number = number.replace(prevScore1.current, "");
        if (setId === 2) number = number.replace(prevScore2.current, "");
      }

      if (+number < 0 || +number > 7) return;
    }

    if (type === "points" && number.length > 2) return;

    if (setId === 1) setScore1(+number);
    if (setId === 2) setScore2(+number);
  };

  return (
    <Wrapper>
      {first && <p className="name name--you">You</p>}
      <input
        type="text"
        id="1"
        onChange={scoreChangeHandler}
        className="input input__left"
        value={score1}
        inputMode="numeric"
      />
      <span className="colon">:</span>
      <input
        type="text"
        id="2"
        onChange={scoreChangeHandler}
        className="input input__right"
        value={score2}
        inputMode="numeric"
      />
      {first && <p className="name">{opponent ? opponent.name : "Opponent"}</p>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-size: 1.6rem;

  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 1rem;
  margin-bottom: 1rem;

  .input {
    all: unset;
    background-color: transparent;

    width: 3rem;
    text-align: center;
    outline: none;
    text-decoration: none;
    border-bottom: 2px solid #aaa;

    transition: all 0.2s;

    &:focus {
      border-bottom: 2px solid var(--primary-color);
    }
  }

  .name {
    font-size: 1.1rem;
    color: #aaa;
    min-width: 10rem;

    &--you {
      text-align: right;
    }
  }
`;
