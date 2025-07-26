

// Toggle menu on mobile
// const toggle = document.getElementById("toggle");
// const menu = document.getElementById("menu");

// toggle.addEventListener("click", () => {
//   menu.classList.toggle("active");
// });

// const navbar = document.querySelector(".navbar");

// window.addEventListener("scroll", () => {
//   if (window.scrollY > 50) {
//     navbar.classList.add("scrolled");
//   } 
//   else {
//     navbar.classList.remove("scrolled");
//   }
// });





// document.addEventListener("DOMContentLoaded", function () {
//   const track = document.querySelector(".logo-track");
//   const logos = track.innerHTML;
//   track.innerHTML += logos;
  
//   // Clone logos once to make a loop
// });

//slides will copy

// var copy = document.querySelector(".logos-slide").cloneNode(true);
// document.querySelector(".logos").appendChild(copy);

var copy = document.querySelector(".logos-slide").cloneNode(true);
      document.querySelector(".logos").appendChild(copy);





//moving lets talk   const wordElement = document.getElementById("shuffle-word");



           // vedio
            
//  const video = document.getElementById("autoplay-video");

//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           video.play();
//         } else {
//           video.pause(); // Optional: Pause when not in view
//         }
//       });
//     },
//     { threshold: 0.5 }
//   );

//   observer.observe(video);





  // First autoplay silently on scroll

  const video = document.getElementById("autoplay-video");
  let userInteracted = false;

  // Detect user interaction (click/tap anywhere)
  document.body.addEventListener("click", () => {
    userInteracted = true;
  });

  // Wait for DOM and then observe
  window.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().then(() => {
              // If user interacted, unmute
              if (userInteracted) {
                video.muted = false;
              }
            }).catch((e) => {
              console.log("Play failed:", e);
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
  });









//bogs


  const carousel = document.querySelector('.blog-carousel');
  const cards = document.querySelectorAll('.blog-card');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');

  let index = 0;
  const visibleCards = 52;
  const totalCards = cards.length;
  const cardWidth = cards[0].offsetWidth + 20; // 20 = gap

  function updateCarousel() {
    const maxIndex = totalCards - visibleCards;
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;
    carousel.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  rightBtn.addEventListener('click', () => {
    index++;
    updateCarousel();
  });

  leftBtn.addEventListener('click', () => {
    index--;
    updateCarousel();
  });

  // Optional: Auto Slide
  setInterval(() => {
    index++;
    updateCarousel();
  }, 4000);

