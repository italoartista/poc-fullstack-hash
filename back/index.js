const express = require('express');
const cors = require('cors');
const crypto = require('node:crypto')
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000;



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json()); 
app.use(cors());

app.post('/signup', (req, res) => {
  const { email, pass } = req.body;

  // Verificar se o email já existe
  const checkEmailQuery = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  };

  pool.query(checkEmailQuery, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.rows.length > 0) {
      // Email já existe
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Email não existe, prosseguir com a inserção
    const hash = crypto.createHash('sha256').update(pass).digest('hex');

    const insertUserQuery = {
      text: 'INSERT INTO users(email, password, created_at) VALUES($1, $2, NOW())',
      values: [email, hash],
    };

    pool.query(insertUserQuery, (err, result) => {
      if (err) {
        console.error('Error executing query', err.stack);
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('User created');
      res.status(201).json({ message: 'User created' });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hash = crypto.createHash('sha256').update(pass).digest('hex');

  const query = {
    text: 'SELECT * FROM users WHERE name = $1',
    values: [email],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(user)
      console.log(user.password)
      console.log(hash)
      
      if (user.password === hash) {
        console.log('User authenticated');
        res.status(200).json({ message: 'User authenticated' });
      } else {
        console.log('Authentication failed');
        res.status(401).json({ error: 'Authentication failed' });
      }
    } else {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  });

  console.log(email, pass, hash);
});


process.on('exit', () => {
  pool.end();
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});