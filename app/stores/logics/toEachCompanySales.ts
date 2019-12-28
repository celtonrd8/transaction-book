import { Company } from '../../entity';
import * as Excel from 'exceljs';
import * as Electron from 'electron';

const { dialog } = Electron.remote;
export async function toEachCompanySales(selectedCompany: Company[]) {
  try {
    // console.log(selectedCompany)
    const workbook = new Excel.Workbook();
    workbook.creator = 'SeHan';

    selectedCompany.map(company => {
      const sheet = workbook.addWorksheet(company.companyName);

      sheet.getCell('A1').value = '거래 입금 내역서';
      sheet.mergeCells('A1:H1');
      sheet.getCell(`A1`).alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getCell(`A1`).font = { name: 'Malgun Gothic', bold: true, size: 20 };

      sheet.getCell('A2').value = company.accountNumber;
      sheet.getCell('B2').value = company.depositDate;
      sheet.getCell('G2').value = '거래처 : '
      sheet.getCell('H2').value = company.companyName;

      sheet.getCell('A3').value = '거래총액';
      sheet.mergeCells('A3:D3');
      sheet.getCell(`A3`).alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getCell(`A3`).font = { name: 'Malgun Gothic', bold: true, size: 10 };

      sheet.getCell('E3').value = '입금 총액';
      sheet.mergeCells('E3:H3');
      sheet.getCell(`E3`).alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getCell(`E3`).font = { name: 'Malgun Gothic', bold: true, size: 10 };

      sheet.spliceRows(4, 1, ['발행일', '공급액', '세액', '총액', '입금일', '월분', '입금액', '잔액']);
      sheet.getRow(4).alignment = { vertical: 'middle', horizontal: 'center' };

      sheet.columns = [
        {key: 'issuedDate', width: 12},
        {key: 'supplyAmount', width: 12},
        {key: 'taxAmount', width: 12},
        {key: 'totalAmount', width: 12},
        {key: 'depositDate', width: 12},
        {key: 'originMonth', width: 12},
        {key: 'depositAmount', width: 12},
        {key: 'balance', width: 12},
      ];


    });

    const selectedPath = dialog.showSaveDialog({
      title: '엑셀파일 저장 위치 선택',
      defaultPath: 'c:\\',
      filters: [
        { name: 'Excel', extensions: ['xlsx']}
      ]
    });
    await workbook.xlsx.writeFile(selectedPath);

  } catch (e) {
    throw e;
  }
}
