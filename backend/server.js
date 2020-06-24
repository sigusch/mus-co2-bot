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
  
  //console.log("Distanz: " + distance.replace('.', ''));
  //console.log("weight: " + weight);
  // 380g für 50kg ~ 8g für 1kg
  var result = parseFloat(distance.replace('.', '')) * weight * 0.008;

  return Math.round((result + Number.EPSILON) * 100) / 100;

}

function getAnalogy(weight) {

  var result;

  // * 10 = 0-9
  var x = Math.floor(Math.random() * 5);
  //console.log("case " + x);
  switch (x) {
    case 0:
      // average austrian produces 22.3561643836 kg CO2 per day source : https://de.wikipedia.org/wiki/Liste_der_L%C3%A4nder_nach_CO2-Emission_pro_Kopf#L%C3%A4nderliste_der_CO2-Emissionen_pro_Kopf
      var days = Math.round(((weight / 22.35) + Number.EPSILON) * 100) / 100;
      result = "Soviel CO2 produziert der durchschnittliche Österreicher in " + days + " Tagen!"
      break;
    case 1:
      // flight from vienna to new york produces 1100 kg (1 passenger, economy, one-way) source : https://co2.myclimate.org/
      var percent = Math.round(((weight/1100*100) + Number.EPSILON) * 100) / 100;
      result = "Das sind " + percent + "% von einem Flug von Wien nach New York!";
      break;
    case 2:
      // 31506849 kg is the daily CO2 emission of voest alpine source : https://www.derstandard.at/story/2000013823387/voest-bleibt-groesster-heimischer-co2-emittent
      var percent = Math.round(((weight/31506849*100) + Number.EPSILON) * 100000) / 100000;
      result = "Das sind " + percent + "% des täglichen CO2-Ausstoßes der Voestalpine!";
      break;
    case 3:
      // 0.1666kg per kilometer with a car (fuel type: gasoline, consumption: 7l/100km) source : https://spritrechner.biz/
      var km = Math.round(((weight/0.1666) + Number.EPSILON) * 100) / 100;
      result = "Damit könntest du " + km + " km mit dem Auto fahren!";
      break;
    case 4:
      // Videostreaming uses ~50 MB / Minute, 50MB are equivalent to 1kg CO2 source : https://co2.digitaler-harz.de/co2calculator.de.html
      var minutes = Math.round(weight);
      result = "Damit könntest du " + minutes + " Minuten Videos streamen!"
      break;
    default:
      result = "Thats a lot of CO2!"
      break;
  }
  return result;
}