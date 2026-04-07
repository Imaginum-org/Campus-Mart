import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";   
import morgan from 'morgan';
import helmet from "helmet";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors({
    credentials:true ,
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE"]
    }));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy:false
}));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

export default app;
