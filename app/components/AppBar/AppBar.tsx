import * as React from 'react';

import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import { Typo } from '../../styled/styledComponents';
// import styled from 'styled-components';

type Props = { };

type State = {
};

// const MenuContainer = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-end;

// `;

const styles = {
  menu: {
    // backgroundColor: '#1b1c1d',
  },
  dropdown: {
    // color: 'white',
  },
  title: {
    marginLeft: '1rem',
  }
}

export default class AppBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Menu inverted fixed="top" size="massive" style={styles.menu}>
            <Dropdown item icon='plus' simple style={styles.dropdown}>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Icon name='dropdown' />
                  <span className='text'>New</span>

                  <Dropdown.Menu>
                    <Dropdown.Item>Document</Dropdown.Item>
                    <Dropdown.Item>Image</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>Open</Dropdown.Item>
                <Dropdown.Item>Save...</Dropdown.Item>
                <Dropdown.Item>Edit Permissions</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Export</Dropdown.Header>
                <Dropdown.Item>Share</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Typo bold size={1.25} style={styles.title}>장부관리</Typo>
        </Menu>

      </div>
    );
  }
}
