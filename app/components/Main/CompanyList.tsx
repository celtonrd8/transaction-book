import * as React from 'react';
import { Card } from "semantic-ui-react";

const styles = {
  card: {
    margin: 0,
    width: '100%',
    height: '100%',
  }
}

export default class CompanyList extends React.Component<{}, {}> {


  render() {
    return (
      <Card style={styles.card}>Compnay List</Card>
    );
  }
}
