import * as React from 'react';
import CompanyList from './CompanyList';
import SelectedCompany from './SelectedCompany';
import TotalAmount from './TotalAmount';

import { MainLayout, CampanyLayout, TotalAmoutLayout } from '../../styled/styledComponents';

export default class Main extends React.Component<{}, {}> {

  render() {
    return (
      <MainLayout>
        <CampanyLayout>
          <CompanyList />
          <SelectedCompany />
        </CampanyLayout>
        <TotalAmoutLayout>
          <TotalAmount />
        </TotalAmoutLayout>

      </MainLayout>
    );
  }
}
