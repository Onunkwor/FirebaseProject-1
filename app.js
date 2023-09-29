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

// Get references to HTML elements
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
const questionSection = document.querySelector('#question-section');
const submitButton = document.querySelector('.submit-question');
const feedbackElements = document.querySelectorAll('.feedback');
const performanceGraph = document.getElementById('performance-graph');
const toast = new bootstrap.Toast(toastSignIn);
const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
const reset = document.querySelector('.reset-quiz');
const canvas = document.getElementById('barChart');

// Hide the instruction and quiz-question
topSecret.style.display = 'none';
questionSection.style.display = 'none';

// Sign User Up
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

//  Sign User In
const signUserIn = () => {
  const signInEmail = userEmail.value;
  const signInPassword = userPassword.value;

  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then(() => {
      toast.show();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage);
      let toastMessage = "";

      if (errorCode === "auth/invalid-email") {
        toastMessage = "Invalid email";
      } else if (errorCode === "auth/weak-password") {
        toastMessage = "Weak password";
      } else if (errorCode === "auth/invalid-login-credentials") {
        toastMessage = "Please Sign up first.";
      }

      // Display the error toast with the error message
      const errorToastBody = document.querySelector('#errorToast .toast-body');
      errorToastBody.textContent = toastMessage;
      errorToast.show();
    });
}


signInButton.addEventListener('click', () => {
  signUserIn();
  });

// check user authentication status
  const checkAuthState = async() => {
  onAuthStateChanged(auth,user => {
  if (user) {
    authForm.style.display = "none"
    toast.show();
    topSecret.style.display = 'block';

  } else {
    authForm.style.display = "block"
    topSecret.style.display = 'none';
  }
  }) 
  }
  checkAuthState()
// Sign User Out
  const signUserOut = async() => {
      await signOut(auth);
  }

  signOutButton.addEventListener('click', () => {
      signUserOut();
  })
    
    // Function to update the timer display
    let targetTime = 300;
    let currentTime = targetTime;
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
                submitButton.click();
            } else {
                currentTime--;
                updateTimerDisplay();
            }
          
        }, 1000);
    }
    start.addEventListener('click', () => {
      topSecret.style.display = 'none';
      timer.style.display = 'block';
      questionSection.style.display = 'block';
      startCountdown();
    })


    
// Define correct answers
const correctAnswers = ["Paris", "Mars", "Blue Whale", "H2o", "Wind", "Jupiter", "Leonardo da Vinci", "Bird", "Photosynthesis", "Au"];

// Initialize variables
let correctCount = 0;
let performanceChart; // Declare the performanceChart variable here


// click event listener to the "Submit" button
submitButton.addEventListener('click', () => {
  correctCount = 0;
  // show reset button
  reset.style.display = 'inline-block';
  // Make the correct option green and wrong one red
  for (let i = 1; i <= 10; i++) {
    const options = document.querySelectorAll(`input[name="vbtn-radio-${i}"]`);
    options.forEach((option) => {
      const labelElement = option.nextElementSibling; // Get the label element
      const userAnswer = labelElement.textContent;
      if (userAnswer === correctAnswers[i - 1]) {
        labelElement.style.backgroundColor = "green";
        labelElement.style.color = "white"
        labelElement.style.borderColor = "green";
      } else {
        labelElement.style.backgroundColor = "red";
        labelElement.style.color = "white"
        labelElement.style.borderColor = "red";
      }
    });
  }
  // Loop through radio buttons and check answers
  for (let i = 1; i <= 10; i++) {
    const selectedAnswer = document.querySelector(`input[name="vbtn-radio-${i}"]:checked`);
    if (selectedAnswer) {
      const userAnswer = selectedAnswer.nextElementSibling.textContent;
      const feedbackP = document.getElementById(`feedback-${i}-${selectedAnswer.id.slice(-1)}`); // Get the feedback
      
      if (userAnswer === correctAnswers[i - 1]) {
        correctCount++;
        // Display correct feedback
        feedbackP.innerHTML = 'You answered correctly';
        feedbackP.style.color = 'green';
      } else {
        // Display wrong feedback
        feedbackP.innerHTML = 'You answered wrong';
        feedbackP.style.color = 'red';
      }
    }
  }
  
  // Calculate performance percentage
  const totalQuestions = 10;
  const performancePercentage = (correctCount / totalQuestions) * 100;
  // Display the performance percentage
  performanceGraph.textContent = `Performance: ${performancePercentage.toFixed(2)}%`;
  performanceGraph.style.display = 'block';

  
canvas.style.display = "block"
// Create the bar chart
const ctx = canvas.getContext('2d');
performanceChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Performance'],
    datasets: [{
      label: 'Percentage Score',
      data: [performancePercentage],
      backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color of the bar
      borderColor: 'rgba(75, 192, 192, 1)', // Border color of the bar
      borderWidth: 1, // Border width
      barThickness: 60,
    }],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100, 
      },
    },
  },
});

})


// Reset quiz
reset.addEventListener('click', () => {
  performanceGraph.style.display = 'none';
  reset.style.display = 'none';
 
  // Destroy the existing chart if it exists
  if (performanceChart) {
    performanceChart.destroy();
  }

  // Reset Time
  currentTime = targetTime;
  updateTimerDisplay();
  feedbackElements.forEach((feedbackElement) => {
    feedbackElement.innerHTML = '';
  });

  //Turns the option back to default
  const options = document.querySelectorAll(`input[type="radio"]`);
  options.forEach((option) => {
    const labelElement = option.nextElementSibling; // Get the label element
    // Reset the color and background color
    labelElement.style.color = "#4fd8f4";
    labelElement.style.borderColor = "#4fd8f4";
    labelElement.style.backgroundColor = "white";
  });

  // Changes the background color of selected option
  for (let i = 1; i <= 10; i++) {
    const radioButtons = document.querySelectorAll(`input[name="vbtn-radio-${i}"]`);
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener('click', () => {
        // Set the background color of the selected option to "blue"
        const selectedOption = document.querySelector(`input[name="vbtn-radio-${i}"]:checked`);
        // makes sure only one option is selected at a time 
        radioButtons.forEach((otherRadioButton) => {
          const otherLabel = otherRadioButton.nextElementSibling;
          if (otherRadioButton !== selectedOption) {
            otherRadioButton.checked = false; // Uncheck the other option 
            otherLabel.style.color = "#4fd8f4";
            otherLabel.style.borderColor = "#4fd8f4";
            otherLabel.style.backgroundColor = "white";
          } else {
            const selectedLabel = selectedOption.nextElementSibling;
            selectedOption.checked = true;
            selectedLabel.style.backgroundColor = "#0dcaf0";
            selectedLabel.style.color = "white";
            selectedLabel.style.borderColor = "#4fd8f4";
          }
        });
      });
    });
  }
  
  // Reset the correctCount variable to 0
  correctCount = 0;
  canvas.style.display = 'none';
});

