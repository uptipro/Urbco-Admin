const environment = "production";

const config = {
  testUrl: "http://localhost:8080/api",
  liveUrl: "https://urbco-api-production.up.railway.app/api",
};

const frontUrl = "https://urbco.netlify.app";
// const frontUrl = "http://localhost:3001";

const url = environment === "production" ? config.liveUrl : config.testUrl;

export { environment, config, url, frontUrl };
