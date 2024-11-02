const isProd = process.env.NODE_ENV === "production";

const logger = {
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message, data = null) => {
    console.warn(`[WARN] ${message}`, data || "");
  },
  info: (message) => {
    if (!isProd) {
      console.log(`[INFO] ${message}`);
    }
  },
  debug: (message, data = null) => {
    if (!isProd) {
      console.debug(`[DEBUG] ${message}`, data || "");
    }
  },
  sql: (message) => {
    if (!isProd) {
      console.log(`[SQL] ${message}`);
    }
  },
};

module.exports = logger;
