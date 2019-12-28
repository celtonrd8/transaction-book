import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, DatePicker, Button, Row, Col } from 'antd';
// import { FormComponentProps } from 'antd/lib/form/Form';
import { DataIoStore } from '../../../stores';
// import { Company } from '../../../entity';
// import { qModifyCompany, qAddComapny } from '../../../stores/quries';
import { qGetMinDate } from '../../../stores/quries';
import { toAllCompany } from '../../../stores/logics';
import * as moment from 'moment';

const { MonthPicker } = DatePicker;

interface Props {
  title: string;
  visible: boolean;
  close: Function;
}

interface State {
  minDate: moment.Moment;
  selectedYear: number;
  selectedMonth: number;
}

@inject('dataIoStore')
@observer
class ToAllCompanyDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      minDate: null,
      selectedYear: 0,
      selectedMonth: 0,
    };
  }

  componentDidMount() {

    qGetMinDate().then((minDate) => {
      // console.log(moment(`${minDate.year}-${minDate.month}-01`));
      this.setState({minDate: moment(`${minDate.year}-${minDate.month}-01`)}, () => {
        // console.log(this.state.minDate);
      });
    });
  }

  disabledDate = (current) => {
    return current && this.state.minDate >= current;
  }

  onChangeDate = (date, dateString) => {
    // console.log(date);
    // console.log(dateString);
    const sep = dateString.split('-');
    if (Array.isArray(sep) && sep.length === 2) {
      this.setState({
        selectedYear: parseInt(sep[0]),
        selectedMonth: parseInt(sep[1]),
      });
    }
  }

  createCompanyExcelFile = () => {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const { selectedYear, selectedMonth } = this.state;
    const currentCompanyList = dataIoStore.getCurrentCompanyList();
    toAllCompany(currentCompanyList, selectedYear, selectedMonth)
      .then(() => {
        const { close } = this.props;
        close();
      });
  }
  render() {
    const { title, visible, close } = this.props;
    const { selectedYear, selectedMonth } = this.state;

    return (
      <>
        <Modal
          title={title}
          visible={visible}
          onCancel={() => close() }
          maskClosable={false}
          footer={[null, null]}
        >
          <div>
            <Row>
              <Col span={16}>
                <MonthPicker
                  placeholder="날짜 선택"
                  disabledDate={this.disabledDate}
                  onChange={this.onChangeDate}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={2}/>
              <Col span={6}>
                <Button
                  block
                  type='primary'
                  size={'default'}
                  onClick={this.createCompanyExcelFile}
                  disabled={(selectedYear === 0) || (selectedMonth === 0)}
                >
                  파일저장
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default ToAllCompanyDialog;
