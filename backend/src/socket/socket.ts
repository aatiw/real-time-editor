import { WebSocketServer, WebSocket } from "ws";
import { UserI } from "../database/schema";
import { randomUUID } from "crypto";

const wss = new WebSocketServer({port: 8080});
const Rooms: Record<string, Set<UserI>> = {};

wss.on("connection", (ws) => {
    console.log("client connected");

    let currentRoom: string;
    let currentUser: UserI;

    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if(data.type == "join"){
                currentRoom=data.room;
                const user: UserI = {UserId: randomUUID(), Username: data.username, Ws: ws }
                currentUser = user;
                if(!Rooms[currentRoom]) Rooms[currentRoom] = new Set();
                Rooms[currentRoom]?.add(user);
                
                Rooms[currentRoom]?.forEach((u) => {
                    if(u.Ws !== ws && u.Ws.readyState=== WebSocket.OPEN){
                        u.Ws.send(
                            JSON.stringify({type: "notification", message: `user ${user.Username} has joined the room`})
                        )
                    };
                });
            }

            if(data.type == "msg"){
                currentRoom=data.room;
                if(currentRoom && Rooms[currentRoom]) {
                    for(const client of Rooms[currentRoom]!){
                        if(client !== ws && client.readyState === ws.OPEN){
                            client.send(JSON.stringify({type: "msg", content: data.content}));
                        }
                    }
                }
            }
        } catch (error) {
            console.log('error in socket.ts', error);
        }
    });

    ws.on("close", () => {
        if(currentRoom && Rooms[currentRoom]) {
            Rooms[currentRoom]?.delete(ws);
            if(Rooms[currentRoom]!.size === 0) delete Rooms[currentRoom];
        }
    });
    
} )


console.log("websocket server is running on port 8080");