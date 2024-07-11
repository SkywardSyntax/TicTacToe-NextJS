# Tic Tac Toe Game

This repository contains a basic tic tac toe game for 2 players implemented using Next.js components.

## How to Run

To run this application:

```
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to start playing the game.

## Features

- Hashtag-shaped Tic Tac Toe board with only middle lines visible
- "Tic Tac Toe" title, game board, game result, and reset button on frosted glass chips
- Reset button that becomes red and clickable when the game ends (a win or a tie occurs)
- Score tracking for both X and O players that persists across multiple games
- Scoreboard increments a player's score by exactly 1 for each victory
- New `scoreUpdated` state variable to track if the score has been updated
- Game counter to track the number of games played
