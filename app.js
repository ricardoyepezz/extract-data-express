const express = require('express');
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const mongoose = require('mongoose');
const app = express();

// Import your Mongoose model
const Data = require('./models/models');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
  
// Route to upload the Excel file
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Read the Excel file
      const rows = await readXlsxFile(req.file.path);
      
      // Remove the first row (headers)
      rows.shift();
  
      // Iterate over the rows and store the data in MongoDB
      rows.forEach(row => {
          let liderPrice = typeof row[1] === 'string' ? Number(row[1].replace(/\D/g, '')) : row[1];
          let jumboPrice = typeof row[2] === 'string' ? Number(row[2].replace(/\D/g, '')) : row[2];
          
          let data = new Data({
            Product: row[0],
            Lider: liderPrice,
            Jumbo: jumboPrice,
            Best: row[3]
          });
  
          // Print the data to the console for debugging
          console.log(data);
  
          data.save();
        });
      res.send('File uploaded and data stored successfully!');
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });
  

  async function run() {
    try {
      await mongoose.connect('mongodb://localhost:27017/data');
      console.log('Connected to MongoDB');
  
      app.listen(3000, () => {
        console.log('Application listening on port 3000');
      });
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
    }
  }
  
  run();
