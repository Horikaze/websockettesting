import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
function App() {
  const [message, setMessage] = useState("");
  const [recived, setRecived] = useState("");
  const [room, setRoom] = useState("");
  const sendMessage = () => {
    socket.emit("send_message", {
      message,
      room,
    });
  };
  const joinRoom = () => {
    if (room != "") {
      socket.emit("join_room", room);
      toast.success(`Dołączono do: ${room}`)
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setRecived(data.message);
    });
  }, []);
  return (
    <div className="flex flex-col">
      <div><Toaster
      position="top-right"
      /></div>
      <div className="flex justify-center">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            className="rounded-sm"
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <button
            onClick={() => {
              joinRoom();
            }}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
