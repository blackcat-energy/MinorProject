document.addEventListener('DOMContentLoaded', function() {
    console.log('Listings page loaded');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const page = parseInt(urlParams.get('page')) || 1;
    const search = urlParams.get('search') || '';
    
    // Set initial filter values based on URL parameters
    if (category) {
        // Pre-select the category in the dropdown
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.value = category;
        
        // Update the page title to show the selected category
        document.getElementById('category-title').textContent = category;
        document.title = `${category} - MIT Marketplace`;
    }
    
    // Set up search input
    const searchInput = document.getElementById('search');
    searchInput.value = search;
    
    // Load initial listings with the category from URL
    loadListings(page, category, search);
    
    // Set up filter button event listeners
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // Set up search input event listener
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // Fetch listings from the backend
    async function fetchListings() {
        try {
            const response = await fetch('/api/listings');
            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const listings = await response.json();
            displayListings(listings);
        } catch (error) {
            console.error('Error fetching listings:', error);
            alert('Error fetching listings. Please try again later.');
        }
    }

    // Display listings on the page
    function displayListings(listings) {
        const listingsWrapper = document.getElementById('listings-wrapper');
        listingsWrapper.innerHTML = ''; // Clear any existing content

        if (listings.length === 0) {
            listingsWrapper.innerHTML = '<p>No listings available.</p>';
            return;
        }

        listings.forEach(listing => {
            const listingElement = document.createElement('div');
            listingElement.className = 'listing-card';
            listingElement.innerHTML = `
                <h3>${listing.title}</h3>
                <p>${listing.description}</p>
                <p>Price: $${listing.price}</p>
                <p>Category: ${listing.category}</p>
                <p>Condition: ${listing.condition}</p>
                <button onclick="viewListing('${listing._id}')">View Details</button>
            `;
            listingsWrapper.appendChild(listingElement);
        });
    }

    // Call fetchListings when the page loads
    fetchListings();

    // Function to view listing details
    function viewListing(id) {
        window.location.href = `listing-details.html?id=${id}`;
    }
});

// Function to apply filters
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    const search = document.getElementById('search').value;
    
    // Update URL with filter parameters
    const url = new URL(window.location);
    if (category) url.searchParams.set('category', category);
    else url.searchParams.delete('category');
    
    if (search) url.searchParams.set('search', search);
    else url.searchParams.delete('search');
    
    if (priceRange) url.searchParams.set('price', priceRange);
    else url.searchParams.delete('price');
    
    if (sortBy) url.searchParams.set('sort', sortBy);
    else url.searchParams.delete('sort');
    
    url.searchParams.set('page', '1'); // Reset to first page when filters change
    
    window.history.pushState({}, '', url);
    
    // Update page title
    if (category) {
        document.getElementById('category-title').textContent = category;
    } else {
        document.getElementById('category-title').textContent = 'All Listings';
    }
    
    // Load filtered listings
    loadListings(1, category, search, priceRange, sortBy);
}

// Function to reset filters
function resetFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('price-filter').value = '';
    document.getElementById('sort-filter').value = 'newest';
    document.getElementById('search').value = '';
    
    // Reset URL
    const url = new URL(window.location);
    url.search = '';
    window.history.pushState({}, '', url);
    
    // Reset page title
    document.getElementById('category-title').textContent = 'All Listings';
    
    // Load all listings
    loadListings(1);
}

