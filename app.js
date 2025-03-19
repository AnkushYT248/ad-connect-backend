import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { transporter } from "./mail.js";
import { router } from "./routes/auth.js";
import cors from "cors";

const app = express();
const port = 5000;
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET'],
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.use('/api/auth', router);

app.get('/mail',(req,res)=> {
    res.render('mail');
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});