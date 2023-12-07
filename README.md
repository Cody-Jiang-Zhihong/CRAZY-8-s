
# CR🤪ZY 8's

## Overview
This project is an interactive card game, Crazy Eights, implemented in JavaScript. It uses Node.js for execution and includes a demo of two turns of the game: one player turn and one computer turn.

### Features
- Utilizes a standard 52-card deck of French suited playing cards.
- Allows for a predefined configuration through a JSON file or dynamic generation of cards.
- Implements an interactive demo of the first two turns in a game of Crazy Eights.
- Includes functions for managing the card deck, shuffling, drawing, and dealing cards.
- Interactive game logic for player and computer turns.
- Utilizes Node.js built-ins like the `fs` module and `process`.

### Installation
Ensure Node.js (at least v16.9.x) and npm are installed on your system. To check, run:
```bash
node -v
npm -v
```

### Clone the Repository
```bash
git clone [Repository URL]
cd [Repository Directory]
```

### Install Development Modules
Run the following commands in your project directory:
```bash
npm install --save-dev mocha
npm install --save-dev eslint
npm install --save-dev chai
npm install --save-dev eslint-plugin-mocha
```

### Install Game Dependencies
```bash
npm install --save readline-sync
npm install --save clear
```

### Running the Game
Navigate to the project directory and run:
```bash
node bin/game.mjs
```

### Testing
Run unit tests with:
```bash
npx mocha test/test-cards.mjs
```

## Contribution
Feel free to fork this project and contribute. Please make sure to run tests before submitting a pull request.

## License
[Add License here if applicable]

---
Created as part of [Course/Institution Name] curriculum.
