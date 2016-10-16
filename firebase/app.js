/// define page elements
var username = document.getElementById('username');
var message = document.getElementById('message');
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var login = document.getElementById('login');

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBqUE7KXY8pGmTs4jVnwA0TEBZp0ossHOw",
    authDomain: "testproject1-47ea7.firebaseapp.com",
    databaseURL: "https://testproject1-47ea7.firebaseio.com",
    storageBucket: "testproject1-47ea7.appspot.com",
    messagingSenderId: "584114967619"
  };
  firebase.initializeApp(config);

// define Firebase ref
var messagesRef = firebase.database().ref('messages');

// Retrieve new posts as they are added to Firebase
messagesRef.on("child_added", function(data) {
  var newPost = data.val();
  
  var msg = document.createElement("div");
  msg.innerText = newPost.username + ": " + newPost.message;
  
  messages.appendChild(msg);
  console.log(newPost);
  
});

form.addEventListener('submit', function(event) {
  event.preventDefault();  //prevent form from doing page reload
  console.log("form submitted");  //show in the log that we submitted
  //append the posted data to the fire database
  messagesRef.push({'username':username.value,'message':message.value});
  
  message.value = "";  //clear the page message
  message.focus();  //put the cursor in the box for the next message
});

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');

login.addEventListener('click', function(event) {

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log("Authenticated successfully with payload:", user);
      username.value = user.displayName;
      username.disabled = true;

      form.style.display = "block";
      login.style.display = "none";

    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

});


