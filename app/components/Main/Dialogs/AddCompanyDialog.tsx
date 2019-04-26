import * as React from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';

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
  addCompany: Function;
  close: Function;
}

interface State {
}
class AddCompanyDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { title, visible, close } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Modal
          title={title}
          visible={visible}
          onCancel={() => close() }
          footer={[null, null]}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="업체명">
              {getFieldDecorator("compnayName", {
                rules: [{ required: true, message: "업체명 입력 필수", whitespace: true }]
              })(<Input placeholder="업체명 입력" />)}
            </Form.Item>

            <Form.Item label="거래상태">
              { getFieldDecorator("transactionState", {
                initialValue: "ON"
              })(
                <Select>
                  <Option value="ON">거래중</Option>
                  <Option value="OFF">거래중지(반영)</Option>
                  <Option value="PAUSE">거래중지(미반영)</Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item label="연락처">
              {getFieldDecorator("phone", {
                rules: [{ required: false, message: "연락처 입력", whitespace: false }]
              })(<Input placeholder="연락처 입력" />)}
            </Form.Item>

            <Form.Item label="계정번호">
              {getFieldDecorator("accountNumber", {
                rules: [{ required: false, message: "계정번호 입력", whitespace: true }]
              })(<Input placeholder="계정번호 입력" />)}
            </Form.Item>

            <Form.Item label="입금일">
              {getFieldDecorator("depositDate", {
                rules: [{ required: false, message: "입금일 입력", whitespace: true }]
              })(<Input placeholder="입금일 입력" />)}
            </Form.Item>

            <Form.Item label="메모">
              {getFieldDecorator("memo", {
                rules: [{ required: false, message: "메모 입력", whitespace: true }]
              })(<TextArea rows={4} />)}
            </Form.Item>

            <div className="footerLayout">
              <Button htmlType="button" onClick={() => close()}>
                취소
              </Button>
              <Button htmlType="submit" type="primary" style={{marginLeft: ".5rem"}}>
                추가
              </Button>
            </div>
          </Form>
        </Modal>
        <style>{`
          .footerLayout {
            width: 100%;
            padding-right: 1rem;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
          }
        `}</style>
      </>
    );
  }
}

export default Form.create()(AddCompanyDialog);
