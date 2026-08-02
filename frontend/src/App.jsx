import { useCallback, useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import Matching from "./pages/Matching";
import Chat from "./pages/Chat";
import { socket } from "./services/socket";

function App() {
  const [screen, setScreen] = useState("home");
  const [roomId, setRoomId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(() => socket.id || "");
  const [onlineCount, setOnlineCount] = useState(0);
  const [notice, setNotice] = useState("");
  const screenRef = useRef(screen);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    const onConnect = () => {
      setMyId(socket.id);
      setNotice("");
      if (screenRef.current === "matching") socket.emit("find_match");
    };
    const onDisconnect = () => {
      setRoomId(null);
      if (screenRef.current !== "home") {
        setScreen("matching");
        setNotice("Connection lost. Reconnecting…");
      }
    };
    const onConnectError = () => setNotice("Unable to reach the chat service. Retrying…");
    const onMatchFound = (data) => {
      setRoomId(data.roomId);
      setMyId(data.myId);
      setMessages([]);
      setNotice("");
      setScreen("chat");
    };
    const onReceiveMessage = (data) => setMessages((previous) => [...previous, data]);
    const onPartnerLeft = () => {
      setRoomId(null);
      setNotice("The stranger left the chat.");
    };
    const onPresence = ({ online }) => setOnlineCount(online);
    const onChatError = ({ message: errorMessage }) => setNotice(errorMessage);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("match_found", onMatchFound);
    socket.on("receive_message", onReceiveMessage);
    socket.on("partner_left", onPartnerLeft);
    socket.on("presence", onPresence);
    socket.on("chat_error", onChatError);
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("match_found", onMatchFound);
      socket.off("receive_message", onReceiveMessage);
      socket.off("partner_left", onPartnerLeft);
      socket.off("presence", onPresence);
      socket.off("chat_error", onChatError);
    };
  }, []);

  const beginMatching = useCallback(() => {
    setMessages([]);
    setMessage("");
    setRoomId(null);
    setNotice(socket.connected ? "" : "Connecting to the chat service…");
    setScreen("matching");
    if (socket.connected) socket.emit("find_match");
  }, []);

  const cancelMatching = useCallback(() => {
    socket.emit("cancel_match");
    setNotice("");
    setScreen("home");
  }, []);

  const sendMessage = useCallback(() => {
    const text = message.trim();
    if (!text || !roomId) return;
    socket.emit("send_message", { roomId, text }, (result) => {
      if (!result?.ok) setNotice(result?.message || "Message could not be sent.");
    });
    setMessage("");
  }, [message, roomId]);

  const nextPerson = useCallback(() => {
    socket.emit("leave_chat", () => beginMatching());
  }, [beginMatching]);

  const reportPartner = useCallback(() => {
    socket.emit("report_partner", { reason: "User reported from chat" }, (result) => {
      setNotice(result?.ok ? "Report received. Finding someone new…" : "Unable to submit the report.");
      if (result?.ok) nextPerson();
    });
  }, [nextPerson]);

  if (screen === "matching") {
    return <Matching onCancel={cancelMatching} onlineCount={onlineCount} notice={notice} />;
  }

  if (screen === "chat") {
    return (
      <Chat
        myId={myId}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSend={sendMessage}
        onNext={nextPerson}
        onReport={reportPartner}
        notice={notice}
        canSend={Boolean(roomId && socket.connected)}
      />
    );
  }

  return <Home onStart={beginMatching} />;
}

export default App;
