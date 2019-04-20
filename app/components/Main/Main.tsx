import * as React from "react";
import { inject, observer } from "mobx-react";
import { DataIoStore } from "../../stores";

import CompanyList from "./CompanyList";
import SelectedCompany from "./SelectedCompany";
import TotalAmount from "./TotalAmount";

import { MainLayout, LeftSideLayout, RightSideLayout } from "../../styled/styledComponents";
import { Company } from "../../entity";

interface Props { }
interface State {
  companyList: Company[];
  totalCount: number;
}

@inject("dataIoStore")
@observer
export default class Main extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      companyList: [],
      totalCount: 0,
    }
  }

  componentDidMount() {
    this.reloadData();
  }

  reloadData = () => {
    const dataIoStore = this.props['dataIoStore'] as DataIoStore;
    dataIoStore
      .queryCompanyByPage()
      .then(data => {
        this.setState({
          companyList: data.map((item) => { return {key: item.id.toString(), ...item} }),
          totalCount: data.length,
        })
      })
      .catch(err => console.log(err.message));
  }

  render() {
    const { companyList, totalCount } = this.state;
    return (
      <MainLayout>
        <LeftSideLayout>
          <CompanyList
            onReload={this.reloadData}
            totalCount={totalCount}
            companyList={companyList}
          />
        </LeftSideLayout>

        <RightSideLayout>
          <SelectedCompany />
          <TotalAmount />
        </RightSideLayout>

      </MainLayout>
    );
  }
}
