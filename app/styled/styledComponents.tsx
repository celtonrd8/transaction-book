import styled from 'styled-components';

export const Typo = styled.div`
  color: black;
  font-weight: ${ props => props.bold ? 600 : 400 };
  font-size: ${ props => props.size ? `${props.size}rem`: '0.88rem'};
`;

export const MainLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const LeftSideLayout = styled.div`
  flex: 0.65;
  padding: 0.5rem;
`;

export const RightSideLayout = styled.div`
  flex: 0.35;
  /* width: 100%; */
  display: flex;
  flex-direction: column;
`
export const ScrollableCardContent = styled.div`
  /* padding: 1rem; */
  /* min-height: 700px; */
  /* max-height: calc(100vh - 128px); */
  /* height: 100%; */
  overflow-y: auto;
`;

export const CRow = styled.div`
  flex: 1;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* background: lightgray; */
  /* border-top: 0.5px solid #2c3e50;
  border-bottom: 0.5px solid #2c3e50;
  border-left: 1px solid #2c3e50;
  border-right: 1px solid #2c3e50; */
  &:hover{
    /* border: 1.25px solid #2c3e50; */
  }
`;

export const CColumn = styled.div`
  flex: 1;
  /* width: 100%; */
  height: 1rem;
  align-self: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
