import { Link } from "react-router-dom";
import styled from "styled-components";

export default function StyledLink(props) {
  return <MyLink {...props}>{props.children}</MyLink>;
}

const MyLink = styled(Link)`
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }

  color: ${({ color }) => (color ? color : "var(--primary-color)")};
`;
