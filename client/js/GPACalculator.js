import { tost } from "./Toastify.js";
document.addEventListener("DOMContentLoaded", function () {
  const pageData = document.getElementById("yaya");
  pageData.style.display = "none";
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  const subjects = [
    { id: 1, name: "Math", creditHours: 8, semester: 1 },
    { id: 2, name: "Physics", creditHours: 5, semester: 1 },
    { id: 3, name: "Technical", creditHours: 4, semester: 1 },
    { id: 4, name: "CS1", creditHours: 6, semester: 1 },
    { id: 5, name: "Math 2", creditHours: 4, semester: 2 },
    { id: 6, name: "CS 2", creditHours: 7, semester: 2 },
    { id: 7, name: "Networks", creditHours: 5, semester: 2 },
    { id: 8, name: "Theo", creditHours: 5, semester: 2 },
    { id: 9, name: "Micro", creditHours: 5, semester: 2 },
    { id: 10, name: "CS 3", creditHours: 7, semester: 3 },
    { id: 11, name: "OS", creditHours: 5, semester: 3 },
    { id: 12, name: "DB", creditHours: 6, semester: 3 },
    { id: 13, name: "DSA", creditHours: 6, semester: 3 },
    { id: 14, name: "Math 3", creditHours: 4, semester: 3 },
    { id: 15, name: "Math 4", creditHours: 4, semester: 4 },
    { id: 16, name: "Distributed", creditHours: 4, semester: 4 },
    { id: 17, name: "IT", creditHours: 4, semester: 4 },
    { id: 18, name: "DS", creditHours: 4, semester: 4 },
    { id: 19, name: "Media", creditHours: 4, semester: 4 },
    { id: 20, name: "SE", creditHours: 4, semester: 4 },
    { id: 23, name: "SE I", creditHours: 4, semester: 5 },
    { id: 21, name: "SDA", creditHours: 4, semester: 5 },
    { id: 22, name: "RE", creditHours: 4, semester: 5 },
    { id: 24, name: "SECT", creditHours: 4, semester: 5 },
    { id: 25, name: "SE sec", creditHours: 4, semester: 5 },
    { id: 26, name: "crypto", creditHours: 4, semester: 5 },
    { id: 27, name: "froensic", creditHours: 4, semester: 5 },
    { id: 28, name: "web prog.", creditHours: 4, semester: 5 },
    { id: 29, name: "HCI", creditHours: 4, semester: 5 },
    { id: 30, name: "graphics", creditHours: 4, semester: 5 },
    { id: 31, name: "ML I", creditHours: 4, semester: 5 },
    { id: 32, name: "DB prog", creditHours: 4, semester: 5 },
    { id: 33, name: "data vis.", creditHours: 4, semester: 5 },
    { id: 34, name: "PM", creditHours: 4, semester: 6 },
    { id: 35, name: "RM", creditHours: 4, semester: 6 },
    { id: 36, name: "Cloud", creditHours: 4, semester: 6 },
    { id: 37, name: "Mobile", creditHours: 4, semester: 6 },
    { id: 38, name: "SE II", creditHours: 4, semester: 6 },
    { id: 39, name: "NoSQL", creditHours: 4, semester: 6 },
    { id: 40, name: "ML II", creditHours: 4, semester: 6 },
    { id: 41, name: "Image", creditHours: 4, semester: 6 },
    { id: 42, name: "Network sec", creditHours: 4, semester: 6 },
    { id: 43, name: "Business Continuity", creditHours: 4, semester: 6 },
    { id: 44, name: "Ethical Hacking", creditHours: 4, semester: 6 },
    { id: 45, name: "3D Design", creditHours: 4, semester: 6 },
    { id: 46, name: "Usability ", creditHours: 4, semester: 6 },
    { id: 47, name: "Web Dev porj ", creditHours: 4, semester: 6 },
  ];

  const grades = {
    select: 0,
    "A+": 0.7,
    A: 1,
    "A-": 1.3,
    "B+": 1.7,
    B: 2,
    "B-": 2.3,
    "C+": 2.7,
    C: 3,
    "C-": 3.3,
    "D+": 3.7,
    D: 4,
    "D-": 4.3,
    F: 5,
  };

  const subjectForm = document.getElementById("subject-form");
  const subjectButtonsContainer = document.getElementById("subject-buttons");

  const gradesArray = new Array(subjects.length).fill(0);

  // Create choice buttons for each subject
  let curSemester = 0;
  let currentSemesterDiv; // To keep track of the current semester div

  subjects.forEach((subject) => {
    loader.style.display = "none";
    pageData.style.display = "grid";
    if (curSemester !== subject.semester) {
      curSemester = subject.semester;

      // Create a new div for each semester
      const semesterDiv = document.createElement("div");
      semesterDiv.classList.add("sem");
      const semesterHeader = document.createElement("h4");
      semesterHeader.textContent = `Semester ${subject.semester}`;
      semesterDiv.appendChild(semesterHeader);

      // Update the currentSemesterDiv
      currentSemesterDiv = semesterDiv;

      // Add the div to the subjectButtonsContainer
      subjectButtonsContainer.appendChild(semesterDiv);

      // Create a checkbox to select all subjects of this semester
      const selectAllWrap = document.createElement("div");
      selectAllWrap.classList.add("selectAllWrap");

      const checkBoxWrapAll = document.createElement("div");
      checkBoxWrapAll.classList.add("checkbox-wrapper");

      const label = document.createElement("label");
      label.setAttribute("for", `semester-${subject.semester}`);
      const tickMarkAll = document.createElement("div");
      tickMarkAll.classList.add("tickMark");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = `semester-${subject.semester}`;
      input.id = `semester-${subject.semester}`;
      input.value = subject.creditHours;
      const pContent = document.createElement("p");
      pContent.textContent = `Select All Semester ${subject.semester}`;
      checkBoxWrapAll.appendChild(input);
      checkBoxWrapAll.appendChild(label);
      selectAllWrap.appendChild(checkBoxWrapAll);
      selectAllWrap.appendChild(pContent);
      currentSemesterDiv.appendChild(selectAllWrap);
    }

    // Create a div to wrap each input and label
    const choiceWrapDiv = document.createElement("div");
    choiceWrapDiv.classList.add("choiceWrap");
    //create checkbox wrap
    const checkboxWrap = document.createElement("div");
    checkboxWrap.classList.add("checkbox-wrapper");

    const labelCheckBox = document.createElement("label");
    const tickMark = document.createElement("div");
    tickMark.classList.add("tickMark");

    const checkboxSubject = document.createElement("input");
    checkboxSubject.type = "checkbox";
    checkboxSubject.name = subject.name + "-" + subject.semester;
    checkboxSubject.id = subject.semester + subject.name;
    checkboxSubject.value = subject.creditHours;

    //apend the checkbox, label and tickmark inside the checkboxWrap
    checkboxWrap.appendChild(checkboxSubject);
    checkboxWrap.appendChild(labelCheckBox);
    labelCheckBox.appendChild(tickMark);

    // Set the 'for' attribute of the label to match the checkbox 'id'
    labelCheckBox.setAttribute("for", subject.semester + subject.name);

    const pSubject = document.createElement("p");
    pSubject.textContent = `${subject.name} (${subject.creditHours} credit hours)`;
    const gradeSelect = document.createElement("select");
    gradeSelect.name = `${subject.name}-grade`;

    for (const grade in grades) {
      const option = document.createElement("option");
      option.value = grade;
      option.textContent = grade;
      gradeSelect.appendChild(option);
    }

    // Append input, label, and gradeSelect to the choiceWrapDiv
    choiceWrapDiv.appendChild(checkboxWrap);
    choiceWrapDiv.appendChild(pSubject);
    choiceWrapDiv.appendChild(gradeSelect);

    // Hide grade option by default
    gradeSelect.style.display = "none";
    checkboxSubject.addEventListener("change", function () {
      // Make grade option visible when checkbox is checked
      if (checkboxSubject.checked) {
        gradeSelect.style.display = "block";
      }
      // Hide grade option when checkbox is unchecked
      else {
        gradeSelect.style.display = "none";
      }
    });

    gradeSelect.addEventListener("change", function () {
      let gradeValue;
      let selectedGrade;
      if (checkboxSubject.checked) {
        selectedGrade = gradeSelect.value;
        gradeValue = grades[selectedGrade];
        gradesArray[subject.id - 1] = gradeValue; // Update grade in gradesArray
      }
    });
    // Append the choiceWrapDiv to the currentSemesterDiv
    currentSemesterDiv.appendChild(choiceWrapDiv);
  });

  // Select buttons that id starts with semester
  const selectButtons = document.querySelectorAll('input[id^="semester-"]');
  selectButtons.forEach((button) => {
    button.addEventListener("change", function () {
      const semester = button.name.split("-")[1];
      const subjectsOfSemester = subjects.filter(
        (subject) => subject.semester === parseInt(semester)
      );
      // Select all options that id start with semester number
      const gradeSelects = document.querySelectorAll(
        `input[id^="${semester}"]`
      );

      gradeSelects.forEach((gradeSelect) => {
        gradeSelect.click();
      });
    });
  });

  // Prevent form submission for demonstration purpose
  subjectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let totalCreditHoursWithGrades = 0;
    let totalCreditHours = 0;

    // Use reduce to get totalCreditHoursWithGrades
    for (let i = 0; i < gradesArray.length; i++) {
      if (gradesArray[i] === 0) {
        continue;
      }
      totalCreditHoursWithGrades += gradesArray[i] * subjects[i].creditHours;
      totalCreditHours += subjects[i].creditHours;
    }
    const result = totalCreditHoursWithGrades / totalCreditHours;
    const grade = result.toFixed(4);
    let letterGrade;
    if(grade < 1){
      letterGrade = "A+";
    }
    else if(grade < 1.3){
      letterGrade = "A";
    }
    else if(grade < 1.7){
      letterGrade = "A-";
    }
    else if(grade < 2){
      letterGrade = "B+";
    }
    else if(grade < 2.3){
      letterGrade = "B";
    }
    else if(grade < 2.7){
      letterGrade = "B-";
    }
    else if(grade < 3){
      letterGrade = "C+";
    }
    else if(grade < 3.3){
      letterGrade = "C";
    }
    else if(grade < 3.7){
      letterGrade = "C-";
    }
    else if(grade < 4){
      letterGrade = "D+";
    }
    else if(grade < 4.3){
      letterGrade = "D";
    }
    else if(grade < 5){
      letterGrade = "F";
    }
    tost(`Your GPA is: ${grade}  which is  ${letterGrade}`, "success", 6000);
  });
});

