import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import session from "express-session";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use('/uploads', express.static('uploads')); // Serve static files from uploads
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Multer storage with a custom storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Directory to save the file
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for each file
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

// Initialize multer for file uploads
const upload = multer({ storage });

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
        picture: `/uploads/${file.filename}`,
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
app.post("/index", (req, res) => res.redirect("/"));
app.post("/create", (req, res) => res.render("create.ejs"));
app.get("/create", (req, res) => res.render("create.ejs"));
app.post("/calendar", (req, res) => res.render("calendar.ejs"));
app.post("/register", (req, res) => res.render("login.ejs"));
app.post("/more", (req, res) => res.render("more.ejs"));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});