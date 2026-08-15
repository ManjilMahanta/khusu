/* =========================================================================
   FOR KHUSHI — script.js

   HOW TO CUSTOMIZE (read me, Manjil):
   - MILESTONES: edit the text/dates in the `milestones` array below.
   - TIMELINE PHOTOS: `timelinePhotoFiles` picks which photos become the
     "pinned polaroids" down the thread. Reorder / swap filenames as you like.
   - CAPTIONS: edit `captions` — they cycle across the polaroids in order.
   - Everything else (all remaining photos) automatically goes into the
     "a few more we love" gallery grid at the bottom.
   - HERO PHOTO: change `heroPhoto` to whichever picture you want as the
     big cover image at the top.
   ========================================================================= */

// All 44 photos, already sorted oldest -> newest (by photo date where available).
const allPhotos = [
  "photo_01.jpg","photo_02.jpg","photo_03.jpg","photo_04.jpg","photo_05.jpg",
  "photo_06.jpg","photo_07.jpg","photo_08.jpg","photo_09.jpg","photo_10.jpg",
  "photo_11.jpg","photo_12.jpg","photo_13.jpg","photo_14.jpg","photo_15.jpg",
  "photo_16.jpg","photo_17.jpg","photo_18.jpg","photo_19.jpg","photo_20.jpg",
  "photo_21.jpg","photo_22.jpg","photo_23.jpg","photo_24.jpg","photo_25.jpg",
  "photo_26.jpg","photo_27.jpg","photo_28.jpg","photo_29.jpg","photo_30.jpg",
  "photo_31.jpg","photo_32.jpg","photo_33.jpg","photo_34.jpg","photo_35.jpg",
  "photo_36.jpg","photo_37.jpg","photo_38.jpg","photo_39.jpg","photo_40.jpg",
  "photo_41.jpg","photo_42.jpg","photo_43.jpg","photo_44.jpg"
];

// Cover photo for the hero section.
const heroPhoto = "photos/photo_18.jpg";

// Which photos get pulled out as "pinned polaroids" along the thread
// (spread evenly across the dated range so the story flows in order).
const timelinePhotoFiles = [
  "photo_02.jpg","photo_05.jpg","photo_08.jpg","photo_11.jpg","photo_14.jpg",
  "photo_17.jpg","photo_20.jpg","photo_23.jpg","photo_26.jpg","photo_29.jpg",
  "photo_31.jpg","photo_34.jpg"
];

// Captions cycle across the pinned polaroids, in order. Edit freely.
const captions = [
  "the start of us",
  "you, mid-laugh",
  "just a random day I kept anyway",
  "us being ridiculous",
  "quiet ones are my favorite",
  "caught you off guard",
  "another for the collection",
  "that whole day, honestly",
  "still can't believe you replied first that time",
  "us, again",
  "one of the good days",
  "and here we are"
];

// The written milestones — real dates from your story.
const milestones = [
  {
    date: "29 November 2024",
    title: "The first text",
    text: "I messaged you on Instagram for the first time. You ignored it. I kept texting anyway."
  },
  {
    date: "1 January 2025",
    title: "A new year",
    text: "You wished me a happy new year. Small thing to you, maybe. I still remember it."
  },
  {
    date: "23 February 2025",
    title: "She remembered",
    text: "My birthday came around, and you wished me. I don't think you know how much that meant."
  },
  {
    date: "24 January 2026",
    title: "Inked, and closest",
    text: "I got a tattoo — and added you to my close friends. You were the only one there. Still are."
  },
  {
    date: "August 2026",
    title: "Seven months",
    text: "Seven months of us, and a whole scrapbook of proof. Everything below is what got us here."
  }
];

// ---------------------------------------------------------------------
// Build the derived lists
// ---------------------------------------------------------------------
const galleryPhotoFiles = allPhotos.filter(f => !timelinePhotoFiles.includes(f));

