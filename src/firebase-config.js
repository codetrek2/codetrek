import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: "AIzaSyDJ27hYqVb3fYkpT5n4d_bp5jHAkb1-cVc",
  authDomain: "codetrek-d54f5.firebaseapp.com",
  projectId: "codetrek-d54f5",
  storageBucket: "codetrek-d54f5.appspot.com",
  messagingSenderId: "249897697184",
  appId: "1:249897697184:web:d0df4e1e5ee49e8c5b6ec5",
  measurementId: "G-5PLBMDP36F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// se instancian las funciones de recaptcha de firebase con 

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Lelk-YpAAAAAB1U1O1JdZz_7MHf5vhRpzyCSac9'),
  isTokenAutoRefreshEnabled: true
});




export { app, auth, onAuthStateChanged };