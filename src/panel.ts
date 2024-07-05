export interface ScraperPanel {
  setIdle: () => void;
  setScraping: () => void;
  setStartScrapeHandler: (handler: () => void) => void;
  setStopScrapeHandler: (handler: () => void) => void;
  display: () => void;
}

export function makeScraperPanel(): ScraperPanel {
  return new ScraperPanelUI();
}

class ScraperPanelUI implements ScraperPanel {
  private onStartScrape = () => {};
  private onStopScrape = () => {};
  private readonly panel: HTMLDivElement;
  private readonly scrapeButton: HTMLButtonElement;
  private loadingSpinner: HTMLDivElement;
  private state: "idle" | "scraping" = "idle";

  public constructor() {
    this.panel = document.createElement("div");
    this.scrapeButton = document.createElement("button");
    this.scrapeButton.innerText = "Start scrape";
    this.scrapeButton.classList.add("scrape-button");
    this.panel.innerHTML = `<h1>Chat Scraper</h1>`;
    this.panel.appendChild(this.scrapeButton);
    this.panel.classList.add("chat-scraper-panel");
    this.scrapeButton.onclick = () => {
      if (this.state === "idle") {
        this.setScraping();
        this.onStartScrape();
      } else if (this.state === "scraping") {
        this.setIdle();
        this.onStopScrape();
      }
    };
    this.loadingSpinner = document.createElement("div");
    this.loadingSpinner.style.display = "none";
    this.loadingSpinner.innerText = "Loading...";
    this.panel.appendChild(this.loadingSpinner);
  }

  public setIdle() {
    this.state = "idle";
    this.scrapeButton.innerText = "Start scrape";
    this.loadingSpinner.style.display = "none";
    this.panel.classList.remove("scraping");
  }

  public setScraping() {
    this.state = "scraping";
    this.scrapeButton.innerText = "Stop scrape";
    this.panel.classList.add("scraping");
    this.loadingSpinner.style.display = "";
  }

  public display() {
    const style = document.createElement("style");
    style.innerText = panelCSS;
    document.body.prepend(style);
    document.body.prepend(this.panel);
  }

  public setStartScrapeHandler(handler: () => void) {
    this.onStartScrape = handler;
  }

  public setStopScrapeHandler(handler: () => void) {
    this.onStopScrape = handler;
  }
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
.chat-scraper-panel .loading-spinner {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.chat-scraper-panel.scraping .loading-spinner {
  display: block;
}
`;
