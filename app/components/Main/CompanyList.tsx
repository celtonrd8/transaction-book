import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { DataIoStore } from '../../stores';
import { Card, Table, Icon, Input, Button, Tooltip, Modal, Typography } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination'
import Highlighter from 'react-highlight-words';
import { Company } from '../../entity';
import CompanyDialog from './Dialogs/CompanyDialog';
// import './CompanyList.scss';

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
  isModify: boolean;
  modifyData: Company;
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
      isModify: false,
      modifyData: null,
    }
  }

  componentDidMount() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const pagination = { ...this.state.pagination };
    pagination.total = dataIoStore.totalCount;
    pagination.showSizeChanger = true;
    pagination.pageSize = 25;
    pagination.pageSizeOptions = ['25', '50', '100'];
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

  deleteCompanyConfirm = (record: Company) => {
    console.log(record);
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    confirm({
      title: '업체 삭제',
      content: '등록된 업체가 삭제 됩니다?',
      onOk() {
        return new Promise((resolve, reject) => {
          dataIoStore
            .queryDeleteCompany(record.id)
            .then(() => {
              dataIoStore
                .queryCompanyByPage()
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

  modifyData = (record: Company) => {
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

  render() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const companyList = dataIoStore.companyList;
    const { pagination, isCompanyDialog, isModify, modifyData } = this.state;

    const columns = [{
      align: 'center' as 'center',
      dataIndex: 'companyName',
      key: 'companyName',
      title: '업체명',
      ...this.getColumnSearchProps('companyName'),
      render: (text: string, record: Company) => (
        <div className="clCompanyLink" onClick={() => this.selectCompany(record)}>
          {text}
        </div>
      )
    }, {
      align: 'center' as 'center',
      dataIndex: 'transactionState',
      key: 'transactionState',
      title: '거래상태',
      render: text => {
        if (text === 'ON') return (<Text>거래중</Text>)
        else if (text === 'OFF') return (<Text style={{color: '#EA2027'}}>거래중지(미반영)</Text>)
        else if (text === 'PAUSE') return (<Text style={{color: '#D980FA'}}>거래중지(반영)</Text>)
        else return ''
      },
    },
    { align: 'center' as 'center', dataIndex: 'phone', title: '연락처', key: 'phone' },
    { align: 'center' as 'center', dataIndex: 'accountNumber', title: '계정번호', key: 'accountNumber'},
    { align: 'center' as 'center', dataIndex: 'depositDate', title: '입금일', key: 'depositDate' },
    {
      align: 'center' as 'center',
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
      align: 'center' as 'center',
      title: '관리',
      key: 'operation',
      render: (record: Company) => (
        <span>
          <Button ghost size='small' type='primary' onClick={() => this.modifyData(record)}>
            수정
          </Button>
          <Button ghost size='small' type='danger' style={{ marginLeft: '0.5rem' }} onClick={() => this.deleteCompanyConfirm(record)}>
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
              <Tooltip placement='bottomLeft' title='엑셀파일 출력'>
                <Button
                  type='primary'
                  shape='circle'
                  icon='download'
                  size={'default'}
                  style={{marginLeft: '.5rem'}}
                />
              </Tooltip>
            </div>
          }
        >
          <Table
            size='middle'
            rowKey={record => record.key}
            columns={columns}
            dataSource={companyList}
            pagination={pagination}
            scroll={{y: 680}}
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
      </>
    );
  }
}

export default CompanyList;

