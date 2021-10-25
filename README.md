# Skull King Online

## Description

Skull King Online is a web application that is a recreation of a popular card game of the same name. The objective of the game is to make accurate bids on how many tricks you will gain for that round to earn points. Guess incorrectly, and you'll lose points! Users can create an account to play this game online with friends or even complete strangers. Also, users will stay logged in even when they close the page so they won't have to login again!

### Screenshots

### Home Screen

![Home_Screen](https://i.imgur.com/H6LQg9V.png)

### Lobby

![Lobby](https://i.imgur.com/JDFaX9G.png)

### In-Game

![InGame](https://i.imgur.com/veCYRjA.png)

## Technologies Used

- HTML/CSS
- Node.js
- ReactJS
- ExpressJS
- Mongoose
- MongoDB
- Material UI
- Websockets (Socket.io) - Backend
- Socket.io-Client - Frontend
- Heroku

## Getting Started / Instructions

To get started, it's as simple as creating an account. When you sign up or sign in, you will be redirected to the lobby page. There, you can create a new room or join an open room. Inside the lobby, you can learn how to play while you wait for people to join. Current ruleset and how to play the game can be found [here](https://www.grandpabecksgames.com/pages/skull-king).

Link to game: [Skull King Online](https://sk-online.herokuapp.com)
Link to backend server: [Skull King Online - Server](https://sk-online-server.herokuapp.com)

## Unsolved Problems / Contribution Requests
There are some problems or unimplemented features due to time constraints that are listed below.

- Room list sometimes doesn't properly update when users join or leave
- "Tigress" card is missing from the game due to additional functionality on being able to be played as either a Pirate or Escape
- Game currently has no audio
- First room creation after login sometimes results in an error, unable to find cause
- Depending on screen size, users may not be able to see cards that overflow to a new line when trying to place a bid
- Users can join the same room twice (semi-intentional for demonstration purposes)
- Room owners cannot kick users from the room
- Room persists even after a game is finished
- Room owners currently cannot invite players to their room
- Game currently has unlimited time to make bids or play cards, plans to implement a timeout feature
- Users are currently able to "cheat" by not following suit even if they have cards of the leading suit in their hand.
- Trick display in game sometimes doesn't update properly when a player wins a trick
