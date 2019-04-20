import * as React from 'react';
import { Modal, Button } from 'antd';

interface Props {
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
  render() {
    const { title, visible, addCompany, close } = this.props;
    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={() => close() }
        footer={[
          <Button
            key="back"
            onClick={() => close()}
          >
              취소
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => addCompany()}
          >
            추가
          </Button>,
        ]}
      >
        <p>폼내용</p>
      </Modal>
    );
  }
}

export default AddCompanyDialog;
