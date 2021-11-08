import React from 'react';
import styled from 'styled-components';
import NormalH1 from 'components/H1';
import NormalH3 from 'components/H3';

const Wrapper = styled.div`
  z-index: 1;
  width: 100vw;
  height: 300px;
  color: white;
  margin: calc(50vh - 150px) -32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AnimatedWrapper = styled.div`
  width: 100vw;
  height: 0px;
  background-color: rgba(255, 255, 255, 0.4);
  margin: 50vh 0;
  animation-delay: 1s;
  animation-duration: 2s;
  animation-name: expand;
  animation-fill-mode: forwards;
  h1,
  h3 {
    z-index: 2;
    opacity: 0;
    animation-delay: 2s;
    animation-duration: 2s;
    animation-name: appear;
    animation-fill-mode: forwards;
  }
  @keyframes expand {
    from {
      height: 0px;
      margin: 50vh 0;
    }
    to {
      height: 300px;
      margin: calc(50vh - 150px) 0;
    }
  }
  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Title = styled(NormalH1)`
  font-size: 2em;
`;

const SubTitle = styled(NormalH3)`
  font-size: 1.25em;
`;

function Intro() {
  return (
    <Wrapper>
      <AnimatedWrapper>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Title>I'm Iris.</Title>
        <SubTitle>
          I write programs <strike>and bugs</strike>.
        </SubTitle>
      </AnimatedWrapper>
    </Wrapper>
  );
}

export default Intro;
