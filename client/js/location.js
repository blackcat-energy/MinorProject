document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");

  // Find all buttons with the text "Post Listing"
  const postListingButtons = document.querySelectorAll('.contactBtn');

  postListingButtons.forEach(button => {
    if (button.textContent.trim() === 'Post Listing') {
      console.log("Found Post Listing button, setting up click handler");

      // Remove any existing onclick attribute
      button.removeAttribute('onclick');

      // Add a new click event listener
      button.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Post Listing button clicked");

        // Check if user is logged in
        if (isLoggedIn()) {
          console.log("User is logged in, redirecting to create listing page");
          // If logged in, go to create listing page
          window.location.href = 'create-listing.html';
        } else {
          console.log("User is not logged in, showing login modal");
          // If not logged in, show login modal
          showLoginModal();
        }
      });

      console.log("Click handler added to Post Listing button");
    }
  });

  // Fix close buttons for modals
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Find the parent modal
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
});

// Ensure isLoggedIn function is defined
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Ensure showLoginModal function is defined
function showLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'block';
  } else {
    alert("Login modal not found. Please log in to continue.");
  }
}