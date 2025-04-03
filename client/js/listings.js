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
async function loadListings(page = 1, category = null, search = '', priceRange = null, sortBy = 'newest') {
    try {
        // Show loading indicator
        const listingsWrapper = document.getElementById('listings-wrapper');
        listingsWrapper.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading listings...</p>
            </div>
        `;
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            page,
            ...(category && { category }),
            ...(search && { search }),
            ...(priceRange && { price: priceRange })
        });
        
        // Handle sort parameter
        switch(sortBy) {
            case 'newest':
                queryParams.set('sort', 'createdAt:desc');
                break;
            case 'oldest':
                queryParams.set('sort', 'createdAt:asc');
                break;
            case 'price-low':
                queryParams.set('sort', 'price:asc');
                break;
            case 'price-high':
                queryParams.set('sort', 'price:desc');
                break;
            default:
                queryParams.set('sort', 'createdAt:desc');
        }
        
        // Fetch listings from API
        const response = await fetch(`/api/marketplace/listings?${queryParams}`);
        const data = await response.json();
        
        // Render listings
        renderListings(data.listings, data.pagination);
    } catch (error) {
        console.error('Error loading listings:', error);
        document.getElementById('listings-wrapper').innerHTML = `
            <div class="error-message">
                <p>Failed to load listings. Please try again.</p>
                <button onclick="loadListings(${page}, '${category}', '${search}')">Retry</button>
            </div>
        `;
    }
}

// Function to render listings
function renderListings(listings, pagination) {
    const listingsWrapper = document.getElementById('listings-wrapper');
    const noResults = document.querySelector('.no-results');
    
    if (listings.length === 0) {
        listingsWrapper.innerHTML = '';
        noResults.style.display = 'block';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Generate HTML for listings
    listingsWrapper.innerHTML = listings.map(listing => `
        <div class="card" data-id="${listing._id}">
            <div class="card-head">
                <h6 class="card-status">${listing.status || 'Available'}</h6>
                <h4 class="card-title">${listing.title}</h4>
                <span class="card-subtitle">${listing.category}</span>
            </div>
            <img src="${listing.images && listing.images.length > 0 ? listing.images[0] : '../images/placeholder.jpg'}" alt="${listing.title}" />
            <div class="innerCard">
                <p class="card-text">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
                <div class="price">$${listing.price}</div>
                <button class="contactBtn" onclick="viewListing('${listing._id}')">View Details</button>
            </div>
        </div>
    `).join('');
    
    // Render pagination
    renderPagination(pagination);
    
    // Add event listeners to cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('contactBtn')) {
                const id = this.getAttribute('data-id');
                viewListing(id);
            }
        });
    });
}

// Function to render pagination
function renderPagination(pagination) {
    if (!pagination) return;
    
    const { currentPage, totalPages } = pagination;
    const paginationContainer = document.getElementById('pagination');
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                ${currentPage === 1 ? 'disabled' : `onclick="changePage(${currentPage - 1})"`}>
            Previous
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" onclick="changePage(1)">1</button>
            ${startPage > 2 ? '<span class="pagination-ellipsis">...</span>' : ''}
        `;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="pagination-ellipsis">...</span>' : ''}
            <button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                ${currentPage === totalPages ? 'disabled' : `onclick="changePage(${currentPage + 1})"`}>
            Next
        </button>
    `;
    
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