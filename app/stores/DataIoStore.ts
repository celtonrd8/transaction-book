import { observable, action } from 'mobx';
import { getConnection } from "typeorm";
import { Company, Sales, Deposit } from "../entity";

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
  private _updateCompanyList = (companyList: Company[]) => {
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
      this._qGetSalesAmountByYear(parseInt(year))
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

      this._qGetDepositAmountByYear(parseInt(year))
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

  public globalUpdate = async () => {
    try {
      await this.qGetAllCompany();
      await this._qGetAllYears();
      return await true;
    } catch(e) {
      throw e;
    }
  }

  public qGetAllCompany = async () => {
    try {
      const result = await getConnection()
        .getRepository(Company)
        .createQueryBuilder("company")
        .leftJoinAndSelect("company.salesList", "salesList")
        .leftJoinAndSelect("company.depositList", "depositList")
        .getMany();

      if (result) {
        this._updateCompanyList(result);
        // console.log(result);
        return result;
      }
    } catch(e) {
      throw e;
    }
  }

  public qDeleteCompany = async(companyId: number) => {
    try {
      return await getConnection()
        .getRepository(Company)
        .delete({id: companyId});
    } catch(e) {
      throw e;
    }
  }

  public qAddComapny = async(company: Company) => {
    // console.log(value)
    try {
      return await getConnection()
        .getRepository(Company)
        .save(company);
    } catch(e) {
      throw e;
    }
  }

  public qModifyCompany = async(companyId: number, company: Company) => {
    try {
      return await getConnection()
        .getRepository(Company)
        .update({id: companyId}, company);
    } catch (e) {
      throw e;
    }
  }

  qGetSalesById = async (salesId: number) => {
    try {
      return await getConnection()
        .getRepository(Sales)
        .findOne(salesId);
    } catch (e) {
      throw e;
    }
  }
  public qAddSalesAmount = async(companyId: number, sales: Sales) => {
    try {
      const company = await getConnection()
        .getRepository(Company)
        .findOne({id: companyId});

      sales.company = company;
      return await getConnection()
        .getRepository(Sales)
        .save(sales);

    } catch (e) {
      throw e;
    }
  }

public qUpdateSalesAmount = async(salesId: number, sales: Sales) => {
  try {
    return await getConnection()
      .getRepository(Sales)
      .update({id: salesId}, sales);
  } catch (e) {
    throw e;
  }
}

  public qDeleteSalesAmount = async(salesId: number) => {
    try {
      return await getConnection()
        .getRepository(Sales)
        .delete({ id: salesId });
    } catch (e) {
      throw e;
    }
  }

  public qGetDepositById = async (depositId: number) => {
    try {
      return await getConnection()
        .getRepository(Deposit)
        .findOne(depositId);
    } catch (e) {
      throw e;
    }
  }
  public qAddDepositAmount = async(companyId: number, deposit: Deposit) => {
    try {
      const company = await getConnection()
        .getRepository(Company)
        .findOne({id: companyId});

      deposit.company = company;
      return await getConnection()
        .getRepository(Deposit)
        .save(deposit);

    } catch (e) {
      throw e;
    }
  }

  public qUpdateDepositAmount = async(depositId: number, deposit: Deposit) => {
    try {
      return await getConnection()
        .getRepository(Deposit)
        .update({id: depositId}, deposit);
    } catch (e) {
      throw e;
    }
  }

  public qDeleteDepositAmount = async(depositId: number) => {
    try {
      return await getConnection()
        .getRepository(Deposit)
        .delete({ id: depositId });
    } catch (e) {
      throw e;
    }
  }

  private _qGetAllYears = async () => {
    try {
      const result = await getConnection()
        .query(`SELECT distinct year from Sales UNION SELECT year from Deposit;`);
      if (result) {
        this._updateYearlyToalAmount(result.map(item => item.year));
        return result;
      }
    } catch(e) {
      throw e;
    }
  }

  private _qGetSalesAmountByYear = async (year: number) => {
    try {
      return await getConnection()
        .getRepository(Sales)
        .find({year: year});
    } catch(e) {
      throw e;
    }
  }

  private _qGetDepositAmountByYear = async (year: number) => {
    try {
     return await getConnection()
        .getRepository(Deposit)
        .find({year: year});
    } catch(e) {
      throw e;
    }
  }
}