// DOM Elements
const pageData = document.querySelector('.internships-page');
const searchInput = document.querySelector('.hero-search input');
const internshipsContainer = document.querySelector('.internships-grid');
const filterTags = document.querySelectorAll('.filter-tag');
const viewToggleButtons = document.querySelectorAll('.view-toggle button');
const sortSelect = document.querySelector('.sort-select');
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
const internshipModal = document.getElementById('internshipModal');
const closeModal = document.querySelector('.close-modal');

// State
let internships = [];
let filteredInternships = [];
let currentView = 'grid';

// Event Listeners
viewToggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    viewToggleButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentView = button.dataset.view;
    renderInternships();
  });
});

filterTags.forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('active');
    filterInternships();
  });
});

sortSelect.addEventListener('change', () => {
  sortInternships();
});

filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    filterInternships();
  });
});

searchInput.addEventListener('input', debounce(() => {
  filterInternships();
}, 300));

// Fetch internship data
async function fetchInternshipData() {
  // Simulate API call
  internships = [
    {
      id: 1,
      company: 'Google India',
      position: 'Software Engineer Intern',
      location: 'Bangalore',
      type: 'On-site',
      duration: '3 months',
      stipend: '₹50,000/month',
      deadline: '2024-03-15',
      description: 'Join Google\'s engineering team to work on cutting-edge projects...',
      requirements: [
        'Currently pursuing B.Tech in Computer Science or related field',
        'Strong programming skills in Java, Python, or C++',
        'Good understanding of data structures and algorithms'
      ],
      logo: '../images/google-logo.png',
      category: 'Technology',
      experienceLevel: 'Open to All'
    },
    // Add more sample internships here
  ];
  filteredInternships = [...internships];
  renderInternships();
}

