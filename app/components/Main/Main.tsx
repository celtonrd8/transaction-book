import * as React from "react";
import { inject, observer } from "mobx-react";
import { DataIoStore } from "../../stores";
import CompanyList from "./CompanyList";
import SelectedCompany from "./SelectedCompany";
import TotalAmount from "./TotalAmount";

interface Props { }
interface State { }

@inject("dataIoStore")
@observer
export default class Main extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { }
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData = () => {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    dataIoStore
      .queryCompanyByPage()
      .then(data => { dataIoStore.updateCompanyList(data) })
      .catch(err => console.log(err.message));
  }

  render() {
    return (
      <>
        <div className="mainLayout">
          <div className="leftSideLayout">
            <CompanyList reload={this.reloadData} />
          </div>
          <div className="rightSideLayout">
            <SelectedCompany />

            <div className="totalAmount">
            <TotalAmount />
            </div>
          </div>
        </div>

        <style>{`
          .mainLayout {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
          }
          .leftSideLayout {
            flex: 0.65;
            padding: 0.5rem;
          }
          .rightSideLayout {
            flex: 0.35;
            padding: 0.5rem 0.5rem 0.5rem 0;
          }
          .totalAmount {
            padding-top: 0.5rem;
          }
        `}
        </style>
      </>

    );
  }
}
