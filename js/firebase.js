const firebaseConfig = {
  apiKey: "AIzaSyDSVfrjfRsS8ZJswe5aQmk0MnWYdmSwdF0",
  authDomain: "seagri-eda95.firebaseapp.com",
  databaseURL: "https://seagri-eda95-default-rtdb.firebaseio.com",
  projectId: "seagri-eda95",
  storageBucket: "seagri-eda95.firebasestorage.app",
  messagingSenderId: "53518760667",
  appId: "1:53518760667:web:d234f2988505c705162afe",
  measurementId: "G-HDJ2BM40Y6"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

export const storage = firebase.storage();
