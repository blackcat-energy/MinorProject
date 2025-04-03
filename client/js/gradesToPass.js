import { tost } from "./Toastify.js";
window.onload = function () {
  const loadingScreen = document.getElementById("loader");
  loadingScreen.style.display = "none";
};
const addButton = document.getElementById("addButton");
const gradesContainer = document.getElementById("gradesContainer");
const calculateButton = document.getElementById("calculateButton");

addButton.addEventListener("click", function () {
  // Create div element
  const divElement = document.createElement("div");
  divElement.className = "subj";

  // Create paragraph element for subject label
  const subjectLabel = document.createElement("h4");
  subjectLabel.textContent = `subject`;
  divElement.appendChild(subjectLabel);

  // Create input element for Name
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "nameInput";
  nameInput.placeholder = "Name ex midterm";
  divElement.appendChild(nameInput);

  // Create input element for Weight
  const weightInput = document.createElement("input");
  weightInput.type = "text";
  weightInput.className = "weightInput";
  weightInput.placeholder = "Weight ex 30%";
  divElement.appendChild(weightInput);

  // Create input element for Exam Grade
  const examInput = document.createElement("input");
  examInput.type = "text";
  examInput.className = "examInput";
  examInput.placeholder = "Exam Grade ex 100";
  divElement.appendChild(examInput);

  // Create input element for Your Grade
  const gradeInput = document.createElement("input");
  gradeInput.type = "text";
  gradeInput.className = "gradeInput";
  gradeInput.placeholder = "Your Grade ex 88";
  divElement.appendChild(gradeInput);

  // Create delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class=" fa-regular fa-trash-can"></i>';
  divElement.appendChild(deleteBtn);

  // Add event listener to delete button
  deleteBtn.addEventListener("click", function () {
    gradesContainer.removeChild(divElement);
  });

  // Append the div element to grades container
  gradesContainer.appendChild(divElement);
});
calculateButton.addEventListener("click", function () {
  let totalWeightedGrade = 0;

  // Loop through each set of input fields
  gradesContainer.querySelectorAll("div").forEach(function (gradeDiv) {
    const examGradeInput = gradeDiv.querySelector(".examInput");
    const yourGradeInput = gradeDiv.querySelector(".gradeInput");
    const weightInput = gradeDiv.querySelector(".weightInput");

    // Get values and convert to numbers
    const examGrade = parseFloat(examGradeInput.value);
    const yourGrade = parseFloat(yourGradeInput.value);
    let weightNUm = weightInput.value.includes("%")
      ? weightInput.value.slice(0, -1)
      : weightInput.value.includes("0.")
      ? weightInput.value * 100
      : weightInput.value;
    const weight = parseFloat(weightNUm) / 100; // converting percentage to decimal

    // Calculate weighted grade
    const weightedGrade = (yourGrade / examGrade) * weight;

    // Add to total
    totalWeightedGrade += weightedGrade;
  });
  const toPass = Math.max(0.5 - totalWeightedGrade, 0);
  if (toPass == 0)
    tost(
      `Your total weighted grade is: ${
        totalWeightedGrade.toFixed(4) * 100
      }%  you have passed`,
      "success",
      6000
    );
  else
    tost(
      `Your total  grade is: ${
        totalWeightedGrade.toFixed(4) * 100
      }%  you need ${toPass.toFixed(3) * 100}% to pass`,
      "info",
      6000
    );
});
// Assuming "whatif" is not an input field
document.getElementById("whatif").addEventListener("mouseover", function() {
  this.textContent = "What if Afelt el final?";
});

document.getElementById("whatif").addEventListener("mouseout", function() {
  this.textContent = "whatif??!"; // Resetting text content, you might want to set it to some other default value if needed
});

