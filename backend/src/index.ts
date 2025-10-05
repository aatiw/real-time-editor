import express, {type Request,type Response} from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from "ws";
import connectDb from './database/config.js'
import { User } from './database/schema.js';
import { randomUUID } from 'crypto';
import http from "http";

const PORT = process.env.PORT || 3000;
const Rooms: Record<string, Set<UserI>> = {};

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
connectDb();

const wss = new WebSocketServer({ server });

interface UserI{
    Username: string
    Ws: WebSocket
    valueContent: string
}

wss.on("connection", (ws) => {
    console.log("client connected");

    let currentRoom: string;
    let currentUser: UserI;
    let hasclose = false;

    ws.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if(data.type == "join"){
                currentRoom=data.room;
                const user: UserI = { 
                    Username: data.username,
                    Ws: ws, 
                    valueContent: ''
                }
                currentUser = user;

                if(!Rooms[currentRoom]) Rooms[currentRoom] = new Set();
                Rooms[currentRoom]?.add(user);
                
                Rooms[currentRoom]?.forEach((u) => {
                    if(u.Ws !== ws && u.Ws.readyState=== WebSocket.OPEN){
                        u.Ws.send(
                            JSON.stringify({
                                type: "msg",
                                valueContent: u.valueContent
                            })
                        )
                    };
                });

                const membersList = Array.from(Rooms[currentRoom]!).map(u => u.Username);
                Rooms[currentRoom]?.forEach((u) => {
                    if(u.Ws.readyState=== WebSocket.OPEN){
                        u.Ws.send(JSON.stringify({
                            type: "members",
                            members: membersList
                        }))
                    };
                });
            }

            if(data.type == "msg"){
                if(currentRoom && Rooms[currentRoom] ) {
                    if(currentUser){
                        currentUser.valueContent = data.valueContent
                    }
                    for(const client of Rooms[currentRoom]!){
                        if(client.Ws !== ws && client.Ws.readyState === WebSocket.OPEN){
                            client.valueContent = data.valueContent;
                            client.Ws.send(JSON.stringify({
                                type: "msg", 
                                valueContent: data.valueContent
                            }));
                        }
                    }
                }
            }
        } catch (error) {
            console.log('error in socket.ts', error);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Failed to process message"
                }));
            }
        }
    });

    ws.on("close", () => {
        if(hasclose) return;
        hasclose  = true;
        if(currentRoom && Rooms[currentRoom] && currentUser) {
            Rooms[currentRoom]?.delete(currentUser);

            Rooms[currentRoom]?.forEach((u) => {
                if(u.Ws.readyState === WebSocket.OPEN){
                    u.Ws.send(JSON.stringify({
                        type: "notification",
                        message: `${currentUser.Username} left the room`
                    }));

                    const membersList = Array.from(Rooms[currentRoom]!).map(u => u.Username);
                    u.Ws.send(JSON.stringify({
                        type: "members",
                        members: membersList
                    }));
                }
            });
            if(Rooms[currentRoom]!.size === 0) delete Rooms[currentRoom];
        }
    });

    ws.on("error", (error: any) => {
        console.error("WebSocket error:", error);
    });
    
} )

app.post('/submit', async (req: Request, res: Response) => {
    try {
        const {roomId, username} = req.body;

        if(!roomId || !username){
            return res.status(400).json({
                success: false,
                error: "roodId and username required"
            })
        };

        if (roomId.trim().length === 0) {
            return res.status(400).json({
                success: false, 
                error: "Invalid room ID"
            });
        }

        const user = new User({
            UserId: randomUUID(),
            RoomId: roomId,
            Username: username.trim()
        })

        await user.save();

        res.status(201).json({success:true, user});
    } catch (error) {
        res.status(500).json({success: false, error: "error in /submit post"});
        console.error(error);
    }
})

app.get('/room/:roomId', async (req: Request, res: Response) => {
    try {
        const {roomId} = req.body;

        const users = await User.find({RoomId: roomId});

        res.json({
            success: false,
            exists: users.length > 0,
            userCount: users.length,
            users: users.map(u => ({username: u.Username}))
        })
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Error checking room" 
        });
        console.error("Error in /room/:roomId:", error);
    }
})

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "hllo"
    })
})

app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

server.listen(PORT , function() {
    console.log("app working and set on port 3000");
})