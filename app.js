// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth,
        createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
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

// ================================================== Get references to HTML elements
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

// ================================================ Hide the instruction and quiz-question
topSecret.style.display = 'none';
questionSection.style.display = 'none';


//================================================= Sign User Up
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

// ================================================== Sign User In
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

// ================================================= Check user authentication status
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

// ================================================== Sign User Out
  const signUserOut = async() => {
      await signOut(auth);
  }

  signOutButton.addEventListener('click', () => {
      signUserOut();
      questionSection.style.display = 'none';
  })
    
// ================================================== Function to update the timer display
    let targetTime = 300;
    let currentTime = targetTime;
    function updateTimerDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timer.textContent = formattedTime;
    }

// =================================================== Function to start the countdown
let timerInterval; // Declare the timerInterval variable outside the function

function startCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval); // Clear the previous timer if it exists
  }

  timerInterval = setInterval(() => {
    if (currentTime <= 0) {
      clearInterval(timerInterval);
      submitButton.click();
    } else {
      currentTime--;
      updateTimerDisplay();
    }
  }, 1000);
}

function pauseCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}
    start.addEventListener('click', () => {
      topSecret.style.display = 'none';
      timer.style.display = 'block';
      questionSection.style.display = 'block';
      startCountdown();
    })

// =================================== Changes the background color of selected option
for (let i = 1; i <= 10; i++) {
  const radioButtons = document.querySelectorAll(`input[name="vbtn-radio-${i}"]`);
  radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('click', () => {
// Set the background color of the selected option to "blue" and makes sure only one option is selected at a time
      const selectedOption = document.querySelector(`input[name="vbtn-radio-${i}"]:checked`);
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




// ================================================== Bar Chart
let performanceChart; // Declare the performanceChart variable here
function barChart (performancePercentage) {
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
}

// ================================================== Function to disable the input
// ...

// Function to disable radio buttons
function disableRadioButtons() {
  for (let i = 1; i <= 10; i++) {
  const radioButtons = document.querySelectorAll(`input[name="vbtn-radio-${i}"]`);
  radioButtons.forEach((radioButton) => {
    radioButton.disabled = true;
  });
}
}

// Function to enable radio buttons
function enableRadioButtons() {
  for (let i = 1; i <= 10; i++) {
    const radioButtons = document.querySelectorAll(`input[name="vbtn-radio-${i}"]`);
    radioButtons.forEach((radioButton) => {
      radioButton.disabled = false;
    });
  }
  }


// ================================================= Define correct answers
const correctAnswers = ["Paris", "Mars", "Blue Whale", "H2o", "Wind", "Jupiter", "Leonardo da Vinci", "Bird", "Photosynthesis", "Au"];

// ================================================= Initialize variables
let correctCount = 0;
let questionAnswered = 0;
let answeredQuestions = new Set();
let allQuestionsAnswered;


//================================= Function to check how many questions have been answered
function checkQuestion() {
  // Set allQuestionsAnswered based on whether all 10 questions have been answered
  allQuestionsAnswered = questionAnswered === 10;
}

// Get all radio buttons
const radioButtons = document.querySelectorAll('input[type="radio"]');

// Attach event listeners to radio buttons
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('click', () => {
    const questionName = radioButton.getAttribute('name');
    if (!answeredQuestions.has(questionName) && radioButton.checked) {
      answeredQuestions.add(questionName);
      questionAnswered++;
    }
  });
  });
// ================================================= "Submit" Quiz
submitButton.addEventListener('click', () => {
  checkQuestion();
  if (allQuestionsAnswered) {
    correctCount = 0;
    //  ======== Display feedback if any questions are answered
      for (let i = 1; i <= 10; i++) {
        const selectedAnswers = document.querySelectorAll(`input[name="vbtn-radio-${i}"]:checked`);
        selectedAnswers.forEach((selectedAnswer) => {
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
        });  
      }
       // Calculate performance percentage
       const totalQuestions = 10;
       const performancePercentage = (correctCount / totalQuestions) * 100;
       // Display the performance percentage
        performanceGraph.textContent = `Performance: ${performancePercentage.toFixed(2)}%`;
        performanceGraph.style.display = "block";
        barChart(performancePercentage)
    
     // Make the correct option green and wrong one red
      for (let i = 1; i <= 10; i++) {
        const options = document.querySelectorAll(`input[name="vbtn-radio-${i}"]:checked`);
         // Flag to track if the question is answered
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
      // pause countdown
      pauseCountdown()
      // disable radio buttons
      disableRadioButtons();
  } else {
    const errorToast = new bootstrap.Toast(document.getElementById('errorToast-2'));
      const errorToastBody = document.querySelector('#errorToast-2 .toast-body');
      errorToastBody.textContent = 'Please answer all questions before submitting';
      errorToast.show();
      performanceGraph.style.display = 'none';
      canvas.style.display = "none";
        const options = document.querySelectorAll(`input[type="radio"]`);
        options.forEach((option) => {
          const labelElement = option.nextElementSibling; // Get the label element
          // Reset the color and background color
          labelElement.style.color = "#4fd8f4";
          labelElement.style.borderColor = "#4fd8f4";
          labelElement.style.backgroundColor = "white";
        });
        questionAnswered = 0;
        correctCount = 0;
        answeredQuestions.clear();
        currentTime = targetTime;
        updateTimerDisplay();
        startCountdown();
    }
  });

//Reset quiz
reset.addEventListener('click', () => {
  performanceGraph.style.display = 'none';
  //Turns the option back to default
  const options = document.querySelectorAll(`input[type="radio"]`);
  options.forEach((option) => {
    const labelElement = option.nextElementSibling; // Get the label element
    // Reset the color and background color
    labelElement.style.color = "#4fd8f4";
    labelElement.style.borderColor = "#4fd8f4";
    labelElement.style.backgroundColor = "white";
  });

  // Reset the correctCount variable to 0
  currentTime = targetTime;
  updateTimerDisplay();
  startCountdown();
  feedbackElements.forEach((feedbackElement) => {
    feedbackElement.innerHTML = '';
  });

  // Reset the correctCount variable to 0
  correctCount = 0;
  answeredQuestions.clear();
  questionAnswered = 0;
  // Destroy the existing chart if it exists
  if (performanceChart) {
    performanceChart.destroy();
  }
  canvas.style.display = 'none';
  //   enable radio button
  enableRadioButtons()
});





