import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { DataIoStore } from '../../../stores';
import { Company } from '../../../entity';
import { qModifyCompany, qAddComapny } from '../../../stores/quries';

const { Option } = Select;
const { TextArea } = Input;

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
  modifyData: Company;
}

interface State { }

@inject('dataIoStore')
@observer
class CompanyDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const { form, modifyData, isModify } = this.props;
    if (isModify) {
      form.setFieldsValue({...modifyData});
    }
  }

  handleSubmit = (e) => {
    const { close, isModify, modifyData } = this.props;
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        if (isModify) {
          qModifyCompany(modifyData.id, values as Company)
            .then(() => {
              dataIoStore.globalUpdate()
                .then()
                .catch(err => {throw err});
              close();
            })
            .catch(err => console.log(err))
        } else {
          qAddComapny(values as Company)
            .then(() => {
              dataIoStore.globalUpdate()
              .then()
              .catch(err =>{throw err});
              close();
            })
            .catch(err => console.log(err));
        }
      }
    });
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
            <Form.Item label='업체명'>
              {getFieldDecorator('companyName', {
                rules: [{ required: true, message: '업체명 입력 필수', whitespace: true }]
              })(
                <Input placeholder='업체명 입력' />
              )}
            </Form.Item>

            <Form.Item label='거래상태'>
              { getFieldDecorator('transactionState', {
                initialValue: 'ON'
              })(
                <Select>
                  <Option value='ON'>거래중</Option>
                  <Option value='OFF'>거래중지(미반영)</Option>
                  <Option value='PAUSE'>거래중지(반영)</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item label='연락처'>
              {getFieldDecorator('phone', {
                rules: [{ required: false, message: '연락처 입력', whitespace: false }]
              })(<Input placeholder='연락처 입력' />)}
            </Form.Item>

            <Form.Item label='계정번호'>
              {getFieldDecorator('accountNumber', {
                rules: [{ required: false, message: '계정번호 입력', whitespace: true }]
              })(<Input placeholder='계정번호 입력' />)}
            </Form.Item>

            <Form.Item label='입금(예정)일'>
              {getFieldDecorator('depositDate', {
                rules: [{ required: false, message: '입금(예정)일 입력', whitespace: true }]
              })(<Input placeholder='입금(예정)일 입력' />)}
            </Form.Item>

            <Form.Item label='메모'>
              {getFieldDecorator('memo', {
                rules: [{ required: false, message: '메모 입력', whitespace: true }]
              })(<TextArea rows={4} />)}
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

export default Form.create()(CompanyDialog);
