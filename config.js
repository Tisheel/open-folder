// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')

const firebaseConfig = {
    apiKey: "AIzaSyA4I5g59AvLg3Ac-ZR02nYtWhiWu9GqAYw",
    authDomain: "open-folder-1768a.firebaseapp.com",
    projectId: "open-folder-1768a",
    storageBucket: "open-folder-1768a.appspot.com",
    messagingSenderId: "474924957587",
    appId: "1:474924957587:web:d4c4fe827769b6abbd7266",
    measurementId: "G-NFZL1DRFVD"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app, "gs://open-folder-1768a.appspot.com")

module.exports = { storage }