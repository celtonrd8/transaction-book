import * as React from 'react';

import { Layout, Menu } from 'antd';
// import { Typo } from '../../styled/styledComponents';
// import styled from 'styled-components';

type Props = { };

type State = { };

const { Header } = Layout;

// const styles = {
//   menu: {
//     // backgroundColor: '#1b1c1d',
//   },
//   dropdown: {
//     // color: 'white',
//   },
//   title: {
//     marginLeft: '1rem',
//   }
// }

export default class AppBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
      </Layout>
    );
  }
}
