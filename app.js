const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

const CLIENT_ID =
  "509179651322-olss7gd782uphift25oq7k3eg51fdgke.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//044EyTE4HcuI_CgYIARAAGAQSNwF-L9Ir_Vg1KWHg25_R6xJM7uYfro06TysR-_9saXvGt4EBa03-WsyRGatRcI2g3N75VPDeUdw";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const directoryPath = "C:\\Users\\augus\\OneDrive\\Documentos\\MiniMe";
const filePath = path.join(__dirname, directoryPath);

async function uploadFiles() {
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const mimeType = mime.lookup(filePath);

      const response = await drive.files.create({
        requestBody: {
          name: file,
          mimeType: mimeType,
        },
        media: {
          mimeType: mimeType,
          body: fs.createReadStream(filePath),
        },
      });

      console.log(`Uploaded: ${file}`);
    }
  } catch (error) {
    console.error(error.message);
  }
}

uploadFiles();
