import express, {type Request,type Response} from 'express';
import cors from 'cors';
import connectDb from './database/config.js'
import { User } from './database/schema.js';
import { randomUUID } from 'crypto';

const app = express();

app.use(express.json());
app.use(cors());
connectDb();

app.post('/submit', async (req: Request, res: Response) => {
    try {
        const {roomId, username} = req.body;

        const user = new User({
            UserId: randomUUID(),
            RoomId: roomId,
            Username: username
        })

        await user.save();

        res.status(201).json({success:true, user});
    } catch (error) {
        res.status(500).json({success: false, error: "error in /submit post"});
        console.error(error);
    }
})

app.get('/', (req: Request, res: Response) => {
    console.log("this is hello")
})

app.listen(3000 , function() {
    console.log("app working and set on port 3000");
})