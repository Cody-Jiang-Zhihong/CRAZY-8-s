// game.mjs

// CODY's PART 2:
import {
    draw, shuffle, generateDeck,
    matchesAnyProperty, drawUntilPlayable
} from '../lib/cards.mjs';
import { question } from 'readline-sync';
import clear from 'clear';

import fs from 'fs';

// setup function initializes the game state, 
// either by loading from a JSON file or creating a new game state
function setup() {
    if (process.argv.length > 2) {
        const filePath = process.argv[2];
        try {
            const jsonData = fs.readFileSync(filePath, { encoding: 'utf8' });
            return JSON.parse(jsonData);
        } catch (error) {
            console.error('Error reading or parsing the JSON file:', error);
            process.exit(1);
        }
    } else {
        const deck = shuffle(generateDeck());
        const [afterComputerDraw, computerHand] = draw(deck, 5);
        const [afterPlayerDraw, playerHand] = draw(afterComputerDraw, 5);
        const [updatedDeck, discardPile] = draw(afterPlayerDraw, 1);

        return {
            deck: updatedDeck,
            playerHand,
            computerHand,
            discardPile,
            currentSuit: discardPile[0].suit,
            currentRank: discardPile[0].rank,
        };
    }
}

// displayState function is used to log the current game state to the console
function displayState({ deck, playerHand, computerHand, discardPile }) {
    const lastDiscard = discardPile[discardPile.length - 1];

    console.log("              CR🤪ZY 8's");
    console.log('-----------------------------------------------');
    console.log(`Next suit/rank to play: ➡️  ${lastDiscard.rank}${lastDiscard.suit}  ⬅️`);
    console.log('-----------------------------------------------');
    console.log(`Top of discard pile: ${lastDiscard.rank}${lastDiscard.suit}`);
    console.log(`Number of cards left in deck: ${deck.length}`);
    console.log('-----------------------------------------------');
    console.log(`🤖✋ (computer hand): ${computerHand.map(card => card.rank + card.suit).join('  ')}`);
    console.log(`😊✋ (player hand): ${playerHand.map(card => card.rank + card.suit).join('  ')}`);
    console.log('-----------------------------------------------');
}

// getPlayableCards returns an array of cards that can be legally played from the hand
function getPlayableCards(hand, currentCard) {
    return hand.filter(card => matchesAnyProperty(card, currentCard) || card.rank === '8');
}

// handle8Card function is triggered when an 8 card is played, allowing the user to select a new suit
function handle8Card() {
    console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
    console.log("1: ♠️\n2: ❤️\n3: ♣️\n4: ♦️");
    let suitChoice = parseInt(question("> "), 10);
    while (suitChoice < 1 || suitChoice > 4) {
        console.log("Invalid choice. Please select a valid suit number.");
        suitChoice = parseInt(question("> "), 10);
    }
    return ['♠️', '❤️', '♣️', '♦️'][suitChoice - 1];
}

// handleCardPlay updates the game state after a card is played, managing the player hand and discard pile
function handleCardPlay(gameState, playedCard) {
    gameState.playerHand = gameState.playerHand.filter(card => card !== playedCard);
    gameState.discardPile.push(playedCard);
    if (playedCard.rank === '8') {
        playedCard.suit = handle8Card();
    }
    return gameState;
}

// drawAndPlayCard is triggered when the player cannot play any card from hand, the player draws cards until they can play
function drawAndPlayCard(gameState, currentCard) {
    const [remainingDeck, drawnCards] = drawUntilPlayable(gameState.deck, currentCard);
    if (!remainingDeck.length && !getPlayableCards(drawnCards, currentCard).length) {
        console.log("No more cards left in the deck to play.");
        return null;
    }

    console.log("Cards drawn:", `${drawnCards.map(card => card.rank + card.suit).join('  ')}`);
    
    const playedCard = drawnCards.pop();
    gameState.deck = remainingDeck;
    gameState.playerHand = [...gameState.playerHand, ...drawnCards];

    console.log("Card played:", `${playedCard.rank}${playedCard.suit}`);
    question("Press ENTER to continue");

    return handleCardPlay(gameState, playedCard);
}

// playerTurn function manages the flow for the player’s turn
function playerTurn(gameState) {
    const currentCard = gameState.discardPile[gameState.discardPile.length - 1];
    const playableCards = getPlayableCards(gameState.playerHand, currentCard);

    console.log("😊 Player's turn...");

    if (playableCards.length) {
        console.log("Enter the number of the card you would like to play");
        gameState.playerHand.forEach((card, index) => console.log(`${index + 1}: ${card.rank}${card.suit}`));

        let choice = parseInt(question("> "), 10) - 1;
        while (!(playableCards.includes(gameState.playerHand[choice]))) {
            console.log("Invalid choice. Please select a valid card number.");
            choice = parseInt(question("> "), 10) - 1;
        }
        console.log("You played", `${gameState.playerHand[choice].rank}${gameState.playerHand[choice].suit}`);

        return handleCardPlay(gameState, gameState.playerHand[choice]);
    } else {
        console.log("😔 You have no playable cards");
        console.log(`Press ENTER to draw cards until matching: ${currentCard.rank}, ${currentCard.suit}, 8`);
        question(".");
        return drawAndPlayCard(gameState, currentCard);
    }
}

// computerTurn function manages the flow for the computer’s turn
function computerTurn(gameState) {
    const currentCard = gameState.discardPile[gameState.discardPile.length - 1];
    const playableCards = getPlayableCards(gameState.computerHand, currentCard);

    console.log("🤖 Computer's turn...");

    let cardPlayed;
    if (playableCards.length) {
        cardPlayed = playableCards[0];
        gameState.computerHand = gameState.computerHand.filter(card => card !== cardPlayed);
        gameState.discardPile.push(cardPlayed);
    } else {
        while (!cardPlayed && gameState.deck.length) {
            const [newDeck, drawnCard] = draw(gameState.deck);
            gameState.deck = newDeck;
            gameState.computerHand.push(drawnCard[0]);

            if (getPlayableCards([drawnCard[0]], currentCard).length) cardPlayed = drawnCard[0];
        }
    }

    if (cardPlayed) {
        if (cardPlayed.rank === '8') cardPlayed.suit = ['♠️', '❤️', '♣️', '♦️'][Math.floor(Math.random() * 4)];
        console.log(`🤖 Computer plays: ${cardPlayed.rank}${cardPlayed.suit}`);
    }
    question("Press ENTER to continue");

    return gameState;
}

// playGame is the main game loop, it continues the game for 2 turns
function playGame() {
    let gameState = setup();
    displayState(gameState);
    let roundsPlayed = 0;
    while (roundsPlayed < 2) {
        gameState = playerTurn(gameState) || gameState;
        gameState = computerTurn(gameState);
        displayState(gameState);
        roundsPlayed++;
    }
    clear();
    console.log("2 TURNS END, GAME OVER!");
}

playGame(); // Initiating the game
