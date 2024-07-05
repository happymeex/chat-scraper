export interface ScraperPanel {
  setIdle: () => void;
  setScraping: () => void;
  setStartScrapeHandler: (handler: () => void) => void;
  setStopScrapeHandler: (handler: () => void) => void;
  setOnDownloadHandler: (handler: () => void) => void;
  setOnOpenInNewWindowHandler: (handler: () => void) => void;
  showExportOptions: () => void;
  setCurrentChatName: (chatName: string) => void;
  display: () => void;
}

/**
 * Creates a ScraperPanel if one does not already exist.
 *
 * @return The created ScraperPanel or null if it already exists.
 */
export function makeScraperPanel(): ScraperPanel | null {
  const maybePanel = document.querySelector(".chat-scraper-panel");
  if (maybePanel) {
    maybePanel.remove();
    return null;
  }
  return new ScraperPanelUI();
}

class ScraperPanelUI implements ScraperPanel {
  private onStartScrape = () => {};
  private onStopScrape = () => {};
  private onDownload = () => {};
  private onOpenInNewWindow = () => {};
  private readonly panel: HTMLDivElement;
  private readonly scrapeButton: HTMLButtonElement;
  private readonly downloadButton: HTMLButtonElement;
  private readonly openInNewWindowButton: HTMLButtonElement;
  private readonly exportOptionsHolder: HTMLDivElement;
  private state: "idle" | "scraping" = "idle";
  private currentChatName: string | null = null;

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
        this.showExportOptions();
        this.onStopScrape();
      }
    };

    const statusBanner = document.createElement("div");
    statusBanner.innerHTML = '<div class="loader"></div>';
    statusBanner.classList.add("status-banner");
    this.panel.appendChild(statusBanner);

    this.exportOptionsHolder = document.createElement("div");
    this.exportOptionsHolder.classList.add("options-holder");
    this.exportOptionsHolder.innerHTML =
      '<div class="last-scraped-banner"></div>';
    this.panel.appendChild(this.exportOptionsHolder);

    this.downloadButton = document.createElement("button");
    this.downloadButton.innerText = "Download";
    this.downloadButton.classList.add("regular-button");
    this.exportOptionsHolder.appendChild(this.downloadButton);

    this.openInNewWindowButton = document.createElement("button");
    this.openInNewWindowButton.innerText = "Open in new window";
    this.openInNewWindowButton.classList.add("regular-button");
    this.exportOptionsHolder.appendChild(this.openInNewWindowButton);

    this.downloadButton.onclick = () => {
      this.onDownload();
    };
    this.openInNewWindowButton.onclick = () => {
      this.onOpenInNewWindow();
    };
  }

  public setIdle() {
    this.state = "idle";
    this.scrapeButton.innerText = "Start scrape";
    this.panel.classList.remove("scraping");
  }

  public setScraping() {
    this.state = "scraping";
    this.scrapeButton.innerText = "Stop scrape";
    this.panel.classList.add("scraping");
  }

  public display() {
    const style = document.createElement("style");
    style.classList.add("chat-scraper-style");
    style.innerText = panelCSS;
    document.body.prepend(style);
    document.body.prepend(this.panel);
  }

  public remove() {
    this.onStopScrape();
    this.panel.remove();
    document.querySelector(".chat-scraper-style")?.remove();
  }

  public setStartScrapeHandler(handler: () => void) {
    this.onStartScrape = handler;
  }

  public setStopScrapeHandler(handler: () => void) {
    this.onStopScrape = handler;
  }

  public setOnDownloadHandler(handler: () => void) {
    this.onDownload = handler;
  }

  public setOnOpenInNewWindowHandler(handler: () => void) {
    this.onOpenInNewWindow = handler;
  }

  public showExportOptions() {
    this.exportOptionsHolder.querySelector(
      ".last-scraped-banner"
    )!.innerHTML = `<strong style="font-weight: bold">Last scraped:</strong> ${this.currentChatName}`;
    this.exportOptionsHolder.classList.add("visible");
  }

  public setCurrentChatName(chatName: string) {
    this.currentChatName = chatName;
  }
}

const borderWhite = "#848484";
const darkGray = "#222222";
const medGray = "#2f2f2f";
const lightGray = "#4c4c4c";
const offWhite = "#dfdfdf";
const primary = "#4d9648";
const secondary = "#994252";
const panelCSS = `
.chat-scraper-panel {
    position: absolute;
    z-index: 10000;
    top: 10px;
    left: 10px;
    border-radius: 4px;
    border: 1px solid ${borderWhite};
    background-color: ${darkGray};
    padding: 10px 20px 16px;
    font-size: 16px;
    max-width: 300px;
}
.chat-scraper-panel * {
    color: ${offWhite};
}
.chat-scraper-panel h1 {
    font-size: 1.5rem;
    font-weight: bold;
}
.chat-scraper-panel .status-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
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
.chat-scraper-panel .options-holder {
    display: none;
}
.chat-scraper-panel .options-holder.visible {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 8px;
}
.chat-scraper-panel .last-scraped-banner {
    
}
.chat-scraper-panel .regular-button {
    margin-top: 10px;
    background-color: ${darkGray};
    font-weight: bold;
    border-radius: 2px;
    border: 1px solid ${borderWhite};
    padding: 10px 20px;
    color: white;
    width: 100%;
    font-size: 1rem;
}
.chat-scraper-panel .regular-button:hover {
    transition: background-color 0.15s ease-in-out;
    cursor: pointer;
    filter: brightness(1.2);
}
.scrape-button:hover {
    transition: background-color 0.15s ease-in-out;
    cursor: pointer;
    background-color: ${primary}cc;
}
.chat-scraper-panel.scraping .scrape-button {
    background-color: ${secondary};
}
.chat-scraper-panel.scraping .scrape-button:hover {
    background-color: ${secondary}cc;
}
.loader {
    display: none;
}
.chat-scraper-panel.scraping .loader {
    display: block;
    border: 4px solid ${lightGray};
    border-top: 4px solid ${medGray};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: chat-scraper-panel-spin 2s linear infinite;
}
  
@keyframes chat-scraper-panel-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
