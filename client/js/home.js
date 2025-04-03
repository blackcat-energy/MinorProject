// start animation
const sectionPoints = document.querySelectorAll(
  ".section-global .section-points li"
);
const observerOfSectionPoints = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting) el.target.classList.add("active");
    });
  },
  { threshold: 1 }
);
sectionPoints.forEach((el) => observerOfSectionPoints.observe(el));

const welcomeText = document.querySelectorAll(".welcome .container .text h1");
const logo = document.querySelectorAll(".welcome .container .img img");
const observerOfWelcome = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting) el.target.classList.add("active");
    });
  },
  { threshold: 1 }
);

welcomeText.forEach((el) => observerOfWelcome.observe(el));
logo.forEach((el) => observerOfWelcome.observe(el));
