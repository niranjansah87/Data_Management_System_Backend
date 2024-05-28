const express = require('express');
const mysql = require('mysql2/promise');
const router = require('./routes/data');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3001;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Apply CORS middleware
app.use(cors({ origin: '*', credentials: true }));
// Create a connection pool for efficient database interactions
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

(async () => {
  try {
    // Attempt to connect to the database
    const connection = await pool.getConnection();
    console.log('Database connection established');
    connection.release();

    // Define routes here (assuming they're in a separate file, e.g., routes/data.js)
    app.use('/api', router);


    // app.get("/*",function(req,res) {
    //   res.sendFile(path.join(__dirname,'../data_entry_system/dist/index.html'),
    //   function (err){
    //     if(err){
    //       res.status(500).send(err)
    //     }
    //   });
    
    // });
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); 
  }
})();