const whatif = document.getElementById("whatif");
whatif.addEventListener("click", function () {
  // Create div element
  const divElement = document.createElement("div");
  divElement.className = "subj";

  // Create paragraph element for subject label
  const subjectLabel = document.createElement("h4");
  subjectLabel.textContent = `subject`;
  divElement.appendChild(subjectLabel);

  // Create input element for Name
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "nameInput";
  nameInput.placeholder = "Name";

  nameInput.value= "Final";
  divElement.appendChild(nameInput);
  // get total weight graded he already have
  let totalWeightedGrade = 0;

  // Loop through each set of input fields
  gradesContainer.querySelectorAll("div").forEach(function (gradeDiv) {
    const weightInput = gradeDiv.querySelector(".weightInput");
    let weightNUm = weightInput.value.includes("%")
      ? weightInput.value.slice(0, -1)
      : weightInput.value.includes("0.")
      ? weightInput.value * 100
      : weightInput.value;
    const weight = parseFloat(weightNUm) / 100; // converting percentage to decimal
    totalWeightedGrade += weight;

  });
  // Create input element for Weight
  const weightInput = document.createElement("input");
  weightInput.type = "text";
  weightInput.className = "weightInput";
  weightInput.placeholder = "Weight";
  weightInput.value = (1 - totalWeightedGrade)*100 + "%";
  divElement.appendChild(weightInput);

  // Create input element for Exam Grade
  const examInput = document.createElement("input");
  examInput.type = "text";
  examInput.className = "examInput";
  examInput.placeholder = "Exam Grade";
  examInput.value = "100";
  divElement.appendChild(examInput);

  // Create input element for Your Grade
  const gradeInput = document.createElement("input");
  gradeInput.type = "text";
  gradeInput.className = "gradeInput";
  gradeInput.placeholder = "Your Grade";
  gradeInput.value = "100";
  divElement.appendChild(gradeInput);

  // Create delete button
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class=" fa-regular fa-trash-can"></i>';
  divElement.appendChild(deleteBtn);

  // Add event listener to delete button
  deleteBtn.addEventListener("click", function () {
    gradesContainer.removeChild(divElement);
  });

  // Append the div element to grades container
  gradesContainer.appendChild(divElement);
  calculateButton.click();
});

// DOM Elements
const pageData = document.querySelector('.clubs-page');
const searchInput = document.querySelector('.hero-search input');
const clubsContainer = document.querySelector('.clubs-grid');
const categoryTabs = document.querySelectorAll('.category-tab');
const viewToggleButtons = document.querySelectorAll('.view-toggle button');
const sortSelect = document.querySelector('.sort-select');
const eventFilters = document.querySelectorAll('.event-filters input');
const clubModal = document.querySelector('.club-modal');
const closeModal = document.querySelector('.close-modal');

// State
let clubs = [];
let filteredClubs = [];
let currentCategory = 'all';
let currentView = 'grid';

// View Toggle
viewToggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    viewToggleButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentView = button.dataset.view;
    renderClubs();
  });
});

// Category Filter
categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.category;
    filterClubs();
  });
});

// Sort Clubs
sortSelect.addEventListener('change', () => {
  sortClubs();
});

// Event Filters
eventFilters.forEach(filter => {
  filter.addEventListener('change', () => {
    filterClubs();
  });
});

// Search Functionality
searchInput.addEventListener('input', debounce(() => {
  filterClubs();
}, 300));

// Fetch Club Data
async function fetchClubData() {
  // Simulated API call
  clubs = [
    {
      id: 1,
      name: 'MIT Robotics Club',
      category: 'Technology',
      description: 'Join us to build and program robots! We participate in various competitions and host workshops.',
      members: 150,
      coverImage: 'https://source.unsplash.com/random/800x400/?robotics',
      logo: 'https://source.unsplash.com/random/100x100/?robot',
      events: [
        {
          title: 'Robotics Workshop',
          date: '2024-03-15',
          time: '2:00 PM',
          location: 'Building 32-123'
        },
        {
          title: 'Competition Prep',
          date: '2024-03-20',
          time: '4:00 PM',
          location: 'Building 32-124'
        }
      ],
      admins: [
        {
          name: 'John Doe',
          role: 'President',
          image: 'https://source.unsplash.com/random/50x50/?portrait'
        },
        {
          name: 'Jane Smith',
          role: 'Vice President',
          image: 'https://source.unsplash.com/random/50x50/?person'
        }
      ]
    },
    {
      id: 2,
      name: 'MIT Photography Club',
      category: 'Arts',
      description: 'Capture moments, share stories. Weekly photo walks and monthly exhibitions.',
      members: 120,
      coverImage: 'https://source.unsplash.com/random/800x400/?photography',
      logo: 'https://source.unsplash.com/random/100x100/?camera',
      events: [
        {
          title: 'Photo Walk',
          date: '2024-03-16',
          time: '3:00 PM',
          location: 'MIT Campus'
        }
      ],
      admins: [
        {
          name: 'Mike Johnson',
          role: 'President',
          image: 'https://source.unsplash.com/random/50x50/?man'
        }
      ]
    }
  ];
  filterClubs();
}

