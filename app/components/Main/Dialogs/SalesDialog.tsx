import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Input, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { DataIoStore } from '../../../stores';
import { Sales } from '../../../entity';
import { qUpdateSalesAmount, qAddSalesAmount, qGetSalesById } from '../../../stores/quries';
import * as  moment from 'moment';
import { ipcRenderer } from 'electron';
// import { toCurrency } from '../../../utils';
// const { TextArea } = Input;

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
class SalesDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    // const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const { form, modifyDataId, isModify } = this.props;
    if (isModify) {
      qGetSalesById(modifyDataId)
        .then((sales) => {
          form.setFieldsValue({
            pubDate: moment(`${sales.year}-${sales.month}-${sales.day}`),
            supplyAmount: sales.supplyAmount,
            // taxAmount: sales.taxAmount,
            // totalAmount: sales.totalAmount,
          });
        })
        .catch(err => console.log(err.message))
      // console.log(modifyDataId);
    }
  }

  handleSubmit = (e) => {
    // const { close, isModify, modifyData } = this.props;
    ipcRenderer.send('message', 'run handleSubmit()');
    const { close, isModify, modifyDataId } = this.props;
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    const selectedComapnyId = dataIoStore.selectedComapnyId;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const sales = new Sales();
        sales.year = +(values.pubDate.year());
        sales.month = +(values.pubDate.month() + 1);
        sales.day = +(values.pubDate.date());
        sales.supplyAmount = +(values.supplyAmount);
        sales.taxAmount = +(values.taxAmount);
        sales.totalAmount = +(values.totalAmount);

        if (isModify) {
          qUpdateSalesAmount(modifyDataId, sales)
            .then(() => {
              dataIoStore.globalUpdate()
                .then()
                .catch(err => {throw err});
              close();
            })
            .catch(err => console.log(err.message));
        } else {
          ipcRenderer.send('message', 'run !isModify');
          qAddSalesAmount(selectedComapnyId, sales)
            .then(() => {
              dataIoStore.globalUpdate()
                .then()
                .catch(err =>{throw err});
                ipcRenderer.send('message', 'success');
              close();
            })
            .catch(err =>  {
              console.log(err.message);
              ipcRenderer.send('message', `${err.message}`);

            });
        }
      }
    });
  }
  render() {
    const { title, visible, close, isModify } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
            <Form.Item label='거래일'>
              {getFieldDecorator('pubDate', {
                rules: [{ type:'object', required: true, message: '발행일 입력 필수' }]
              })(
                <DatePicker />
              )}
            </Form.Item>


            <Form.Item label='공급액'>
              {getFieldDecorator('supplyAmount', {
                rules: [{ pattern: /^[0-9]+$/,  required: true, message: '숫자만 입력 가능', whitespace: false }]
              })(<Input placeholder='공급액 입력' />)}
            </Form.Item>

            <Form.Item label='세액'>
              {getFieldDecorator('taxAmount', {
                rules: [{ pattern: /^[0-9]+$/,  required: true, message: '숫자만 입력 가능', whitespace: false }],
                initialValue:
                  getFieldValue('supplyAmount') ?
                  parseInt((getFieldValue('supplyAmount') * 0.1).toFixed(0)) : null,
              })(<Input placeholder='공급액 입력' />)}
            </Form.Item>

            <Form.Item label='총액'>
              {getFieldDecorator('totalAmount', {
                rules: [{ pattern: /^[0-9]+$/,  required: true, message: '숫자만 입력 가능', whitespace: false }],
                initialValue:
                  getFieldValue('supplyAmount') ?
                  parseInt(getFieldValue('supplyAmount')) + parseInt(getFieldValue('taxAmount')) : null,
              })(<Input placeholder='공급액 입력' />)}
            </Form.Item>

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

export default Form.create()(SalesDialog);
