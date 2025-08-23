import { Request } from "express";

export function extractIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];

  if (typeof xff === "string") {
    const firstIp = xff.split(",")[0];
    return firstIp?.trim() ?? "unknown";
  } else if (Array.isArray(xff)) {
    return xff[0] ?? "unknown";
  } else if (typeof req.ip === "string") {
    return req.ip;
  } else if (typeof req.socket?.remoteAddress === "string") {
    return req.socket.remoteAddress;
  } else {
    return "unknown";
  }
}
