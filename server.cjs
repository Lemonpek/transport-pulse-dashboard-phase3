const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

const HOST = "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const ROOT = __dirname;
const ENTRY_FILE = "transport_pulse_phase3_eds_v2_prototype.html";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".zip": "application/zip",
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  const requestedPath = urlPath === "/" ? ENTRY_FILE : decodeURIComponent(urlPath.slice(1));
  const resolvedPath = path.resolve(ROOT, requestedPath);
  const relativePath = path.relative(ROOT, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return resolvedPath;
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method Not Allowed\n", "text/plain; charset=utf-8");
    return;
  }

  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  } catch {
    send(res, 400, "Bad Request\n", "text/plain; charset=utf-8");
    return;
  }

  if (url.pathname === "/healthz") {
    send(res, 200, JSON.stringify({ status: "ok" }), "application/json; charset=utf-8");
    return;
  }

  let filePath;
  try {
    filePath = resolveRequestPath(url.pathname);
  } catch {
    send(res, 400, "Bad Request\n", "text/plain; charset=utf-8");
    return;
  }

  if (!filePath) {
    send(res, 403, "Forbidden\n", "text/plain; charset=utf-8");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(res, 404, "Not Found\n", "text/plain; charset=utf-8");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Cache-Control": filePath.endsWith(".html") ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!res.headersSent) {
        send(res, 500, "Internal Server Error\n", "text/plain; charset=utf-8");
      } else {
        res.destroy();
      }
    });
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Transport Pulse is listening on ${HOST}:${PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received; closing server.`);
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
