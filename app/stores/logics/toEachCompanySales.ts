import { Company, Sales, Deposit } from '../../entity';
import * as Excel from 'exceljs';
import * as Electron from 'electron';
// import * as moment from 'moment';

const { dialog } = Electron.remote;

const calcBalance = (iOrder: number, deposits: Deposit[], sales: Sales[]) => {
  // const refDate = moment(`${deposits[iOrder].originYear}-${deposits[iOrder].originMonth}`).endOf('month').format('YYYY-MM-DD');
  const refOriginDate = `${deposits[iOrder].originYear}-${deposits[iOrder].originMonth}`;

  let depositBalance = 0;
  let sameMonthDeposit = 0;
  deposits.forEach(deposit => {
    if (`${deposit.originYear}-${deposit.originMonth}` === refOriginDate) {
      depositBalance += deposit.depositAmount;
      sameMonthDeposit++;
    }
  });

  let salesBalance = 0;
  sales.forEach(sale => {
    if (`${sale.year}-${sale.month}` === refOriginDate) {
      salesBalance += sale.totalAmount;
    }
  });

  if (sameMonthDeposit > 1) {
    const data = deposits.filter(deposit => `${deposit.originYear}-${deposit.originMonth}` === refOriginDate);
    const max = data.reduce((p, c) => new Date(`${p.year}-${p.month}-${p.day}`) > new Date(`${c.year}-${c.month}-${c.day}`) ? p : c)
    
    const refDate = `${deposits[iOrder].year}-${deposits[iOrder].month}-${deposits[iOrder].day}`;
    
    if (`${max.year}-${max.month}-${max.day}` === refDate) {
      return salesBalance - depositBalance;
    } else {
      return 0;
    }
  } else {
    return salesBalance - depositBalance;
  }
}

export async function toEachCompanySales(selectedCompany: Company[]) {
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
        {key: 'issuedDate', width: 15},
        {key: 'supplyAmount', width: 12},
        {key: 'taxAmount', width: 12},
        {key: 'totalAmount', width: 12},
        {key: 'depositDate', width: 15},
        {key: 'originDate', width: 12},
        {key: 'depositAmount', width: 12},
        {key: 'balance', width: 12},
      ];

      const salesLen = company.salesList.length;
      const depositLen = company.depositList.length;
      const maxLen = salesLen > depositLen ? salesLen : depositLen;

      const sales = company.salesList;
        // .sort((p, n) => new Date(`${p.year}-${p.month}-${p.day}`) > new Date(`${n.year}-${n.month}-${n.day}`) ? 1 : 0);

      const deposits = company.depositList;
        // .sort((p, n) => new Date(`${p.year}-${p.month}-${p.day}`) > new Date(`${n.year}-${n.month}-${n.day}`) ? 1 : 0);

      for (let i = 0; i < maxLen; i++) {
        sheet.addRow({
          'issuedDate': salesLen > i ? `${sales[i].year}년 ${sales[i].month}월 ${sales[i].day}일` : '',
          'supplyAmount': salesLen > i ? sales[i].supplyAmount : '',
          'taxAmount': salesLen > i ? sales[i].taxAmount : '',
          'totalAmount':salesLen > i ? sales[i].totalAmount : '',

          'depositDate':depositLen > i ? `${deposits[i].year}년 ${deposits[i].month}월 ${deposits[i].day}일` : '',
          'originDate':depositLen > i ? `${deposits[i].originYear}년 ${deposits[i].originMonth}월` : '',
          'depositAmount':depositLen > i ? deposits[i].depositAmount : null,
          'balance': depositLen > i ? calcBalance(i, deposits, sales) : null,
        });
      }
  
      const lastRow = sheet.rowCount;

      sheet.getCell(`A${lastRow + 2}`).value = '총합계';
      sheet.getCell(`E${lastRow + 2}`).value = '총합계';

      sheet.getCell(`B${lastRow + 2}`).value = { formula: `SUM(B5:B${lastRow})`, result: 0};
      sheet.getCell(`C${lastRow + 2}`).value = { formula: `SUM(C5:C${lastRow})`, result: 0};
      sheet.getCell(`D${lastRow + 2}`).value = { formula: `SUM(D5:D${lastRow})`, result: 0};
      sheet.getCell(`G${lastRow + 2}`).value = { formula: `SUM(G5:G${lastRow})`, result: 0};
      sheet.getCell(`H${lastRow + 2}`).value = { formula: `SUM(H5:H${lastRow})`, result: 0};
    
  
      sheet.getCell(`A${lastRow + 3}`).value = '미수금 총액';
      sheet.mergeCells(`A${lastRow + 3}:C${lastRow + 3}`);
      sheet.getCell(`A${lastRow + 3}`).alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getCell(`A${lastRow + 3}`).font = { name: 'Malgun Gothic', bold: true, size: 12 };

      sheet.getCell(`D${lastRow + 3}`).value = sheet.getCell(`H${lastRow + 2}`).value
      sheet.mergeCells(`D${lastRow + 3}:H${lastRow + 3}`);
      sheet.getCell(`D${lastRow + 3}`).alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getCell(`D${lastRow + 3}`).font = { name: 'Malgun Gothic', bold: true, size: 12 };
      sheet.getCell(`D${lastRow + 3}`).numFmt = '#,###';

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber < 3) return;

        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(alphabet => {
          if (rowNumber != sheet.rowCount) {
            sheet.getCell(`${alphabet}${rowNumber}`).font = {
              name: 'Malgun Gothic',
              bold: false,
              size: 10,
            };
          }
          sheet.getCell(`${alphabet}${rowNumber}`).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
          sheet.getCell(`${alphabet}${rowNumber}`).alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };

        });

        if (rowNumber > 4) {
          ['B', 'C', 'D', 'G', 'H'].map(alphabet => {
            if (rowNumber != sheet.rowCount) {
              sheet.getCell(`${alphabet}${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'right' };
              sheet.getCell(`${alphabet}${rowNumber}`).numFmt = '#,###'
              if (alphabet = 'H') {
                sheet.getCell(`${alphabet}${rowNumber}`).font = { color: {argb: '00ff0000'} };
              }
            }
          });
        }

      });

    });

    await workbook.xlsx.writeFile(selectedPath);


  } catch (e) {
    throw e;
  }
}
