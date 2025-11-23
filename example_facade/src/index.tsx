import { serve } from "bun";
import index from "./index.html";

// these two static files appear after running `bun run build-index.js`
import lunr_index from "../../lunr-index.json";
import courses_data from "../../courses-data.json";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/lunr-index": async () => {
      return Response.json(lunr_index);
    },

    "/api/courses-data": async () => {
      return Response.json(courses_data);
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
