/**
 * Google Apps Script — Godavari Pushkaralu Backend
 *
 * SETUP:
 * 1. Go to https://script.google.com → New project
 * 2. Paste this entire code into Code.gs
 * 3. Click Deploy → New deployment
 * 4. Select "Web app"
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Click Deploy → Copy the URL
 * 8. Paste the URL into:
 *    - AdminClient.tsx (APPS_SCRIPT_URL constant)
 *    - FeedbackClient.tsx (APPS_SCRIPT_URL constant)
 *
 * IMPORTANT: Your Google Sheet must have these tabs:
 * - "ghats" (first tab) — with 'id' in column A, 'crowd' in column I (9th column)
 * - "alerts" (second tab) — with 'id' in column A, 'active' in column J (10th column)
 * - "feedback" (third tab) — columns: timestamp, feedback_text, image_data, lang
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    switch (action) {
      case "updateCrowd":
        return updateCrowd(data);
      case "toggleAlert":
        return toggleAlert(data);
      case "submitFeedback":
        return submitFeedback(data);
      default:
        return respond(false, "Unknown action: " + action);
    }
  } catch (err) {
    return respond(false, err.toString());
  }
}

function updateCrowd(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0]; // First tab = ghats
  var values = sheet.getDataRange().getValues();
  var headers = values[0];

  // Find the 'crowd' column index
  var crowdCol = -1;
  for (var c = 0; c < headers.length; c++) {
    if (headers[c].toString().toLowerCase().trim() === "crowd") {
      crowdCol = c;
      break;
    }
  }
  if (crowdCol === -1) return respond(false, "crowd column not found");

  // Find the row with matching ID
  for (var i = 1; i < values.length; i++) {
    if (values[i][0].toString() === data.ghatId) {
      sheet.getRange(i + 1, crowdCol + 1).setValue(data.crowd);
      return respond(true, "Crowd updated: " + data.ghatId + " → " + data.crowd);
    }
  }
  return respond(false, "Ghat not found: " + data.ghatId);
}

function toggleAlert(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("alerts");
  if (!sheet) sheet = ss.getSheets()[1]; // Fallback to second tab

  var values = sheet.getDataRange().getValues();
  var headers = values[0];

  // Find the 'active' column index
  var activeCol = -1;
  for (var c = 0; c < headers.length; c++) {
    if (headers[c].toString().toLowerCase().trim() === "active") {
      activeCol = c;
      break;
    }
  }
  if (activeCol === -1) return respond(false, "active column not found");

  // Find the row with matching ID
  for (var i = 1; i < values.length; i++) {
    if (values[i][0].toString() === data.alertId) {
      sheet.getRange(i + 1, activeCol + 1).setValue(data.active ? "TRUE" : "FALSE");
      return respond(true, "Alert toggled: " + data.alertId + " → " + data.active);
    }
  }
  return respond(false, "Alert not found: " + data.alertId);
}

function submitFeedback(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("feedback");

  if (!sheet) {
    // Auto-create feedback tab if it doesn't exist
    sheet = ss.insertSheet("feedback");
    sheet.appendRow(["timestamp", "feedback_text", "image_data", "lang"]);
  }

  var timestamp = new Date().toISOString();
  sheet.appendRow([
    timestamp,
    data.text || "",
    data.imageData ? "HAS_IMAGE" : "", // Don't store full base64 to avoid sheet size limits
    data.lang || "en"
  ]);

  return respond(true, "Feedback received");
}

function respond(success, message) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: success, message: message })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Test function — run this manually to verify the script works
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Sheet name: " + ss.getName());
  Logger.log("Tabs: " + ss.getSheets().map(function(s) { return s.getName(); }).join(", "));

  var ghats = ss.getSheets()[0];
  Logger.log("Ghats tab headers: " + ghats.getRange(1, 1, 1, ghats.getLastColumn()).getValues()[0].join(", "));
  Logger.log("Ghats rows: " + (ghats.getLastRow() - 1));
}
