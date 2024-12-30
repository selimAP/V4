gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smooth: true,
    smoothTouch: 0.1
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const changeStyleOnScroll = () => {
  const scrollPosition = window.scrollY;
  const h1 = document.querySelector('h1');

  const scaleValue = 1 + Math.min(scrollPosition / 300, 2);
  const colorProgress = Math.min(scrollPosition / 300, 1);

  gsap.to(h1, {
      scale: scaleValue,
      color: `rgb(${169 + (255 - 169) * colorProgress}, ${169 + (255 - 169) * colorProgress}, ${169 + (255 - 169) * colorProgress})`,
      duration: 0
  });
};

lenis.on('scroll', () => {
  changeStyleOnScroll();
});

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  function animateText(selector) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach((aboutText) => {
      const textContent = aboutText.textContent.trim();
      aboutText.textContent = "";

      textContent.split(" ").forEach((word, index, array) => {
        const wordElement = document.createElement("span");
        wordElement.textContent = word;
        wordElement.style.color = "gray";
        aboutText.appendChild(wordElement);

        if (index < array.length - 1) {
          aboutText.appendChild(document.createTextNode(" "));
        }
      });

      gsap.fromTo(
        aboutText.children,
        { color: "gray" },
        {
          color: "white",
          stagger: 0.2,
          scrollTrigger: {
            trigger: aboutText,
            start: "top 90%",
            end: "bottom 50%",
            scrub: true,
          },
        }
      );
    });
  }

  if (
    currentPath.includes("about.html") ||
    currentPath.includes("project.html") ||
    currentPath.match(/P[1-8]\.html/)
  ) {
    animateText(".aboutme-text p");
  } else if (currentPath.includes("index.html") || currentPath === "/") {
    animateText(".aboutme-text p");

    const scrollingText = gsap.utils.toArray(".rail h4");
    if (scrollingText.length) {
      gsap.timeline({
        scrollTrigger: {
          trigger: ".scrolling-text",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }).to(scrollingText, { x: "-=100%", ease: "none" });
    }
  }
});


gsap.registerPlugin(ScrollTrigger);

const scrollingText = gsap.utils.toArray('.rail h4');


gsap.registerPlugin(ScrollTrigger);



document.addEventListener("DOMContentLoaded", () => {
  const lines = document.querySelector(".lines");
  const navMenu = document.querySelector(".navmenu");
  const navLinks = document.querySelectorAll(".navlink");
  const html = document.querySelector("html");

  function isMobileMenu() {
    return window.innerWidth <= 850;
  }

  // Initialisierung des Hamburger-Menüs für mobile Geräte
  if (isMobileMenu()) {
    gsap.set(navMenu, { x: "100%" });
    gsap.set(navLinks, { opacity: 0, y: 50 });
  }

  const menuTimeline = gsap.timeline({ paused: true, reversed: true });

  menuTimeline
    .to(navMenu, {
      x: "0%",
      duration: 0.8,
      ease: "power4.out",
    })
    .to({}, { duration: 0.3 }) // Leere Animation als Platzhalter
    .to(
      navLinks,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.3"
    );

  // Öffnen/Schließen des Menüs bei Klick auf die Hamburger-Lines
  lines.addEventListener("click", () => {
    if (!isMobileMenu()) return;
    if (menuTimeline.isActive()) return;

    if (menuTimeline.reversed()) {
      menuTimeline.play();
      html.classList.add("menu-open");
    } else {
      menuTimeline.reverse();
      html.classList.remove("menu-open");
    }
  });

  // Smooth-Scroll und Menü schließen bei Klick auf einen Menüpunkt
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      // Smooth-Scroll mit GSAP
      if (targetId.startsWith("#")) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          gsap.to(window, {
            scrollTo: { y: targetElement, offsetY: 70 }, // Offset für Header
            duration: 1,
            ease: "power2.out",
          });
        }
      }

      // Schließen des Menüs, wenn ein Link geklickt wird (nur mobil)
      if (isMobileMenu()) {
        menuTimeline.reverse();
        html.classList.remove("menu-open");
      }
    });
  });

  // Menü zurücksetzen, wenn die Fenstergröße geändert wird
  window.addEventListener("resize", () => {
    if (!isMobileMenu()) {
      gsap.set(navMenu, { clearProps: "all" });
      gsap.set(navLinks, { clearProps: "all" });
      html.classList.remove("menu-open");
    } else {
      gsap.set(navMenu, { x: menuTimeline.reversed() ? "100%" : "0%" });
      gsap.set(navLinks, {
        opacity: menuTimeline.reversed() ? 0 : 1,
        y: menuTimeline.reversed() ? 50 : 0,
      });
    }
  });
});






