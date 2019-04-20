import * as React from 'react';
import { inject, observer } from "mobx-react";
import { DataIoStore } from "../../stores";

import { Card, Table, Icon, Input, Button, Tooltip } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination'
import Highlighter from 'react-highlight-words';

import { ScrollableCardContent } from '../../styled/styledComponents';
// import { Company } from 'app/entity';

const style = {
  cardHeader: {
    padding: 0,
  },
  table: {
    marginLeft: '-3rem',
    marginTop: '-2rem',
    marginRight: '1rem'
  },
}

 interface Props {
  onReload: Function;
}

interface State {
  searchText: string;
  loading: boolean;
  pagination: PaginationConfig;
 }

@inject("dataIoStore")
@observer
class CompanyList extends React.Component<Props, State> {

  private searchInput: Input;

  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      loading: false,
      pagination: {},
    }
  }

  componentDidMount() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;

    const pagination = { ...this.state.pagination };
    pagination.total = dataIoStore.getTotalCount();
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
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          검색하기
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          되돌리기
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
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

  handleTableChange = (pagination, filters, sorter) => {
    // const pager = { ...this.state.pagination };
    // pager.current = pagination.current;
    // pager.total = dataIoStore.getTotalCount();
    // this.setState({ pagination: pager });

    // console.log(pagination);
    // console.log(filters);
    // console.log(sorter);
  }

  reload = () => {
  }

  render() {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const companyList = dataIoStore.companyList;
    const { loading, pagination } = this.state;

    const columns = [{
      align: 'center' as 'center',
      dataIndex: "companyName",
      title: "업체명",
      ...this.getColumnSearchProps('companyName'),
    }, {
      align: 'center' as 'center',
      dataIndex: "transactionState",
      title: "거래상태",
      render: text => {
        if (text === 'ON') return (
          <div>거래중</div>
        )
        else if (text === "OFF") return (
          <div style={{color: "#eb2f06"}}>거래중지(미반영)</div>
          )
        else if (text === "PAUSE") return (
            <div style={{color: "#e55039"}}>거래중지(반영)</div>
        )
        else return ""
      },
    }, {
      align: 'center' as 'center',
      dataIndex: "phone",
      title: "연락처",
    }, {
      align: 'center' as 'center',
      dataIndex: "accountNumber",
      title: "계정번호",
    }, {
      align: 'center' as 'center',
      dataIndex: "depositDate",
      title: "입금일",
    }, {
      align: 'center' as 'center',
      dataIndex: "memo",
      title: "메모",
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text.length > 10 ? `${text.substring(0, 6)}...` : text}
          { (text.length > 0) &&
            <Icon type="zoom-in" style={{marginLeft: '.5rem'}} />
          }
        </Tooltip>
      )
    }, {
      align: 'center' as 'center',
      title: "관리",
      key: "operation",
      render: (record) => (
        <span>
          <Button
            ghost
            size="small"
            type="primary"
            onClick={() => console.log(record)}
          >
            수정
          </Button>
          <Button
            ghost
            size="small"
            type="danger"
            style={{ marginLeft: '0.5rem' }}
            onClick={() => console.log(record)}
          >
            삭제
          </Button>
        </span>
      )
    }];

    return (
      <>
        <Card
          title="업체 목록"
          bordered={true}
          headStyle={style.cardHeader}
          extra={
            <div className="cardHeaderExtra">
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                size={'default'}
              />
              <Button
                type="primary"
                shape="circle"
                icon="download"
                size={'default'}
                style={{marginLeft: '.5rem'}}
              />
            </div>
          }
        >
          <ScrollableCardContent>
            <Table
              size="middle"
              columns={columns}
              dataSource={companyList}
              loading={loading}
              pagination={pagination}
              onChange={this.handleTableChange}
              className="table"
            />
          </ScrollableCardContent>
        </Card>

        <style>{`
          .table {
            margin: -2rem 1rem 0 -3rem;
          }
          .cardHeaderExtra {
            margin-right: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
          }
        `}
        </style>
      </>
    );
  }
}

export default CompanyList;
