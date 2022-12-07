import React from "react";
import { useState } from "react";

export const UIContext = React.createContext();

export function UIProvider(props) {
  const [contentPage, setContentPage] = useState("games");
  const [showSidebar, setShowSidebar] = useState(false);
  const [modal, setModal] = useState(null);

  const value = {
    contentPage,
    setContentPage,
    showSidebar,
    setShowSidebar,
    modal,
    setModal,
  };

  return (
    <UIContext.Provider value={value}>{props.children}</UIContext.Provider>
  );
}
