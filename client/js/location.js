// Add this at the top of your file to help with debugging
console.log('Location.js loaded');

// Hide loading screen when page loads
window.addEventListener('load', function() {
  const loadingScreen = document.getElementById("test");
  loadingScreen.style.display = "none";
  
  // Check for success message in URL
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  if (success === 'listing_created') {
    showSuccess('Your listing has been created successfully!');
  }
});

function sliderFunction(slider, items, next, prev, dots) {
  let lengthItems = items.length - 1;
  let active = 0;
  next.onclick = function () {
    active = active + 1 <= lengthItems ? active + 1 : 0;
    reloadSlider();
  };
  prev.onclick = function () {
    active = active - 1 >= 0 ? active - 1 : lengthItems;
    reloadSlider();
  };
  let refreshInterval = setInterval(() => {
    next.click();
  }, 3000);
  function reloadSlider() {
    slider.style.left = -items[active].offsetLeft + "px";
    //
    let last_active_dot = document.querySelector(".slider .dots li.active");
    last_active_dot.classList.remove("active");
    dots[active].classList.add("active");

    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
      next.click();
    }, 3000);
  }

  dots.forEach((li, key) => {
    li.addEventListener("click", () => {
      active = key;
      reloadSlider();
    });
  });
  window.onresize = function () {
    reloadSlider();
  };
}

const librarySlider = document.querySelector(".librarySlider .list");
const libraryItems = document.querySelectorAll(".librarySlider .list .library");
const libraryNext = document.getElementById("nextLibrary");
const libraryPrev = document.getElementById("prevLibrary");
const libraryDots = document.querySelectorAll(".librarySlider .libraryDots li");

sliderFunction(
  librarySlider,
  libraryItems,
  libraryNext,
  libraryPrev,
  libraryDots
);

const poolSlider = document.querySelector(".poolSlider .list");
const poolItems = document.querySelectorAll(".poolSlider .list .pool");
const poolNext = document.getElementById("nextPool");
const poolPrev = document.getElementById("prevPool");
const poolDots = document.querySelectorAll(".poolSlider .poolDots li");

sliderFunction(
  poolSlider,
  poolItems,
  poolNext,
  poolPrev,
  poolDots
);
const arr = document.querySelectorAll(".card");
console.log(arr);

// Handle search functionality
const searchBar = document.getElementById("search");
const cards = document.querySelectorAll(".card");

searchBar.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  cards.forEach((card) => {
    const cardTitle = card.querySelector(".card-title").textContent.toLowerCase();
    const cardSubtitle = card.querySelector(".card-subtitle").textContent.toLowerCase();
    const cardText = card.querySelector(".card-text").textContent.toLowerCase();
    
    const isVisible = cardTitle.includes(searchValue) || 
                     cardSubtitle.includes(searchValue) || 
                     cardText.includes(searchValue);

    card.classList.toggle("hide", !isVisible);
  });
});

// Handle card button clicks
cards.forEach(card => {
  const button = card.querySelector(".contactBtn");
  if (button) {
    button.addEventListener("click", () => {
      const title = card.querySelector(".card-title").textContent;
      handleCardAction(title);
    });
  }
});

// Update the event listener for the Post Listing button with debugging
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Find all buttons with the text "Post Listing"
  const allButtons = document.querySelectorAll('.contactBtn');
  console.log('Found contactBtn elements:', allButtons.length);
  
  const postListingButtons = Array.from(allButtons).filter(btn => 
    btn.textContent.trim() === 'Post Listing'
  );
  console.log('Post Listing buttons found:', postListingButtons.length);
  
  // Direct approach - find the specific button in the post-listing-card
  const directButton = document.querySelector('.post-listing-card .contactBtn');
  console.log('Direct button found:', directButton);
  
  if (directButton) {
    console.log('Adding click event to direct button');
    directButton.addEventListener('click', () => {
      console.log('Direct button clicked');
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('userName');
      if (!isLoggedIn) {
        window.location.href = '../html/login.html';
        return;
      }
      // Navigate to create listing page
      console.log('Redirecting to create-listing.html');
      window.location.href = '../html/create-listing.html';
    });
  }
  
  // Also add listeners to all filtered buttons
  postListingButtons.forEach(button => {
    console.log('Adding click event to filtered button');
    button.addEventListener('click', () => {
      console.log('Filtered button clicked');
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('userName');
      if (!isLoggedIn) {
        window.location.href = '../html/login.html';
        return;
      }
      // Navigate to create listing page
      console.log('Redirecting to create-listing.html');
      window.location.href = '../html/create-listing.html';
    });
  });
  
  // Fallback approach - add click handler to all contact buttons
  allButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const buttonText = button.textContent.trim();
      console.log('Button clicked with text:', buttonText);
      
      if (buttonText === 'Post Listing') {
        console.log('Post Listing button clicked via fallback');
        e.preventDefault();
        e.stopPropagation();
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('userName');
        if (!isLoggedIn) {
          window.location.href = '../html/login.html';
          return;
        }
        // Navigate to create listing page
        console.log('Redirecting to create-listing.html via fallback');
        window.location.href = '../html/create-listing.html';
      }
    });
  });
});

