const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username', // replace with your MySQL username
  password: 'your_password', // replace with your MySQL password
  database: 'todos_db', // replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// Create todos table if it doesn't exist
db.query(
  `CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
  )`,
  (err) => {
    if (err) throw err;
  }
);

// Get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;
  db.query('INSERT INTO todos (task, completed) VALUES (?, ?)', [task, completed], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, task, completed });
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(204).send();
  });
});

// Update todo completion status
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(204).send();
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
