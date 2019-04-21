import * as React from 'react';
import { Card } from 'antd';

const styles = {
  cardHeader: {
    padding: 0,
    paddingLeft: "1rem",
  }
}

export default class TotalAmount extends React.Component<{}, {}> {

  render() {
    return (
      <Card
        title="연간 총장"
        bordered={true}
        headStyle={styles.cardHeader}
      >
        Total amount
      </Card>
    );
  }
}
