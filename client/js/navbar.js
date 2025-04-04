// Get the header element
const header = document.getElementById("header");
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in using token
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Get current user info
async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return null;
    }

    const response = await fetch('http://localhost:5000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    localStorage.removeItem('token'); // Clear invalid token
    return null;
  }
}

// Initialize navbar with user data
async function initNavbar() {
  const user = await getCurrentUser();
  const authLinks = document.querySelectorAll('.auth-required');
  const guestLinks = document.querySelectorAll('.guest-only');

  if (user) {
    // User is logged in
    authLinks.forEach(link => link.style.display = 'block');
    guestLinks.forEach(link => link.style.display = 'none');
  } else {
    // User is not logged in
    authLinks.forEach(link => link.style.display = 'none');
    guestLinks.forEach(link => link.style.display = 'block');
  }

  // Try to get current user
  const currentUser = await getCurrentUser();
  const userName = currentUser ? currentUser.username : null;
  const isAdmin = currentUser ? currentUser.isAdmin : false;
  
  // Create container div
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("container");

  // Create logo
  const logoDiv = document.createElement("div");
  logoDiv.classList.add("logo");
  const logoLink = document.createElement("a");

  if ("/client/index.html" === location.pathname) logoLink.href = "index.html";
  else logoLink.href = "../index.html";

  const logoText = document.createElement("h4");
  logoText.textContent = "Student ";
  const spanElement = document.createElement("span");
  spanElement.textContent = "Guide";
  logoText.appendChild(spanElement);
  logoLink.appendChild(logoText);
  logoDiv.appendChild(logoLink);
  containerDiv.appendChild(logoDiv);

  // Create navigation
  const navDiv = document.createElement("nav");
  navDiv.classList.add("nav");
  navDiv.setAttribute("data-visibility", "false");

  const ulElement = document.createElement("ul");
  ulElement.classList.add("links");

  //return the required links for each page
  let navLinks;

  if ("/client/index.html" === location.pathname) {
    navLinks = [
      { name: "Marketplace", link: "html/location.html" },
      { name: "Explore People", link: "html/TA-directory.html" },
      { name: "Clubs", link: "html/selectCourse.html" },
      { name: "Timetables", link: "html/groupSchedule.html" },
      { name: "Notes", link: "html/gradesToPass.html" },
      { name: "Internships", link: "html/GPACalculator.html" },
      { name: "Discussion", link: "html/resource gateway.html" },
    ];
  } else {
    navLinks = [
      { name: "Marketplace", link: "../html/location.html" },
      { name: "Explore People", link: "../html/TA-directory.html" }, 
      { name: "Notes", link: "../html/selectCourse.html" },
      { name: "Timetables", link: "../html/groupSchedule.html" },
      { name: "Clubs", link: "../html/gradesToPass.html" },
      { name: "Internships", link: "../html/GPACalculator.html" },
      { name: "Discussion", link: "../html/resource gateway.html" },
    ];
  }
  navLinks.forEach((item) => {
    const liElement = document.createElement("li");
    const aElement = document.createElement("a");
    aElement.href = item.link;
    aElement.textContent = item.name;

    if (item.name == "logout" && !userName) {
      aElement.textContent = "login";
    }

    if (item.name === "logout") aElement.id = "logout";
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
  });

  navDiv.appendChild(ulElement);
  containerDiv.appendChild(navDiv);

  // Create avatar
  const avatar = document.createElement("a");
  const imgElement = document.createElement("img");

  if ("/client/index.html" === location.pathname) {
    imgElement.src = "images/profile pic2.svg";
  } else imgElement.src = "../images/profile pic2.svg";
  avatar.classList.add("avatar");

  avatar.appendChild(imgElement);
  containerDiv.appendChild(avatar);
  const avatarDropdown = document.createElement("div");
  avatarDropdown.classList.add("avatar-dropdown");

  let dropdownItems = [
    { name: "View profile", link: "html/profilePage.html" },
    { name: "Apply for JTA", link: "html/JTA.html" },
    {
      name: "Feedback",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdDtAs4eoyWzjABwTlLppcLFuJNBoziim2a4ooIYU7xXcyVTg/viewform",
    }
  ];
  
  // Add login/logout based on auth status
  if (userName) {
    dropdownItems.push({ name: "Logout", link: "#" });
  } else {
    dropdownItems.push({ name: "Login", link: "#" });
  }
  
  if ("/client/index.html" !== location.pathname) {
    dropdownItems = [
      { name: "View profile", link: "../html/profilePage.html" },
      { name: "Apply for JTA", link: "../html/JTA.html" },
      {
        name: "Feedback",
        link: "https://docs.google.com/forms/d/e/1FAIpQLSdDtAs4eoyWzjABwTlLppcLFuJNBoziim2a4ooIYU7xXcyVTg/viewform",
      }
    ];
    
    // Add login/logout based on auth status
    if (userName) {
      dropdownItems.push({ name: "Logout", link: "#" });
    } else {
      dropdownItems.push({ name: "Login", link: "#" });
    }
  }
  
  dropdownItems.forEach((item, index) => {
    const aElement = document.createElement("a");
    aElement.href = item.link;
    aElement.textContent = item.name;

    if (item.name === "View profile") {
      const iElement = document.createElement("i");
      iElement.classList.add("fa-regular", "fa-user");
      aElement.prepend(iElement);
    } else if (item.name === "Apply for JTA") {
      const iElement = document.createElement("i");
      iElement.classList.add("fa-solid", "fa-envelope-open");
      aElement.prepend(iElement);
    } else if (item.name === "Logout") {
      const iElement = document.createElement("i");
      iElement.classList.add("fa-solid", "fa-arrow-right-from-bracket");
      aElement.prepend(iElement);
    } else if (item.name === "Login") {
      const iElement = document.createElement("i");
      iElement.classList.add("fa-solid", "fa-sign-in-alt");
      aElement.prepend(iElement);
    } else if (item.name === "Feedback") {
      const iElement = document.createElement("i");
      iElement.classList.add("fa-regular", "fa-pen-to-square");
      aElement.prepend(iElement);
    }

    if (item.name === "Logout") {
      aElement.addEventListener("click", (event) => {
        event.preventDefault();
        // Clear token
        localStorage.removeItem("token");
        // Reload page to update UI
        window.location.reload();
      });
    } else if (item.name === "Login") {
      aElement.addEventListener("click", (event) => {
        event.preventDefault();
        
        // Show login modal if it exists on this page
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          console.log("Opening login modal from navbar");
          loginModal.style.display = 'block';
        } else {
          // If no modal exists on this page, redirect to discussions page
          console.log("No login modal found, redirecting to discussions page");
          window.location.href = "/client/html/resource gateway.html";
        }
      });
    } else if ((item.name === "View profile" || item.name === "Apply for JTA") && !userName) {
      aElement.addEventListener("click", (event) => {
        event.preventDefault();
        // Show login modal
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.style.display = 'block';
        } else {
          // If no modal exists on this page, redirect to discussions page
          window.location.href = "/client/html/resource gateway.html";
        }
      });
    }
    
    if (isAdmin && item.name === "Apply for JTA") {
      aElement.href =
        location.pathname === "/client/index.html"
          ? "html/JTARequests.html"
          : "./JTARequests.html";

      aElement.textContent = "JTA requests";
      const iElement = document.createElement("i");
      iElement.classList.add("fa-regular", "fa-bell");
      aElement.prepend(iElement);
    }

    avatarDropdown.appendChild(aElement);

    // Add a thin line before the "Logout" item
    if (index === dropdownItems.length - 2) {
      const hrElement = document.createElement("hr");
      avatarDropdown.appendChild(hrElement);
    }
  });
  
  avatarDropdown.style.display = "none";
  avatar.appendChild(avatarDropdown);

  avatar.addEventListener("click", () => {
    if (avatarDropdown.style.display === "none") {
      avatarDropdown.style.display = "block";
    }
    avatarDropdown.classList.toggle("show");
  });

  // Create burger menu
  const burgerMenuDiv = document.createElement("div");
  burgerMenuDiv.classList.add("burger-menu");
  const spanTop = document.createElement("span");
  spanTop.classList.add("top");
  const spanMid = document.createElement("span");
  spanMid.classList.add("mid");
  const spanBtm = document.createElement("span");
  spanBtm.classList.add("btm");
  burgerMenuDiv.appendChild(spanTop);
  burgerMenuDiv.appendChild(spanMid);
  burgerMenuDiv.appendChild(spanBtm);
  containerDiv.appendChild(burgerMenuDiv);
  
  // Create mobile navigation
  const mobileNavDiv = document.createElement("div");
  mobileNavDiv.classList.add("mobile-nav");

  let mobileNavLinks;
  if ("/client/index.html" === location.pathname)
    mobileNavLinks = [
      { href: "index.html", iconUnicode: "\u{f015}" },
      { href: "html/groupSchedule.html", iconUnicode: "\u{f073}" },
      { href: "html/TA-directory.html", iconUnicode: "\u{f51c}" },
      { href: "html/selectCourse.html", iconUnicode: "\u{f5da}" },
    ];
  else
    mobileNavLinks = [
      { href: "../index.html", iconUnicode: "\u{f015}" },
      { href: "../html/groupSchedule.html", iconUnicode: "\u{f073}" },
      { href: "../html/TA-directory.html", iconUnicode: "\u{f51c}" },
      { href: "../html/selectCourse.html", iconUnicode: "\u{f5da}" },
    ];
  mobileNavLinks.forEach((link) => {
    const aElement = document.createElement("a");
    aElement.href = link.href;
    const iElement = document.createElement("i");
    iElement.classList.add("fa-solid");
    iElement.textContent = link.iconUnicode;
    aElement.appendChild(iElement);
    mobileNavDiv.appendChild(aElement);
  });

  containerDiv.appendChild(mobileNavDiv);

  // Append the container to the header
  header.appendChild(containerDiv);

  // Hamburger menu functionality
  let hamburgerMenu = document.querySelector(".burger-menu");
  let navBar = document.querySelector(".nav");
  hamburgerMenu.addEventListener("click", () => {
    let vis = navBar.getAttribute("data-visibility");
    if (vis === "false") {
      navBar.setAttribute("data-visibility", "true");
      hamburgerMenu.classList.add("active");
    } else {
      navBar.setAttribute("data-visibility", "false");
      hamburgerMenu.classList.remove("active");
    }
  });
}

// Initialize the navbar
initNavbar();

// Handle clicks outside dropdown
document.addEventListener('click', function(event) {
  const avatarDropdown = document.querySelector('.avatar-dropdown');
  const avatar = document.querySelector('.avatar');
  
  if (avatarDropdown && avatar) {
    if (!avatar.contains(event.target) && avatarDropdown.classList.contains('show')) {
      avatarDropdown.classList.remove('show');
    }
  }
});