import styled, { css } from "styled-components";
import { adjustHue, darken, lighten, linearGradient } from "polished";
import { Link } from "react-router-dom";

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem 1rem;
  text-transform: capitalize;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: ${(props) =>
    props.primary
      ? darken(0.01, props.theme.primary)
      : props.transparent
      ? "transparent"
      : "gray"};
  width: ${(props) => (props.block ? "100%" : "auto")};
  transition: all 0.2s ease-in-out;

  &:hover,
  &:focus {
    cursor: pointer;
    background-color: ${(props) =>
      darken(
        0.05,
        props.primary
          ? props.theme.primary
          : props.transparent
          ? "transparent"
          : "gray"
      )};

    ${(props) =>
      props.transparent &&
      `color: ${darken(0.3, "white")};
    transform: scale(1.1);`}
  }
`;

export const ButtonClose = styled.button`
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  font-size: 1.5rem;
  color: gray;
  background-color: transparent;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: white;
    background-color: gray;
    cursor: pointer;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  & input,
  & label,
  & textarea {
    display: block;
    width: 100%;
  }
`;

export const Label = styled.label`
  color: inherit;
  margin-bottom: 0.5rem;
`;

const sharedInputTextarea = css`
  padding: 0.5rem 1rem;
  border: 2px solid #aaaaaa;
  border-radius: 4px;
  background-color: white;
  color: ${lighten(0.3, "black")};
  flex-grow: 1;

  &:focus {
    outline: none;
    box-shadow: 0 0 3px 5px rgba(0, 119, 255, 0.2);
  }

  &:placeholder {
    color: ${lighten(0.3, "black")};
  }
`;

export const Input = styled.input`
  ${sharedInputTextarea};
  min-width: 10px;
`;

export const Textarea = styled.textarea`
  ${sharedInputTextarea}
`;

export const Form = styled.form`
  display: ${(props) => (props.flex ? "flex" : "inline")};
  justify-content: center;
  align-items: center;
  max-width: 100%;
  width: 100%;
`;

export const FormContainer = styled.div`
  max-width: 600px;
  padding: 1.5rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: #ececec;

  @media screen and (max-width: 600px) {
    width: 100%;
    margin: 0 auto;
    border-radius: 0;
    height: 100vh;
  }
`;

export const LinkStyled = styled(Link)`
  text-decoration: none;
  margin-top: 1rem;
  margin-left: auto;
  color: black;

  &:hover {
    text-decoration: underline;
  }
`;

export const UnorderedList = styled.ul`
  list-style: none;
  width: 100%;
`;

const statusColor = (status) => {
  switch (status) {
    case "New":
      return "red";
    case "In progress":
      return "yellow";
    case "Finished":
      return "green";
    default:
      return "orange";
  }
};

export const ListItem = styled.li`
  padding: 0.2rem 0.5rem;
  width: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  background: ${(props) =>
    props.status
      ? linearGradient({
          colorStops: [
            statusColor(props.status),
            (adjustHue(10, props.theme.primary) || "transparent") + " 20%",
          ],
          toDirection: "to right",
        })
      : adjustHue(-10, props.theme.primary)};
  margin-bottom: 0.5rem;

  &:hover,
  &:focus {
    transform: scale(1.05);

    button {
      transform: translateX(0);
      opacity: 1;
      padding: 0 0.2rem;
    }
  }

  p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 0.4rem;

    &:hover {
      cursor: pointer;
    }
  }

  button {
    padding: 0;
    transform: translateX(150%);
    opacity: 0;
    svg {
      font-size: 1rem;
    }
  }

  svg {
    font-size: 1.5rem;
  }
`;
