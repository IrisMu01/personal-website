import styled from 'styled-components';

export default styled.div`
  width: calc(100% + 64px);
  height: 0px;
  background-color: rgba(255, 255, 255, 0.3);
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
