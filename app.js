const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const contactsRouter = require('./routes/api/contacts')
const dbConnect = require('./db');
const authController = require('./routes/api/authController');

const app = express();
const path = require('path');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

dbConnect();
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/api/auth', authController);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

module.exports = app
