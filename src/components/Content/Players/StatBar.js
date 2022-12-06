import styled from "styled-components";

export default function StatBar({ fill, color }) {
  const checkedFill = isNaN(fill) ? 0 : fill; // Fix divide by 0 bug

  return <Div fill={checkedFill} color={color}></Div>;
}

const Div = styled.div`
  width: 8rem;
  height: 5px;
  background-color: black;
  position: relative;

  ::before {
    content: "";
    height: 5px;
    width: ${(props) => `${props.fill}%`};
    background-color: ${(props) => props.color};
    position: absolute;
    top: 0;
    left: 0;
  }

  ::after {
    content: "";
    height: 5px;
    width: ${(props) => `${100 - props.fill}%`};
    background-color: #c8c8c8;
    position: absolute;
    top: 0;
    right: 0;
  }
`;
