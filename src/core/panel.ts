import { addRadioInput } from "./utils";
import { Exporter } from "./types";

const CSP = "chat-scraper-panel";

export interface ScraperPanel {
  setIdle: () => void;
  setScraping: () => void;
  setStartScrapeHandler: (handler: () => void) => void;
  setStopScrapeHandler: (handler: () => void) => void;
  setDownloadHandler: (handler: Exporter) => void;
  setOpenInNewWindowHandler: (handler: Exporter) => void;
  showExportOptions: () => void;
  setCurrentChatName: (chatName: string) => void;
  display: () => void;
  remove: () => void;
}

/**
 * Creates a ScraperPanel if one does not already exist.
 *
 * @return The created ScraperPanel or null if it already exists.
 */
export function makeScraperPanel(): ScraperPanel | null {
  const maybePanel = document.querySelector(`#${CSP}`);
  if (maybePanel) {
    return null;
  }
  return new ScraperPanelUI();
}

class ScraperPanelUI implements ScraperPanel {
  private onStartScrape = () => {};
  private onStopScrape = () => {};
  private onDownload = (format: "json" | "text") => {};
  private onOpenInNewWindow = (format: "json" | "text") => {};
  private readonly panel: HTMLDivElement;
  private readonly scrapeButton: HTMLButtonElement;
  private readonly downloadButton: HTMLButtonElement;
  private readonly openInNewWindowButton: HTMLButtonElement;
  private readonly exportOptionsHolder: HTMLDivElement;
  private readonly radioHolder: HTMLDivElement;
  private readonly closeButton: HTMLSpanElement;
  private state: "idle" | "scraping" = "idle";
  private currentChatName: string | null = null;
  private currentExportFormat: "json" | "text" = "text";

  public constructor() {
    this.panel = document.createElement("div");
    this.scrapeButton = document.createElement("button");
    this.scrapeButton.innerText = "Start scrape";
    this.scrapeButton.classList.add("scrape-button");
    this.panel.innerHTML = `<h1>Chat Scraper</h1>`;
    this.closeButton = document.createElement("span");
    this.closeButton.classList.add("close-button");
    this.closeButton.innerText = "\u2715";
    this.closeButton.onclick = () => {
      this.remove();
    };
    this.panel.querySelector("h1")!.append(this.closeButton);
    this.panel.appendChild(this.scrapeButton);
    this.panel.id = CSP;
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

    this.radioHolder = document.createElement("div");
    this.radioHolder.classList.add("radio-holder");
    this.exportOptionsHolder.appendChild(this.radioHolder);
    addRadioInput(
      this.radioHolder,
      "As text",
      "export-format",
      "text",
      true,
      () => {
        this.currentExportFormat = "text";
      }
    );
    addRadioInput(
      this.radioHolder,
      "As JSON",
      "export-format",
      "json",
      false,
      () => {
        this.currentExportFormat = "json";
      }
    );

    this.downloadButton.onclick = () => {
      this.onDownload(this.currentExportFormat);
    };
    this.openInNewWindowButton.onclick = () => {
      this.onOpenInNewWindow(this.currentExportFormat);
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

  public setDownloadHandler(handler: (format: "json" | "text") => void) {
    this.onDownload = handler;
  }

  public setOpenInNewWindowHandler(handler: (format: "json" | "text") => void) {
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
const darkGray = "#292929";
const medGray = "#3c3c3c";
const lightGray = "#595959";
const offWhite = "#dfdfdf";
const primary = "#4d9648";
const secondary = "#994252";
const panelCSS = `
#${CSP} {
    position: fixed;
    z-index: 10000;
    top: 10px;
    right: 10px;
    border-radius: 4px;
    border: 1px solid ${borderWhite};
    background-color: ${darkGray};
    padding: 10px 20px 16px;
    font-size: 16px;
    max-width: 300px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
}
#${CSP} * {
    color: ${offWhite};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
#${CSP} h1 {
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
}
#${CSP} .close-button {
  color: ${borderWhite};
}
#${CSP} .close-button:hover {
    transition: filter 0.15s ease-in-out;
    cursor: pointer;
    filter: brightness(1.1);
}
#${CSP} .status-banner {
    display: none;
}
#${CSP}.scraping .status-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}
#${CSP} .scrape-button {
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
#${CSP} .scrape-button:hover {
    transition: filter 0.15s ease-in-out;
    cursor: pointer;
    filter: brightness(1.1);
}
#${CSP} .options-holder {
    display: none;
}
#${CSP} .options-holder.visible {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 8px;
}
#${CSP} .last-scraped-banner {
    margin-top: 8px;
}
#${CSP} .regular-button {
    margin-top: 10px;
    background-color: ${lightGray};
    font-weight: bold;
    border-radius: 2px;
    border: 1px solid ${borderWhite};
    padding: 10px 20px;
    color: white;
    width: 100%;
    font-size: 1rem;
}
#${CSP} .regular-button:hover {
    transition: filter 0.15s ease-in-out;
    cursor: pointer;
    filter: brightness(1.1);
}
#${CSP}.scraping .scrape-button {
    background-color: ${secondary};
}
#${CSP} .radio-holder {
    margin-top: 12px;
    display: flex;
    gap: 8px;
}
#${CSP} .radio-holder label {
    font-size: 1rem;
}
#${CSP} .radio-holder input[type="radio"]:checked {
    background-color: ${primary};
}
#${CSP} .loader {
    display: block;
    border: 4px solid ${lightGray};
    border-top: 4px solid ${medGray};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: ${CSP}-spin 2s linear infinite;
}
@keyframes ${CSP}-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
