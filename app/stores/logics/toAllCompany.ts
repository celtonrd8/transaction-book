import { Company } from "../../entity";
import * as Excel from 'exceljs';
import * as Electron from 'electron';

const { dialog } = Electron.remote;
// export function toAllCompany(companyList: Company[], selectYear: number, selectMonth: number) {
export async function toAllCompany(companyList: Company[], selectedYear: number, selectedMonth: number) {
  try {

    const selectedPath = dialog.showSaveDialog({
      title: '엑셀파일 저장 위치 선택',
      defaultPath: 'c:\\',
      filters: [
        { name: 'Excel', extensions: ['xlsx']}
      ]
    });

    if (!selectedPath) {
      return;
    }
    // console.log(companyList);
    const year = selectedYear;
    const month = selectedMonth;

    const workbook = new Excel.Workbook();
    workbook.creator = 'SeHan';

    const sheet = workbook.addWorksheet(`${year}년 ${month}월`);

    // sheet.addRow({}).commit();
    // sheet.getRow(1).getCell(8).value =
    sheet.getCell('A1').value = `${year}년 ${month}월분`;
    sheet.mergeCells('A1:H1');
    sheet.getCell(`A1`).alignment = { vertical: 'middle', horizontal: 'right' };

    sheet.spliceRows(2, 1, ['업체', '비고', '공급가액', '부가세', '합계', '입금일', '연락처', '메모']);
    // sheet.getRow(2).values = []
    sheet.columns = [
      {key: 'companyList', width: 20},
      {key: 'empty', width: 10},
      {key: 'supplyAmount', width: 12},
      {key: 'taxAmount', width: 12},
      {key: 'totalAmount', width: 15},
      {key: 'accountNumber', width: 13},
      {key: 'phone', width: 12},
      {key: 'memo', width: 15},
    ];

    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((alphabet) => {
      sheet.getCell(`${alphabet}2`).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{ argb:'00c0d0eb' }
      }
    });

    companyList.map((company, index) => {

      if (company.transactionState !== 'OFF') {
        let supplyAmount: number = 0;
        let taxAmount: number = 0;
        let totalAmount: number = 0;
        company.salesList.map(sales => {
          if (sales.year === year && sales.month === month) {
            supplyAmount += sales.supplyAmount;
            taxAmount += sales.taxAmount;
            totalAmount += sales.totalAmount;
          }
        });
        sheet.addRow({
          'companyList': company.companyName,
          'empty': '',
          'supplyAmount': supplyAmount,
          'taxAmount': taxAmount,
          'totalAmount': totalAmount,
          'accountNumber': company.accountNumber,
          'phone': company.phone,
          'memo': company.memo,
        }).commit();

      }
    });

    const lastRow = sheet.rowCount;
    sheet.getCell(`A${lastRow+1}`).value = '합계';
    sheet.getCell(`C${lastRow+1}`).value = { formula: `SUM(C3:C${lastRow})`, result: 0};
    sheet.getCell(`D${lastRow+1}`).value = { formula: `SUM(D3:D${lastRow})`, result: 0};
    sheet.getCell(`E${lastRow+1}`).value = { formula: `SUM(E3:E${lastRow})`, result: 0};

    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((alphabet) => {
      // sheet.getCell(`${alphabet}${lastRow}`).numFmt = '#,###';
      sheet.getCell(`${alphabet}${lastRow+1}`).fill = {
        type: 'pattern',
        pattern:'solid',
        fgColor:{ argb:'00f7d794' }
      };
      sheet.getCell(`${alphabet}${lastRow+1}`).border = {
        top: {style:'thin'},
        left: {style:'thin'},
        bottom: {style:'thin'},
        right: {style:'thin'}
      }
    });


    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      row.eachCell((cell) => {
        cell.font = {
          name: 'Malgun Gothic',
          bold: rowNumber === 2 ? true : false,
          size: 10,
        };
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        }
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        }
      })

      if (rowNumber > 2) {
        ['C', 'D', 'E'].map(alphabet => {
          sheet.getCell(`${alphabet}${rowNumber}`).numFmt = '#,###';
          sheet.getCell(`${alphabet}${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'right' };
        });
      }

    });


    await workbook.xlsx.writeFile(selectedPath);

  } catch (e) {
    throw e;
  }


}
