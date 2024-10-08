const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
// Middleware
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin', // replace with your MySQL username
  password: 'password', // replace with your MySQL password
  database: 'mydb', // replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes
// Get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      console.error('Error fetching todos:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add a new todo
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;

  // Validate request body
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  db.query('INSERT INTO todos (task, completed) VALUES (?, ?)', [task, completed], (err, result) => {
    if (err) {
      console.error('Error adding todo:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId, task, completed });
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.sendStatus(204);
  });
});

// Toggle todo completion
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;

  // Validate request body
  if (completed === undefined) {
    return res.status(400).json({ error: 'Completion status is required' });
  }

  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) {
      console.error('Error updating todo:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.sendStatus(204);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
