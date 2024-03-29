import ExcelJS from 'exceljs';

export async function readMessfileInOverview(
  myBlob,
  file2find,
  expectedCols,
  offsetLines
) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(myBlob);
  const worksheet = workbook.getWorksheet('Global');
  const result = {};
  worksheet.eachRow((row, rowNumber) => {
    console.log(row, rowNumber);
    if (offsetLines >= rowNumber) {
    } else {
      if (
        row.getCell(1).value != null &&
        row.getCell(1).value.includes(file2find)
      ) {
        console.log('Found in row ' + rowNumber);

        for (let i of expectedCols) {
          console.log(row, i);
          console.log(i.name, row.getCell(i.col).value);
          result[i.name] = row.getCell(i.col).value;
        }
      }
    }
  });
  console.log(result);
  return result;
}

export async function createExcelReport(excelBlob) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(excelBlob);
  const sheet = workbook.getWorksheet('Test');
  const row = sheet.getRow(10);
  row.getCell(1).value = 'Hello';
  row.getCell(5).value = 96;

  const buf = await workbook.xlsx.writeBuffer();
  const resultAsBlob = new Blob([buf]);

  return resultAsBlob;
}
