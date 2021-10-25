const SUITS = ["Parrot", "Treasure Chest", "Map", "Jolly Roger"]
const VALUES = [...Array(15).keys()]

class Deck {
    constructor() {
        this.cards = []
    }

    get deckSize() {
        return this.cards.length
    }

    show() {
        return this.cards
    }

    pop() {
        return this.cards.shift()
    }

    push(card) {
        this.cards.push(card)
    }

    shuffle() {
        for (let i = this.deckSize - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    build() {
        for (const suit of SUITS) {
            for (const value of VALUES) {
                if (value !== 0) {
                    this.cards.push({suit: suit,
                        value: value})
                }
            }
        }
        for (let i = 0; i < 5; i++) {
            this.cards.push({suit: "Pirate", value: 15})
            this.cards.push({suit: "Escape", value: 0})
        }
        for (let i = 0; i < 2; i++) {
            this.cards.push({suit: "Mermaid", value: 15})
        }
        this.cards.push({suit: "Skull King", value: 15})
    }
}

module.exports = Deck