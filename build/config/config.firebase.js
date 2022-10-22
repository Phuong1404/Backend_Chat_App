"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const FIREBASE = {
    apiKey: "AIzaSyAwZaSYixYXJRZYAtRO_OWXQq3294Z1-uM",
    authDomain: "social-network-8df66.firebaseapp.com",
    projectId: "social-network-8df66",
    storageBucket: "social-network-8df66.appspot.com",
    messagingSenderId: "1048234264419",
    appId: "1:1048234264419:web:c4ed4e83ea19aec3123556",
    measurementId: "G-SBDW68MBHQ"
};
const app = (0, app_1.initializeApp)(FIREBASE);
const storage = (0, storage_1.getStorage)(app, "gs://social-network-8df66.appspot.com");
exports.default = storage;
//# sourceMappingURL=config.firebase.js.map