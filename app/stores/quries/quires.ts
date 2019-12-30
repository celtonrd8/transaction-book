import { getConnection } from "typeorm";
import { Company, Sales, Deposit } from "../../entity";

export async function qGetAllCompany() {
  try {
    const companyList = await getConnection()
      .getRepository(Company)
      .createQueryBuilder("company")
      .leftJoinAndSelect("company.salesList", "salesList")
      .leftJoinAndSelect("company.depositList", "depositList")
      .orderBy("company.companyName", "ASC")
      .getMany();
    
    if (companyList) {
      return companyList.map(company => {
        company.salesList = company.salesList.sort((p, n) => new Date(`${p.year}-${p.month}-${p.day}`) > new Date(`${n.year}-${n.month}-${n.day}`) ? 1 : 0);
        company.depositList = company.depositList.sort((p, n) => new Date(`${p.year}-${p.month}-${p.day}`) > new Date(`${n.year}-${n.month}-${n.day}`) ? 1 : 0);
        return company;
      });
    }
  } catch(e) {
    throw e;
  }
}

export async function qDeleteCompany (companyId: number) {
  try {
    return await getConnection()
      .getRepository(Company)
      .delete({id: companyId});
  } catch(e) {
    throw e;
  }
}

export async function qAddComapny (company: Company) {
  // console.log(value)
  try {
    return await getConnection()
      .getRepository(Company)
      .save(company);
  } catch(e) {
    throw e;
  }
}

export async function qModifyCompany (companyId: number, company: Company) {
  try {
    return await getConnection()
      .getRepository(Company)
      .update({id: companyId}, company);
  } catch (e) {
    throw e;
  }
}

export async function qGetSalesById (salesId: number) {
  try {
    return await getConnection()
      .getRepository(Sales)
      .findOne(salesId);
  } catch (e) {
    throw e;
  }
}
export async function qAddSalesAmount (companyId: number, sales: Sales) {
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

export async function qUpdateSalesAmount (salesId: number, sales: Sales) {
try {
  return await getConnection()
    .getRepository(Sales)
    .update({id: salesId}, sales);
} catch (e) {
  throw e;
}
}

export async function qDeleteSalesAmount (salesId: number) {
  try {
    return await getConnection()
      .getRepository(Sales)
      .delete({ id: salesId });
  } catch (e) {
    throw e;
  }
}

export async function qGetDepositById (depositId: number) {
  try {
    return await getConnection()
      .getRepository(Deposit)
      .findOne(depositId);
  } catch (e) {
    throw e;
  }
}
export async function qAddDepositAmount (companyId: number, deposit: Deposit) {
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

export async function qUpdateDepositAmount (depositId: number, deposit: Deposit) {
  try {
    return await getConnection()
      .getRepository(Deposit)
      .update({id: depositId}, deposit);
  } catch (e) {
    throw e;
  }
}

export async function qDeleteDepositAmount (depositId: number) {
  try {
    return await getConnection()
      .getRepository(Deposit)
      .delete({ id: depositId });
  } catch (e) {
    throw e;
  }
}

export async function qGetSalesAmountByYear (year: number) {
  try {
    return await getConnection()
      .getRepository(Sales)
      .find({year: year});
  } catch(e) {
    throw e;
  }
}

export async function qGetDepositAmountByYear (year: number) {
  try {
   return await getConnection()
      .getRepository(Deposit)
      .find({year: year});
  } catch(e) {
    throw e;
  }
}

export async function qGetAllYears() {
  try {
    return await getConnection()
      .query(`SELECT distinct year from Sales UNION SELECT year from Deposit;`);
  } catch(e) {
    throw e;
  }
}

export async function qGetMinDate() {
  try {
    const months = await getConnection()
      .query(`SELECT distinct year, month from Sales UNION SELECT distinct year, month from Deposit;`);

    // console.log(months);
    if (months) {
      return months.reduce((p, c) => p > c ? c : p)
    } else {
      return null;
    }
    // console.log(minYear);
  } catch (e) {
    throw e;
  }
}