function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};

    let tl = gsap.timeline({
        repeat: -1,
        paused: true,
        defaults: { ease: "none" },
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
    });

    const length = items.length;
    const startX = items[0].offsetLeft;
    const widths = [];
    const xPercents = [];
    let curIndex = 0;
    const pixelsPerSecond = (config.speed || 1) * 100;
    const snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1);

    let totalWidth, curX, distanceToStart, distanceToLoop, item;

    gsap.set(items, {
        xPercent: (i, el) => {
            const w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
            xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        }
    });

    gsap.set(items, { x: 0 });

    totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);

    const spaceBetweenItems = 20;

    for (let i = 0; i < length; i++) {
        item = items[i];
        curX = xPercents[i] / 100 * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

        tl.to(item, { 
            xPercent: snap((curX - distanceToLoop + spaceBetweenItems) / widths[i] * 100), 
            duration: (distanceToLoop + spaceBetweenItems) / pixelsPerSecond 
        }, 0)
        .fromTo(item, { 
            xPercent: snap((curX - distanceToLoop + totalWidth + spaceBetweenItems) / widths[i] * 100) 
        }, { 
            xPercent: xPercents[i], 
            duration: (curX - distanceToLoop + totalWidth + spaceBetweenItems - curX) / pixelsPerSecond, 
            immediateRender: false 
        }, distanceToLoop / pixelsPerSecond);
    }

    tl.play();

    function toIndex(index, vars) {
        vars = vars || {};
        const newIndex = gsap.utils.wrap(0, length, index);
        let time = newIndex * pixelsPerSecond;

        curIndex = newIndex;
        vars.overwrite = true;

        return tl.tweenTo(time, vars);
    }

    tl.next = vars => toIndex(curIndex + 1, vars);
    tl.previous = vars => toIndex(curIndex - 1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);

    return tl;
}

const tl = horizontalLoop('.scrolling-text h4', {
    repeat: -1,
    speed: 1,
});

let lastScrollY = 0;

ScrollTrigger.create({
    trigger: ".scrolling-text",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
        const newScrollSpeed = Math.abs(self.scroll() - lastScrollY) * 0.45;
        lastScrollY = self.scroll();

        if (newScrollSpeed > 0) {
            tl.timeScale(newScrollSpeed * 10);

            if (self.direction === 1) {
                tl.play();
            } else if (self.direction === -1) {
                tl.reverse();
            }
        } else {
            tl.timeScale(1);
        }
    },
    markers: false,
});




const elementsWorks = document.querySelectorAll(".item-work");
const slidePicWorks = document.querySelector("#gallery-work");
const slidePicsWorks = document.querySelector("#work-images");

gsap.set(slidePicWorks, { autoAlpha: 0 });

elementsWorks.forEach((element, index) => {
  element.addEventListener("mouseenter", function () {
    gsap.to(slidePicsWorks, {
      marginTop: `-${280 * index}px`,
      duration: 0.2,
      ease: "power1",
    });
  });

  element.addEventListener("mouseleave", function () {
    gsap.to(element, { color: "initial", duration: 0.2, ease: "power1" });
  });
});

window.addEventListener("mousemove", function (e) {
  gsap.to(slidePicWorks, {
    top: `${e.clientY}px`,
    left: `${e.clientX}px`,
    xPercent: -20,
    yPercent: -45,
    duration: 0.2,
    ease: "power1",
  });
});

document
  .querySelector(".items-works")
  .addEventListener("mouseenter", function () {
    gsap.to(slidePicWorks, {
      autoAlpha: 1,
      duration: 0.2,
      ease: "power1",
    });
  });

document
  .querySelector(".items-works")
  .addEventListener("mouseleave", function () {
    gsap.to(slidePicWorks, {
      autoAlpha: 0,
      duration: 0.2,
      ease: "power1",
    });
  });

function updateClock() {
  const timeElement = document.querySelector(".footer-bottom .time .time");

  const options = {
    timeZone: 'Europe/Berlin',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const now = new Date();
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(now);

  const timezoneOffset = now.getTimezoneOffset() / -60;
  const timezone = `GMT${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`;

  const displayTime = `${formattedTime} ${timezone}`;

  timeElement.textContent = displayTime;
}

setInterval(updateClock, 1000);

updateClock();



document.addEventListener("DOMContentLoaded", () => {
  const binaryName = document.getElementById("binary-name");
  const textName = document.getElementById("text-name");
  const preloader = document.getElementById("preloader");

  const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

  if (hasSeenPreloader) {
    preloader.style.display = "none";
  } else {
    sessionStorage.setItem("hasSeenPreloader", "true");
    startPreloaderAnimation();
  }

  function startPreloaderAnimation() {
    const targetBinary = "01001000 01101001";
    const words = ["Hello", "My", "Name", "Is", "Selim"];
    let wordIndex = 0;

    function buildBinaryText() {
      const targetBinaryArray = targetBinary.split("");
      const currentBinaryArray = Array(targetBinaryArray.length).fill("0");
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < targetBinaryArray.length) {
          currentBinaryArray[currentIndex] = targetBinaryArray[currentIndex];
          binaryName.textContent = currentBinaryArray.join("");
          currentIndex++;
        } else {
          clearInterval(interval);
          gsap.to(binaryName, {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              binaryName.style.display = "none";
              revealWords();
            },
          });
        }
      }, 100);
    }

    function revealWords() {
      if (wordIndex < words.length) {
        const currentWord = words[wordIndex];

        textName.textContent = currentWord;
        textName.style.display = "block";

        gsap.fromTo(
          textName,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(textName, {
                y: -50,
                opacity: 0,
                delay: 0.2,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                  wordIndex++;
                  revealWords();
                },
              });
            },
          }
        );
      } else {
        hidePreloader();
      }
    }

    function hidePreloader() {
      gsap.to(preloader, {
        y: "-100%",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          preloader.style.display = "none";
        },
      });
    }

    function adjustBinaryLayout() {
      if (window.innerWidth <= 451) {
        binaryName.style.whiteSpace = "pre-wrap";
        binaryName.style.display = "block";
      } else {
        binaryName.style.whiteSpace = "nowrap";
        binaryName.style.display = "inline";
      }
    }

    adjustBinaryLayout();
    window.addEventListener("resize", adjustBinaryLayout);

    buildBinaryText();
  }
});
