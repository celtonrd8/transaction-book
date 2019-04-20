import * as React from 'react';
import { Card } from 'antd';

const styles = {
  cardHeader: {
    padding: 0,
  }
}
export default class SelectedCompany extends React.Component<{}, {}> {

  render() {
    return (
      <Card
        title="업체별 총장"
        bordered={false}
        headStyle={styles.cardHeader}
      >
        Card content
      </Card>
    );
  }
}
