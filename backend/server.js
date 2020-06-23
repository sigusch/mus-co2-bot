// MUS2 CO2 - Bot Backend
const bodyParser = require('body-parser');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const port = 8080;
const http = require('http');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/:usertext', (req, res) => {
    console.log(req.params.usertext);

    if(!req.params.usertext) {
        return res.status(400).send({
          success: 'false',
          message: 'user text is required'
        });
    }
    var co2 = Math.floor(Math.random() * 10); 
    return res.status(200).send({
        'co2': co2
    })
});

// TODO add query params for country and weight
app.get('/', (req, res) => {
    var co2 = getCO2("Italien", 1);
    console.log("1kg aus Ägypten verursacht: " + co2 + " kg CO2!");
    return res.status(200).send();
});



app.listen(port, () => {
  console.log('CO2 Bot Backend listening on port 8080!')
});

function getCO2(country, weight) {

  // variante luftlinie.org
  var url = 'https://www.luftlinie.org/%C3%96sterreich/' + country;

  // variante distance24
  // var url = 'https://www.distance24.org/%C3%96sterreich/' + country;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);

  // variante luftlinie.org
  var distance = dom.window.document.getElementsByClassName("value km")[0].innerHTML;

  // variante distance24
  //var distance = dom.window.document.getElementById("map").getAttribute("data-distance");
  
  console.log("Distanz: " + distance);
  console.log("weigh: " + weight);
  // TODO find better formula for CO2 calculation
  var result = parseFloat(distance) * weight * 0.01;
  return Math.round((result + Number.EPSILON) * 100) / 100;

}