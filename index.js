import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import session from "express-session";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Use session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

// Main page route
app.get("/", (req, res) => {
    // Only render, don't add new data here
    res.render("index.ejs", { uploadedData: req.session.uploadedData || [] });
});

app.post("/upload", upload.array('picture', 10), (req, res) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const files = req.files;
    const { buildingName, country, city, address, size, bedrom, bathroom } = req.body;

    // Initialize session data if it doesn't exist
    if (!req.session.uploadedData) {
        req.session.uploadedData = [];
    }

    // Add new data to the session array
    const newData = files.map(file => ({
        picture: file.path,
        buildingName,
        country,
        city,
        address,
        size,
        bedrom,
        bathroom
    }));

    // Only add new data to the session
    req.session.uploadedData.push(...newData);

    console.log('Uploaded Data:', req.session.uploadedData);

    // Redirect to prevent form resubmission on refresh
    res.redirect("/");
});

// Other routes...
app.get("/create", (req, res) => res.render("create.ejs"));
app.post("/index", (req, res) => res.redirect("/"));
app.post("/create", (req, res) => res.render("create.ejs"));
app.post("/register", (req, res) => res.render("login.ejs"));
app.post("/more", (req, res) => res.render("more.ejs"));
app.post("/calendar", (req, res) => res.render("calendar.ejs"));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