// Filter Clubs
function filterClubs() {
  const searchTerm = searchInput.value.toLowerCase();
  const hasUpcomingEvents = eventFilters[0].checked;
  const hasOpenPositions = eventFilters[1].checked;

  filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm) ||
                         club.description.toLowerCase().includes(searchTerm);
    const matchesCategory = currentCategory === 'all' || club.category === currentCategory;
    const matchesEvents = !hasUpcomingEvents || club.events.length > 0;
    const matchesPositions = !hasOpenPositions || club.admins.length < 3;

    return matchesSearch && matchesCategory && matchesEvents && matchesPositions;
  });

  sortClubs();
  renderClubs();
}

// Sort Clubs
function sortClubs() {
  const sortBy = sortSelect.value;
  
  filteredClubs.sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.members - a.members;
      case 'newest':
        return b.id - a.id;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}

// Render Clubs
function renderClubs() {
  if (filteredClubs.length === 0) {
    clubsContainer.innerHTML = `
      <div class="empty-state">
        <img src="https://source.unsplash.com/random/400x300/?illustration" alt="No clubs found">
        <h3>No Clubs Found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }

  clubsContainer.innerHTML = filteredClubs.map(club => `
    <div class="club-card" onclick="openClubModal(${club.id})">
      <div class="club-cover">
        <img src="${club.coverImage}" alt="${club.name}">
        <span class="club-category">${club.category}</span>
      </div>
      <div class="club-info">
        <div class="club-header">
          <div class="club-logo">
            <img src="${club.logo}" alt="${club.name} logo">
          </div>
          <div class="club-title">
            <h3>${club.name}</h3>
            <div class="member-count">
              <i class="fas fa-users"></i>
              ${club.members} members
            </div>
          </div>
        </div>
        <p class="club-description">${club.description}</p>
        <div class="club-actions">
          <button class="join-btn">
            <i class="fas fa-user-plus"></i>
            Join Club
          </button>
          <button class="share-btn">
            <i class="fas fa-share-alt"></i>
            Share
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Open Club Modal
function openClubModal(clubId) {
  const club = clubs.find(c => c.id === clubId);
  if (!club) return;

  const modalContent = `
    <div class="club-modal-content">
      <div class="club-modal-header">
        <div class="club-modal-cover">
          <img src="${club.coverImage}" alt="${club.name}">
        </div>
        <div class="club-modal-info">
          <div class="club-modal-logo">
            <img src="${club.logo}" alt="${club.name} logo">
          </div>
          <h2>${club.name}</h2>
          <p class="club-category">${club.category}</p>
          <div class="member-count">
            <i class="fas fa-users"></i>
            ${club.members} members
          </div>
        </div>
      </div>
      
      <div class="club-modal-body">
        <div class="club-description">
          <h3>About</h3>
          <p>${club.description}</p>
        </div>

        <div class="club-events">
          <h3>Upcoming Events</h3>
          ${club.events.length > 0 ? `
            <div class="events-list">
              ${club.events.map(event => `
                <div class="event-item">
                  <div class="event-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(event.date)}
                  </div>
                  <div class="event-time">
                    <i class="fas fa-clock"></i>
                    ${event.time}
                  </div>
                  <div class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location}
                  </div>
                  <h4>${event.title}</h4>
                </div>
              `).join('')}
            </div>
          ` : '<p>No upcoming events</p>'}
        </div>

        <div class="club-admins">
          <h3>Club Leadership</h3>
          <div class="admins-grid">
            ${club.admins.map(admin => `
              <div class="admin-card">
                <img src="${admin.image}" alt="${admin.name}">
                <h4>${admin.name}</h4>
                <p>${admin.role}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  clubModal.querySelector('.modal-content').innerHTML = modalContent;
  clubModal.style.display = 'block';
}

// Close Modal
closeModal.addEventListener('click', () => {
  clubModal.style.display = 'none';
});

// Close Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === clubModal) {
    clubModal.style.display = 'none';
  }
});

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize
fetchClubData();
