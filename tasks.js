const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", function(req, res) {
  
  const someTasks = [
    {
      id: 1,
      text: "water plants",
      completed: false
    },
    {
      id: 2,
      text: "walk dog",
      completed: true
    },
    {
      id: 3,
      text: "mop kitchen",
      completed: false
    }
  ];
  
  res.send({
    someTasks
  });
});

app.post("/tasks", function(req, res) {
  const text = req.body.text;
  const date = req.body.date;

  res.status(201);
  res.json({
    message: `Received a request to add task ${text} with date ${date}`
  });
});

app.delete("/tasks/:taskId", function(req, res) {
  const taskIdToBeDeleted = req.params.taskId;

  let someResponse = {
    message: `Received a request to delete task with ID ${taskIdToBeDeleted}`
  };

  if (taskIdToBeDeleted > 3){
    res.status(404);
    someResponse = {
      message: `Task ${taskIdToBeDeleted} does not exist`
    }
  }

  res.json(someResponse);

});


app.put("/tasks/:taskId", function(req, res) {
  const taskIdToBeUpdated = req.params.taskId;
  res.json({
    message: `You issues a put request for task with ID ${taskIdToBeUpdated}`
  });
});

module.exports.handler = serverless(app);