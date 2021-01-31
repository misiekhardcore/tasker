import React from "react";
import styled, { css } from "styled-components";
import { linearGradient } from "polished";

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

const LoadingContainer = styled.div``;
const Element1 = styled.div`
  ${gradient}
  width: 100%;
  height: 1.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
`;

const Element2 = styled(Element1)`
  width: 80%;
`;

const Loading = ({ type = "list" }) => {
  return (
    <LoadingContainer>
      <Element1 />
      <Element2 />
      <Element1 />
    </LoadingContainer>
  );
};

export default Loading;
