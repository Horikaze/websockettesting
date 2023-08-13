import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
function App() {
  const [range, setRange] = useState(0);
  const [room, setRoom] = useState("");

  const sendMessage = (message: number) => {
    socket.emit("send_message", {
      message,
      room,
    });
    setRange(message);
  };
  const joinRoom = () => {
    if (room != "") {
      socket.emit("join_room", room);
      toast.success(`Dołączono do: ${room}`);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setRange(data.message);
    });
  }, []);
  return (
    <div className="flex flex-col">
      <div>
        <Toaster position="top-right" />
      </div>
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
          <input
            type="range"
            value={range}
            onChange={(e) => {
              sendMessage(Number(e.target.value));
            }}
          />
        </div>
      </div>
      <p>{`Msg:${range}`}</p>
    </div>
  );
}

export default App;
