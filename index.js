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
import readline from 'readline';

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
        if (err) {
            console.log('No token found, generating new token.');
            return getAccessToken(oAuth2Client);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        console.log('Token loaded.');
    });
}

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    // Wait for the user to provide the authorization code
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return;
            }
            oAuth2Client.setCredentials(token);

            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {
                    console.error('Error saving the token', err);
                } else {
                    console.log('Token stored to', TOKEN_PATH);
                }
            });
        });
    });
}

// Handle OAuth2 callback and exchange code for token
app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(400).send('Error retrieving access token');
        }
        oAuth2Client.setCredentials(token);

        // Store the token for later use
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) {
                console.error('Error saving the token', err);
                return res.status(500).send('Error saving the token');
            }
            console.log('Token stored to', TOKEN_PATH);
            res.redirect('/'); // Redirect to the home page after authentication
        });
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

let preExistingPosts = [];
fs.readFile('preExistingPosts.json', 'utf8', (err, data) => {
    if (err) {
        console.log('Error reading pre-existing posts:', err);
    } else {
        preExistingPosts = JSON.parse(data);
    }
});

// Main page route
app.get("/", (req, res) => {
    // Combine session-based posts with pre-existing posts
    const allPosts = [...preExistingPosts, ...(req.session.uploadedData || [])];
    res.render("index.ejs", { uploadedData: allPosts });
});

function filterByCity(post, city) {
    return !city || (post.city && post.city.toLowerCase().includes(city.toLowerCase()));
}


function filterByBeds(post, beds) {
    return beds === null || (post.bedroom && Number(post.bedroom) === beds);
}

function filterByBath(post, bath) {
    return bath === null || (post.bathroom && Number(post.bathroom) === bath);
}


app.get('/search', (req, res) => {
    console.log('Session Uploaded Data:', req.session.uploadedData);
    console.log('Pre-existing Posts:', preExistingPosts);

    const { city, beds, bath, } = req.query;

    const numBeds = beds ? Number(beds) : null;
    const numBath = bath ? Number(bath) : null;

    const allPosts = [...preExistingPosts, ...(req.session.uploadedData || [])];

    console.log('All Posts:', allPosts); // Log combined data

    const filteredPosts = allPosts.filter(post => {
        return (
            filterByCity(post, city) &&
            filterByBeds(post, numBeds) &&
            filterByBath(post, numBath)
        );
    });

    console.log('Filtered Posts:', filteredPosts); // Log filtered data

    res.render("index.ejs", { uploadedData: filteredPosts });
});

app.post("/upload", upload.array('picture', 10), (req, res) => {
    const files = req.files;
    const {
        buildingName, city, town, address, size, bedroom, bathroom, pool, poolSize, roomService, commentsText, price,
        profilePicture, creatorName, rating
    } = req.body;

    if (!req.session.uploadedData) {
        req.session.uploadedData = [];
    }

    const imagePaths = files.map(file => `/uploads/${file.filename}`);

    const newPost = {
        pictures: imagePaths,
        buildingName,
        city,
        town,
        address,
        size,
        bedroom,
        bathroom,
        pool: pool === "on",
        poolSize: pool === "on" ? poolSize : null,
        roomService: roomService === "on",
        commentsText,
        price,
        profilePicture,
        creatorName,
        rating,
    };

    req.session.uploadedData.push(newPost);

    res.redirect("/");
});

app.post('/create-event', async (req, res) => {
    const { checkinDate, checkoutDate, guestName, phoneNumber, numberOfGuests } = req.body;

    // Format the dates correctly
    const startDate = new Date(checkinDate);
    const endDate = new Date(checkoutDate);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
        summary: `Booking by ${guestName}`,
        description: `Phone: ${phoneNumber}\nGuests: ${numberOfGuests}`,
        start: {
            date: startDate.toISOString().split('T')[0],  // Format as YYYY-MM-DD for all-day events
            // Alternatively, use dateTime for events with times
            // dateTime: startDate.toISOString(),  // Example: use dateTime for events with specific times
            timeZone: 'Libya',
        },
        end: {
            date: endDate.toISOString().split('T')[0],  // Format as YYYY-MM-DD for all-day events
            // Alternatively, use dateTime for events with times
            // dateTime: endDate.toISOString(),  // Example: use dateTime for events with specific times
            timeZone: 'Libya',
        },
    };

    try {
        await calendar.events.insert({
            auth: oAuth2Client,
            calendarId: 'primary',
            resource: event,
        });

        res.json({ message: 'Event created successfully' });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

app.get('/details', (req, res) => {
    const { pictures, buildingName, city, town, address, size, bedroom, bathroom, pool, poolSize, roomService, commentsText, price, profilePicture, creatorName, rating } = req.query;

    const pictureArray = pictures.split(',');

    res.render('details.ejs', {
        pictureArray,
        buildingName,
        city,
        town,
        address,
        size,
        bedroom,
        bathroom,
        pool,
        poolSize,
        roomService,
        commentsText,
        price,
        profilePicture,
        creatorName,
        rating,
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