// interleave: note, note, note, note[tattoo] -> photos -> note[7 months]
const introNotes = milestones.slice(0, 4);
const closingNote = milestones[4];

function randomTilt() {
  const deg = (Math.random() * 5 + 1.5).toFixed(1);
  return (Math.random() > 0.5 ? "" : "-") + deg + "deg";
}

function makeNoteEl(m, side) {
  const item = document.createElement("div");
  item.className = `timeline__item timeline__item--${side}`;
  item.innerHTML = `
    <div class="timeline__node"></div>
    <div class="timeline__card">
      <div class="note" style="--tilt:${randomTilt()}">
        <span class="note__date">${m.date}</span>
        <h3 class="note__title">${m.title}</h3>
        <p class="note__text">${m.text}</p>
      </div>
    </div>
  `;
  return item;
}

function makePhotoEl(file, caption, side) {
  const item = document.createElement("div");
  item.className = `timeline__item timeline__item--${side}`;
  item.innerHTML = `
    <div class="timeline__node"></div>
    <div class="timeline__card">
      <figure class="polaroid" style="--tilt:${randomTilt()}">
        <img src="photos/${file}" alt="${caption}" loading="lazy" />
        <figcaption>${caption}</figcaption>
      </figure>
    </div>
  `;
  return item;
}

function buildTimeline() {
  const container = document.getElementById("timeline");
  let side = "left";
  const flip = () => { side = side === "left" ? "right" : "left"; return side; };

  introNotes.forEach(m => {
    container.appendChild(makeNoteEl(m, side));
    flip();
  });

  timelinePhotoFiles.forEach((file, i) => {
    const caption = captions[i % captions.length];
    container.appendChild(makePhotoEl(file, caption, side));
    flip();
  });

  container.appendChild(makeNoteEl(closingNote, side));
}

function buildGallery() {
  const grid = document.getElementById("galleryGrid");
  galleryPhotoFiles.forEach(file => {
    const img = document.createElement("img");
    img.src = `photos/${file}`;
    img.loading = "lazy";
    img.alt = "a moment with Khushi";
    img.addEventListener("click", () => openLightbox(`photos/${file}`));
    grid.appendChild(img);
  });
}

// ---------------------------------------------------------------------
// Scroll reveal (IntersectionObserver)
// ---------------------------------------------------------------------
function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".timeline__item, .gallery__grid img").forEach(el => observer.observe(el));
}

// ---------------------------------------------------------------------
// Thread fill progress tied to scroll position within the timeline
// ---------------------------------------------------------------------
function setupThreadProgress() {
  const timeline = document.getElementById("timeline");
  const fill = document.getElementById("threadFill");

  function update() {
    const rect = timeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const scrolled = Math.min(Math.max(viewportH * 0.5 - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    fill.style.height = pct + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// ---------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  img.src = src;
  lightbox.classList.add("is-open");
}

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  document.getElementById("lightboxClose").addEventListener("click", () => {
    lightbox.classList.remove("is-open");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("is-open");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.classList.remove("is-open");
  });
}

// ---------------------------------------------------------------------
// Confetti (finale section)
// ---------------------------------------------------------------------
function setupConfetti() {
  const colors = ["#c6435b", "#c9a24b", "#fffaf3", "#e8b4b8"];
  const container = document.getElementById("confetti");
  const count = window.innerWidth < 600 ? 26 : 46;

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    const size = Math.random() * 7 + 5;
    span.style.left = Math.random() * 100 + "%";
    span.style.width = size + "px";
    span.style.height = size * 0.6 + "px";
    span.style.background = colors[i % colors.length];
    span.style.animationDuration = (Math.random() * 4 + 5) + "s";
    span.style.animationDelay = (Math.random() * 5) + "s";
    container.appendChild(span);
  }
}

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("heroBg").style.backgroundImage = `url('${heroPhoto}')`;
  buildTimeline();
  buildGallery();
  setupReveal();
  setupThreadProgress();
  setupLightbox();
  setupConfetti();
});
