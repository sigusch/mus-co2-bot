// MUS2 CO2 - Bot Backend

const bodyParser = require('body-parser');

const express = require('express')
const app = express();
const port = 8080;


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


app.listen(port, () => {
  console.log('CO2 Bot Backend listening on port 8080!')
});
