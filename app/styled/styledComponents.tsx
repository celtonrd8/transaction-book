import styled from 'styled-components';

export const TopContainer = styled.div`
  margin-top: 52px;
`;

export const Typo = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-weight: ${ props => props.bold ? 600 : 400 };
  font-size: ${ props => props.size ? `${props.size}rem`: '1rem'};
`;

export const MainLayout = styled.div`
  width: 100%;
  height: 94vh;
  /* padding: 0.5rem; */
  display: flex;
  flex-direction: column;
  div:nth-child(1) {
    flex: 0.75;
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
  div:nth-child(2) {
    flex: 0.25;
    padding: 1.5rem;
  }
`;


export const CampanyLayout = styled.div`
  display: grid;
  grid-template-columns: 60% auto;
  grid-column-gap: 1.5rem;
`;

export const TotalAmoutLayout = styled.div`
`
