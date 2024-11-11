require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authrouter = require('./routes/authrouter');
const app = express();
const cors = require('cors');


console.log('mongoDB: ', process.env.MONGO_URI);


//mongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,  
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

//use routes
app.use(cors());
app.use(express.json());
app.use('/api', authrouter);


//server listen
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 