import { useState } from "react";
import {
  useAuthContext,
  useDataContext,
  useUIContext,
} from "../../store/context";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import AvatarGenerate from "./AvatarGenerate";
import Button from "../UI/Button";

import AuthForm from "./AuthForm";

const avatarBgColor = getComputedStyle(document.body).getPropertyValue(
  "--primary-color"
);

export default function Signup(props) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [avatarConfig, setAvatarConfig] = useState({
    sex: "man",
    isGradient: true,
    bgColor: avatarBgColor,
  });

  const { signup } = useAuthContext();
  const { playersNames } = useDataContext();
  const { setModal } = useUIContext();

  const navigate = useNavigate();

  const signUpHandler = async (e) => {
    try {
      e.preventDefault();

      if (playersNames.includes(username))
        throw Object.assign(
          new Error("This username already exists! Please, choose another one"),
          {
            appError: true,
          }
        );

      if (password !== passwordConfirm)
        throw Object.assign(new Error("Passwords are not the same"), {
          appError: true,
        });

      if (username.length < 4 || username.length > 10)
        throw Object.assign(
          new Error("Username must be between 4 and 10 characters long"),
          {
            appError: true,
          }
        );

      await signup(email, password, username, avatarConfig);

      navigate("/");
    } catch (err) {
      let message = "Creating user error";
      if (err.appError) message = err.message;

      if (err.code === "auth/email-already-in-use")
        message = "The email address is already in use";

      if (err.code === "auth/invalid-email")
        message = "The email address is badly formatted";

      setModal({ type: "error", msg: message });
    }
  };

  return (
    <div>
      <AuthForm onSubmit={signUpHandler}>
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
          <label>Username</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            minLength="4"
            maxLength="10"
            required
          />
          <AiOutlineUser className="icon" />
        </div>
        <div className="form-item">
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength="6"
            required
          />
          <AiOutlineLock className="icon" />
        </div>
        <div className="form-item">
          <label>Confirm Password</label>
          <input
            type="password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            minLength="6"
            required
          />
          <AiOutlineLock className="icon" />
        </div>
        <AvatarGenerate
          onAvatarGenerate={setAvatarConfig}
          avatarConfig={avatarConfig}
        />
        <div className="buttons">
          <Button category="main">Signup</Button>
        </div>
        <div className="links">
          <Link className="link" to="/login">
            Already have accout? <strong>Log In</strong>
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
