import styled from "styled-components";

const Button = styled.button`
  outline: none;
  cursor: pointer;

  display: block;
  text-transform: uppercase;
  transition: all 0.2s;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 7px 12px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

  &:active {
    box-shadow: none;
    transform: translateY(3px) translateX(1px);
  }

  ${({ category }) => {
    if (category === "main") {
      return `
        background-color: var(--primary-color);
        border: 2px solid var(--primary-color);
        color: #eee;
        `;
    }

    if (category === "secondary") {
      return `
        background-color: #eee;
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
      `;
    }
  }}

  ${({ small }) => {
    if (small)
      return ` 
      font-size: 1rem;

      min-width: 6.6rem;
      padding: 0.7rem 0.7rem;
      margin: 0;
      text-decoration: none;
      letter-spacing: 1.5px;
      `;

    return `
      min-width: 16rem;
      padding: 1rem 2rem;

      :not(:last-of-type) {
        margin: 0 auto 2rem auto;
      }
      `;
  }}
`;

export default Button;
