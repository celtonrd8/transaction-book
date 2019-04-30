import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Tabs } from 'antd';
import { DataIoStore } from '../../stores';

const TabPane = Tabs.TabPane;

interface Props {};

interface State {};

const styles = {
  cardHeader: {
    padding: 0,
    paddingLeft: "1rem",
  },
  tabs: {
    maxWidth: 640,
  }
}
@inject('dataIoStore')
@observer
export default class TotalAmount extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    // const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    // const companyList = dataIoStore.companyList;

    // companyList && companyList.map((company, cIdx) => {
    //   // let allYears
    // })
    // dataIoStore
    //   .getAllYears()
    //   .then(years => {
    //     console.log(years);
    //     this.setState({ allYears: years.map(item => item.year)});
    //   })
    //   .catch(err => console.log(err.message));
  }


  render() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;

    return (
      <Card
        title="연간 총장"
        bordered={true}
        headStyle={styles.cardHeader}
      >
        <Tabs defaultActiveKey="0" animated={false} style={styles.tabs}>
          { dataIoStore.allYears && dataIoStore.allYears.map((year, index) => {
            return (
              <TabPane tab={`${year}년`} key={`${index + 1}`}>Test</TabPane>
            );
          })}
        </Tabs>
      </Card>
    );
  }
}
