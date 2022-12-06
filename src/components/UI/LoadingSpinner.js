import Logo from "../../assets/logo.png";
import styled, { keyframes } from "styled-components";

export default function LoadingSpinner() {
  return (
    <Div>
      <div className="image-container">
        <img src={Logo} alt="Tennis Ball Logo" />
      </div>
    </Div>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .image-container {
    width: 5rem;
    height: 5rem;
    background-size: cover;
    animation: ${rotate} 1s linear infinite;

    & img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
`;
