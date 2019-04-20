import { observable, action } from 'mobx';
import { getConnection } from "typeorm";
import { Company } from "../entity";

export class DataIoStore {

  @observable
  companyList: Company[] = [];

  @observable
  totalCount: number = 0;

  @action
  public updateCompanyList = (companyList: Company[]) => {
    this.totalCount = companyList.length;
    this.companyList = companyList.map((item) => {
      console.log(item);
      return {
        key: item.id.toString(),
        ...item,
      }
    });
  }

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

  public queryDeleteCompany = async(id: number) => {
    try {
      return await getConnection()
        .getRepository(Company)
        .delete({id: id});
    } catch(e) {
      throw e;
    }
  }
}
