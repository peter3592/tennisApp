import { useEffect } from "react";
import { useUIContext } from "../store/context";

import styled from "styled-components";

import Modal from "../components/UI/Modal";

export default function Authentification({ children }) {
  const { modal, setModal } = useUIContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => setModal(null), 3000);

    return () => clearTimeout(timeoutId);
  }, [modal, setModal]);

  return (
    <Wrapper>
      <Modal modal={modal} />
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
`;
