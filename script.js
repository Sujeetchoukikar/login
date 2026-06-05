function showSignup() {

  document.getElementById("loginForm").classList.add("hidden");

  document.getElementById("signupForm").classList.remove("hidden");
}

function showLogin() {

  document.getElementById("signupForm").classList.add("hidden");

  document.getElementById("loginForm").classList.remove("hidden");
}

function signup() {

  const name = document.getElementById("signupName").value;

  const email = document.getElementById("signupEmail").value;

  const password = document.getElementById("signupPassword").value;

  if(name === "" || email === "" || password === ""){

    alert("Please fill all signup fields");

    return;
  }

  alert("Signup Successful");

  showLogin();
}

function login() {

  const email = document.getElementById("loginEmail").value;

  const password = document.getElementById("loginPassword").value;

  if(email === "" || password === ""){

    alert("Please fill all login fields");

    return;
  }

  alert("Login Successful");

  // Redirect to details page
  window.location.href = "details.html";
}
