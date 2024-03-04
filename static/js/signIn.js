// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getDatabase, ref, set, update, child, get}
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsv6msCEpUTfM00vZsgogzoAoqPJ55dJs",
    authDomain: "research-website-4ac25.firebaseapp.com",
    databaseURL: "https://research-website-4ac25-default-rtdb.firebaseio.com",
    projectId: "research-website-4ac25",
    storageBucket: "research-website-4ac25.appspot.com",
    messagingSenderId: "872371135515",
    appId: "1:872371135515:web:a8a33ad7c15cbc8eedc4be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();         

// Returns instance of your app's FRD
const db = getDatabase(app) 

// ---------------------- Sign-In User ---------------------------------------//

document.getElementById('signIn').onclick = function(){
    // Get user's email and password for sign in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    //console.log(email, password);
    // Attempt to sign user in 
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create user credentias and store user ID
        const user = userCredential.user;

        // Log sign-in date in DB
        // 'Update' function will only add the last_login info and won't overwrite anything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate,
        })
        .then(() => {
            // User signed in successfully
            alert('User signed in successully!')

            // Get snapshot of all the user info (including uid) that will be passed to the login() and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if(snapshot.exists()){
                    console.log(snapshot.val());
                    logIn(snapshot.val(), firebaseConfig);     //logIn function
                } else {
                    console.log("User does not exist")
                }
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            // Sign-In failed...
            alert(error)
        });
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
    })

}

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user, fbcfg){
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    fbcfg.userID = user.uid

    // Session storage is temporary (only while active session)
    // Info. saved as a string (must convert to JS object)
    // Session storage will be cleared with a signOut() function in home.js
    if(!keepLoggedIn){
        sessionStorage.setItem('user', JSON.stringify(user));

        fetch('/test', {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(fbcfg),
        })

        window.location="home"     // Redirect browser to home.html
    }

    // Local storage is permanent (keep user logged in if browser is closed)
    // Local storage will be cleared with signOut() function
    else{
        localStorage.setItem('keepLoggedIn', 'yes')
        localStorage.setItem('user', JSON.stringify(user));
        
        fetch('/test', {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(fbcfg),
        })

        window.location="home"     // Redirect browser to home.html
    }
}
