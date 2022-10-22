"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
const admin = require("firebase-admin");
const firebase_key_json_1 = require("../config/firebase-key.json");
const BUCKET = "social-network-8df66.appspot.com";
console.log(firebase_key_json_1.default);
admin.initializeApp({
    credential: admin.credential.cert(firebase_key_json_1.default),
    storageBucket: BUCKET
});
exports.bucket = admin.storage().bucket();
// module.exports = {
//     bucket
// }
//# sourceMappingURL=firebase.js.map