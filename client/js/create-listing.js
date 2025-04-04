// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded');
  
  // Get the form element
  const form = document.getElementById('create-listing-form');
  console.log('Form element:', form); // Debug log
  
  // Check if form exists before adding event listener
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        category: document.getElementById('category').value,
        condition: document.getElementById('condition').value,
        location: document.getElementById('location').value,
        contactPreference: document.getElementById('contactPreference').value,
        phone: document.getElementById('phone').value
      };

      // Handle image uploads if needed
      const imageFiles = document.getElementById('images').files;
      if (imageFiles.length > 0) {
        // You'll need to implement image upload logic here
        // This might involve using FormData and a separate endpoint
      }

      console.log('Sending form data:', formData);

      try {
        const response = await fetch('http://localhost:5000/api/marketplace/listings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // This is important for sending cookies
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          alert('Listing created successfully!');
          window.location.href = 'listings.html';
        } else {
          throw new Error(data.message || 'Failed to create listing');
        }
      } catch (error) {
        console.error('Error creating listing:', error);
        alert('Error creating listing: ' + error.message);
      }
    });
  } else {
    console.error('Form element not found!');
  }
});