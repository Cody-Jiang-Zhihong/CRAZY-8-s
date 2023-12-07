// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};

// CODY's PART
// range function
export function range(...args) {
    let start = 0, end = 0, inc = 1;
    if (args.length === 1) {
      [end] = args;
    } else if (args.length === 2) {
      [start, end] = args;
    } else if (args.length === 3) {
      [start, end, inc] = args;
    }
  
    const arr = [];
    for (let i = start; i < end; i += inc) {
      arr.push(i);
    }
    return arr;
};

// generateDeck function
export function generateDeck() {
    const suits = ['♠️', '❤️', '♣️', '♦️'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
  
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    return deck;
};
  
// shuffle function
export function shuffle(deck) {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
};
  
// draw function
export function draw(cardsArray, n = 1) {
    const newDeck = [...cardsArray];
    const drawnCards = newDeck.splice(-n, n);
    return [newDeck, drawnCards];
};
  
// deal function
export function deal(cardsArray, numHands = 2, cardsPerHand = 5) {
    const newDeck = [...cardsArray];
    const hands = [];
    for (let i = 0; i < numHands; i++) {
      const hand = newDeck.splice(-cardsPerHand, cardsPerHand);
      hands.push(hand);
    }
    return { deck: newDeck, hands };
};
  
// handToString function
export function handToString(hand, sep = '  ', numbers = false) {
    return hand.map((card, index) => {
      const cardString = `${card.rank}${card.suit}`;
      return numbers ? `${index + 1}: ${cardString}` : cardString;
    }).join(sep);
};
  
// matchesAnyProperty function
export function matchesAnyProperty(obj, matchObj) {
    for (const [key, value] of Object.entries(matchObj)) {
      if (obj[key] === value) {
        return true;
      }
    }
    return false;
};
  
// drawUntilPlayable function
export function drawUntilPlayable(deck, matchObj) {
  const newDeck = [...deck];
  const drawnCards = [];

  let found = false; // Add this line to track whether a matching card is found

  for (let i = newDeck.length - 1; i >= 0; i--) {
    const card = newDeck[i];
    drawnCards.push(card);

    if (card.rank === '8' || matchesAnyProperty(card, matchObj)) {
      newDeck.splice(i);
      found = true; // Update this line to reflect that a matching card has been found
      break;
    }
  }

  if (!found) { // If no matching card is found, empty the newDeck array
    newDeck.length = 0;
  }

  return [newDeck, drawnCards];
}
