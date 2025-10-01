import express, {type Request,type Response} from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    console.log("this is hello")
})

app.listen(3000 , function() {
    console.log("app working and set on port 3000");
})