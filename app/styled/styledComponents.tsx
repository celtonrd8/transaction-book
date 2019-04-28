import styled from 'styled-components';

export const CRow = styled.div`
  flex: 1;
  width: 100%;
  /* height: 50px; */
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.left ? 'flex-start' : 'center'};
  align-items: center;
`;

export const CColumn = styled.div`
  flex: 1;
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.left ? 'flex-start' : 'center'};
  align-items: center;
  padding-bottom: 0.25rem;
  padding-left: 1rem;
  border-left: ${props => props.hover ? '3px solid #84817a' : null};
  &:hover {
    border-left: ${props => props.hover ? '3px solid #33d9b2' : null};
  }
`