// Filter internships based on search and filters
function filterInternships() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeFilterTags = Array.from(filterTags)
    .filter(tag => tag.classList.contains('active'))
    .map(tag => tag.textContent.trim().toLowerCase());
  
  const selectedTypes = Array.from(document.querySelectorAll('input[value="remote"], input[value="onsite"], input[value="hybrid"]'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  const selectedIndustries = Array.from(document.querySelectorAll('input[value="tech"], input[value="finance"], input[value="marketing"], input[value="design"], input[value="consulting"]'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  const selectedDurations = Array.from(document.querySelectorAll('input[value="short"], input[value="long"]'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  const selectedExperienceLevels = Array.from(document.querySelectorAll('input[value="all"], input[value="final"]'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.position.toLowerCase().includes(searchTerm) ||
                         internship.company.toLowerCase().includes(searchTerm);
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(internship.type.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(internship.category.toLowerCase());
    const matchesDuration = selectedDurations.length === 0 || 
                           (selectedDurations.includes('short') && parseInt(internship.duration) < 3) ||
                           (selectedDurations.includes('long') && parseInt(internship.duration) >= 3);
    const matchesExperience = selectedExperienceLevels.length === 0 || 
                             selectedExperienceLevels.includes(internship.experienceLevel.toLowerCase());
    
    const matchesTags = activeFilterTags.length === 0 || 
                       activeFilterTags.some(tag => 
                         internship.type.toLowerCase().includes(tag) ||
                         internship.category.toLowerCase().includes(tag));

    return matchesSearch && matchesType && matchesIndustry && matchesDuration && 
           matchesExperience && matchesTags;
  });

  renderInternships();
}

// Sort internships
function sortInternships() {
  const sortBy = sortSelect.value;
  
  filteredInternships.sort((a, b) => {
    switch(sortBy) {
      case 'latest':
        return new Date(b.deadline) - new Date(a.deadline);
      case 'popular':
        // Simulate popularity based on company name (in real app, would use actual metrics)
        return b.company.localeCompare(a.company);
      case 'stipend':
        return parseInt(b.stipend.replace(/[^0-9]/g, '')) - parseInt(a.stipend.replace(/[^0-9]/g, ''));
      default:
        return 0;
    }
  });

  renderInternships();
}

// Render internships
function renderInternships() {
  if (filteredInternships.length === 0) {
    internshipsContainer.innerHTML = `
      <div class="empty-state">
        <img src="../images/no-internships.svg" alt="No internships found" />
        <h3>No Internships Found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
    return;
  }

  internshipsContainer.innerHTML = filteredInternships.map(internship => `
    <div class="internship-card" onclick="openInternshipModal(${internship.id})">
      <div class="company-logo">
        <img src="${internship.logo}" alt="${internship.company} Logo" />
      </div>
      <div class="internship-info">
        <h3>${internship.position}</h3>
        <div class="company-name">${internship.company}</div>
        <div class="internship-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${internship.location}</span>
          <span><i class="fas fa-clock"></i> ${internship.duration}</span>
          <span><i class="fas fa-money-bill-wave"></i> ${internship.stipend}</span>
        </div>
        <div class="deadline">
          <i class="fas fa-calendar"></i>
          Apply by: ${formatDate(internship.deadline)}
        </div>
        <div class="card-actions">
          <button class="apply-btn">Apply Now</button>
          <button class="save-btn"><i class="far fa-bookmark"></i></button>
        </div>
      </div>
    </div>
  `).join('');
}

// Modal functions
function openInternshipModal(id) {
  const internship = internships.find(i => i.id === id);
  if (!internship) return;

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="company-logo">
        <img src="${internship.logo}" alt="${internship.company} Logo" />
      </div>
      <div class="company-info">
        <h2>${internship.position}</h2>
        <h3>${internship.company}</h3>
      </div>
    </div>
    <div class="modal-content">
      <div class="internship-details">
        <div class="detail-row">
          <span><i class="fas fa-map-marker-alt"></i> ${internship.location}</span>
          <span><i class="fas fa-clock"></i> ${internship.duration}</span>
          <span><i class="fas fa-money-bill-wave"></i> ${internship.stipend}</span>
        </div>
        <div class="deadline">
          <i class="fas fa-calendar"></i>
          Apply by: ${formatDate(internship.deadline)}
        </div>
        <div class="description">
          <h4>About the Role</h4>
          <p>${internship.description}</p>
        </div>
        <div class="requirements">
          <h4>Requirements</h4>
          <ul>
            ${internship.requirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="modal-actions">
        <button class="apply-btn">Apply Now</button>
        <button class="save-btn"><i class="far fa-bookmark"></i> Save</button>
      </div>
    </div>
  `;

  internshipModal.style.display = 'block';
}

// Close modal when clicking the close button or outside the modal
closeModal.addEventListener('click', () => {
  internshipModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === internshipModal) {
    internshipModal.style.display = 'none';
  }
});

// Utility functions
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
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
  pageData.style.display = 'block';
  fetchInternshipData();
});
