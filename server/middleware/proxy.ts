// server/middleware/proxy.ts

import { createProxyMiddleware } from "http-proxy-middleware";
import { getQuery } from "h3";

// defineEventHandler is a Nuxt utility for creating server event handlers
export default defineEventHandler(async (event) => {
  // Extract target IP and Host from the query string
  // e.g., /?target_ip=1.2.3.4&target_host=example.com
  const { target_ip, target_host } = getQuery(event);

  // If the required query parameters are not present, do nothing.
  if (!target_ip || !target_host) {
    return;
  }

  // Configure the proxy middleware
  const proxy = createProxyMiddleware({
    // The server we are forwarding the request to
    target: `http://${target_ip}`,

    // This is the magic! It changes the 'Host' header to the target_host value.
    changeOrigin: true,

    // Optional: Rewrites cookie paths to work on your local domain
    cookieDomainRewrite: {
      "*": "",
    },

    // Optional: Helps with websockets if the target site uses them
    ws: true,

    // We manually set the Host header, so we can turn this off if needed.
    // However, changeOrigin: true often handles this sufficiently.
    // For full control, you can use the onProxyReq event:
    on: {
      proxyReq: (proxyReq, req, res) => {
        // Explicitly set the host header to the one we want to preview
        proxyReq.setHeader("Host", target_host as string);
        console.log(
          `Proxying request for host: ${target_host} to IP: ${target_ip}`
        );
      },
    },
  });

  // Run the proxy middleware.
  // We need to await a promise to make it compatible with Nuxt/H3 event handlers.
  await new Promise<void>((resolve, reject) => {
    // A little trick to stop the middleware chain in Nuxt
    const next = (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    };

    // Execute the proxy. It will handle the request and response.
    proxy(event.node.req, event.node.res, next);
  });
});
