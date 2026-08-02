import { io } from "socket.io-client";

const defaultUrl = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://tots-zxj3.onrender.com";

export const socket = io(import.meta.env.VITE_SOCKET_URL || defaultUrl, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelayMax: 5_000,
});
