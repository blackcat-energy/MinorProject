// Common authentication functions
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Get current user
async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auth error:', error);
    localStorage.removeItem('token');
    return null;
  }
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Register function
async function register(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    
    return data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  // You could redirect to home page or refresh the current page
  // window.location.href = '/';
}

// Initialize auth UI
function initAuthUI() {
  console.log("Initializing auth UI");
  
  // Set up login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    console.log("Found login form, adding submit handler");
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      console.log("Login form submitted");
      
      fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Login failed');
        }
      })
      .then(data => {
        console.log("Login successful, storing token");
        localStorage.setItem('token', data.token);
        
        // Close login modal
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.style.display = 'none';
        }
        
        // Show success message and reload
        alert('Login successful!');
        window.location.reload();
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials and try again.');
      });
    });
  }
  
  // Set up register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    console.log("Found register form, adding submit handler");
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      
      console.log("Register form submitted");
      
      fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(text => {
            throw new Error(text || 'Registration failed');
          });
        }
      })
      .then(data => {
        console.log("Registration successful, storing token");
        localStorage.setItem('token', data.token);
        
        // Close register modal
        const registerModal = document.getElementById('registerModal');
        if (registerModal) {
          registerModal.style.display = 'none';
        }
        
        // Show success message and reload
        alert('Registration successful!');
        window.location.reload();
      })
      .catch(error => {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
      });
    });
  }
  
  // Set up modal switches
  const switchToLoginLink = document.getElementById('switchToLogin');
  if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      const registerModal = document.getElementById('registerModal');
      const loginModal = document.getElementById('loginModal');
      if (registerModal) registerModal.style.display = 'none';
      if (loginModal) loginModal.style.display = 'block';
    });
  }
  
  const switchToRegisterLink = document.getElementById('switchToRegister');
  if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      const loginModal = document.getElementById('loginModal');
      const registerModal = document.getElementById('registerModal');
      if (loginModal) loginModal.style.display = 'none';
      if (registerModal) registerModal.style.display = 'block';
    });
  }
  
  // Set up close buttons
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
}

// Call this when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing auth UI");
  initAuthUI();
});

// Centralized function to show login modal
function showLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'block';
  } else {
    alert("Login modal not found. Please log in to continue.");
  }
}

// Use this function in both navbar.js and location.js