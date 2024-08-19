import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });

let uploadedData = [];

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs", { uploadedData });
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
});

app.post("/calendar", (req,res) => {
    res.render("calendar.ejs");
})

app.get('/index', (req, res) => {
    res.render("index.ejs", { uploadedData }); // or res.send('Index page')
});

app.post("/upload", upload.array('picture', 10), (req, res) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const files = req.files;
    const { buildingName, country, city, address, size, bedrom, bathroom } = req.body;

    files.forEach(file => {
        uploadedData.push({
            picture: file.path, // Path to the uploaded image
            buildingName,
            country,
            city,
            address,
            size,
            bedrom,
            bathroom
        });
    });

    console.log('Uploaded Data:', uploadedData);

    // res.redirect("/index"); // Redirect to a page where the data will be displayed
    res.render("index.ejs", { uploadedData }); // or res.send('Index page')

})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


