import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { DataIoStore } from '../../stores';
import { qDeleteCompany } from '../../stores/quries';
import { toEachCompanySales } from '../../stores/logics';
import { Card, Table, Icon, Input, Button, Tooltip, Modal, Typography } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination'
import Highlighter from 'react-highlight-words';
import { Company } from '../../entity';
import CompanyDialog from './Dialogs/CompanyDialog';
import ToAllCompanyDialog from './Dialogs/ToAllCompanyDialog';

const { Text } = Typography;
const confirm = Modal.confirm;

const cardHeaderSt: React.CSSProperties = {
  padding: 0,
  paddingLeft: '1rem',
}

interface Props {

}

interface State {
  searchText: string;
  pagination: PaginationConfig;
  isCompanyDialog: boolean;
  isToAllCompanyDialog: boolean;
  isModify: boolean;
  modifyData: Company;
  selectedRowKeys: string[];
 }

@inject('dataIoStore')
@observer
class CompanyList extends React.Component<Props, State> {

  private searchInput: Input;

  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      pagination: {},
      isCompanyDialog: false,
      isToAllCompanyDialog: false,
      isModify: false,
      modifyData: null,
      selectedRowKeys: [],
    }
  }

  componentDidMount() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const pagination = { ...this.state.pagination };
    pagination.total = dataIoStore.totalCount;
    pagination.showSizeChanger = true;
    pagination.pageSize = 100;
    pagination.pageSizeOptions = ['50', '100', '150', '200', '300'];
    pagination.style = {marginRight: '1.5rem' };
    this.setState({pagination: pagination});
  }

  getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { this.searchInput = node; }}
          placeholder={`입력하기`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type='primary'
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon='search'
          size='small'
          style={{ width: 90, marginRight: 8 }}
        >
          검색하기
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size='small'
          style={{ width: 90 }}
        >
          되돌리기
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => <Icon type='search' style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: string, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text: string) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })

  handleSearch = (selectedKeys: string[], confirm: Function) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters: Function) => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  openCompanyDialog = () => { this.setState({isCompanyDialog: true}) };
  closeCompanyDialog = () => { this.setState({isCompanyDialog: false, isModify: false}) };
  openToAllCompanyDialog = () => { this.setState({isToAllCompanyDialog: true}) };
  closeToAllCompanyDialog = () => { this.setState({isToAllCompanyDialog: false}) };

  deleteCompanyConfirm = (record: Company) => {
    // console.log(record);
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    confirm({
      title: '업체 삭제',
      content: '등록된 업체가 삭제 됩니다?',
      onOk() {
        return new Promise((resolve, reject) => {
          qDeleteCompany(record.id)
          .then(() => {
            dataIoStore
              .globalUpdate()
              .then()
              .catch(err => {throw err});
            resolve();
          })
          .catch(() => reject());
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    })
  }

  setModifyData = (record: Company) => {
    this.setState({
      modifyData: {...record},
      isModify: true,
    }, () => {
      this.openCompanyDialog();
    });
  }

  selectCompany = (record: Company) => {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    dataIoStore.setSelectedComapnyId(record.id);
  }


  getSelectedCompanySales = () => {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const currentCompany = dataIoStore.getCurrentCompanyList();
    const selected = currentCompany.filter(company => this.state.selectedRowKeys.includes(`${company.id}`));
    toEachCompanySales(selected).then();
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // console.log(selectedRowKeys);
      // console.log(toJS(selectedRows));
      this.setState({ selectedRowKeys: selectedRowKeys });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  render() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    // const companyList = dataIoStore.companyList;
    const companyList = dataIoStore.getCurrentCompanyList();
    const { pagination, isCompanyDialog, isToAllCompanyDialog, isModify, modifyData, selectedRowKeys } = this.state;

    let columns = [
    { width: '5%', dataIndex: 'order', title: '번호', key: 'order' },
    {
      width: '15%',
      dataIndex: 'companyName',
      key: 'companyName',
      title: '업체명',
      ...this.getColumnSearchProps('companyName'),
      render: (text: string, record: Company) => {
        const salesTotal = record.salesList.map(item => item.totalAmount).reduce((acc, val) => { return acc + val; }, 0);
        const depositTotal = record.depositList.map(item => item.depositAmount).reduce((acc, val) => { return acc + val; }, 0);
        const amount = salesTotal - depositTotal;

        return (        
          <div className="clCompanyLink" onClick={() => this.selectCompany(record)}>
            <Text style={{color: amount >= 0 ? "#45aaf2" : "#fc5c65"}}>{text}</Text>
          </div>
      )}
    }, {
      width: '12%',
      dataIndex: 'transactionState',
      key: 'transactionState',
      title: '거래상태',
      render: text => {
        if (text === 'ON') return (<Text>거래중</Text>)
        else if (text === 'OFF') return (<Text style={{color: '#EA2027'}}>거래중지(미반영)</Text>);
        else if (text === 'PAUSE') return (<Text style={{color: '#D980FA'}}>거래중지(반영)</Text>);
        else return '';
      },
    },
    { width: '14%', dataIndex: 'phone', title: '연락처', key: 'phone' },
    { width: '10%', dataIndex: 'accountNumber', title: '계정번호', key: 'accountNumber'},
    { width: '13%', dataIndex: 'depositDate', title: '입금(예정)일', key: 'depositDate' },
    {
      dataIndex: 'memo',
      key: 'memo',
      title: '메모',
      render: (text: string) => (
        <Tooltip placement='topLeft' title={text}>
          <Text>
            {text.length > 6 ? `${text.substring(0, 6)}..` : text}
            { (text.length > 0) &&
              <Icon type='zoom-in' style={{marginLeft: '.5rem'}} />
            }
          </Text>
        </Tooltip>
      )
    }, {
      title: '관리',
      key: 'operation',
      render: (record: Company) => (
        <span>
          <Button
            ghost
            size='small'
            type='primary'
            onClick={() => this.setModifyData(record)}
          >
            수정
          </Button>
          <Button
            ghost
            size='small'
            type='danger'
            style={{ marginLeft: '0.5rem' }}
            onClick={() => this.deleteCompanyConfirm(record)}
          >
            삭제
          </Button>
        </span>
      )
    }];

    return (
      <>
        <Card
          title='업체 목록'
          bordered={true}
          headStyle={cardHeaderSt}
          extra={
            <div className="clCardHeaderExtra">
              <Tooltip placement='bottomLeft' title='업체 추가'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='plus'
                  size={'default'}
                  onClick={this.openCompanyDialog}
                />
              </Tooltip>
              <Tooltip placement='bottomLeft' title='엑셀 파일저장(모든업체 월별 운송료)'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='file-excel'
                  size={'default'}
                  style={{marginLeft: '.5rem'}}
                  onClick={this.openToAllCompanyDialog}
                  // onClick={this.createCompanyExcelFile}
                />
              </Tooltip>
              <Tooltip placement='bottomLeft' title='엑셀 파일저장(외상매출 현황)'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='line-chart'
                  size={'default'}
                  style={{marginLeft: '.5rem'}}
                  disabled={selectedRowKeys.length === 0}
                  onClick={this.getSelectedCompanySales}
                  // onClick={this.openToAllCompanyDialog}
                  // onClick={this.createCompanyExcelFile}
                />
            </Tooltip>
            </div>
          }
        >
          <Table
            size='middle'
            rowKey={record => record.key}
            rowSelection={this.rowSelection}
            columns={columns}
            dataSource={companyList.map((company: Company, order: number) => {
              return {
                ...company,
                order: `${order+1}`
              }
            })}
            pagination={pagination}
            scroll={{y: 'calc(100vh - 300px)'}}
            style={{height: 'calc(100vh - 200px)'}}
          />
        </Card>

        { isCompanyDialog &&
          <CompanyDialog
            title={isModify ? '업체 수정' : '업체 추가'}
            visible={isCompanyDialog}
            close={this.closeCompanyDialog}
            isModify={isModify}
            modifyData={isModify ? modifyData : null}
          />
        }

        { isToAllCompanyDialog &&
          <ToAllCompanyDialog
            title={'엑셀파일 저장 (모든업체 월별 운송료)'}
            visible={isToAllCompanyDialog}
            close={this.closeToAllCompanyDialog}
          />
        }
      </>
    );
  }
}

export default CompanyList;

