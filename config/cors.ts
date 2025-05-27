const whitelist: string[] = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://localhost",
  "http://127.0.0.1",
  "https://x5okvoq-sulovic-8081.exp.direct",
];

// Firebase Studio CORS

const dynamicDomainRegex = /^https:\/\/[a-zA-Z0-9-]+\.cluster-c3a7z3wnwzapkx3rfr5kz62dac\.cloudworkstations\.dev$/;

type CorsCallback = (err: Error | null, allow?: boolean) => void;

const corsConfig = {
  origin: (requestOrigin: string | undefined, callback: CorsCallback) => {
    const isWhitelistedOrigin: boolean =
      (requestOrigin && whitelist.includes(requestOrigin)) || !requestOrigin || dynamicDomainRegex.test(requestOrigin);
    if (isWhitelistedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsConfig;
