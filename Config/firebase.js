const admin = require("firebase-admin");
const serviceAccount = require("../service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL ,
});

const db = admin.firestore();
module.exports = { admin, db };
