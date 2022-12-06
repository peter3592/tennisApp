import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Court from "../../assets/tennisCourt.png";

export default function Background(props) {
  return (
    <Wrapper image={Court}>
      {props.children}
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  background: ${(props) =>
    `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${props.image})`};
  background-size: cover;
  background-position: center;

  width: 100%;
  height: 100%;
`;
