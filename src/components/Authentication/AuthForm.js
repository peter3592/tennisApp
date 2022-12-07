import styled from "styled-components";

export default function AuthForm(props) {
  return <Form onSubmit={props.onSubmit}>{props.children}</Form>;
}

const Form = styled.form`
  background-color: #eee;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .form-item {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .icon {
    position: absolute;
    bottom: 2.1rem;
    left: 0;
    font-size: 2rem;
    transition: 0.4s all;
  }

  label {
    font-weight: bold;
    font-size: 1.3rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  input {
    margin-bottom: 1.6rem;
    outline: none;
    border: none;
    border-bottom: 2px solid #bbb;
    background-color: transparent;
    padding: 0.5rem;
    padding-left: 3rem;

    :focus + .icon {
      font-size: 2.2rem;
    }
  }

  .link {
    text-decoration: none;
    color: #aaa;
    font-size: 1.2rem;

    :not(:last-of-type) {
      margin-bottom: 1rem;
    }
  }

  .links {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1rem;
  }

  .buttons {
    margin-top: 2rem;
  }

  .textAlready {
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text;
    background-clip: text;
  }

  strong {
    color: var(--primary-color);
    font-size: 105%;
  }
`;
