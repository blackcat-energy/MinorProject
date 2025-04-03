const pageData = document.getElementById("yaya");
pageData.style.display = "none";

const loader = document.getElementById("test");
loader.style.display = "flex";

const cardsData = {
  "Choose Your Major": [
    "../html/majorSelection.html",
    "Even if you settled on a major, Due to courses, intuition, family, friends, likes & dislikes, I would advise you to read about all three majors, just in case maybe something could click",
    "chooseMajor",
    "Open",
  ],
  "CMS Downloader": [
    "https://github.com/AhmedAshrafAZ/cms-downloader",
    "Automate Your Downloads Effortlessly! Fetch, Create Folders, and Download All Your CMS Content with Ease!",
    "cmsDownloader",
    "Open",
  ],
  "ACM Club": [
    "https://www.facebook.com/profile.php?id=61556831184217",
    "Level Up Your Skills: Join ACM Club for Problem-Solving and Programming Mastery!",
    "acmClub",
    "Join",
  ],
  "Internships and Roadmaps":[
    "https://github.com/FahdSeddik/CUFE-CCE25",
    "A dedicated repo for internships and great learning roadmaps!",
    "acmClub", // Used the ACM Club ref for the image
    "Open",
  ],
  "GIU Calendar": [
    "https://drive.google.com/file/d/1PwTV77dy07mzuBjtGLd32Bqzrz0DNygr/view?usp=sharing",
    "Unlock Your Potential: Academic Semester Calendar Unveiled!",
    "giuCalendar",
    "Open",
  ],
  "13- Whatsapp Group": [
    "https://chat.whatsapp.com/CWoFNpYmuSYAbVULWKxCtT",
    "Join the GIU Study WhatsApp group for 13- students",
    "whatsappGroup13",
    "Join",
  ],
  "10- Whatsapp Group": [
    "https://chat.whatsapp.com/BflwNdGVwgVLaohbIr7nvU",
    "Join the GIU Study WhatsApp group for 10- students",
    "whatsappGroup10",
    "Join",
  ],
  "GIU WIR": [
    "https://drive.google.com/file/d/1WHAYGxa3jRV1gGBhok-6RGGdvwewy3ye/view?usp=sharing",
    "Do wanna have a discount using your student ID? Check out the WIR program!",
    "giuWIR",
    "Open",
  ],

};

Object.entries(cardsData).forEach(([key, value]) => {
  loader.style.display = "none";
  pageData.style.display = "grid";

  const cardContainer = document.querySelector(".card-wrap");

  // create new card
  let card = document.createElement("div");
  card.classList.add("card");

  // create card head
  let cardHead = document.createElement("div");
  cardHead.classList.add("card-head");

  // create card title
  let cardTitle = document.createElement("h4");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = key;

  // append cardHead to Card
  card.appendChild(cardHead);
  cardHead.appendChild(cardTitle); // Append cardTitle to cardHead

  // create and add img data
  let img = document.createElement("img");
  img.src = `../images/${value[2]}.svg`;
  console.log(img.src);
  img.alt = "image not available";
  card.appendChild(img);

  // create text content wrapper
  const textContent = document.createElement("div");
  textContent.classList.add("txt");

  // create and add card text
  let cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = value[1];
  textContent.appendChild(cardText);

  // create contact button
  let cardButton = document.createElement("a");
  cardButton.classList.add("contactBtn");
  cardButton.textContent = value[3];
  cardButton.href = value[0];
  cardButton.target = "_blank";
  textContent.appendChild(cardButton); // Append cardButton to textContent

  // append text content to card
  card.appendChild(textContent);

  // append card
  cardContainer.appendChild(card);

  // create onclick function for the contact button
  cardButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent card click event from triggering
  });
});

// DOM Elements
const discussionsPage = document.querySelector('.discussions-page');
const searchInput = document.querySelector('.search-input');
const postsContainer = document.querySelector('.posts-feed');
const sortSelect = document.querySelector('.sort-select');
const newPostBtn = document.querySelector('.new-post-btn');

// State
let posts = [];
let filteredPosts = [];
let currentSort = 'hot';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.style.display = 'none';
    }

    // Fetch posts
    fetchPosts();
});

// Search functionality
searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterPosts(searchTerm);
}, 300));

// Sort functionality
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    sortPosts();
});

// New post button
newPostBtn.addEventListener('click', () => {
    // TODO: Implement new post modal
    console.log('New post clicked');
});

// Vote functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('vote-btn')) {
        const postId = e.target.closest('.post-card').dataset.id;
        const voteType = e.target.dataset.vote;
        handleVote(postId, voteType);
    }
});

// Fetch posts
async function fetchPosts() {
    try {
        // Simulate API call
        posts = [
            {
                id: 1,
                title: 'Tips for Managing Course Load',
                content: 'I\'ve been struggling with managing my course load this semester. Any tips for balancing multiple assignments and projects?',
                author: {
                    name: 'Sarah Chen',
                    avatar: 'https://i.pravatar.cc/150?img=1',
                    karma: 1234
                },
                timestamp: '2 hours ago',
                votes: 42,
                comments: 15,
                tags: ['academic', 'time-management']
            },
            {
                id: 2,
                title: 'Internship Experience at Google',
                content: 'Just finished my summer internship at Google! Here\'s what I learned and some tips for future applicants...',
                author: {
                    name: 'Alex Kumar',
                    avatar: 'https://i.pravatar.cc/150?img=2',
                    karma: 856
                },
                timestamp: '5 hours ago',
                votes: 89,
                comments: 32,
                tags: ['internship', 'career']
            },
            {
                id: 3,
                title: 'Study Group for CS50',
                content: 'Looking to form a study group for CS50. Anyone interested in meeting weekly to work on problem sets together?',
                author: {
                    name: 'Mike Johnson',
                    avatar: 'https://i.pravatar.cc/150?img=3',
                    karma: 567
                },
                timestamp: '1 day ago',
                votes: 23,
                comments: 8,
                tags: ['study-group', 'cs50']
            }
        ];

        filteredPosts = [...posts];
        sortPosts();
        renderPosts();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Filter posts
function filterPosts(searchTerm) {
    filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    sortPosts();
    renderPosts();
}

// Sort posts
function sortPosts() {
    switch (currentSort) {
        case 'hot':
            filteredPosts.sort((a, b) => b.votes - a.votes);
            break;
        case 'new':
            filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'top':
            filteredPosts.sort((a, b) => b.comments - a.comments);
            break;
    }
    renderPosts();
}

// Render posts
function renderPosts() {
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <p>No posts found matching your criteria.</p>
            </div>
        `;
        return;
    }

    postsContainer.innerHTML = filteredPosts.map(post => `
        <div class="post-card" data-id="${post.id}">
            <div class="post-votes">
                <button class="vote-btn" data-vote="up">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <span class="vote-count">${post.votes}</span>
                <button class="vote-btn" data-vote="down">
                    <i class="fas fa-arrow-down"></i>
                </button>
            </div>
            <div class="post-content">
                <div class="post-header">
                    <div class="user-info">
                        <img class="avatar" src="${post.author.avatar}" alt="${post.author.name}">
                        <span class="username">${post.author.name}</span>
                    </div>
                    <span class="post-time">${post.timestamp}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-preview">${post.content}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div class="post-footer">
                    <button class="comment-btn">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments} Comments</span>
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle vote
function handleVote(postId, voteType) {
    const post = posts.find(p => p.id === parseInt(postId));
    if (!post) return;

    if (voteType === 'up') {
        post.votes++;
    } else if (voteType === 'down') {
        post.votes--;
    }

    sortPosts();
    renderPosts();
}

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
