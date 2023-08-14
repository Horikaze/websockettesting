import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import io from "socket.io-client";
import { winningCombinations } from "./utils/game";
const socket = io(import.meta.env.VITE_API_KEY);
function App() {
  const [room, setRoom] = useState("");
  const [myChoices, setMyChoices] = useState<number[]>([]);
  const [enemyChoices, setEnemyChoices] = useState<number[]>([]);
  const [myTurn, setMyTurn] = useState(true);

  const squares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const joinRoom = () => {
    if (room != "") {
      socket.emit("join_room", room);
      toast.success(`Dołączono do: ${room}`);
    }
  };

  const restartGame = () => {
    setEnemyChoices([]);
    setMyChoices([]);
  };
  const selectSquare = (sq: number) => {
    if (!myTurn) {
      toast.error("Teraz nie jest twoja kolej");
      return;
    }
    if (myChoices.includes(sq)) {
      toast.error("Te pole jest już wybrane");
      return;
    }
    if (enemyChoices.includes(sq)) {
      toast.error("Te pole jest już wybrane");
      return;
    }
    setMyChoices([...myChoices, sq]);
    setMyTurn(false);
  };
  useEffect(() => {
    for (const combination of winningCombinations) {
      const isWinning = combination.every((choice) =>
        myChoices.includes(choice)
      );
      socket.emit("send_message", {
        myChoices,
        room,
        myTurn,
        isWinning,
      });
      if (isWinning) {
        toast.success("WIN");
        restartGame();
        break;
      }
    }
  }, [myChoices]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setEnemyChoices(data.myChoices);
      setMyTurn(!data.myTurn);
      if (data?.isWinning) {
        toast.error("LOSE");
        restartGame();
      }
    });
  }, []);
  return (
    <div className="flex flex-col bg-gray-400">
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
        </div>
      </div>
      <div>
        <div className="flex p-2 justify-between">
          <div>
            <p>
              Twoja kolej:
              <span
                className={`${
                  myTurn ? "text-red-600" : "text-yellow-400"
                } font-bold`}
              >
                {myTurn ? "TAK" : "NIE"}
              </span>
            </p>
          </div>
          <div className="grid gap-1 grid-cols-3 place-self-center">
            {squares.map((sq) => {
              let className = "bg-slate-600";
              if (myChoices.includes(sq)) {
                className = "bg-red-500";
              }
              if (enemyChoices.includes(sq)) {
                className = "bg-blue-500";
              }
              return (
                <div
                  key={sq}
                  onClick={() => {
                    selectSquare(sq);
                  }}
                  className={`${className} w-20 h-20 cursor-pointer hover:brightness-75 hover:scale-105 transition-all`}
                ></div>
              );
            })}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default App;
