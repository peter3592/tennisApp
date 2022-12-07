import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext, useUIContext, useDataContext } from "./store/context";
import Dashboard from "./pages/Dashboard";
import PlayerProfile from "./components/Content/Players/PlayerProfile";
import Authentication from "./pages/Authentication";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import NewGameForm from "./components/Content/NewGame/NewGameForm";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import Background from "./components/UI/Background";
import Content from "./components/Content/Content";

function App() {
  const { showNewGameForm } = useUIContext();
  const { playersNames, dataLoaded } = useDataContext();
  const { currentUser } = useAuthContext();

  return (
    <>
      {(currentUser === null || !playersNames || !dataLoaded) && (
        <Background>
          <LoadingSpinner />
        </Background>
      )}
      {currentUser !== null && playersNames && (
        <BrowserRouter>
          {showNewGameForm && <NewGameForm />}
          <Routes>
            <Route path="/" element={<Background />}>
              <Route
                path="/login"
                element={
                  <Authentication>
                    <Login />
                  </Authentication>
                }
              />
              <Route
                path="/signup"
                element={
                  <Authentication>
                    <Signup />
                  </Authentication>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <Authentication>
                    <ForgotPassword />
                  </Authentication>
                }
              />
              <Route
                path="/"
                element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
              >
                <Route index element={<Content />} />
                <Route path="/players/:id" element={<PlayerProfile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
