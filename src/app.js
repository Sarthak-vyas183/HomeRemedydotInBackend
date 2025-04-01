import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRouter from "./routes/userRouter.js"
import videoRouter from "./routes/videoRouter.js"
import commentRouter from "./routes/commentRouter.js"
import LikeRouter from "./routes/likeRoute.js";
import healthcheckRouter from "./routes/healthcheckRouter.js"
import remedyRouter from "./routes/RemedyRouter.js"
import professionalRouter from './routes/ProfessionalRouter.js';
import AdminRouter from './routes/AdminRouter.js'

app.use("/api/v1/user", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", LikeRouter);
app.use("/api/v1/healthCheck", healthcheckRouter)
app.use("/api/v1/remedy", remedyRouter);
app.use("/api/v1/p", professionalRouter);
app.use("/api/v1/admin", AdminRouter)

export { app }