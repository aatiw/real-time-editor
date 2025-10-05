import { Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { WS_URL } from "../config";

export default function CodeEditor() {
    const location = useLocation();
    const navigate = useNavigate();
    const {roomId, username} = location.state || {};

    const [val, setValue] = useState("");
    const [members, setMembers] = useState<string[]>([username]);

    const wsRef = useRef<WebSocket | null>(null);

    const isUserTyping = useRef(false);

    useEffect(() => {

        if(!roomId || !username){
            toast.error("Missing room or username");
            navigate('/');
            return;
        }

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("websocket connected");
            ws.send(JSON.stringify({
                type: "join",
                room: roomId,
                username: username
            }));
        };


        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.type === "notification"){
                toast.success(data.message);
            }

            if(data.type === "members"){
                setMembers(data.members);
            }

            if(data.type === "msg"){
                if(!isUserTyping.current){
                    setValue(data.valueContent);
                }
            }
        };

        ws.onerror = (error) => {
            console.error("error in codeeditor websocket", error);
            toast.error("disconnected from room");
        }

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            toast.error("Disconnected from room");
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [roomId, username, navigate]);

    useEffect(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const debounceTimer = setTimeout(() => {
            isUserTyping.current = false;
            wsRef.current?.send(JSON.stringify({
                type: "msg", 
                room: roomId,
                valueContent: val
            }));
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [val, roomId]);

    function handleScroll(){
        const textNumber = document.getElementById("textLines");
        const textlines = document.getElementById("area");
        
        if(textNumber && textlines){
            textNumber.scrollTop = textlines.scrollTop;
        }
    }

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        toast.success("Room ID copied!");
    };

    const handleLeaveRoom = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }
        navigate('/');
    };

  return (
    <div className="">
        <div className="w-full m-0">
            <div className="h-screen flex flex-row">

                {/* sidebar */}
                <div className="min-w-[20vw] h-screen bg-gray-600">
                    <div className="w-full h-screen flex flex-col relative">


                        <div className="flex flex-row items-center justify-center gap-2 mt-8">
                            <Users className="w-8 h-8 text-amber-50" />
                            <h1 className="font-bold text-2xl text-amber-50">Code Editor</h1>
                        </div>

                        {/* Users */}
                        <div className="flex flex-col pl-5 mt-6">
                            <p className="text-amber-50 text-1.5xl mb-4">Members</p>
                            {members.map((member, index) => (
                                <div key={index} className="flex flex-row gap-3 mb-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                    <p className="text-white font-semibold">{member}</p>
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 flex pl-8 pb-8 flex-row gap-3">
                            <button className="bg-red-400 text-amber-50 text-sm p-2 rounded-2xl" onClick={handleCopyRoomId}>Copy room id</button>
                            <button className="bg-red-400 text-amber-50 text-sm p-2 rounded-2xl" onClick={handleLeaveRoom}>Leave Room</button>
                        </div>
                    </div>
                </div>

                {/* editor */}
                <div className="w-full h-screen bg-white flex flex-row">
                    <div id="textLines" className="w-[5vh] shadow-xl bg-amber-50 shadow-gray-400 flex flex-col pl-1 pt-2">
                        {Array.from({length: val.split("\n").length}, (_, i) => (
                            <span key={i}>{i+1}.</span>
                        ))}
                    </div>
                    <textarea
                        id="area" 
                        className="w-full pl-4 pt-2 bg-amber-200 border-none outline-none shadow-none focus:outline-none focus:border-none overflow-hidden"
                        value={val}
                        onChange={(e) => {
                            isUserTyping.current=true
                            setValue(e.target.value)
                        }}
                        onScroll={handleScroll}
                    ></textarea>
                </div>
            </div>
        </div>
    </div>
  )
 
}