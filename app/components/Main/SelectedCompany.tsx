import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { DataIoStore } from '../../stores';
import { Card, Typography, Tabs, Table, Button, Tooltip } from 'antd';
import { Sales, Deposit } from '../../entity';
import { toCurrency } from '../../utils';
import { CRow, CColumn } from '../../styled';
// import SelectedSales from './SelectedSales';
// import SlectedDeposit from './SlectedDeposit';

const { Text } = Typography;
const TabPane = Tabs.TabPane;

const cardHeaderSt: React.CSSProperties = {
  padding: 0,
  paddingLeft: '1rem',
}

interface Props {
}

interface State {
}

@inject('dataIoStore')
@observer
class SelectedCompany extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  componentDidMount () {
  }

  addItem = () => {
  }

  getSelectedCompanyData = () => {
    console.log('getSelectedCompanyData');
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const comapnyList = dataIoStore.companyList;
    const selectedComapnyId = dataIoStore.selectedComapnyId;
    let sumAllSales = 0;
    let sumAllDeposit = 0;

    const selectedCompany = comapnyList.find((item) => item.id === selectedComapnyId);

    selectedCompany && (selectedCompany.salesList || []).map((item: Sales) => {
      sumAllSales += item.totalAmount;
    });

    selectedCompany && (selectedCompany.depositList || []).map((item: Deposit) => {
      sumAllDeposit += item.balanceAmount;
    });
    return {
      selectedCompany: selectedCompany,
      selectedCompanyId: selectedComapnyId,
      sumAllSales: sumAllSales,
      sumAllDeposit: sumAllDeposit,
    }
  }

  render() {
    const { selectedCompany, selectedCompanyId, sumAllSales, sumAllDeposit } = this.getSelectedCompanyData();

    return (
      <>
        <Card
          title='거래 입금 내역서(업체별)'
          bordered={true}
          headStyle={cardHeaderSt}
          extra={
            <div className='cardHeaderExtra'>
              <Tooltip placement='bottomLeft' title='거래/입금액 추가'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='plus'
                  size='default'
                  onClick={this.addItem}
                />
              </Tooltip>
              <Tooltip placement='bottomLeft' title='엑셀파일 출력'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='download'
                  size='default'
                  style={{marginLeft: '.5rem'}}
                />
              </Tooltip>
            </div>
          }
        >
          { selectedCompanyId > 0 ? (
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
                <Tabs defaultActiveKey='1' animated={false} style={{flex: 1}}>
                  <TabPane tab='거래총액' key='1'>
                    <div>
                    <Table
                      size='small'
                      rowKey='salesKey'
                      pagination={false}
                      columns={[
                        { align: 'center' as 'center', dataIndex: 'date', title: '발행일' },
                        { align: 'center' as 'center', dataIndex: 'supplyAmount', title: '공급액' },
                        { align: 'center' as 'center', dataIndex: 'taxAmount', title: '세액' },
                        { align: 'center' as 'center', dataIndex: 'totalAmount', title: '총액' },
                      ]}
                      dataSource={selectedCompany && (selectedCompany.salesList || []).map((item: Sales) => {
                        console.log(item);
                        return {
                          date: `${item.year}년 ${item.month}월 ${item.day}일`,
                          supplyAmount: `${toCurrency(item.supplyAmount)}원`,
                          taxAmount: `${toCurrency(item.taxAmount)}원`,
                          totalAmount: `${toCurrency(item.totalAmount)}원`,
                        }
                      })}
                    />
                    </div>
                  </TabPane>
                  <TabPane tab='입금총액' key='2'>
                    <div>
                      <Table
                        size='small'
                        rowKey='depositKey'
                        pagination={false}
                        columns={[
                          { align: 'center' as 'center', dataIndex: 'date', title: '입금일' },
                          { align: 'center' as 'center', dataIndex: 'originMonth', title: '월분' },
                          { align: 'center' as 'center', dataIndex: 'depositAmount', title: '입금액' },
                          { align: 'center' as 'center', dataIndex: 'balanceAmount', title: '잔액' },
                        ]}
                        dataSource={selectedCompany && (selectedCompany.depositList || []).map((item: Deposit) => {
                          return {
                            date: `${item.year}년 ${item.month}월 ${item.day}일`,
                            originMonth: item.originMonth,
                            depositAmount: `${toCurrency(item.depositAmount)}원`,
                            balanceAmount: `${toCurrency(item.balanceAmount)}원`,
                          }
                        })}
                      />
                    </div>
                  </TabPane>
                </Tabs>
              </div>

              <CRow left style={{marginTop: '2rem'}}>
                <CColumn hover left>
                  <Text strong>거래 총액: {toCurrency(sumAllSales)}원</Text>
                </CColumn>
                <CColumn hover left>
                  <Text strong>입금 총액: {toCurrency(sumAllDeposit)}원</Text>
                </CColumn>
              </CRow>
              <CRow left hover style={{marginTop: '1rem'}}>
                <CColumn hober left>
                  <Text strong>미수금 총액: {toCurrency(sumAllDeposit - sumAllSales)}원</Text>
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
      </>
    );
  }
}

export default SelectedCompany;
