import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import { DataIoStore } from '../../stores';

const styles = {
  cardHeader: {
    padding: 0,
    paddingLeft: "1rem",
  }
}
@inject('dataIoStore')
@observer
export default class TotalAmount extends React.Component<{}, {}> {

  componentDidMount() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const companyList = dataIoStore.companyList;

    companyList && companyList.map((company, cIdx) => {
      // let allYears
    })
  }

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
