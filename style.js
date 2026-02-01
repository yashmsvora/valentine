const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const statusEl = document.getElementById("status");
const nextBtn = document.getElementById("nextBtn");
const dateOptions = document.getElementById("dateOptions");
const plotPanel = document.getElementById("plotPanel");
const plotTitle = document.getElementById("plotTitle");
const plotText = document.getElementById("plotText");
const plotList = document.getElementById("plotList");
const plotImage = document.getElementById("plotImage");
const kenFace = document.querySelector(".ken-face");
const kenMouth = document.getElementById("kenMouth");
const kenCaption = document.getElementById("kenCaption");
const dateCards = Array.from(document.querySelectorAll(".date-card"));
const kenSection = document.getElementById("kenSection");
const ctaSection = document.getElementById("ctaSection");
const headerSection = document.getElementById("headerSection");
const footerSection = document.getElementById("footerSection");

let lastTrigger = yesBtn;
let plotIndex = 0;
let currentPlots = [];
let noHoverCount = 0;
let noClicks = 0;

const statusPhrases = [
  "Pink spiral unlocked.",
  "Dreamhouse itinerary loading.",
  "Glitter level: iconic.",
  "Ken has the aux cord ready.",
  "Heart confetti incoming."
];

const datePlots = {
  malibu: [
    {
      title: "Malibu Skates",
      text: "Glitter skates glide along the boardwalk with cotton-candy skies."
    },
    {
      title: "Seashell Surprise",
      text: "Ken finds a shell shaped like a heart. He gasps, politely."
    },
    {
      title: "Sunset Cruise",
      text: "The pink convertible becomes a magical sunset tunnel."
    }
  ],
  dreamhouse: [
    {
      title: "Dreamhouse Disco",
      text: "The rooftop lights up with bubblegum beats and confetti."
    },
    {
      title: "Sparkle Mocktails",
      text: "Barbie serves a pink drink with a glitter sugar rim."
    },
    {
      title: "Twirls & Twinkles",
      text: "Ken practices a dramatic twirl. It is, sadly, perfect."
    }
  ],
  arcade: [
    {
      title: "Pastel Arcade",
      text: "The claw machine delivers a plush that looks suspiciously like Ken."
    },
    {
      title: "Photo Booth Chaos",
      text: "Three frames, six poses, one unstoppable giggle fit."
    },
    {
      title: "Prize Parade",
      text: "Tickets rain down. Barbie declares you the champion."
    }
  ]
};

const dateImages = {
  malibu: "assets/malibu.png",
  dreamhouse: "assets/disco.png",
  arcade: "assets/photo booth.png"
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function showDateOptions() {
  dateOptions.classList.remove("is-hidden");
  dateOptions.scrollIntoView({ behavior: "smooth", block: "start" });
}

function launchSparkles() {
  const count = 80;
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("div");
    const size = rand(6, 12);
    el.style.position = "fixed";
    el.style.left = `${rand(0, window.innerWidth)}px`;
    el.style.top = `${rand(-20, 30)}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = "50%";
    el.style.background = `hsl(${rand(320, 360)} 90% 70%)`;
    el.style.opacity = "0.9";
    el.style.zIndex = 9999;

    document.body.appendChild(el);

    const fall = rand(420, 760);
    const drift = rand(-160, 160);
    const dur = rand(900, 1500);

    el.animate(
      [
        { transform: "translate(0, 0) scale(1)" },
        { transform: `translate(${drift}px, ${fall}px) scale(0.6)`, opacity: 0 }
      ],
      { duration: dur, easing: "cubic-bezier(.2,.7,.2,1)" }
    );

    setTimeout(() => el.remove(), dur + 60);
  }
}

function renderPlots() {
  plotList.innerHTML = "";
  const plotsToShow = Math.min(3, currentPlots.length);
  for (let i = 0; i < plotsToShow; i += 1) {
    const plot = currentPlots[(plotIndex + i) % currentPlots.length];
    const card = document.createElement("div");
    card.className = "stop";

    const title = document.createElement("div");
    title.className = "plot-title";
    title.textContent = plot.title;

    const text = document.createElement("div");
    text.className = "plot-text";
    text.textContent = plot.text;

    card.appendChild(title);
    card.appendChild(text);
    plotList.appendChild(card);
  }
}

function handleAnswer(answer) {
  lastTrigger = answer === "yes" ? yesBtn : noBtn;
  setStatus("");
  showDateOptions();
  launchSparkles();
}

yesBtn.addEventListener("click", () => handleAnswer("yes"));

yesBtn.addEventListener("mouseenter", () => {
  yesBtn.classList.remove("wiggle");
  void yesBtn.offsetWidth;
  yesBtn.classList.add("wiggle");
  kenMouth.classList.remove("sad", "laugh");
  kenFace.classList.remove("laugh-tears");
  kenMouth.classList.add("surprised");
  kenCaption.textContent = "";
});

noBtn.addEventListener("mouseenter", () => {
  if (noBtn.dataset.converted) return;
  noHoverCount += 1;
  kenMouth.classList.remove("surprised", "laugh");
  kenFace.classList.remove("laugh-tears");
  kenMouth.classList.add("sad");
  kenCaption.textContent = "";
  if (noHoverCount % 2 === 0) {
    yesBtn.style.transform = "scale(1.05)";
  }
});

noBtn.addEventListener("click", () => {
  if (!noBtn.dataset.converted) {
    noClicks += 1;
    noBtn.dataset.converted = "true";
    noBtn.classList.add("sad");
    kenMouth.classList.remove("surprised", "laugh");
    kenMouth.classList.add("laugh");
    kenFace.classList.add("laugh-tears");
    kenCaption.textContent = "";
    setStatus("");
    noBtn.textContent = "Yes (oops!)";
    setTimeout(() => {
      noBtn.classList.remove("sad");
    }, 500);
    return;
  }

  handleAnswer("yes");
});

yesBtn.addEventListener("click", () => {
  kenMouth.classList.remove("sad", "laugh");
  kenFace.classList.remove("laugh-tears");
  kenMouth.classList.add("surprised");
  kenCaption.textContent = "";
});

nextBtn.addEventListener("click", () => {
  if (!currentPlots.length) return;
  plotIndex = (plotIndex + 1) % currentPlots.length;
  renderPlots();
});

dateCards.forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.date;
    lastTrigger = card;
    currentPlots = datePlots[key] || [];
    plotImage.src = dateImages[key] || "";
    plotImage.alt = `Barbie and Ken at the ${key} date`;
    plotIndex = 0;
    plotTitle.textContent = "";
    plotText.textContent = "";
    setStatus("");
    plotPanel.classList.remove("is-hidden");
    kenSection.classList.add("is-hidden");
    ctaSection.classList.add("is-hidden");
    dateOptions.classList.add("is-hidden");
    headerSection.classList.add("is-hidden");
    footerSection.classList.add("is-hidden");
    renderPlots();
    launchSparkles();
  });
});
