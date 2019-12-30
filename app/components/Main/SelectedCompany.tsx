import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { DataIoStore } from '../../stores';
import { qDeleteDepositAmount, qDeleteSalesAmount } from '../../stores/quries';
import { Card, Typography, Tabs, Table, Button, Tooltip, Modal } from 'antd';
import { Sales, Deposit } from '../../entity';
import { toCurrency } from '../../utils';
import { CRow, CColumn } from '../../styled';
import SalesDialog from './Dialogs/SalesDialog';
import DepositDialog from './Dialogs/DepositDialog';

const { Text } = Typography;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const cardHeaderSt: React.CSSProperties = {
  padding: '0 1rem 0 1rem',
}

interface Props {
}

interface State {
  isDepositDialog: boolean;
  isSalesDialog: boolean;
  salesModifyId: number;
  isSalesModify: boolean;
  depositModifyId: number;
  isDepositModify: boolean;
}

@inject('dataIoStore')
@observer
class SelectedCompany extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isSalesDialog: false,
      isDepositDialog: false,
      salesModifyId: null,
      isSalesModify: false,
      depositModifyId: null,
      isDepositModify: false,
    }
  }

  componentDidMount () { }

  openSalesDialog = () => { this.setState({ isSalesDialog: true, isSalesModify: false }) }
  closeSalesDialog = () => { this.setState({ isSalesDialog: false, isSalesModify: false }) }
  openDepositDialog = () => { this.setState({ isDepositDialog: true, isSalesModify: false }) }
  closeDepositDialog = () => { this.setState({ isDepositDialog: false, isDepositModify: false })}

  getSelectedCompanyData = () => {
    // console.log('getSelectedCompanyData');
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    // const comapnyList = dataIoStore.companyList;
    const comapnyList = dataIoStore.getCurrentCompanyList();
    const selectedComapnyId = dataIoStore.selectedComapnyId;
    let sumAllSales = 0;
    let sumAllDeposit = 0;

    const selectedCompany = comapnyList.find((item) => item.id === selectedComapnyId);

    selectedCompany && (selectedCompany.salesList || []).map((item: Sales) => {
      sumAllSales += item.totalAmount;
    });

    selectedCompany && (selectedCompany.depositList || []).map((item: Deposit) => {
      sumAllDeposit += item.depositAmount;
    });
    return {
      selectedCompany: selectedCompany,
      selectedCompanyId: selectedComapnyId,
      sumAllSales: sumAllSales,
      sumAllDeposit: sumAllDeposit,
    }
  }

  setSalesModifyData = (id: number) => {
    this.setState({ salesModifyId: id, isSalesModify: true, isSalesDialog: true });
  }

  setDepositModifyData = (id: number) => {
    this.setState({ depositModifyId: id, isDepositModify: true, isDepositDialog: true });
  }

  deleteSalesConfirm = (record: Sales) => {
    // console.log(record);
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    confirm({
      title: '거래액 삭제',
      content: '등록된 거래액이 삭제 됩니다?',
      onOk() {
        return new Promise((resolve, reject) => {
          qDeleteSalesAmount(record.id)
            .then(() => {
              dataIoStore.globalUpdate()
                .then()
                .catch(err => console.log(err.message));
              resolve();
            })
            .catch(() => reject());
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  deleteDepositConfirm = (record: Deposit) => {
    // console.log(record);
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    confirm({
      title: '입금액 삭제',
      content: '등록된 입금액이 삭제 됩니다?',
      onOk() {
        return new Promise((resolve, reject) => {
          qDeleteDepositAmount(record.id)
            .then(() => {
              dataIoStore.globalUpdate()
                .then()
                .catch(err => console.log(err.message));
              resolve();
            })
            .catch(() => reject());
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  render() {
    const { selectedCompany, selectedCompanyId, sumAllSales, sumAllDeposit } = this.getSelectedCompanyData();
    const { isSalesDialog, isDepositDialog, salesModifyId, depositModifyId, isSalesModify, isDepositModify } = this.state;

    return (
      <>
        <Card
          title='거래 입금 내역서(업체별)'
          bordered={true}
          headStyle={cardHeaderSt}
          // className="scHeight"
          extra={
            <div className='cardHeaderExtra'>
              <Tooltip placement='bottomLeft' title='거래액 추가'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='rise'
                  size='default'
                  disabled={selectedCompanyId > 0 ? false : true }
                  onClick={this.openSalesDialog}
                />
              </Tooltip>
              <Tooltip placement='bottomLeft' title='입금액 추가'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='credit-card'
                  size='default'
                  disabled={selectedCompanyId > 0 ? false : true }
                  onClick={this.openDepositDialog}
                  style={{marginLeft: '.5rem'}} />
              </Tooltip>
              {/* <Tooltip placement='bottomLeft' title='엑셀파일 출력'>
                <Button type='primary' shape='circle' icon='download' size='default' style={{marginLeft: '.5rem'}} />
              </Tooltip> */}
            </div>
          }
        >
          { selectedCompanyId > 0 ? (
            <>
              <CRow style={{paddingBottom: '1rem', borderBottom: '1px solid #1890ff'}}>
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

              <Tabs defaultActiveKey='1' animated={false} style={{flex: 1}}>
                <TabPane tab='거래총액' key='1'>
                  <Table
                    size='small'
                    rowKey={record => record.key}
                    pagination={false}
                    scroll={{y: 'calc(100vh - 840px)'}}
                    style={{height: 'calc(100vh - 800px)'}}
                    columns={[
                      { width: '25%', dataIndex: 'date', title: '발행일', key: 'date' },
                      { width: '20%', dataIndex: 'supplyAmount', title: '공급액', key: 'supplyAmount' },
                      { width: '20%', dataIndex: 'taxAmount', title: '세액', key: 'taxAmount' },
                      { width: '20%', dataIndex: 'totalAmount', title: '총액', key: 'totalAmount' },
                      { title: '관리',
                        key: 'operation',
                        render: (record: Sales) => (
                          <span>
                            <Button
                              ghost
                              size='small'
                              type='primary'
                              shape='circle'
                              icon='edit'
                              onClick={() => this.setSalesModifyData(record.id)}
                            />
                            <Button
                              ghost size='small'
                              type='danger'
                              shape='circle'
                              icon='delete'
                              onClick={() => this.deleteSalesConfirm(record)}
                              style={{ marginLeft: '0.5rem' }}
                            />
                          </span>
                        )
                      }
                    ]}
                    dataSource={selectedCompany && (selectedCompany.salesList || []).map((item: Sales) => {
                      // console.log(item);
                      return {
                        key: `${item.id}`,
                        id: item.id,
                        date: `${item.year}년 ${item.month}월 ${item.day}일`,
                        supplyAmount: `${toCurrency(item.supplyAmount)}원`,
                        taxAmount: `${toCurrency(item.taxAmount)}원`,
                        totalAmount: `${toCurrency(item.totalAmount)}원`,
                      }
                    })}
                  />
                </TabPane>
                <TabPane tab='입금총액' key='2'>
                  <Table
                    size='small'
                    rowKey={record => record.key}
                    pagination={false}
                    scroll={{y: 'calc(100vh - 840px)'}}
                    style={{height: 'calc(100vh - 800px)'}}
                    columns={[
                      { width: '25%', dataIndex: 'date', title: '입금일', key: 'date' },
                      { width: '20%', dataIndex: 'originMonth', title: '월분', key: 'originMonth' },
                      { width: '20%', dataIndex: 'depositAmount', title: '입금액', key: 'depositAmount' },
                      // { align: 'center' as 'center', dataIndex: 'balanceAmount', title: '잔액', key: 'balanceAmount' },
                      { title: '관리',
                        key: 'operation',
                        render: (record: Deposit) => (
                          <span>
                            <Button
                              ghost
                              size='small'
                              type='primary'
                              shape='circle'
                              icon='edit'
                              onClick={() => this.setDepositModifyData(record.id)}
                            />
                            <Button
                              ghost size='small'
                              type='danger'
                              shape='circle'
                              icon='delete'
                              onClick={() => this.deleteDepositConfirm(record)}
                              style={{ marginLeft: '0.5rem' }}
                            />
                          </span>
                        )
                      }
                    ]}
                    dataSource={selectedCompany && (selectedCompany.depositList || []).map((item: Deposit) => {
                      return {
                        key: `${item.id}`,
                        id: item.id,
                        date: `${item.year}년 ${item.month}월 ${item.day}일`,
                        originMonth: `${item.originYear}년 ${item.originMonth}월`,
                        depositAmount: `${toCurrency(item.depositAmount)}원`,
                        // balanceAmount: `${toCurrency(item.balanceAmount)}원`,
                      }
                    })}
                  />
                </TabPane>
              </Tabs>

              <CRow left style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dotted #b2bec3'}}>
                <CColumn hover left>
                  <Text style={{fontSize: '1rem', color: '#2980b9'}}>거래 총액 : {toCurrency(sumAllSales)}원</Text>
                </CColumn>
                <CColumn hover left>
                  <Text style={{fontSize: '1rem', color: '#2980b9'}}>입금 총액 : {toCurrency(sumAllDeposit)}원</Text>
                </CColumn>
              </CRow>
              <CRow left hover style={{marginTop: '1rem'}}>
                <CColumn hover left>
                  <Text
                    style={{
                      fontSize: '1rem',
                      color: `${sumAllSales > sumAllDeposit ? '#e74c3c' : null }`
                    }}
                  >
                      미수금(잔액) 총액 : {sumAllDeposit >= sumAllSales ? '없음' : `${toCurrency(Math.abs(sumAllSales - sumAllDeposit))}원`}
                  </Text>
                </CColumn>
              </CRow>
            </>
          ) : (
            <div className="scHeight">
              <CRow>
                <CColumn>
                  <Text>선택된 회사가 없습니다. 회사를 선택해 주세요.</Text>
                </CColumn>
              </CRow>
            </div>
          )}
        </Card>
        { isSalesDialog &&
          <SalesDialog
            title="거래액 추가"
            visible={isSalesDialog}
            close={this.closeSalesDialog}
            isModify={isSalesModify}
            modifyDataId={salesModifyId}
          />
        }
        { isDepositDialog &&
          <DepositDialog
            title="입금액 추가"
            visible={isDepositDialog}
            close={this.closeDepositDialog}
            isModify={isDepositModify}
            modifyDataId={depositModifyId}
          />
        }
      </>
    );
  }
}

export default SelectedCompany;
