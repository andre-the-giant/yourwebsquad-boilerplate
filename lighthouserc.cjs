const fs = require("fs");

function loadUrls() {
  if (process.env.LHCI_URLS_FILE && fs.existsSync(process.env.LHCI_URLS_FILE)) {
    try {
      const raw = fs.readFileSync(process.env.LHCI_URLS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through to env/defaults
    }
  }

  if (process.env.LHCI_URLS) {
    return process.env.LHCI_URLS.split(",")
      .map((u) => u.trim())
      .filter(Boolean);
  }

  return ["http://localhost:4321/"];
}

const outputDir = process.env.LHCI_REPORT_DIR || "./reports/lighthouse";
const numberOfRuns = Number(process.env.LHCI_RUNS || 1);

/** @type {import('@lhci/cli').LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      url: loadUrls(),
      numberOfRuns,
      settings: {
        output: ["json", "html"]
      }
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        // disable noisy audits
        "image-delivery-insight": "off",
        "uses-responsive-images": "off",
        "uses-long-cache-ttl": "off",
        "dom-size": "off",
        "network-requests": "off",
        cache: "off"
      }
    },
    upload: {
      target: "filesystem",
      outputDir
    }
  }
};
