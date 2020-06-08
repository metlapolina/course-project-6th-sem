require('dotenv').config();

const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const Admin = require('./models/admin');
const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const courseRouter = require('./routes/courses');
const trainerRouter = require('./routes/trainers');
const courseGroupRouter = require('./routes/courseGroups');

const app = express();
const httpsOptions = {
    key: fs.readFileSync('certs/LAB.key'),
    cert: fs.readFileSync('certs/LAB.crt')
};
const PORT = process.env.PORT || 3000;

const server = https.createServer(httpsOptions, app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.on('open', err => console.log('Connected to Mongoose'));

app.use(function(req, res, next) {
    req.io = io;
    next();
});

app.use(cookieParser());
app.use(expressSession({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.get('/login', async(req, res) => {
    res.render('login/index');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/login?info=' + info);
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                return res.redirect('/');
            });

        })(req, res, next);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/courses', courseRouter);
app.use('/trainers', trainerRouter);
app.use('/courseGroups', courseGroupRouter);

server.listen(PORT, () => {
    console.log(`Listening on https://localhost:${PORT}`);
}).on('error', (e) => { console.log(`Listener | error: ${e.code}`) });