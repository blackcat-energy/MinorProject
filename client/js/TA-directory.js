import { taURL, clientLoginURL } from "../utils/env.js";
import { tost } from "./Toastify.js";

// DOM Elements
const pageData = document.querySelector(".explore-people");
const loader = document.getElementById("loader");
const searchInput = document.querySelector("#searchBar");
const cardWrap = document.querySelector(".card-wrap");
const emptyState = document.querySelector(".empty-state");
const profileModal = document.getElementById("profileModal");
const closeModal = document.querySelector(".close-modal");

// State
let students = [];
let filteredStudents = [];

// View Toggle
const gridViewBtn = document.querySelector(".grid-view");
const listViewBtn = document.querySelector(".list-view");

gridViewBtn.addEventListener("click", () => {
  gridViewBtn.classList.add("active");
  listViewBtn.classList.remove("active");
  cardWrap.classList.remove("list-view");
});

listViewBtn.addEventListener("click", () => {
  listViewBtn.classList.add("active");
  gridViewBtn.classList.remove("active");
  cardWrap.classList.add("list-view");
});

// Fetch Student Data
function fetchStudentData() {
  loader.style.display = "flex";
  pageData.style.display = "none";
  
  // Simulated API call - replace with actual API endpoint
  setTimeout(() => {
    // Sample data - replace with actual API response
    students = [
      {
        id: 1,
        name: "John Doe",
        branch: "CSE",
        year: 3,
        interests: ["Tech Clubs", "Research"],
        bio: "Passionate about AI and machine learning. Looking for research collaborators.",
        linkedin: "https://linkedin.com/in/johndoe",
        instagram: "https://instagram.com/johndoe"
      },
      // Add more sample data as needed
    ];
    
    filteredStudents = [...students];
    renderStudents();
        loader.style.display = "none";
    pageData.style.display = "block";
  }, 1000);
}

// Render Students
function renderStudents() {
  cardWrap.innerHTML = "";
  
  if (filteredStudents.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  
  emptyState.style.display = "none";
  
  filteredStudents.forEach(student => {
    const card = createStudentCard(student);
    cardWrap.appendChild(card);
  });
}

// Create Student Card
function createStudentCard(student) {
  const card = document.createElement("div");
    card.classList.add("card");
  card.addEventListener("click", () => openProfileModal(student));
  
  card.innerHTML = `
    <div class="card-head">
      <div class="profile-image">
        ${student.name.charAt(0)}
      </div>
      <div class="profile-info">
        <h4>${student.name}</h4>
        <p>${student.branch} • Year ${student.year}</p>
      </div>
    </div>
    <p class="card-text">${student.bio}</p>
    <div class="social-links">
      ${student.linkedin ? `<a href="${student.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
      ${student.instagram ? `<a href="${student.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
    </div>
  `;
  
  return card;
}

// Profile Modal
function openProfileModal(student) {
  const modalBody = profileModal.querySelector(".modal-body");
  
  modalBody.innerHTML = `
    <div class="modal-profile">
      <div class="modal-header">
        <div class="profile-image large">
          ${student.name.charAt(0)}
        </div>
        <div class="profile-info">
          <h2>${student.name}</h2>
          <p>${student.branch} • Year ${student.year}</p>
        </div>
      </div>
      <div class="modal-content">
        <div class="bio-section">
          <h3>About</h3>
          <p>${student.bio}</p>
        </div>
        <div class="interests-section">
          <h3>Interests</h3>
          <div class="interests-tags">
            ${student.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
          </div>
        </div>
        <div class="social-section">
          <h3>Connect</h3>
          <div class="social-links">
            ${student.linkedin ? `<a href="${student.linkedin}" target="_blank" class="social-btn linkedin"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
            ${student.instagram ? `<a href="${student.instagram}" target="_blank" class="social-btn instagram"><i class="fab fa-instagram"></i> Instagram</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
  
  profileModal.style.display = "flex";
}

// Close Modal
closeModal.addEventListener("click", () => {
  profileModal.style.display = "none";
});

profileModal.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    profileModal.style.display = "none";
  }
});

// Search Functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filterStudents(searchTerm);
});

// Filter Functionality
function filterStudents(searchTerm = "") {
  const branchFilter = document.getElementById("branch").value;
  const yearFilter = document.getElementById("year").value;
  const interestsFilter = document.getElementById("interests").value;
  
  filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                         student.bio.toLowerCase().includes(searchTerm);
    const matchesBranch = !branchFilter || student.branch === branchFilter;
    const matchesYear = !yearFilter || student.year.toString() === yearFilter;
    const matchesInterests = !interestsFilter || student.interests.includes(interestsFilter);
    
    return matchesSearch && matchesBranch && matchesYear && matchesInterests;
  });
  
  renderStudents();
}

// Sort Functionality
document.getElementById("sort").addEventListener("change", (e) => {
  const sortBy = e.target.value;
  
  filteredStudents.sort((a, b) => {
    switch(sortBy) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "active":
        // Implement active sorting logic
        return 0;
      case "recent":
        // Implement recent sorting logic
        return 0;
      default:
        return 0;
    }
  });
  
  renderStudents();
});

// Initialize
fetchStudentData();
