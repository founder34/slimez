const SHEET_NAME = "Whitelist";

function doPost(event) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(spreadsheet);
  const values = event.parameter || {};

  ensureHeaderRow(sheet);

  sheet.appendRow([
    values.submittedAt || new Date().toISOString(),
    values.username || "",
    values.commentLink || "",
    values.wallet || "",
    values.source || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(spreadsheet) {
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow(["Submitted At", "X Username", "Comment Link", "Wallet", "Source"]);
}
