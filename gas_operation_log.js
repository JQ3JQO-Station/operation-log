const SHEET_NAME = 'ログ';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    
    // ヘッダーがなければ作成
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'No', '日時', '種別', 'DCR出力', '特小交信方法', '特小レピーター名', 'LCR距離(km)', 'コールサイン', 'ポータブル',
        '送信RST', '受信RST',
        '相手局_都道府県', '相手局_市区町村', '相手局_詳細',
        '自局_都道府県', '自局_市区町村', '自局_詳細', 'メモ'
      ]);
      sheet.getRange(1, 1, 1, 18).setFontWeight('bold').setBackground('#4472C4').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
    
    const no = sheet.getLastRow();
    const ts = new Date(data.ts);
    const dateStr = Utilities.formatDate(ts, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    
    sheet.appendRow([
      no, dateStr,
      data.cat          || '',
      data.dcrPower     || '',
      data.tokushoMode  || '',
      data.repeaterName || '',
      data.lcrDistance  || '',
      data.csBase       || data.cs || '',
      data.portable     || '',
      data.rstTx        || '',
      data.rstRx        || '',
      data.pref         || '',
      data.city         || '',
      data.detail       || '',
      data.myPref       || '',
      data.myCity       || '',
      data.myDetail     || '',
      data.memo         || ''
    ]);
    
    sheet.autoResizeColumns(1, 18);
    
    const output = ContentService
      .createTextOutput(JSON.stringify({ result: 'ok', no: no }))
      .setMimeType(ContentService.MimeType.JSON);
    return output;
      
  } catch(err) {
    const output = ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

function doGet(e) {
  const output = ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'OPERATION LOG GAS is running' }))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // デフォルトの「シート1」が残っていれば削除
    const default_sheet = ss.getSheetByName('シート1');
    if (default_sheet) ss.deleteSheet(default_sheet);
  }
  return sheet;
}
