import { createProxyMiddleware } from "http-proxy-middleware";
import { getQuery } from "h3";
export default defineEventHandler(async (event) => {
  const { target_ip, target_host } = getQuery(event);

  if (!target_ip || !target_host) {
    return;
  }

  const proxy = createProxyMiddleware({
    target: `http://${target_ip}`,

    changeOrigin: true,

    cookieDomainRewrite: {
      "*": "",
    },

    ws: true,

    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("Host", target_host as string);
        console.log(
          `Proxying request for host: ${target_host} to IP: ${target_ip}`
        );
      },
    },
  });

  await new Promise<void>((resolve, reject) => {
    const next = (err?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    };

    proxy(event.node.req, event.node.res, next);
  });
});