// Also add a direct event listener outside of DOMContentLoaded
window.addEventListener('load', function() {
  console.log('Window fully loaded');
  
  // Try to find the button again after everything is loaded
  const postListingButton = document.querySelector('.post-listing-card .contactBtn');
  console.log('Post listing button found on window load:', postListingButton);
  
  if (postListingButton) {
    console.log('Adding click event on window load');
    postListingButton.addEventListener('click', function() {
      console.log('Button clicked on window load handler');
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('userName');
      if (!isLoggedIn) {
        window.location.href = '../html/login.html';
        return;
      }
      // Navigate to create listing page
      console.log('Redirecting to create-listing.html from window load handler');
      window.location.href = '../html/create-listing.html';
    });
  }
});

function handleCardAction(title) {
  switch(title) {
    case "Post New Listing":
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('userName');
      if (!isLoggedIn) {
        window.location.href = '../html/login.html';
        return;
      }
      // Navigate to create listing page
      window.location.href = '../html/create-listing.html';
      break;
    case "Furniture":
    case "Room Listings":
    case "Textbooks":
    case "Electronics":
    case "Sports Equipment":
    case "Other Items":
      // Redirect to listings page with category parameter
      window.location.href = `../html/listings.html?category=${encodeURIComponent(title)}`;
      break;
    case "My Listings":
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('userName');
      if (!isLoggedIn) {
        window.location.href = '../html/login.html';
        return;
      }
      loadUserListings();
      break;
    case "Saved Items":
      // Check if user is logged in
      const savedUser = localStorage.getItem('userName');
      if (!savedUser) {
        window.location.href = '../html/login.html';
        return;
      }
      loadSavedItems();
      break;
  }
}

// Function to load listings by category
async function loadListings(page = 1, category = null, search = '') {
  try {
    const queryParams = new URLSearchParams({
      page,
      sort: 'createdAt:desc',
      ...(category && { category }),
      ...(search && { search })
    });

    const response = await fetch(`/api/marketplace/listings?${queryParams}`);
    const data = await response.json();
    
    // Create a container for the listings if it doesn't exist
    let listingsContainer = document.querySelector('.listings-container');
    if (!listingsContainer) {
      listingsContainer = document.createElement('div');
      listingsContainer.className = 'listings-container';
      
      // Insert after the categories section
      const categoriesSection = document.querySelector('.categories-section');
      categoriesSection.parentNode.insertBefore(listingsContainer, categoriesSection.nextSibling);
      
      // Add a heading
      const heading = document.createElement('h3');
      heading.className = 'section-title';
      heading.textContent = category ? `${category} Listings` : 'All Listings';
      listingsContainer.appendChild(heading);
      
      // Add a container for the listings
      const listingsWrap = document.createElement('div');
      listingsWrap.className = 'card-wrap';
      listingsContainer.appendChild(listingsWrap);
    }
    
    // Render the listings
    renderListings(data.listings);
    
    // Setup pagination if needed
    if (data.totalPages > 1) {
      setupPagination(data.totalPages, data.currentPage, category);
    }
  } catch (error) {
    console.error('Error loading listings:', error);
    showError('Failed to load listings. Please try again later.');
  }
}

