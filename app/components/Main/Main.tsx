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
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    dataIoStore.globalUpdate()
      .then()
      .catch(err => console.log(err.message));
    // dataIoStore.queryCompanyByPage().then().catch(err => console.log(err.message));
    // dataIoStore.queryGetAllYears().then().catch(err => console.log(err.message));
  }

  render() {
    return (
      <>
        <div className="mainRootLayout">
          <div className="mainLeftSideLayout">
            <CompanyList />
          </div>
          <div className="mainRightSideLayout">
            <SelectedCompany />
            <div className="mainTotalAmount">
            <TotalAmount />
            </div>
          </div>
        </div>
      </>
    );
  }
}
