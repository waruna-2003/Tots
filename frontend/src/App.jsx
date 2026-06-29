import {
  useEffect,
  useState
} from "react";

import Home from "./pages/Home";
import Matching from "./pages/Matching";
import Chat from "./pages/Chat";

import {
  socket
} from "./services/socket";

function App() {

  const [screen, setScreen] =
    useState("home");

  const [roomId, setRoomId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [myId, setMyId] = useState(socket.id || "");

  useEffect(() => {
    if (socket.connected) {
      setMyId(socket.id);
    }

    const onConnect = () => {
      console.log("Connected:", socket.id);
      setMyId(socket.id);
    };

    socket.on("connect", onConnect);

    socket.on("match_found", (data) => {
      setRoomId(data.roomId);
      setScreen("chat");
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("match_found");
      socket.off("receive_message");
    };
  }, []);

  const startChat = () => {

    setMessages([]);

    setScreen("matching");

    socket.emit(
      "find_match"
    );

  };

  const sendMessage = () => {

    if (!message.trim())
      return;

    socket.emit("send_message", {
      roomId,
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    });

    setMessage("");

  };

  const nextPerson = () => {

    setMessages([]);

    setRoomId(null);

    setScreen("matching");

    socket.emit(
      "find_match"
    );

  };

  if (screen === "matching")
    return <Matching />;

  if (screen === "chat")
    return (
      <Chat
        myId={myId}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSend={sendMessage}
        onNext={nextPerson}
      />
    );

  return (
    <Home
      onStart={startChat}
    />
  );
}

export default App;