console.log("Discussions portal script loaded");

// API URL
const API_URL = 'http://localhost:5000/api';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  // Auth elements
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  const newPostModal = document.getElementById('newPostModal');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const newPostForm = document.getElementById('newPostForm');
  const loggedOutView = document.getElementById('loggedOutView');
  const loggedInView = document.getElementById('loggedInView');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const showLoginBtn = document.getElementById('showLoginBtn');
  const showRegisterBtn = document.getElementById('showRegisterBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const switchToLoginLink = document.getElementById('switchToLogin');
  const switchToRegisterLink = document.getElementById('switchToRegister');
  
  // Post elements
  const postsFeed = document.getElementById('postsFeed');
  const newPostBtn = document.getElementById('newPostBtn');
  const sortSelect = document.getElementById('sortSelect');
  
  // Close buttons
  const closeButtons = document.querySelectorAll('.close');
  
  // State
  let currentUser = null;
  let posts = [];
  
  // Check if user is logged in
  checkAuthStatus();
  
  // Fetch posts
  fetchPosts();
  
  // Event Listeners
  
  // Auth buttons
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', function() {
      if (loginModal) loginModal.style.display = 'block';
    });
  }
  
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', function() {
      if (registerModal) registerModal.style.display = 'block';
    });
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Switch between login and register
  if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (registerModal) registerModal.style.display = 'none';
      if (loginModal) loginModal.style.display = 'block';
    });
  }
  
  if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (loginModal) loginModal.style.display = 'none';
      if (registerModal) registerModal.style.display = 'block';
    });
  }
  
  // New post button
  if (newPostBtn) {
    newPostBtn.addEventListener('click', function() {
      console.log("New Post button clicked");
      console.log("User logged in status:", isLoggedIn());
      
      if (!isLoggedIn()) {
        // If not logged in, show login modal
        if (loginModal) {
          console.log("Showing login modal");
          loginModal.style.display = 'block';
        }
      } else {
        // If logged in, show new post modal
        if (newPostModal) {
          console.log("Showing new post modal");
          newPostModal.style.display = 'block';
        }
      }
    });
  }
  
  // Close buttons
  if (closeButtons) {
    closeButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) modal.style.display = 'none';
      });
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
  
  // Sort posts
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortPosts(this.value);
    });
  }
  
  // Form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const usernameOrEmail = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Login failed');
        }
      })
      .then(data => {
        console.log("Login successful, token received:", !!data.token);
        localStorage.setItem('token', data.token);
        currentUser = data.user;
        
        // Close login modal
        if (loginModal) {
          loginModal.style.display = 'none';
        }
        
        // Update UI
        if (document.getElementById('loggedOutView')) {
          document.getElementById('loggedOutView').style.display = 'none';
        }
        if (document.getElementById('loggedInView')) {
          document.getElementById('loggedInView').style.display = 'flex';
        }
        if (document.getElementById('usernameDisplay')) {
          document.getElementById('usernameDisplay').textContent = data.user.username;
        }
        
        // Show success message
        alert('Login successful!');
      })
      .catch(error => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials and try again.');
      });
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      register(username, email, password);
    });
  }
  
  if (newPostForm) {
    console.log("New post form found, adding submit handler");
    
    newPostForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log("New post form submitted");
      
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      
      console.log("Form values:", { title, content });
      
      // Call createPost without tags
      createPost(title, content);
    });
  } else {
    console.error("New post form not found");
  }
  
  // Functions
  
  // Check if user is logged in
  function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetch(`${API_URL}/users/me`, {
        headers: {
          'x-auth-token': token
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Invalid token');
        }
      })
      .then(data => {
        currentUser = data;
        updateAuthUI(true);
      })
      .catch(error => {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        currentUser = null;
        updateAuthUI(false);
      });
    } else {
      updateAuthUI(false);
    }
  }
  
  // Update UI based on auth status
  function updateAuthUI(isLoggedIn) {
    if (isLoggedIn && currentUser) {
      if (loggedOutView) loggedOutView.style.display = 'none';
      if (loggedInView) loggedInView.style.display = 'flex';
      if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
    } else {
      if (loggedOutView) loggedOutView.style.display = 'flex';
      if (loggedInView) loggedInView.style.display = 'none';
    }
  }
  
  // Register
  function register(username, email, password) {
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
        throw new Error('Registration failed');
      }
    })
    .then(data => {
      localStorage.setItem('token', data.token);
      currentUser = data.user;
      updateAuthUI(true);
      
      // Close register modal
      if (registerModal) registerModal.style.display = 'none';
      
      // Show success message
      alert('Registration successful!');
    })
    .catch(error => {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    });
  }
  
  // Logout
  function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateAuthUI(false);
    alert('You have been logged out.');
  }
  
  // Fetch posts
  function fetchPosts() {
    if (!postsFeed) return;
    
    postsFeed.innerHTML = `
      <div class="loading-indicator">
        <p>Loading posts...</p>
      </div>
    `;
    
    fetch(`${API_URL}/posts`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch posts');
        }
      })
      .then(data => {
        posts = data;
        renderPosts();
        sortPosts(sortSelect ? sortSelect.value : 'trending');
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        postsFeed.innerHTML = `
          <div class="error-message">
            <p>Error loading posts: ${error.message}</p>
          </div>
        `;
      });
  }
  
  // Render posts
  function renderPosts() {
    if (!postsFeed) return;
    
    if (posts.length === 0) {
      postsFeed.innerHTML = `
        <div class="empty-state">
          <p>No posts found. Be the first to create a post!</p>
        </div>
      `;
      return;
    }
    
    postsFeed.innerHTML = '';
    
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post-card';
      postElement.dataset.id = post._id;
      
      postElement.innerHTML = `
        <div class="post-votes">
          <button class="vote-btn upvote" data-id="${post._id}" data-vote="up">
            <i class="fas fa-arrow-up"></i>
          </button>
          <span class="vote-count">${(post.upvotes ? post.upvotes.length : 0) - (post.downvotes ? post.downvotes.length : 0)}</span>
          <button class="vote-btn downvote" data-id="${post._id}" data-vote="down">
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
        <div class="post-content">
          <div class="post-header">
            <div class="user-info">
              <img class="avatar" src="../images/default-avatar.png" alt="${post.author ? post.author.username : 'Anonymous'}">
              <span class="username">${post.author ? post.author.username : 'Anonymous'}</span>
              <span class="post-time">${new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div class="post-actions">
              <button class="action-btn">
                <i class="far fa-bookmark"></i>
              </button>
              <button class="action-btn">
                <i class="fas fa-share"></i>
              </button>
            </div>
          </div>
          <h3 class="post-title">${post.title}</h3>
          <p class="post-preview">${post.content}</p>
          <div class="post-footer">
            <button class="comment-btn" data-id="${post._id}">
              <i class="fas fa-comment"></i>
              <span>${post.commentCount || 0} Comments</span>
            </button>
          </div>
        </div>
      `;
      
      postsFeed.appendChild(postElement);
    });
    
    // Add event listeners for votes
    document.querySelectorAll('.vote-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (!currentUser) {
          if (loginModal) loginModal.style.display = 'block';
          return;
        }
        
        const postId = this.dataset.id;
        const voteType = this.dataset.vote;
        votePost(postId, voteType);
      });
    });
    
    // Add event listeners for comments
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const postId = this.dataset.id;
        fetchComments(postId);
      });
    });
  }
  
  // Sort posts
  function sortPosts(sortType) {
    if (!posts || posts.length === 0) return;
    
    switch (sortType) {
      case 'newest':
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'most-upvoted':
        posts.sort((a, b) => {
          const aVotes = (a.upvotes ? a.upvotes.length : 0) - (a.downvotes ? a.downvotes.length : 0);
          const bVotes = (b.upvotes ? b.upvotes.length : 0) - (b.downvotes ? b.downvotes.length : 0);
          return bVotes - aVotes;
        });
        break;
      case 'trending':
      default:
        // For trending, we could use a combination of recency and votes
        posts.sort((a, b) => {
          const aVotes = (a.upvotes ? a.upvotes.length : 0) - (a.downvotes ? a.downvotes.length : 0);
          const bVotes = (b.upvotes ? b.upvotes.length : 0) - (b.downvotes ? b.downvotes.length : 0);
          
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          
          // Simple trending algorithm: votes + recency factor
          const aScore = aVotes + (aDate / 1000000000);
          const bScore = bVotes + (bDate / 1000000000);
          
          return bScore - aScore;
        });
        break;
    }
    
    renderPosts();
  }
  
  // Simplified createPost function without tags
  function createPost(title, content) {
    console.log("Creating post with:", { title, content });
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a post.');
      return;
    }
    
    // Create post data - without tags
    const postData = {
      title,
      content
    };
    
    console.log("Sending post data:", postData);
    console.log("Using token:", token);
    
    // Send request to create post
    fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      console.log("Post creation response status:", response.status);
      
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Server error: ${text}`);
        });
      }
      
      return response.json();
    })
    .then(data => {
      console.log("Post created successfully:", data);
      
      // Close modal
      const newPostModal = document.getElementById('newPostModal');
      if (newPostModal) {
        newPostModal.style.display = 'none';
      }
      
      // Clear form
      const newPostForm = document.getElementById('newPostForm');
      if (newPostForm) {
        newPostForm.reset();
      }
      
      // Refresh posts
      fetchPosts();
      
      // Show success message
      alert('Post created successfully!');
    })
    .catch(error => {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error.message}`);
    });
  }
  
  // Vote on a post
  function votePost(postId, voteType) {
    fetch(`${API_URL}/posts/${postId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ vote: voteType === 'up' ? 'upvote' : 'downvote' })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to vote');
      }
    })
    .then(data => {
      // Update post in local array
      const postIndex = posts.findIndex(p => p._id === postId);
      if (postIndex !== -1) {
        posts[postIndex] = data;
        renderPosts();
      }
    })
    .catch(error => {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    });
  }
  
  // Fetch comments for a post
  function fetchComments(postId) {
    fetch(`${API_URL}/comments/${postId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch comments');
        }
      })
      .then(comments => {
        // For now, just show an alert with the number of comments
        alert(`This post has ${comments.length} comments.`);
        
        // In a real implementation, you would show these in a modal or expand the post
        console.log('Comments:', comments);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        alert('Failed to load comments. Please try again.');
      });
  }
  
  // Add this function to check if the user is logged in
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
});