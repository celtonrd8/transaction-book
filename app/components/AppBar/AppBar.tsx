import * as React from 'react';
// import { inject, observer } from 'mobx-react';
import { Layout, Typography } from 'antd';
// import { Typo } from '../../styled/styledComponents';
// import styled from 'styled-components';
// import { RouterStore } from 'mobx-react-router';

const { Title } = Typography;

type Props = { };
type State = { };

const { Header } = Layout;

// @inject('routingStore')
// @observer
export default class AppBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    // const routingStore = this.props['routingStore'] as RouterStore;
    return (
      <Layout className="layout">
        <Header>
          <div className="abHeaderTitle">
            <Title level={4} style={{color: 'white', marginTop: '0.25rem'}}>Transaction Book</Title>
          </div>
          {
          // <Button
          //   onClick={() => {
          //     routingStore.history.push('/main');
          //     console.log(routingStore);
          //   }}
          // >
          //   Main
          // </Button>
          // <Button
          //   onClick={() => {
          //     routingStore.history.push('test');
          //     console.log(routingStore);
          //   }}
          // >
          //   Test
          // </Button>

          // <Menu
          //   theme="dark"
          //   mode="horizontal"
          //   defaultSelectedKeys={['2']}
          //   style={{ lineHeight: '64px' }}
          // >
          //   <Menu.Item
          //     key="1"
          //     onClick={() => {
          //       routingStore.history.push('/test');
          //       console.log(routingStore);
          //     }}
          //   >
          //     nav 1
          //   </Menu.Item>
          //   <Menu.Item
          //     key="2"
          //     onClick={() => routingStore.history.push('/')}
          //   >
          //     nav 2
          //   </Menu.Item>
          //   <Menu.Item key="3">nav 3</Menu.Item>
          // </Menu>
          }
        </Header>
      </Layout>
    );
  }
}
