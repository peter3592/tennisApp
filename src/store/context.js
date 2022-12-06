import { useContext } from "react";

import { AuthProvider, AuthContext } from "./authContext";
import { DataProvider, DataContext } from "./dataContext";
import { UIProvider, UIContext } from "./UIContext";

export default function ContextProvider(props) {
  return (
    <AuthProvider>
      <UIProvider>
        <DataProvider>{props.children}</DataProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useDataContext() {
  return useContext(DataContext);
}

export function useUIContext() {
  return useContext(UIContext);
}
