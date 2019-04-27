import { observable, action } from 'mobx';
import { getConnection } from "typeorm";
import { Company } from "../entity";

export class DataIoStore {

  @observable
  companyList: Company[] = [];

  @observable
  totalCount: number = 0;

  @observable
  selectedComapnyId: number = 0;

  @action
  private _updateCompanyList = (companyList: Company[]) => {
    this.totalCount = companyList.length;
    this.companyList = companyList.map((item) => {
      console.log(item);
      return {
        key: item.id.toString(),
        ...item,
      }
    });
  }

  @action
  public setSelectedComapnyId = (id: number) => {
    this.selectedComapnyId = id;
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
        console.log(result);
        return result;
      }
    } catch(e) {
      throw e;
    }
  }

  public queryDeleteCompany = async(id: number) => {
    try {
      return await getConnection()
        .getRepository(Company)
        .delete({id: id});
    } catch(e) {
      throw e;
    }
  }

  public queryAddComapny = async(value: Company) => {
    // console.log(value)
    try {
      return await getConnection()
        .getRepository(Company)
        .save(value);
    } catch(e) {
      throw e;
    }
  }
}
