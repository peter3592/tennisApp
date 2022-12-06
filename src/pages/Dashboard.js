import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useAuthContext, useDataContext, useUIContext } from "../store/context";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Modal from "../components/UI/Modal";

export default function Dashboard() {
  const { setContentPage, showSidebar, modal, setModal } = useUIContext();
  const { initDataLoad } = useDataContext();
  const { currentUser } = useAuthContext();

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        await initDataLoad();
      }
    };

    loadData();
  }, [currentUser]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setModal(null), 3000);

    return () => clearTimeout(timeoutId);
  }, [modal, setModal]);

  const sidebarHandler = (page) => {
    if (page !== "games" && page !== "players" && page !== "stats") return;

    setContentPage(page);
  };

  return (
    <Wrapper showSidebar={showSidebar}>
      <Modal modal={modal} />
      <Navbar />
      <div className="content">
        <Sidebar onSidebarClick={sidebarHandler} className="sidebar" />
        <Outlet context={"outlet"} />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--primary-color);
  position: relative;

  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex-grow: 1;
    height: calc(100% - var(--navbar-height));

    gap: 2rem;
    padding: 2rem;
  }

  .sidebar {
    width: 20rem;
    z-index: 500;
  }

  .outlet {
    flex-grow: 1;
  }

  @media (max-width: 1000px) {
    .content {
      position: relative;
    }

    .sidebar {
      width: 17rem;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      transform: ${(props) =>
        props.showSidebar ? "translateX(0);" : "translateX(-100%);"};
    }
  }

  @media (max-width: 750px) {
    .content {
      padding: 0;
    }
  }
`;
