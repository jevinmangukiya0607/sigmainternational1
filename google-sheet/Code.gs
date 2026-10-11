/* =========================================================
   SIGMA HORIZON SCHOOL: WEBSITE LEADS TO GOOGLE SHEET
   Paste this whole file into the Apps Script editor of the
   leads spreadsheet (Extensions > Apps Script), then deploy it
   as a Web app (Execute as: Me, Who has access: Anyone).
   The Web app URL goes into SIGMA_SHEET_URL in script.js.

   Each website form gets its own tab. Tabs and header rows are
   created automatically the first time a lead arrives.
========================================================= */

/**
 * Limits this script to the spreadsheet it is attached to,
 * instead of asking for access to every sheet in the account.
 * @OnlyCurrentDoc
 */

// Optional: email address that gets a short alert for every new lead.
// Leave empty for no emails.
const NOTIFY_EMAIL = "";

const TIMEZONE = "Asia/Kolkata";

// Tab name and column order for each form. [field name sent by the website, column heading]
const TABS = {
    "Enquiry": {
        name: "Enquiries",
        columns: [
            ["parent_name", "Parent name"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["grade", "Grade"],
            ["school_type", "School type"],
            ["source", "Form"]
        ]
    },
    "Campus Visit": {
        name: "Campus Visits",
        columns: [
            ["parent_name", "Parent name"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["grade", "Grade"],
            ["school_type", "School type"],
            ["visit_date", "Visit date"],
            ["visit_time", "Visit time"],
            ["message", "Message"]
        ]
    },
    "Application": {
        name: "Applications",
        columns: [
            ["reference", "Reference"],
            ["student_name", "Child's name"],
            ["date_of_birth", "Date of birth"],
            ["gender", "Gender"],
            ["current_school", "Current school"],
            ["applying_grade", "Grade applying for"],
            ["academic_year", "Academic year"],
            ["school_preference", "School preference"],
            ["heard_from", "Heard about SIGMA"],
            ["parent_name", "Parent / guardian"],
            ["relationship", "Relationship"],
            ["phone", "Mobile"],
            ["alt_phone", "Alternate number"],
            ["email", "Email"],
            ["city", "City"],
            ["state", "State"],
            ["message", "Message"],
            ["consent", "Consent"]
        ]
    }
};

// Added to the end of every tab.
const COMMON = [
    ["page", "Page"],
    ["utm_source", "UTM source"],
    ["utm_medium", "UTM medium"],
    ["utm_campaign", "UTM campaign"],
    ["referrer", "Came from"]
];

// Columns the admissions team fills in by hand.
const TEAM_COLUMNS = ["Status", "Notes"];


function doPost(e) {

    const lock = LockService.getScriptLock();

    try {

        const data = JSON.parse(e.postData.contents);

        // Spam traps: hidden fields a person never fills in.
        if (data.company || data.website) {
            return reply({ ok: true });
        }

        const tab = TABS[data.form] || TABS["Enquiry"];
        const columns = tab.columns.concat(COMMON);

        lock.waitLock(20000);

        const sheet = getSheet(tab.name, columns);
        const stamp = Utilities.formatDate(new Date(), TIMEZONE, "dd-MMM-yyyy HH:mm:ss");
        const row = [stamp].concat(columns.map(([key]) => clean(data[key])));
        const target = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);

        // Plain text keeps phone numbers such as "+91 ..." exactly as typed.
        target.setNumberFormat("@").setValues([row]);

        notify(data, tab.name, columns);

        return reply({ ok: true });

    } catch (error) {

        return reply({ ok: false, error: String(error) });

    } finally {

        try {
            lock.releaseLock();
        } catch (ignore) { }

    }

}


// Opening the Web app URL in a browser shows this, which confirms the deployment works.
function doGet() {
    return reply({ ok: true, message: "SIGMA leads endpoint is running." });
}


function getSheet(name, columns) {

    const book = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = book.getSheetByName(name);

    if (!sheet) {
        sheet = book.insertSheet(name);
    }

    if (sheet.getLastRow() === 0) {

        const headings = ["Received"].concat(columns.map(([, label]) => label), TEAM_COLUMNS);

        sheet.getRange(1, 1, 1, headings.length)
            .setValues([headings])
            .setFontWeight("bold")
            .setBackground("#0f2247")
            .setFontColor("#ffffff");

        sheet.setFrozenRows(1);

    }

    return sheet;

}


// Trims the value and stops anything typed into the form from running as a formula.
function clean(value) {

    const text = String(value == null ? "" : value).trim().slice(0, 2000);

    return /^[=@]/.test(text) ? "'" + text : text;

}


function notify(data, tabName, columns) {

    if (!NOTIFY_EMAIL) {
        return;
    }

    const lines = columns
        .filter(([key]) => data[key])
        .map(([key, label]) => label + ": " + data[key]);

    MailApp.sendEmail(
        NOTIFY_EMAIL,
        "New website lead (" + tabName + "): " + (data.parent_name || ""),
        lines.join("\n")
    );

}


function reply(body) {
    return ContentService
        .createTextOutput(JSON.stringify(body))
        .setMimeType(ContentService.MimeType.JSON);
}
