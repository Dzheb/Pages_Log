const express = require('express');
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'log.json');
if(!fs.existsSync(pathToFile)){
  const dateNow = new Date(Date.now()).toUTCString();
  const logData = {
    "cntMain": {
      count:0,
      lastVisit: dateNow,
    },
    "cntAbout":{
     count:0,
     lastVisit: dateNow,
    },
    "cnt404":{
      count:0,
      lastVisit: dateNow,
    },
  };
  fs.writeFileSync(pathToFile, JSON.stringify(logData, null, 2));
  console.log(JSON.stringify(logData));
}
const logData = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
let cntMain = logData.cntMain.count;
let cntAbout = logData.cntAbout.count;
let cnt404 = logData.cnt404.count;
const app = express();
  app.use((req,res,next) => {
    console.log('Поступил запрос', req.method,req.url);
    next();
  });
  app.get('/', function (req, res)  {
  cntMain++;
  res.send(`<h1>Добро пожаловать на мой сайт</h1><h2>Вы посетили эту страницу ${cntMain} раз</h2><a href="http://localhost:5000/about">Для перехода на страницу about</a>`);
  logData.cntMain.count = cntMain;
  logData.cntMain.lastVisit = new Date(Date.now()).toUTCString();
  fs.writeFileSync(pathToFile, JSON.stringify(logData, null, 2));
});

app.get('/about', function (req, res) {
  cntAbout++;
  res.send(`<h1>Добро пожаловать на страницу about</h1>
  <h2>Вы посетили эту страницу ${cntAbout} раз</h2>
  <a href="http://localhost:5000/">Для перехода на главную </a>`);
  logData.cntAbout.count = cntAbout;
  logData.cntAbout.lastVisit = new Date(Date.now()).toUTCString();
  fs.writeFileSync(pathToFile, JSON.stringify(logData, null, 2));
});
app.use((req,res) => {
  cnt404++;
  res.status(404);
  res.send(`<h1>Страница не найдена</h1>
  <h2>Вы посетили эту страницу ${cnt404} раз</h2>`);
  logData.cnt404.count = cnt404;
  logData.cnt404.lastVisit = new Date(Date.now()).toUTCString();
  fs.writeFileSync(pathToFile, JSON.stringify(logData, null, 2));
});
// 
const port = 5000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});


