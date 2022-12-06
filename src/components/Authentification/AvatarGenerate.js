import { useCallback } from "react";
import { useEffect } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import styled, { keyframes } from "styled-components";
import { isMobile } from "react-device-detect";

const avatarSize = "8rem";

const avatarBgColor = getComputedStyle(document.body).getPropertyValue(
  "--primary-color"
);

export default function AvatarGenerate(props) {
  const generateAvatar = useCallback(() => {
    const config = genConfig({
      sex: "man",
      isGradient: true,
      bgColor: avatarBgColor,
      eyeStyle: "circle",
      hairColor: "black",
      hatStyle: "none",
      glassesStyle: "none",
    });

    props.onAvatarGenerate(config);
  }, [props.onAvatarGenerate]);

  useEffect(() => {
    generateAvatar();
  }, [generateAvatar]);

  return (
    <Wrapper>
      <div className="avatar__container" onClick={generateAvatar}>
        <Avatar
          className="avatar"
          style={{ width: avatarSize, height: avatarSize }}
          {...props.avatarConfig}
          shape="circle"
        />
        <div className={"click"}>
          <p>{isMobile ? "Tap!" : "Click!"}</p>
        </div>
      </div>
    </Wrapper>
  );
}

const blink = keyframes`
  from, to {
    opacity: 0;
    transform: scale(1);
  }
  
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const fadeout = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;

  & .avatar__container {
    cursor: pointer;
    position: relative;
  }

  & .click {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 50rem;
    width: ${() => avatarSize};
    height: ${() => avatarSize};
    margin-bottom: 1rem;
    z-index: 1000;
    animation: ${fadeout} 0.5s 2s forwards linear;
    user-select: none;
  }

  & p {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    opacity: 0;
    animation: ${blink} 0.7s 0.2s forwards linear 3;
  }
`;
