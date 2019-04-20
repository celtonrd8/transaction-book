import { observable, action } from 'mobx';
import { getConnection } from "typeorm";
import { Company } from "../entity";

export class DataIoStore {

  @observable
  companyList: Company[] = [];

  private _totalCount: number;

  @action
  public updateCompanyList = (companyList: Company[]) => {
    this.setTotalCount(companyList.length);

    this.companyList = companyList.map((item, index) => {
      console.log(item);
      return {
        key: index.toString(),
        ...item,
      }
    });
  }

  public setTotalCount = (count: number) => this._totalCount = count;
  public getTotalCount = () => this._totalCount;

  public queryCompanyByPage = async () => {
    try {
      return await getConnection()
        .getRepository(Company)
        .createQueryBuilder("company")
        .leftJoinAndSelect("company.salesList", "salesList")
        .leftJoinAndSelect("company.depositList", "depositList")
        .getMany();
    } catch(e) {
      throw e;
    }
  }
}
