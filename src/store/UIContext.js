import React from "react";
import { useState } from "react";

export const UIContext = React.createContext();

export function UIProvider(props) {
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const [contentPage, setContentPage] = useState("games");
  const [showSidebar, setShowSidebar] = useState(false);
  const [modal, setModal] = useState(null);

  const value = {
    showNewGameForm,
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
