// MUS2 CO2 - Bot Backend
const bodyParser = require('body-parser');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const JSDOM = require('jsdom').JSDOM;
const express = require('express');
const app = express();
const port = 8080;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    if(!req.query.country || !req.query.weight) {
        return res.status(400).send({
          success: 'false',
          message: 'country and weight are required'
        });
    } else if (isNaN(parseFloat(req.query.weight))) {
      return res.status(400).send({
        success: 'false',
        message: 'weight must be a number'
      });
    }
    var parsedWeight = parseFloat(req.query.weight.replace(',','.'));
    var co2 = getCO2(req.query.country, parsedWeight);
    return res.status(200).send({
        'co2': co2,
        'analogy': getAnalogy(co2)
    })
});

// TODO add query params for country and weight
// app.get('/', (req, res) => {
//     var co2 = getCO2("Italien", 1);
//     console.log("1kg aus Ägypten verursacht: " + co2 + " kg CO2!");
//     return res.status(200).send();
// });



app.listen(port, () => {
  console.log('CO2 Bot Backend listening on port 8080!')
});

function getCO2(country, weight) {

  // variante luftlinie.org
  var url = 'https://www.luftlinie.org/' + encodeURI('Österreich') + '/' + encodeURI(country);
  
  // variante distance24
  // var url = 'https://www.distance24.org/%C3%96sterreich/' + country;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);

  // variante luftlinie.org
  var dom = new JSDOM(xmlHttp.responseText);
  var distance = dom.window.document.getElementsByClassName("value km")[0].innerHTML;

  // variante distance24
  //var distance = dom.window.document.getElementById("map").getAttribute("data-distance");
  
  console.log("Distanz: " + distance.replace('.', ''));
  console.log("weight: " + weight);
  // 380g für 50kg ~ 8g für 1kg
  var result = parseFloat(distance.replace('.', '')) * weight * 0.008;

  return Math.round((result + Number.EPSILON) * 100) / 100;

}


function getAnalogy(weight) {

  return "Thats a lot a CO2";
}