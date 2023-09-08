import express from "express";
import bootstrap from "./src/index.router.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 5000;
app.get("/", (req, res) => res.json({ message: "Hello World!" }));

bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
