import { observable, action, toJS } from 'mobx';
// import { getConnection } from "typeorm";
import { Company } from "../entity";
import {
  qGetAllCompany,
  qGetSalesAmountByYear,
  qGetDepositAmountByYear,
  qGetAllYears
} from './quries';

interface YearlyAmount {
  year: number;
  monthlySalesAmount: number[];
  monthlyDepositAmount: number[];
  yearlySalesTotal: number;
  yearlyDepositTotal: number;
}

export class DataIoStore {

  @observable
  public companyList: Company[] = [];

  @observable
  public totalCount: number = 0;

  @observable
  public selectedComapnyId: number = 0;

  @observable
  public yearlyTotalAmount: YearlyAmount[] = [];

  @action
  public updateCompanyList = (companyList: Company[]) => {
    this.totalCount = companyList.length;
    this.companyList = companyList.map((item) => {
      // console.log(item);
      return {
        key: item.id.toString(),
        ...item,
      }
    });
  }

  @action
  private _updateYearlyToalAmount = (years: string[]) => {
    this.yearlyTotalAmount = [];
    Promise.all(years.map((year, yIdx) => {
      this.yearlyTotalAmount.push({
        year: parseInt(year),
        monthlySalesAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        monthlyDepositAmount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        yearlySalesTotal: 0,
        yearlyDepositTotal: 0,
      });
      qGetSalesAmountByYear(parseInt(year))
      .then(salesList => {
        salesList.map(sales => {
          let mIdx = sales.month - 1;
          this.yearlyTotalAmount[yIdx]
            .monthlySalesAmount[mIdx] += sales.totalAmount;
        });
        let nAmount = salesList.map(sales => sales.totalAmount);
        this.yearlyTotalAmount[yIdx].yearlySalesTotal =
          nAmount.reduce((f, s) => f + s, 0);
      })
      .catch(e => {throw e});

      qGetDepositAmountByYear(parseInt(year))
      .then(depositList => {
        depositList.map(deposit => {
          let mIdx = deposit.month - 1;
          this.yearlyTotalAmount[yIdx]
            .monthlyDepositAmount[mIdx] += deposit.depositAmount;
        });
        let nAmount = depositList.map(deposit => deposit.depositAmount);
        this.yearlyTotalAmount[yIdx].yearlyDepositTotal =
          nAmount.reduce((f, s) => f + s, 0);
      })
      .catch(e => {throw e});
    })).then(() => {
      // console.log(this.yearlyTotalAmount)
    }).catch(e => {throw e})
  }

  @action
  public setSelectedComapnyId = (companyId: number) => {
    this.selectedComapnyId = companyId;
  }

  // @computed
  public globalUpdate = async () => {
    try {
      const result = await qGetAllCompany();
      await this.updateCompanyList(result);
      const allYears = await qGetAllYears();
      this._updateYearlyToalAmount(allYears.map(item => item.year));
      return await true;
    } catch(e) {
      throw e;
    }
  }

  // @computed
  public getCurrentCompanyList = () => {
    try {
      return toJS(this.companyList);
    } catch(e) {
      throw e;
    }
  }

}
