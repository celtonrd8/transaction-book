import * as React from 'react';
import { Main } from './../components/Main';
import { TopContainer } from '../styled/styledComponents';

export default class MainContainer extends React.Component<{}, {}> {
  componentDidMount() {
    console.log('DidMonut');
    console.log(this.props);
  }
  render() {
    return (
      <TopContainer>
        <Main />
      </TopContainer>
    );
  }
}
