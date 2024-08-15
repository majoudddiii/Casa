import express from "express";
import bodyParser from "body-parser";
import { name } from "ejs";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));


app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/create", (req, res) => {
    res.render("create.ejs")
})

app.post("/index", (req, res) => {
    res.render("index.ejs")
})

app.post("/register", (req, res) => {
    res.render("login.ejs")
})

app.post("/more", (req, res) => {
    res.render("more.ejs")
})

app.post("/create", (req, res) => {
    res.render("create.ejs")
})

app.post("/publish", (req, res) => {
    res.render("index.ejs",
         {  buildingName: req.body["buildingName"],
            address: req.body["address"],
            country: req.body["country"],
            city: req.body["city"],
            bedrom: req.body["bedrom"],
            bathroom: req.body["bathroom"],
            size: req.body["size"],
            picture: req.body["picture"]
         }
    )
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})