# mus-co2-bot

## Problem statement

Nowadays grocery shopping is really difficult if you want to do it with sustainability in mind. An abundance of products from all over the world are available for purchase in most supermarkets an shops and most people don't have an idea how much CO2 is produced in order to ship these products to their destinations.

In order to raise awareness for the global CO2 output and the preference of local products over foreign ones we want to create a chatbot which lets you easily know how much CO2 was generated only by shipping a product from its place of origin to its destination. Furthermore, to help user get a better understanding, useful analogies for the calculated amount of CO2 are provided.  

The bot will also include a feature which lets you create your own shopping list and calculates the emitted CO2 for all the products on your list.

## Implementation

### Architecture

![co2-bot-architecture](./img/co2-architecture.png)

### Backend

As the focus of this project lies on language understanding and the microsoft bot framework we decided so use a simple approach for our backend. A simple node.js server exposes an endpoint using express.js which is used by the bot in order to get CO2 information about a certain country/weight combination. In addition to the amount of CO2 it also returns an informative analogy according to the amount of CO2.

Because it proves difficult to find free apis which offer a specific functionality and additionally also require a registration most of the time, we decided to use a [free web service](https://www.luftlinie.org/) and parse its html content for the information we need.

Sources for the generated analogies can be found in the [server.js sourcecode](./backend/server.js)

### Bot Framework

We used the Microsoft Bot Framework Composer to develop our bot and the Bot Framework Emulator to test it. An Example for the Emulator can be found at the end of this file.

#### Bot Framework Composer

The Bot Framework composer is a visual design tool help developers get a first glance at developing chatbots. It offers luis integration and an easy way to connect to the bot emulator out of the box. Furthermore it includes a bot runtime executable so can easily test run your bot locally.

Here you can see how a sample dialog might look like in the bot framework composer. It visually demonstrates the applications logical flow to the developer who can use UI building blocks to implement the bots logic.

![dialog tree](./img/dialog-tree.png)

The bot framework uses certain scope objects which can be extended by custom properties. In this example we are adding the current product of the user object(application scope) to the custom property of the dialog object (dialog scope)

![variable](./img/variable.png)

The bot can also send http-requests to external apis in order to query for wanted data. We had some problems with sending parameters in the body so we used url-encoded query parameters instead.

![emulator](./img/http-request.png)

#### Bot Framework Emulator

The bot framework emulator can be used to test and debug your bot. It provides a debugging console and also an inspector to analyze the http message flow of the bot. This way you can for example inspect the responses from luis model and check if your language understanding model works as intended.

![emulator](./img/emulator.png)


### LUIS

Luis uses a certain model for its language understanding. More details can be found [here](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/).  

We used a number of apps which then use a number of intents for the individual prompts we offer the user. In order to keep the model simple we decided to only use three entities. The first is the prebuild entity number which represents the weight of the user query. The remaining two entities are the machine learned entities country and product. The idea behind machine learned entities is that the luis model improves in identifying these with an increasing number of examples. Therefore we used a Phraselist for both classes to provide a solid starting set of examples.  

Additionally to phraselists for entities you can also add examples for intents to a luis model which help it recognize intents and its entities even better. When adding such an example to the model it will try to predict the contained entities automatically. This prediction can then be changed or confirmed.  

![Luis entities](./img/luis-entities.png)

When our bot is ready for starting new dialogs it sends the user input to our luis model which then returns the most likely intent to use and the predicted entities.  

## Results

As described above the bot can be used to query emitted CO2 for products and also emitted CO2 for whole shopping lists. It supports multiple natural language commands for its functionalities. For a better user experience it also supports commands to cancel the current query or to show the user available commands.

### Demo
#### CO2 Query
![Luis entities](./img/co2-abfrage.gif)

#### Instant Query
![Luis entities](./img/instant-abfrage.gif)

#### Cancel
![Luis entities](./img/abbrechen.gif)

#### Shopping 
![Luis entities](./img/Einkaufen.gif)

#### Missing values
![Luis entities](./img/rueckfrage.gif)

### Telegram
![Luis entities](./img/azure.png)
