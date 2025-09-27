const firebaseConfig = {
  apiKey: "AIzaSyDSsR8-XACQV31J2SyHwzL7pmYUqyEXAqo",
  authDomain: "teste-590e9.firebaseapp.com",
  databaseURL: "https://teste-590e9-default-rtdb.firebaseio.com",
  projectId: "teste-590e9",
  storageBucket: "teste-590e9.appspot.com",
  messagingSenderId: "766760612862",
  appId: "1:766760612862:web:f379c05faaa46a09ec46af"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();