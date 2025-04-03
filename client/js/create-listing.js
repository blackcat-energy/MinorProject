document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('listingForm');
  const imageInput = document.getElementById('images');
  const imagePreview = document.getElementById('imagePreview');
  const contactPreference = document.getElementsByName('contactPreference');
  const phoneInput = document.getElementById('phoneInput');

  // Handle contact preference change
  contactPreference.forEach(input => {
      input.addEventListener('change', (e) => {
          phoneInput.style.display = e.target.value === 'phone' ? 'block' : 'none';
          const phoneField = document.getElementById('phone');
          phoneField.required = e.target.value === 'phone';
      });
  });

  // Handle image preview
  imageInput.addEventListener('change', function(e) {
      imagePreview.innerHTML = '';
      const files = Array.from(e.target.files);
      
      if (files.length > 5) {
          alert('Maximum 5 images allowed');
          imageInput.value = '';
          return;
      }

      files.forEach(file => {
          if (!file.type.startsWith('image/')) {
              alert('Please upload only images');
              return;
          }

          const reader = new FileReader();
          reader.onload = function(e) {
              const img = document.createElement('img');
              img.src = e.target.result;
              imagePreview.appendChild(img);
          }
          reader.readAsDataURL(file);
      });
  });

  // Handle form submission
  form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
          alert('Please log in to post a listing');
          window.location.href = 'login.html';
          return;
      }

      const formData = new FormData(form);
      
      try {
          const response = await fetch('/api/marketplace/listings', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: formData
          });

          if (response.ok) {
              alert('Listing created successfully!');
              window.location.href = 'location.html?success=listing_created';
          } else {
              const error = await response.json();
              throw new Error(error.message || 'Failed to create listing');
          }
      } catch (error) {
          alert(error.message);
      }
  });
});

// Drag and drop functionality
const dropZone = document.querySelector('.image-upload-container');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropZone.classList.add('highlight');
}

function unhighlight(e) {
  dropZone.classList.remove('highlight');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  const fileInput = document.getElementById('images');
  
  fileInput.files = files;
  // Trigger change event manually
  fileInput.dispatchEvent(new Event('change'));
}