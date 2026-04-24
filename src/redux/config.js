const environment = "production";

const config = {
  testUrl: "https://urbco-api-production.up.railway.app/api",
  liveUrl: "https://urbco-api-production.up.railway.app/api",
};

const frontUrl = "https://admin.urbco.ng";
// const frontUrl = "http://localhost:3001";

const url = environment === "production" ? config.liveUrl : config.testUrl;

export { environment, config, url, frontUrl };
