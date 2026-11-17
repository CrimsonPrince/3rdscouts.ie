/**
 * Google Apps Script Web App handler for 3rd/40th/41st Dublin Donnybrook Scout Group (3rdscouts.ie)
 *
 * Deployment steps:
 * 1. Open your Google Sheet -> Extensions -> Apps Script.
 * 2. Paste this file into Code.gs and save.
 * 3. Deploy -> New deployment -> Web app:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into PUBLIC_APPS_SCRIPT_URL (.env) or forms.appsScriptUrl (src/data/siteData.json).
 */

const SHEET_CONFIG = {
  youth: {
    sheetName: 'Youth',
    notifyEmail: 'apply@donnybrookleaders.com',
    headers: [
      'Submitted At',
      'Parent Name',
      'Email Address',
      'Mobile Phone Number',
      'Home Address',
      "Child's First Name",
      "Child's Last Name",
      "Child's Date Of Birth",
      'How did you hear of us',
      'Connection to the Group',
      'Medical or other considerations',
      'Willing to volunteer',
    ],
  },
  adult: {
    sheetName: 'Adults',
    notifyEmail: 'apply@donnybrookleaders.com',
    headers: [
      'Submitted At',
      'Name',
      'Email Address',
      'Mobile Number',
      'Why do you want to join',
      'Previous experience',
      'Availability',
    ],
  },
  hall: {
    sheetName: 'Hall Bookings',
    notifyEmail: 'donnybrookgroupleader@gmail.com',
    headers: [
      'Submitted At',
      'Name / Group Name',
      'Email Address',
      'Phone Number',
      'Dates requested',
      'Number of attendees',
    ],
  },
  contact: {
    sheetName: 'Enquiries',
    notifyEmail: 'donnybrookgroupleader@gmail.com',
    headers: ['Submitted At', 'Name', 'Email Address', 'Topic', 'Message'],
  },
};

function doPost(e) {
  try {
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(rawBody);

    // Silently drop bot submissions caught by the honeypot field.
    if (data.honeypot && String(data.honeypot).trim() !== '') {
      return jsonResponse({ ok: true });
    }

    const formType = SHEET_CONFIG[data.formType] ? data.formType : 'youth';
    const config = SHEET_CONFIG[formType];
    const rowValues = buildRowValues(config, data);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = ss.getSheetByName(config.sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(config.sheetName);
      }

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(config.headers);
        sheet.getRange(1, 1, 1, config.headers.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([new Date(), ...rowValues]);
    } finally {
      lock.releaseLock();
    }

    // Send email notification outside the lock so sheet writes never wait on mail delivery.
    try {
      const recipient = config.notifyEmail;
      const subjectPrefix = data.subjectPrefix || `${config.sheetName} Submission`;
      const summary = data.summaryName ? ` – ${data.summaryName}` : '';

      MailApp.sendEmail({
        to: recipient,
        replyTo: data.replyTo || recipient,
        subject: `${subjectPrefix}${summary}`,
        body: data.readableBody || 'A new submission was added to the Google Sheet.',
      });
    } catch (mailError) {
      console.error('Email notification failed (row already saved):', mailError);
    }

    return jsonResponse({ ok: true, sheet: config.sheetName });
  } catch (err) {
    console.error('doPost failed:', err);
    return jsonResponse({
      ok: false,
      error: err && err.message ? err.message : 'Submission error',
    });
  }
}

function buildRowValues(config, data) {
  const fieldMap = data && typeof data.fieldMap === 'object' && data.fieldMap ? data.fieldMap : null;
  if (fieldMap) {
    return config.headers.slice(1).map((header) => fieldMap[header] || '');
  }
  return Array.isArray(data.fields) ? data.fields : [];
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
