// import { observable, action } from 'mobx';
import { getConnection } from "typeorm";
import { Company } from "../entity";
export class DataIoStore {

  getAllCompany = async () => {
    try {
    return await getConnection()
      .getRepository(Company)
      .find();
    } catch(e) {
      throw e;
    }
  }
}
