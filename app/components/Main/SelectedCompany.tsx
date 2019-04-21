import * as React from 'react';
import { inject, observer } from "mobx-react";
import { DataIoStore } from "../../stores";
import { CRow, CColumn } from "../../styled/styledComponents";
import { Card, Typography, Tabs, Table } from 'antd';
import { Sales, Deposit } from '../../entity';

// import SelectedSales from './SelectedSales';
// import SlectedDeposit from './SlectedDeposit';

const { Text } = Typography;
const TabPane = Tabs.TabPane;

const styles = {
  cardHeader: {
    paddingLeft: "1rem",
  },
}

interface Props {}
interface State {}

@inject("dataIoStore")
@observer
export default class SelectedCompany extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const comapnyList = dataIoStore.companyList;
    const selectedComapnyId = dataIoStore.selectedComapnyId;
    const selectedCompany = comapnyList.find((item) => item.id === selectedComapnyId);

    return (
      <Card
        title="거래 입금 내역서(업체별)"
        bordered={true}
        headStyle={styles.cardHeader}
      >
        { selectedComapnyId > 0 ? (
          <>
            <CRow style={{marginTop: '1rem'}}>
              <CColumn>
                <Text>통장: {selectedCompany && selectedCompany.accountNumber}</Text>
              </CColumn>
              <CColumn>
                <Text>입금: {selectedCompany && selectedCompany.depositDate}</Text>
              </CColumn>
              <CColumn>
                <Text>연락처: {selectedCompany && selectedCompany.phone}</Text>
              </CColumn>
              <CColumn>
                <Text>거래처: {selectedCompany && selectedCompany.companyName}</Text>
              </CColumn>
            </CRow>

            <div>
              <Tabs defaultActiveKey="1" animated={false} style={{flex: 1}}>
                <TabPane tab="거래총액" key="1">
                  <div>
                  <Table
                    size="small"
                    pagination={false}
                    columns={[
                      { align: 'center' as 'center', dataIndex: "date", title: "발행일" },
                      { align: 'center' as 'center', dataIndex: "supplyAmount", title: "공급액" },
                      { align: 'center' as 'center', dataIndex: "taxAmount", title: "세액" },
                      { align: 'center' as 'center', dataIndex: "totalAmount", title: "총액" },
                    ]}
                    dataSource={selectedCompany && (selectedCompany.salesList || []).map((item: Sales) => {
                      return {
                        date: `${item.year}년 ${item.month}월 ${item.day}일`,
                        supplyAmount: item.supplyAmount,
                        taxAmount: item.taxAmount,
                        TotalAmount: item.totalAmount,
                      }
                    })}
                  />
                  </div>
                </TabPane>
                <TabPane tab="입금총액" key="2">
                  <div>
                    <Table
                      size="small"
                      pagination={false}
                      columns={[
                        { align: 'center' as 'center', dataIndex: "date", title: "입금일" },
                        { align: 'center' as 'center', dataIndex: "originMonth", title: "월분" },
                        { align: 'center' as 'center', dataIndex: "depositAmount", title: "입금액" },
                        { align: 'center' as 'center', dataIndex: "balanceAmount", title: "잔액" },
                      ]}
                      dataSource={selectedCompany && (selectedCompany.depositList || []).map((item: Deposit) => {
                        return {
                          date: `${item.year}년 ${item.month}월 ${item.day}일`,
                          originMonth: item.originMonth,
                          depositAmount: item.depositAmount,
                          balanceAmount: item.balanceAmount,
                        }
                      })}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </div>

            <CRow style={{marginTop: '1rem'}}>
              <CColumn>
                <Text>거래 총액:000</Text>
              </CColumn>
              <CColumn>
                <Text>입금 총액:000</Text>
              </CColumn>
            </CRow>
            <CRow style={{marginTop: '1rem'}}>
              <CColumn>
                <Text>미수금 총액:000</Text>
              </CColumn>
            </CRow>
          </>
        ) : (
          <CRow>
            <CColumn>
              <Text>선택된 회사가 없습니다. 회사를 선택해 주세요.</Text>
            </CColumn>
          </CRow>
        )}
      </Card>
    );
  }
}
