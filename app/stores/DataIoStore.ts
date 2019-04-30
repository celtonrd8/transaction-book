import { observable, action } from 'mobx';
import { getConnection } from "typeorm";
import { Company, Sales, Deposit } from "../entity";

export class DataIoStore {

  @observable
  companyList: Company[] = [];

  @observable
  totalCount: number = 0;

  @observable
  selectedComapnyId: number = 0;

  @observable
  allYears: string[] = [];

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
  public setSelectedComapnyId = (companyId: number) => {
    this.selectedComapnyId = companyId;
  }

  @action
  private _updateYears = (years: string[]) => {
    this.allYears = years;
  }

  public globalUpdate = async () => {
    try {
      await this.queryCompanyByPage();
      await this.queryGetAllYears();
      return await true;
    } catch(e) {
      throw e;
    }
  }

  public queryCompanyByPage = async () => {
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

  public queryDeleteCompany = async(companyId: number) => {
    try {
      return await getConnection()
        .getRepository(Company)
        .delete({id: companyId});
    } catch(e) {
      throw e;
    }
  }

  public queryAddComapny = async(company: Company) => {
    // console.log(value)
    try {
      return await getConnection()
        .getRepository(Company)
        .save(company);
    } catch(e) {
      throw e;
    }
  }

  public queryModifyCompany = async(companyId: number, company: Company) => {
    try {
      return await getConnection()
        .getRepository(Company)
        .update({id: companyId}, company);
    } catch (e) {
      throw e;
    }
  }

  public queryAddSalesAmount = async(companyId: number, sales: Sales) => {
    try {
      const company = await getConnection()
        .getRepository(Company)
        .findOne(companyId);

      sales.company = company;
      return await getConnection()
        .getRepository(Sales)
        .save(sales);

    } catch (e) {
      throw e;
    }
  }

  public queryDeleteSalesAmount = async(salesId: number) => {
    try {
      return await getConnection()
        .getRepository(Sales)
        .delete({ id: salesId });
    } catch (e) {
      throw e;
    }
  }

  public queryAddDepositAmount = async(companyId: number, deposit: Deposit) => {
    try {
      const company = await getConnection()
        .getRepository(Company)
        .findOne(companyId);

      deposit.company = company;
      return await getConnection()
        .getRepository(Deposit)
        .save(deposit);

    } catch (e) {
      throw e;
    }
  }

  public queryDeleteDepositAmount = async(depositId: number) => {
    try {
      return await getConnection()
        .getRepository(Deposit)
        .delete({ id: depositId });
    } catch (e) {
      throw e;
    }
  }

  public queryGetAllYears = async () => {
    try {
      const result = await getConnection()
        .query(`SELECT distinct year from Sales UNION SELECT year from Deposit;`);
      if (result) {
        this._updateYears(result.map(item => item.year));
        return result;
      }
    } catch(e) {
      throw e;
    }
  }

}
