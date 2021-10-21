class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    get suit() { return this.suit }
    get value() { return this.value }

    show() {
        return {suit: this.suit, value: this.value}
    }
}

module.exports = Card