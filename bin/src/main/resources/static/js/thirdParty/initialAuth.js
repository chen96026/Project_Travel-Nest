// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
// 分析功能，暫時沒用到
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqMg4nhFesKBtEtIbxxOUUKAeIebNip1Q",
    authDomain: "javel-85c60.firebaseapp.com",
    projectId: "javel-85c60",
    storageBucket: "javel-85c60.appspot.com",
    messagingSenderId: "780056726416",
    appId: "1:780056726416:web:eae377e64ad572c30a8115",
    measurementId: "G-5WEC19NR0Z"
};

// Initialize Firebase 初始化
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();
// auth.languageCode = 'it';
export { auth };