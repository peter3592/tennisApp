import Tippy from "@tippyjs/react";
import "tippy.js/animations/scale.css";

import styled from "styled-components";

export default function MyTippy(props) {
  if (!props.content) throw new Error("Tippy must have content");

  return (
    <TippyWrapper
      //   content={Players}
      //   visible={visible}
      //   onClickOutside={visibleHandler}
      //   trigger='click'
      interactive={true}
      className="popup"
      arrow=""
      placement="bottom"
      delay={[1, 1]}
      duration={[500, 0]}
      maxWidth="none"
      {...props}
    >
      {props.children}
    </TippyWrapper>
  );
}

const TippyWrapper = styled(Tippy)`
  .popup {
    &--grey {
      background-color: #ccc;
      color: black;
    }
  }
`;
