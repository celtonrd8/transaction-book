import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { qGetDepositById, qUpdateDepositAmount, qAddDepositAmount } from '../../../stores/quries';
import { Deposit } from '../../../entity';
import { DataIoStore } from '../../../stores';
import * as  moment from 'moment';

const { MonthPicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

interface Props extends FormComponentProps {
  title: string;
  visible: boolean;
  close: Function;
  isModify: boolean;
  modifyDataId: number;
}

interface State { }

@inject('dataIoStore')
@observer
class DepositDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    // const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const { form, modifyDataId, isModify } = this.props;
    if (isModify) {
        qGetDepositById(modifyDataId)
        .then((deposit) => {
          form.setFieldsValue({
            depositDate: moment(`${deposit.year}-${deposit.month}-${deposit.day}`),
            originDate: moment(`${deposit.originYear}-${deposit.originMonth}`),
            depositAmount: deposit.depositAmount,
          });
        })
        .catch(err => console.log(err.message))
    }
  }

  handleSubmit = (e) => {
    const { close, isModify, modifyDataId } = this.props;
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const selectedComapnyId = dataIoStore.selectedComapnyId;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        // console.log('Received values of form: ', values);
        const deposit = new Deposit();
        deposit.year = +(values.depositDate.year());
        deposit.month = +(values.depositDate.month() + 1);
        deposit.day = +(values.depositDate.date());
        deposit.originYear = values.originDate.year();
        deposit.originMonth = values.originDate.month() + 1;
        deposit.depositAmount = +(values.depositAmount);

        if (isModify) {
            qUpdateDepositAmount(modifyDataId, deposit)
            .then(() => {
              dataIoStore.globalUpdate()
                .then()
                .catch(err => {throw err});
              close();
            })
            .catch(err => console.log(err.message));
        } else {
          qAddDepositAmount(selectedComapnyId, deposit)
          .then(() => {
            dataIoStore.globalUpdate()
              .then()
              .catch(err => console.log(err.message));
            close();
          })
          .catch(err => {throw err});
        }

      }
    });
  }
  onMonthChangeDate = (date, dateString) => {
    // console.log(date);
    // console.log(dateString);
    // const sep = dateString.split('-');
    // if (Array.isArray(sep) && sep.length === 2) {
    //     // selectedYear: parseInt(sep[0]),
    //     // selectedMonth: parseInt(sep[1]),
    // }
  }

  render() {
    const { title, visible, close, isModify } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Modal
          title={title}
          visible={visible}
          onCancel={() => close() }
          maskClosable={false}
          footer={[null, null]}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>

            <Form.Item label='입금일'>
              {getFieldDecorator('depositDate', {
                rules: [{ type:'object', required: true, message: '발행일 입력 필수', whitespace: true }]
              })(
                <DatePicker />
              )}
            </Form.Item>


            <Form.Item label='월분'>
              {getFieldDecorator('originDate', {
                rules: [{ type:'object', required: true, whitespace: true }]
              })(
                <MonthPicker
                  placeholder="날짜 선택"
                  // onChange={this.onMonthChangeDate}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>

            <Form.Item label='입금액'>
              {getFieldDecorator('depositAmount', {
                rules: [{ pattern: /^[0-9]+$/,  required: true, message: '숫자만 입력 가능', whitespace: false }]
              })(<Input placeholder='입금액 입력' />)}
            </Form.Item>

            {
            // <Form.Item label='잔액'>
            //   {getFieldDecorator('balanceAmount', {
            //     rules: [{ pattern: /^[0-9]+$/,  required: true, message: '숫자만 입력 가능', whitespace: false }]
            //   })(<Input placeholder='잔액 입력' />)}
            // </Form.Item>
            }
            <div className='acdFooter'>
              <Button htmlType='button' onClick={() => close()}>
                취소
              </Button>
              <Button htmlType='submit' type='primary' style={{marginLeft: '.5rem'}}>
                {isModify ? '수정' : '추가'}
              </Button>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(DepositDialog);
