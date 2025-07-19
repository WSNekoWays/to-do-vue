// src/firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyARSNeAhcn9-PXyfjb3r52J-cjWRQr_SlY",
  authDomain: "vue-to-do-project.firebaseapp.com",
  projectId: "vue-to-do-project",
  storageBucket: "vue-to-do-project.appspot.com",
  messagingSenderId: "836002302305",
  appId: "1:836002302305:web:b94255d6bab1f5f51cdd20",
  measurementId: "G-04ZB1WB8TB"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }