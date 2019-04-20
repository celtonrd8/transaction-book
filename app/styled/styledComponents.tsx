import styled from 'styled-components';

export const Typo = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-weight: ${ props => props.bold ? 600 : 400 };
  font-size: ${ props => props.size ? `${props.size}rem`: '1rem'};
`;

export const MainLayout = styled.div`
  width: 100%;
  height: 100%;
  /* padding: 0.5rem; */
  display: flex;
  flex-direction: row;

  div:nth-child(1) {
    flex: 0.6;
    padding: .5rem 0 0 .5rem;
    /* height: 800px; */
  }
  div:nth-child(2) {
    flex: 0.4;
    padding: .5rem;
  }
`;

export const LeftSideLayout = styled.div`
  /* min-height: 800px; */
  /* display: grid;
  grid-template-columns: 60% auto;
  grid-column-gap: .5rem; */
`;

export const RightSideLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  div:nth-child(1) {
    flex: 0.6;
  }
  div:nth-child(2) {
    flex: 0.4;
    margin-top: .5rem;
  }
`
export const ScrollableCardContent = styled.div`
  /* padding: 1rem; */
  min-height: 700px;
  max-height: 750px;
  overflow-y: auto;
`;
