import { useState } from "react";
import { useAuthContext, useUIContext } from "../../store/context";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Button from "../UI/Button";

import AuthForm from "./AuthForm";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, login, guestLogin, logout } = useAuthContext();
  const { setModal } = useUIContext();

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      await login(email, password);
      navigate("/");
    } catch (err) {
      setModal({ type: "error", msg: "Incorrect email or password" });
    }
  };

  const guestLoginHandler = async () => {
    await guestLogin();

    navigate("/");
  };

  if (currentUser) {
    return (
      <AuthForm>
        <p className="textAlready">
          You are logged as{" "}
          <strong>{currentUser.displayName || "Guest"}</strong>
        </p>
        <div className="buttons">
          <Button category="main" onClick={() => navigate("/")}>
            Back to App
          </Button>
          <Button category="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </AuthForm>
    );
  }

  return (
    <>
      <div>
        <AuthForm onSubmit={loginHandler}>
          <div className="form-item">
            <label>Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <AiOutlineMail className="icon" />
          </div>
          <div className="form-item">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <AiOutlineLock className="icon" />
          </div>
          <div className="buttons">
            <Button category="main">Login</Button>
            <Button
              category="secondary"
              type="button"
              onClick={guestLoginHandler}
            >
              Login as Guest
            </Button>
          </div>
          <div className="links">
            <Link className="link" to="/signup">
              Do not have an account? <strong>Create</strong> one
            </Link>
            <Link className="link" to="/forgot-password">
              Do you <strong>forgot</strong> a password?
            </Link>
          </div>
        </AuthForm>
      </div>
    </>
  );
}
