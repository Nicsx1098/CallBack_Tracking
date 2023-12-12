import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 1000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "postgres",
  port: 3000,
});

db.connect();


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Render the form
app.get('/', (req, res) => {
    // Define message variable here with a default value of null
    const message = null;
    res.render('index', { message });
  });
  
  // Handle form submission
  app.post('/submit', (req, res) => {
    const { fName, lName, sNumber, stat, interDate, interTime, agent, prefferDate, prefferTime, note } = req.body;
  
    // Insert data into PostgreSQL
    const query = 'INSERT INTO callback (customer_name, customer_last_name, sr_number, status, interaction_date, interaction_time, agent, preffered_date, preffered_time, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const values = [fName, lName, sNumber, stat, interDate, interTime, agent, prefferDate, prefferTime, note];
  
    db.query(query, values, (error, result) => {
        if (error) {
          console.error('Error executing query', error);
          res.send('Error');
        } else {
          console.log('Data inserted successfully');
    
          // Define message variable here with the success message
          const message = 'Data saved successfully!';
    
          // Render the form with the success message
          res.render('index', { message });
        }
      });
    });



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
