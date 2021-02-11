import React from "react";
import styled, { css } from "styled-components";
import { BiLoaderAlt } from "react-icons/bi";

const gradient = css`
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: #00f700;
  background: linear-gradient(
    70deg,
    rgba(230, 230, 230, 1) 25%,
    rgba(170, 170, 170, 1) 50%,
    rgba(230, 230, 230, 1) 75%
  );
  background-size: 2000px 100%;

  @keyframes placeHolderShimmer {
    0% {
      background-position: -100vw 0;
    }
    100% {
      background-position: 100vw 0;
    }
  }
`;

const spin = css`
  animation-name: spin;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  position: ${(props) => (props.block ? "absolute" : "relative")};
  ${(props) =>
    props.block &&
    `
right: 0;
top: 0;
left: 0;
bottom: 0;
background: rgba(0,0,0,0.4);
z-index: 2;
display: flex;
justify-content: center;
align-items: center;`};
`;

const Element1 = styled.div`
  ${gradient}
  width: 100%;
  height: 1.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const Element2 = styled(Element1)`
  width: 80%;
`;

const SpinIcon = styled(BiLoaderAlt)`
  font-size: 10rem;
  color: white;
  ${spin}
`;

const Spiner = () => {
  return <SpinIcon />;
};

const Loading = ({ block = false }) => {
  return (
    <LoadingContainer block={block}>
      {block ? (
        <Spiner />
      ) : (
        <>
          <Element1 />
          <Element2 />
          <Element1 />
        </>
      )}
    </LoadingContainer>
  );
};

export default Loading;
