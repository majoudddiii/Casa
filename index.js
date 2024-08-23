import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import session from "express-session";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';
import { google } from 'googleapis';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use('/uploads', express.static('uploads')); // Serve static files from uploads
app.use(bodyParser.urlencoded({ extended: true }));

let oAuth2Client;

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content));
});

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web; // Use .web instead of .installed
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
    });
}

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    // Here you'd typically redirect the user to the authUrl, 
    // but for now we'll handle it manually
}

// Handle OAuth2 callback and exchange code for token
app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);

        // Store the token for later use
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });

        res.redirect('/'); // Redirect to the home page after authentication
    });
});


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

app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);

        // Store the token for later use
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });

        res.redirect('/');
    });
});

// Main page route
app.get("/", (req, res) => {
    // Only render, don't add new data here
    res.render("index.ejs", { uploadedData: req.session.uploadedData || [] });
});

app.post("/upload", upload.array('picture', 10), (req, res) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const files = req.files;
    const { buildingName, city, town, address, size, bedrom, bathroom, pool, poolSize, roomService, commentsText, price } = req.body;

    // Initialize session data if it doesn't exist
    if (!req.session.uploadedData) {
        req.session.uploadedData = [];
    }

    // Create an array of image paths
    const imagePaths = files.map(file => `/uploads/${file.filename}`);

    // Create a new post object
    const newPost = {
        pictures: imagePaths,
        buildingName,
        city,
        town,
        address,
        size,
        bedrom,
        bathroom,
        pool: pool === "on",
        poolSize: pool === "on" ? poolSize : null,
        roomService: roomService === "on",
        commentsText,
        price,
    };

    // Only add new data to the session
    req.session.uploadedData.push(newPost);

    console.log('Uploaded Data:', req.session.uploadedData);

    // Redirect to prevent form resubmission on refresh
    res.redirect("/");
});

app.post('/create-event', async (req, res) => {
    const { checkinDate, checkoutDate, guestName, phoneNumber, numberOfGuests } = req.body;

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const event = {
        summary: `Booking by ${guestName}`,
        description: `Phone: ${phoneNumber}\nGuests: ${numberOfGuests}`,
        start: {
            date: checkinDate,
            timeZone: 'Libya', // Set to your time zone
        },
        end: {
            date: checkoutDate,
            timeZone: 'Libya', // Set to your time zone
        },
    };

    try {
        await calendar.events.insert({
            auth: oAuth2Client,
            calendarId: 'primary', // Use the user's primary calendar
            resource: event,
        });

        res.json({ message: 'Event created successfully' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

app.get('/details', (req, res) => {
    const { pictures, buildingName, city, town, address, size, bedrom, bathroom, pool, poolSize, roomService, commentsText, price } = req.query;

    const pictureArray = pictures.split(',');

    res.render('details.ejs', {
        pictureArray,
        buildingName,
        city,
        town,
        address,
        size,
        bedrom,
        bathroom,
        pool,
        poolSize,
        roomService,
        commentsText,
        price
    });
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
