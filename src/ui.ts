export function makeUIPanel(
  onStartScrape: () => void,
  onStopScrape: () => void
) {
  const panel = document.createElement("div");
  panel.innerHTML = `<h1>Chat Scraper</h1>`;
  panel.classList.add("chat-scraper-panel");

  const buttonControls = document.createElement("div");
  const triggerScrapeButton = document.createElement("button");
  triggerScrapeButton.innerText = "Start scrape";
  triggerScrapeButton.classList.add("scrape-button");
  triggerScrapeButton.onclick = () => {
    if (triggerScrapeButton.innerText === "Start scrape") {
      triggerScrapeButton.innerText = "Stop scrape";
      onStartScrape();
    } else {
      triggerScrapeButton.innerText = "Start scrape";
      onStopScrape();
    }
  };
  buttonControls.appendChild(triggerScrapeButton);
  panel.appendChild(buttonControls);

  const style = document.createElement("style");
  style.innerText = panelCSS;
  document.body.prepend(style);

  makeDraggable(panel);

  document.body.prepend(panel);
  return panel;
}

const borderWhite = "#848484";
const darkGray = "#222222";
const offWhite = "#dfdfdf";
const primary = "#4d9648";
const panelCSS = `
.chat-scraper-panel {
    position: absolute;
    z-index: 10000;
    top: 10px;
    left: 10px;
    border-radius: 4px;
    border: 1px solid ${borderWhite};
    background-color: ${darkGray};
    padding: 10px 20px;
    font-size: 16px;
}
.chat-scraper-panel * {
    color: ${offWhite};
}
.chat-scraper-panel h1 {
    font-size: 1.5rem;
    font-weight: bold;
}
.scrape-button {
    margin-top: 10px;
    background-color: ${primary};
    font-weight: bold;
    border-radius: 2px;
    border: 1px solid ${borderWhite};
    padding: 10px 20px;
    color: white;
    width: 100%;
    font-size: 1rem;
}
.scrape-button:hover {
    transition: background-color 0.15s ease-in-out;
    cursor: pointer;
    background-color: ${primary}cc;
}
`;

/**
 * Makes a div draggable across the screen
 */
function makeDraggable(div: HTMLDivElement) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  div.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - div.offsetLeft;
    offsetY = e.clientY - div.offsetTop;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
    }
  });
}