// Function to render listings
function renderListings(listings) {
  const listingsWrap = document.querySelector('.listings-container .card-wrap');
  if (!listingsWrap) return;
  
  if (listings.length === 0) {
    listingsWrap.innerHTML = '<div class="no-listings">No listings found. Be the first to post!</div>';
    return;
  }
  
  listingsWrap.innerHTML = listings.map(listing => `
    <div class="card" data-id="${listing._id}">
      <div class="card-head">
        <h6 class="card-status">${listing.status}</h6>
        <h4 class="card-title">${listing.title}</h4>
        <span class="card-subtitle">${listing.category}</span>
      </div>
      <img src="${listing.images[0]}" alt="${listing.title}" />
      <div class="innerCard">
        <p class="card-text">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
        <div class="price">$${listing.price}</div>
        <button class="contactBtn" onclick="viewListing('${listing._id}')">View Details</button>
      </div>
    </div>
  `).join('');
}

// Function to setup pagination
function setupPagination(totalPages, currentPage, category) {
  let paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) {
    paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    document.querySelector('.listings-container').appendChild(paginationContainer);
  }
  
  let paginationHTML = '';
  
  // Previous button
  paginationHTML += `
    <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
            ${currentPage === 1 ? 'disabled' : `onclick="loadListings(${currentPage - 1}, '${category}')"`}>
      Previous
    </button>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      paginationHTML += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                onclick="loadListings(${i}, '${category}')">
          ${i}
        </button>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }
  
  // Next button
  paginationHTML += `
    <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
            ${currentPage === totalPages ? 'disabled' : `onclick="loadListings(${currentPage + 1}, '${category}')"`}>
      Next
    </button>
  `;
  
  paginationContainer.innerHTML = paginationHTML;
}

// Function to load user's listings
async function loadUserListings() {
  try {
    const response = await fetch('/api/marketplace/my-listings', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    
    // Create a container for the listings if it doesn't exist
    let listingsContainer = document.querySelector('.my-listings-container');
    if (!listingsContainer) {
      listingsContainer = document.createElement('div');
      listingsContainer.className = 'my-listings-container';
      
      // Insert after the user section
      const userSection = document.querySelector('.user-section');
      userSection.parentNode.insertBefore(listingsContainer, userSection.nextSibling);
      
      // Add a heading
      const heading = document.createElement('h3');
      heading.className = 'section-title';
      heading.textContent = 'My Listings';
      listingsContainer.appendChild(heading);
      
      // Add a container for the listings
      const listingsWrap = document.createElement('div');
      listingsWrap.className = 'card-wrap';
      listingsContainer.appendChild(listingsWrap);
    }
    
    // Render the listings
    renderUserListings(data.listings);
  } catch (error) {
    console.error('Error loading user listings:', error);
    showError('Failed to load your listings. Please try again.');
  }
}

// Function to render user listings
function renderUserListings(listings) {
  const listingsWrap = document.querySelector('.my-listings-container .card-wrap');
  if (!listingsWrap) return;
  
  if (listings.length === 0) {
    listingsWrap.innerHTML = '<div class="no-listings">You haven\'t posted any listings yet.</div>';
    return;
  }
  
  listingsWrap.innerHTML = listings.map(listing => `
    <div class="card" data-id="${listing._id}">
      <div class="card-head">
        <h6 class="card-status">${listing.status}</h6>
        <h4 class="card-title">${listing.title}</h4>
        <span class="card-subtitle">${listing.category}</span>
      </div>
      <img src="${listing.images[0]}" alt="${listing.title}" />
      <div class="innerCard">
        <p class="card-text">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
        <div class="price">$${listing.price}</div>
        <div class="card-actions">
          <button class="contactBtn" onclick="viewListing('${listing._id}')">View Details</button>
          <button class="editBtn" onclick="editListing('${listing._id}')">Edit</button>
          <button class="deleteBtn" onclick="deleteListing('${listing._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to load saved items
