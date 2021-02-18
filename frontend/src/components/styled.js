import styled, { css } from "styled-components";
import {
  adjustHue,
  darken,
  lighten,
  linearGradient,
  rgb,
  rgba,
} from "polished";
import { Link } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";

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
  color: ${(props) => props.theme.white};
  background-color: ${(props) =>
    props.primary
      ? darken(0.02, props.theme.primary)
      : props.transparent
      ? "transparent"
      : props.theme.primary};
  width: ${(props) => (props.block ? "100%" : "auto")};
  transition: all 0.2s ease-in-out;

  &:hover,
  &:focus {
    cursor: pointer;
    background-color: ${(props) =>
      darken(
        0.08,
        props.primary
          ? props.theme.primary
          : props.transparent
          ? "transparent"
          : props.theme.primary
      )};

    ${(props) =>
      props.transparent &&
      `color: ${darken(0.3, props.theme.white)};
    transform: scale(1.1);`}
  }
`;

const ButtonCloseStyle = styled.button`
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  font-size: 1.5rem;
  color: ${(props) => props.theme.primary};
  background-color: transparent;
  border: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.white};
    background-color: ${(props) => props.theme.primary};
    cursor: pointer;
  }
`;

export const ButtonClose = (props) => {
  return (
    <ButtonCloseStyle {...props}>
      <AiOutlineCloseCircle />
    </ButtonCloseStyle>
  );
};

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
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 4px;
  background-color: ${(props) => props.theme.white};
  color: ${(props) => props.theme.black};
  flex-grow: 1;

  &:focus {
    outline: none;
    box-shadow: 0 0 3px 5px ${(props) => rgba(props.theme.active, 0.3)};
  }

  &:placeholder {
    color: ${(props) => props.theme.disabled};
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
  background-color: ${(props) => props.theme.disabled};

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
  color: ${(props) => props.theme.black};

  &:hover {
    text-decoration: underline;
  }
`;

export const UnorderedList = styled.ul`
  list-style: none;
  width: 100%;
`;

const statusColor = (status, theme) => {
  switch (status) {
    case "New":
      return theme.error;
    case "In progress":
      return theme.warning;
    case "Finished":
      return theme.success;
    default:
      return "orange";
  }
};

export const ListItem = styled.li`
  padding: 0.2rem 0.5rem;
  width: 100%;
  border-radius: 4px;
  display: flex;
  color: inherit;
  align-items: center;
  transition: all 0.2s ease-in-out;
  background: transparent;
  margin-bottom: 0.5rem;

  & > svg {
    color: ${(props) =>
      props.status ? statusColor(props.status, props.theme) : "inherit"};
  }

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

export const User = styled.div`
  justify-content: flex-start;
  align-items: baseline;
  text-decoration: ${(props) =>
    props.disabled ? `line-through ${props.theme.disabled}` : "none"};
  color: ${(props) => (props.disabled ? props.theme.disabled : "inherit")};
  display: ${(props) => (props.open || !props.disabled ? "block" : "none")};
  max-width: 200px;

  & + & {
    margin-left: ${(props) => (props.open ? "0" : "0.5rem")};
  }

  &:before {
    content: "";
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    background-color: ${(props) => `#${props.avatar}`};
  }
`;

export const Header = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Icon = styled.span`
  font-size: 2rem;
  color: ${(props) => props.theme.black};
`;

export const Date = styled.div`
  font-size: 0.625rem;
  color: ${(props) => props.theme.gray};
`;

export const Title = styled.h2`
  font-size: 1.5rem;

  span {
    font-size: 1rem;
    color: ${(props) => props.theme.gray};
    margin-right: 0.5rem;

    &:after {
      content: ">";
      margin-left: 0.5rem;
    }
  }
`;

export const Creator = styled.div`
  display: flex;
  align-items: baseline;

  span {
    font-size: 0.625rem;
    color: ${(props) => props.theme.gray};
    margin-right: 0.5rem;
  }
`;

export const Select = styled.select`
  background-color: ${(props) =>
    props.value && statusColor(props.value, props.theme)};
`;

export const Option = styled.option`
  background-color: ${(props) =>
    props.value && statusColor(props.value, props.theme)};
`;
