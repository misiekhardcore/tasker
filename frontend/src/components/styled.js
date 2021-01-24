import styled, { css } from "styled-components";
import { darken, lighten } from "polished";

export const Button = styled.button`
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem 1rem;
  text-transform: capitalize;
  border: none;
  border-radius: 0.5rem;
  color: white;
  background-color: ${(props) => props.primary || "gray"};
  width: ${(props) => (props.block ? "100%" : "auto")};

  &:hover,
  &:focus {
    cursor: pointer;
    background-color: ${(props) =>
      darken(0.05, props.primary || "gray")};
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
  border: none;
  border-radius: 0.5rem;
  background-color: ${darken(0.05, "white")};
  color: ${lighten(0.3, "black")};

  &:focus {
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

export const Form = styled.form``;
