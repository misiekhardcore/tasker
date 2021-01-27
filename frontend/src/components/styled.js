import styled, { css } from "styled-components";
import { darken, lighten, rgba } from "polished";

export const Button = styled.button`
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem 1rem;
  text-transform: capitalize;
  border: none;
  border-radius: 0.5rem;
  color: white;
  background-color: ${(props) =>
    props.primary
      ? "#d344a3"
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
          ? "#d344a3"
          : props.transparent
          ? "transparent"
          : "gray"
      )};

    ${(props) =>
      props.transparent &&
      `color: ${darken(0.2, "white")};
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
  color: ${darken(0.1, "white")};
  background-color: transparent;
  border: none;

  &:hover {
    color: ${darken(0.1, "gray")};
    background-color: ${darken(0.1, "white")};
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
  color: white;
  margin-bottom: 0.5rem;
`;

const sharedInputTextarea = css`
  padding: 0.5rem 1rem;
  border: 2px solid #aaaaaa;
  border-radius: 0.5rem;
  background-color: ${darken(0.05, "white")};
  color: ${lighten(0.3, "black")};
  flex-grow: 1;

  &:focus {
    outline: none;
    box-shadow: 0 0 3px 5px rgba(255, 255, 255, 0.2);
  }

  &:placeholder {
    color: ${lighten(0.4, "black")};
  }
`;

export const Input = styled.input`
  ${sharedInputTextarea}
`;

export const Textarea = styled.textarea`
  ${sharedInputTextarea}
`;

export const Form = styled.form`
  display: ${(props) => (props.flex ? "flex" : "inline")};
  justify-content: center;
  align-items: center;
`;

export const UnorderedList = styled.ul`
  list-style: none;
  padding: 0 0.5rem;
  width: 100%;
`;

export const ListItem = styled.li`
  padding: 0.2rem 0.5rem;
  width: 100%;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
  background: ${(props) =>
    props.table ? "red" : props.task ? "green" : rgba("white", 0.05)};
  margin-bottom: 0.5rem;

  &:hover,
  &:focus {
    transform: scale(1.05);
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

  svg {
    font-size: 1.5rem;
  }
`;