async function loadSavedItems() {
  try {
    const response = await fetch('/api/marketplace/saved-items', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    
    // Create a container for the listings if it doesn't exist
    let listingsContainer = document.querySelector('.saved-items-container');
    if (!listingsContainer) {
      listingsContainer = document.createElement('div');
      listingsContainer.className = 'saved-items-container';
      
      // Insert after the user section
      const userSection = document.querySelector('.user-section');
      userSection.parentNode.insertBefore(listingsContainer, userSection.nextSibling);
      
      // Add a heading
      const heading = document.createElement('h3');
      heading.className = 'section-title';
      heading.textContent = 'Saved Items';
      listingsContainer.appendChild(heading);
      
      // Add a container for the listings
      const listingsWrap = document.createElement('div');
      listingsWrap.className = 'card-wrap';
      listingsContainer.appendChild(listingsWrap);
    }
    
    // Render the listings
    renderSavedItems(data.listings);
  } catch (error) {
    console.error('Error loading saved items:', error);
    showError('Failed to load saved items. Please try again.');
  }
}

// Function to render saved items
function renderSavedItems(listings) {
  const listingsWrap = document.querySelector('.saved-items-container .card-wrap');
  if (!listingsWrap) return;
  
  if (listings.length === 0) {
    listingsWrap.innerHTML = '<div class="no-listings">You haven\'t saved any items yet.</div>';
    return;
  }
  
  listingsWrap.innerHTML = listings.map(listing => `
    <div class="card" data-id="${listing._id}">
      <div class="card-head">
        <h6 class="card-status">${listing.status}</h6>
        <h4 class="card-title">${listing.title}</h4>
        <span class="card-subtitle">${listing.category}</span>
      </div>
      <img src="${listing.images[0]}" alt="${listing.title}" />
      <div class="innerCard">
        <p class="card-text">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
        <div class="price">$${listing.price}</div>
        <div class="card-actions">
          <button class="contactBtn" onclick="viewListing('${listing._id}')">View Details</button>
          <button class="unsaveBtn" onclick="unsaveListing('${listing._id}')">Unsave</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to view listing details
async function viewListing(id) {
  try {
    const response = await fetch(`/api/marketplace/listings/${id}`);
    const listing = await response.json();
    
    // Create and show listing details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content listing-details">
        <h2>${listing.title}</h2>
        <div class="listing-images">
          ${listing.images.map(img => `<img src="${img}" alt="${listing.title}">`).join('')}
        </div>
        <div class="listing-info">
          <p class="price">$${listing.price}</p>
          <p class="category">${listing.category}</p>
          <p class="condition">Condition: ${listing.condition}</p>
          <p class="location">Location: ${listing.location}</p>
          <p class="description">${listing.description}</p>
          <div class="seller-info">
            <p>Seller: ${listing.seller.name}</p>
            <p>Contact: ${listing.contactInfo.preferredContact === 'Email' ? listing.contactInfo.email : listing.contactInfo.phone}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button onclick="contactSeller('${listing._id}')">Contact Seller</button>
          <button onclick="saveListing('${listing._id}')">Save Item</button>
          <button onclick="closeModal()">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error loading listing details:', error);
    showError('Failed to load listing details. Please try again.');
  }
}

// Function to edit a listing
function editListing(id) {
  window.location.href = `create-listing.html?id=${id}`;
}

// Function to delete a listing
async function deleteListing(id) {
  if (!confirm('Are you sure you want to delete this listing?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/marketplace/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      showSuccess('Listing deleted successfully!');
      loadUserListings();
    } else {
      throw new Error('Failed to delete listing');
    }
  } catch (error) {
    console.error('Error deleting listing:', error);
    showError('Failed to delete listing. Please try again.');
  }
}

// Function to save a listing
async function saveListing(id) {
  try {
    const response = await fetch(`/api/marketplace/listings/${id}/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      showSuccess('Item saved successfully!');
    } else {
      throw new Error('Failed to save item');
    }
  } catch (error) {
    console.error('Error saving item:', error);
    showError('Failed to save item. Please try again.');
  }
}

// Function to unsave a listing
async function unsaveListing(id) {
  try {
    const response = await fetch(`/api/marketplace/listings/${id}/unsave`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      showSuccess('Item removed from saved items!');
      loadSavedItems();
    } else {
      throw new Error('Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    showError('Failed to remove item. Please try again.');
  }
}

// Function to contact a seller
function contactSeller(id) {
  // This would typically open a messaging interface
  alert('Messaging feature coming soon!');
}

// Function to close modal
function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.remove();
  }
}

// Utility function to show error messages
function showError(message) {
  alert(message); // You can replace this with a better UI notification
}

// Utility function to show success messages
function showSuccess(message) {
  alert(message); // You can replace this with a better UI notification
}

// Export functions that need to be accessed from HTML
window.viewListing = viewListing;
window.closeModal = closeModal;
window.editListing = editListing;
window.deleteListing = deleteListing;
window.saveListing = saveListing;
window.unsaveListing = unsaveListing;
window.contactSeller = contactSeller;
window.loadListings = loadListings;
