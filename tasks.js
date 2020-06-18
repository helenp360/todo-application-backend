const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todos",
});

app.get("/tasks", function(req, res) {
  const query = "SELECT * FROM Task;"

  connection.query(query, function(error, data) {
    if(error) {
      console.log("Error fetching tasks", error);
      res.status(500).json({
        error: error
      })

    } else {
      res.status(200).json({
        tasks: data
      })
    }
  })
});

app.post("/tasks", function(req, res) {
  const query = "INSERT INTO Task (completed, urgency, text, userId) VALUES (?, ?, ?, ?);";
  const querySelect = "SELECT * FROM Task WHERE taskId = ?";

  connection.query(query, [req.body.completed, req.body.urgency, req.body.text, req.body.userId], function(error, data) {
    
    if(error) {
      console.log("Error adding a task", error);
      res.status(500).json({
        error: error
      })
    } else {
      connection.query(querySelect, [data.insertId], function(error, data) {
        if(error) {
          console.log("Error adding a task", error);
          res.status(500).json({
          error: error
        })
        } else {
          res.status(201).json({
            tasks: data
          })
        }
      })
    }
  })
});

app.delete("/tasks/:taskId", function(req, res) {
  const query = "DELETE FROM Task WHERE taskId = ?";
  
  connection.query(query, [req.params.taskId], function(error, data) {
    if(error) {
      console.log("Error deleting task", error);
      res.status(500).json({
        error: error
      })
    } else {
      res.sendStatus(200);
    }
  })
});


app.put("/tasks/:taskId", function(req, res) {
  const query = "UPDATE Task SET completed = ?, urgency = ?, text = ? WHERE taskId = ?"

  connection.query(query, [req.body.completed, req.body.urgency, req.body.text, req.params.taskId], function(error, data) {
    if(error) {
      console.log("Error editing task", error);
      res.status(500).json({
        error: error
      })
    } else {
      res.sendStatus(200);
    }
  })
});

module.exports.handler = serverless(app);