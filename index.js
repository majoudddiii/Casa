import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/create", (req, res) => {
    res.render("create.ejs");
})

app.post("/index", (req, res) => {
    res.render("index.ejs");
})

app.post("/register", (req, res) => {
    res.render("login.ejs");
})

app.post("/more", (req, res) => {
    res.render("more.ejs");
})

app.post("/create", (req, res) => {
    res.render("create.ejs");
})

app.post("/calendar", (req,res) => {
    res.render("calendar.ejs");
})


app.post("/publish", upload, (req, res) => {


    res.render("index.ejs",
        {
            buildingName: req.body.buildingName,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            bedrom: req.body.bedrom,
            bathroom: req.body.bathroom,
            size: req.body.size,
            picture: req.file ? `/uploads/${req.file.filename}` : null
        }
    );
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})