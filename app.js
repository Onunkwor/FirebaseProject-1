// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth,
        createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateEmail
    } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDoLxj2QU8vSKuXi0hiXl-dOYQ1Uu8GwhA",
    authDomain: "auth-1-4a8ec.firebaseapp.com",
    projectId: "auth-1-4a8ec",
    storageBucket: "auth-1-4a8ec.appspot.com",
    messagingSenderId: "286624881231",
    appId: "1:286624881231:web:308b2f6386c2af4d65283a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userName = document.getElementById('name')
const userEmail = document.querySelector('#email');
const userPassword = document.querySelector('#password');
const signUpButton = document.querySelector('.signUp');
const signInButton = document.querySelector('.signIn');
const signOutButton = document.querySelector('#signOut');
const topSecret = document.querySelector('#top-secret');
const authForm = document.querySelector('#auth-form');
const toastSignUp = document.querySelector('#liveToast');
const toastSignIn = document.querySelector('#liveToast2');
const start = document.querySelector('#start');
const timer = document.querySelector('#timer');

topSecret.style.display = 'none';

const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));

const signUserUp = async () => {
   const signUpEmail = userEmail.value;
   const signUpPassword = userPassword.value;
   createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
   .then(() =>{
    // Display the success toast
    const toast = new bootstrap.Toast(toastSignUp);
    toast.show();
   })
   .catch((error) =>{
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
    let toastMessage = "";
    
    if (errorCode === "auth/invalid-email") {
      toastMessage = "Invalid email";
    }else if(errorCode === "auth/weak-password"){
      toastMessage = "Weak password";
    }

    // Display the error toast with the error message
    const errorToastBody = document.querySelector('#errorToast .toast-body');
    errorToastBody.textContent = toastMessage;
    errorToast.show();
   })
}

signUpButton.addEventListener('click', () => {
    signUserUp();
});

       
     const signUserIn = async () => {
        const signInEmail = userEmail.value;
        const signInPassword = userPassword.value;
        try{
          await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
          const toast = new bootstrap.Toast(toastSignIn);
           toast.show();
        }
        catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + errorMessage);
          let toastMessage = "";
          
          if (errorCode === "auth/invalid-email") {
            toastMessage = "Invalid email";
          }else if(errorCode === "auth/weak-password"){
            toastMessage = "Weak password";
          }else if(errorCode === "auth/invalid-login-credentials"){
            toastMessage = "Please Sign up first.";
          }
      
          // Display the error toast with the error message
          const errorToastBody = document.querySelector('#errorToast .toast-body');
          errorToastBody.textContent = toastMessage;
          errorToast.show(); 
        }
     
     }
     signInButton.addEventListener('click', () => {
        signUserIn();
         });

  
  
    const checkAuthState = async() => {
       onAuthStateChanged(auth,user => {
         if (user) {
            authForm.style.display = "none"
           topSecret.style.display = 'block';
         } else {
            authForm.style.display = "block"
           topSecret.style.display = 'none';
         }
       }) 
    }
    checkAuthState()
    const signUserOut = async() => {
        await signOut(auth);
    }
 
    signOutButton.addEventListener('click', () => {
        signUserOut();
    })
    
    const targetTime = 300;
    let currentTime = targetTime;

    // Function to update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timer.textContent = formattedTime;
    }

    // Function to start the countdown
    function startCountdown() {
        const timerInterval = setInterval(() => {
            if (currentTime <= 0) {
                clearInterval(timerInterval);
                alert('Time is up!');
            } else {
                currentTime--;
                updateTimerDisplay();
            }
        }, 1000);
    }

    start.addEventListener('click', () => {
      topSecret.style.display = 'none';
      timer.style.display = 'block';
      startCountdown();
    })