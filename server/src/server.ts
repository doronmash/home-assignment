import express, { Express, Request, Response } from "express";
import cors from "cors";
import usersRouter from "./router-users";
import postsRouter from "./router-posts";

const port = 3000;

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use('/api', usersRouter);

app.use('/api', postsRouter);

app.use("*", (req: Request, res: Response) => {
  res.json("route not found");
});

app.listen(port, () => {
  console.log(`🔋 Server is running at http://localhost:${port}`);
});
