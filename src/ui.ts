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
const primaryDark = "#222222";
const offWhite = "#dfdfdf";
const panelCSS = `
.chat-scraper-panel {
    position: absolute;
    z-index: 10000;
    top: 10px;
    left: 10px;
    border-radius: 4px;
    border: 1px solid ${borderWhite};
    background-color: ${primaryDark};
    padding: 10px 20px;
    font-size: 16px;
}
.chat-scraper-panel * {
    color: ${offWhite};
}
.chat-scraper-panel h1 {
    font-weight: bold;
}`;

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