// Function to load listings
async function loadListings(page = 1, category = '', search = '') {
    const listingsWrapper = document.getElementById('listings-wrapper');
    
    try {
        listingsWrapper.innerHTML = '<div class="loading">Loading listings...</div>';
        
        // Log the request URL
        const url = `/api/marketplace/listings?page=${page}&category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`;
        console.log('Fetching listings from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received listings data:', data);
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch listings');
        }
        
        if (data.listings.length === 0) {
            listingsWrapper.innerHTML = `
                <div class="no-results">
                    <h3>No listings found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }
        
        // Render listings
        const listingsHTML = data.listings.map(listing => `
            <div class="listing-card">
                <div class="listing-image">
                    ${listing.images && listing.images.length > 0 
                        ? `<img src="${listing.images[0]}" alt="${listing.title}">`
                        : '<div class="no-image">No image available</div>'}
                </div>
                <div class="listing-details">
                    <h3>${listing.title}</h3>
                    <p class="price">$${listing.price.toFixed(2)}</p>
                    <p class="category">${listing.category}</p>
                    <p class="condition">Condition: ${listing.condition}</p>
                    <p class="location">Location: ${listing.location}</p>
                    <p class="description">${listing.description.substring(0, 100)}...</p>
                    <div class="listing-actions">
                        <button onclick="viewListing('${listing._id}')" class="view-btn">View Details</button>
                        <button onclick="contactSeller('${listing._id}')" class="contact-btn">Contact Seller</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        listingsWrapper.innerHTML = listingsHTML;
        
        // Render pagination
        renderPagination(data.pagination);
        
    } catch (error) {
        console.error('Error loading listings:', error);
        listingsWrapper.innerHTML = `
            <div class="error-message">
                <h3>Error loading listings</h3>
                <p>${error.message}</p>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Function to render pagination
function renderPagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    const { total, pages, currentPage } = pagination;
    
    if (pages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-buttons">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `
            <button onclick="changePage(${currentPage - 1})" class="pagination-btn">
                Previous
            </button>
        `;
    }
    
    // Page numbers
    for (let i = 1; i <= pages; i++) {
        if (i === currentPage) {
            paginationHTML += `
                <button class="pagination-btn active">${i}</button>
            `;
        } else {
            paginationHTML += `
                <button onclick="changePage(${i})" class="pagination-btn">${i}</button>
            `;
        }
    }
    
    // Next button
    if (currentPage < pages) {
        paginationHTML += `
            <button onclick="changePage(${currentPage + 1})" class="pagination-btn">
                Next
            </button>
        `;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
}

// Function to change page
function changePage(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);
    
    // Get current filter values
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    const search = document.getElementById('search').value;
    
    // Load listings for the new page
    loadListings(page, category, search, priceRange, sortBy);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Function to view listing details
async function viewListing(id) {
    try {
        const response = await fetch(`/api/marketplace/listings/${id}`);
        const listing = await response.json();
        
        // Create modal for listing details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content listing-details">
                <span class="close-modal" onclick="closeModal()">&times;</span>
                <h2>${listing.title}</h2>
                <div class="listing-images">
                    ${listing.images.map(img => `<img src="${img}" alt="${listing.title}">`).join('')}
                </div>
                <div class="listing-info">
                    <p class="price">$${listing.price}</p>
                    <p class="category"><strong>Category:</strong> ${listing.category}</p>
                    <p class="condition"><strong>Condition:</strong> ${listing.condition}</p>
                    <p class="description">${listing.description}</p>
                    <div class="seller-info">
                        <h4>Seller Information</h4>
                        <p><strong>Seller:</strong> ${listing.seller.name}</p>
                        <p><strong>Contact:</strong> ${listing.contactInfo.preferredContact === 'Email' ? listing.contactInfo.email : listing.contactInfo.phone}</p>
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
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } catch (error) {
        console.error('Error loading listing details:', error);
        alert('Failed to load listing details. Please try again.');
    }
}

// Function to close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Function to contact seller
function contactSeller(id) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to contact the seller');
        window.location.href = 'login.html';
        return;
    }
    
    // This would typically open a messaging interface
    alert('Messaging feature coming soon!');
}

// Function to save listing
async function saveListing(id) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to save this listing');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`/api/marketplace/listings/${id}/save`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Item saved successfully!');
        } else {
            throw new Error('Failed to save item');
        }
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item. Please try again.');
    }
}

// Make functions available globally
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.loadListings = loadListings;
window.changePage = changePage;
window.viewListing = viewListing;
window.closeModal = closeModal;
window.contactSeller = contactSeller;
window.saveListing = saveListing;