// ─── UTILITY NAVIGATION ROUTERS ───────────────────────────────────────────────────

function showSignup() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("otpForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("otpForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function showOtp() {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("otpForm").classList.remove("hidden");
}

function globalLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("pendingEmail");
  alert("Session terminated securely.");
  window.location.href = "index.html";
}

// ─── LOGIN ROUTINE OPERATION PROCESSING ───────────────────────────────────────────

async function login() {
  const registration_no = document.getElementById("loginRegNo").value.trim();
  const dob             = document.getElementById("loginDob").value.trim();
  const password        = document.getElementById("loginPassword").value.trim();

  if (!registration_no || !dob || !password) {
    alert("Please fill all login fields safely.");
    return;
  }

  try {
    const response = await fetch("http://13.42.30.223/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_no, dob, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }
      window.location.href = "details.html";
    } else {
      alert(data.detail || data.message || "Login failed. Check structural configuration rules.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Target connection interface dropped. Try again.");
  }
}

// ─── SIGNUP STEP 1: INITIAL DISPATCH REQUEST ────────────────────────────────────

async function sendOtp(isResend = false) {
  const firstname = document.getElementById("signupFirstname").value.trim();
  const lastname  = document.getElementById("signupLastname").value.trim();
  const email     = document.getElementById("signupEmail").value.trim();
  const password  = document.getElementById("signupPassword").value.trim();
  const phone     = document.getElementById("signupPhone").value.trim();
  const dob       = document.getElementById("signupDob").value.trim();

  if (!firstname || !lastname || !email || !password || !phone || !dob) {
    alert("Please fill out all mandatory credentials elements.");
    return;
  }

  // Final verification check constraint rule block before calling backend API
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>\-_=+])$/;
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber  = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+]/.test(password);

  if (!hasCapital || !hasNumber || !hasSpecial) {
    alert("Please satisfy all password rules before requesting verification tokens.");
    document.getElementById("signupPassword").focus();
    return;
  }

  localStorage.setItem("pendingEmail", email);

  try {
    const response = await fetch("http://13.42.30.223/auth/register/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, password, phone, dob })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("otpMessage").textContent = `OTP code dispatched securely to ${email}.`;
      showOtp();
      if (isResend) alert("A new handshake confirmation vector has been dropped successfully.");
    } else {
      alert(data.detail || data.message || "Failed execution loop processing OTP.");
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    alert("Something went wrong processing standard auth routes.");
  }
}

// ─── SIGNUP STEP 2: VERIFICATION PROCESS SUBMISSION ──────────────────────────────

async function verifyOtp() {
  const otp   = document.getElementById("otpInput").value.trim();
  const email = localStorage.getItem("pendingEmail");

  if (!otp) {
    alert("Please enter the verification parameter code.");
    return;
  }

  if (!email) {
    alert("Session cache expiration detected. Restart submission configuration.");
    showSignup();
    return;
  }

  try {
    const response = await fetch("http://13.42.30.223/auth/register/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.removeItem("pendingEmail");
      alert("Registration sequence approved! Proceed to platform initialization profile matching.");
      showLogin();
    } else {
      alert(data.detail || data.message || "Invalid signature key context tracking value.");
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    alert("Verification loop process dropped connection.");
  }
}

// ─── REALTIME PASSWORD DYNAMIC VISIBILITY FILTER ENGINE ─────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("signupPassword");
  if (!passwordInput) return;

  const reqContainer = document.getElementById("passwordRequirements");
  const reqCapital   = document.getElementById("reqCapital");
  const reqNumber    = document.getElementById("reqNumber");
  const reqSpecial   = document.getElementById("reqSpecial");

  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;

    // If the input is empty, hide the entire validation box completely
    if (val === "") {
      reqContainer.style.display = "none";
      return;
    }

    const hasCapital = /[A-Z]/.test(val);
    const hasNumber  = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+]/.test(val);

    // Hide individual elements if they pass, show them if they fail
    reqCapital.style.display = hasCapital ? "none" : "block";
    reqNumber.style.display  = hasNumber ? "none" : "block";
    reqSpecial.style.display = hasSpecial ? "none" : "block";

    // If all three conditions are satisfied, hide the outer boundary block as well
    if (hasCapital && hasNumber && hasSpecial) {
      reqContainer.style.display = "none";
    } else {
      reqContainer.style.display = "flex";
    }
  });
});