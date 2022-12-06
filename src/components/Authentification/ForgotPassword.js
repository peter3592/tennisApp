import { useState } from "react";
import AuthForm from "./AuthForm";
import { AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../store/context";
import Button from "../UI/Button";

export default function ForgotPassword(props) {
  const [email, setEmail] = useState("");

  const { resetPassword } = useAuthContext();

  const forgotPasswordHandler = (e) => {
    e.preventDefault();
    resetPassword(email);
  };
  return (
    <>
      <div>
        <AuthForm onSubmit={forgotPasswordHandler}>
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
          <div className="buttons">
            <Button category="main">Reset Password</Button>
          </div>
          <div className="links">
            <Link className="link" to="/login">
              Back to <strong>Login</strong>
            </Link>
          </div>
        </AuthForm>
      </div>
    </>
  );
}
