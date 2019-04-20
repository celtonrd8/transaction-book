import * as React from "react";
import { inject, observer } from "mobx-react";
import { DataIoStore } from "../../stores";

import CompanyList from "./CompanyList";
import SelectedCompany from "./SelectedCompany";
import TotalAmount from "./TotalAmount";
import { MainLayout, LeftSideLayout, RightSideLayout } from "../../styled/styledComponents";

type Props = { }
type State = { }

@inject("dataIoStore")
@observer
export default class Main extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      CompanyList: [],
    }
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData = () => {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    dataIoStore
      .queryCompanyByPage()
      .then(data => dataIoStore.updateCompanyList(data))
      .catch(err => console.log(err.message));
  }

  render() {
    return (
      <MainLayout>
        <LeftSideLayout>
          <CompanyList onReload={this.reloadData} />
        </LeftSideLayout>

        <RightSideLayout>
          <SelectedCompany />
          <TotalAmount />
        </RightSideLayout>

      </MainLayout>
    );
  }
}
