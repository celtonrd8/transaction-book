import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Tabs, Typography } from 'antd';
import { DataIoStore } from '../../stores';
import { CGRow, CGColumn, CRow, CColumn } from '../../styled'
import { toCurrency } from '../../utils';

const TabPane = Tabs.TabPane;
const { Text } = Typography;

interface Props {};
interface State {};

const cardHeader: React.CSSProperties = { padding: 0, paddingLeft: "1rem" };
const tabs: React.CSSProperties = { maxWidth: '100%' };
const innerColumn: React.CSSProperties = { flex: 1, textAlign: 'center', padding: 0 };
const underline: React.CSSProperties = {
  borderBottom: '1px dotted #aeaeae',
  paddingBottom: '.05rem',
  marginBottom: '.15rem',
};

@inject('dataIoStore')
@observer
export default class TotalAmount extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() { }

  render() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;

    return (
      <Card
        title="연간 총장"
        bordered={true}
        headStyle={cardHeader}
        bodyStyle={{padding: '0 1rem 1rem 1rem'}}
      >
          <Tabs defaultActiveKey="0" animated={false} style={tabs}>
            {
              dataIoStore && dataIoStore.yearlyTotalAmount &&
              dataIoStore.yearlyTotalAmount.map((yearlyTotal, yIdx) => {
                return (
                  <TabPane tab={`${yearlyTotal.year}년`} key={`${yIdx + 1}`}>

                    <Tabs defaultActiveKey="0" animated={false} style={tabs}>
                      <TabPane tab="연간(총)거래액" key='0'>
                        <CGRow>
                          { yearlyTotal.monthlySalesAmount.map((monthlyTotal, mIdx) => (
                              <CGColumn key={mIdx} hover>
                                <div style={innerColumn}>
                                  <div style={underline}>{mIdx+1}월</div>
                                  <div>{toCurrency(monthlyTotal)}원</div>
                                </div>
                              </CGColumn>
                            ))
                          }
                        </CGRow>
                      </TabPane>
                      <TabPane tab="연간(총)수금액" key='1'>
                        <CGRow>
                          { yearlyTotal.monthlyDepositAmount.map((monthlyTotal, mIdx) => (
                              <CGColumn key={mIdx} hover>
                                <div style={innerColumn}>
                                  <div style={underline}>{mIdx+1}월</div>
                                  <div>{toCurrency(monthlyTotal)}원</div>
                                </div>
                              </CGColumn>
                            ))
                          }
                        </CGRow>
                      </TabPane>
                    </Tabs>

                    <CRow right style={{marginTop: '1.25rem'}}>
                      <CColumn hover left>
                        <Text style={{fontSize: '1rem', color: '#2980b9'}}>
                          총 거래액 : {toCurrency(yearlyTotal.yearlySalesTotal)}원
                        </Text>
                      </CColumn>
                      <CColumn hover left>
                        <Text style={{fontSize: '1rem', color: '#2980b9'}}>
                          총 입금액 : {toCurrency(yearlyTotal.yearlyDepositTotal)}원
                        </Text>
                      </CColumn>
                      <CColumn hover left>
                        <Text
                          style={{
                            fontSize: '1rem',
                            color: `${yearlyTotal.yearlySalesTotal > yearlyTotal.yearlyDepositTotal ? '#e74c3c' : null }`,
                          }}
                        >
                          총 미수금 : {
                            yearlyTotal.yearlyDepositTotal > yearlyTotal.yearlySalesTotal ? '없음' :
                            toCurrency(Math.abs(yearlyTotal.yearlySalesTotal - yearlyTotal.yearlyDepositTotal))}원
                        </Text>
                      </CColumn>
                    </CRow>
                  </TabPane>
                );
              })
            }
          </Tabs>
      </Card>
    );
  }
}
