class Trick {
    constructor(cards, players) {
        this.cards = cards
        this.players = players
        this.winner = null
        this.leadCard = {}
        this.leadPlayer = {}
    }

    determineWinner() {
        if (this.cards.every((card) => card.suit === "Escape") || this.cards.every((card) => card.suit === "Pirate")) {
            this.leadCard = this.cards[0]
            this.leadPlayer = this.players[0]
        } else {
            this.leadCard = this.cards.find((card) => card.suit !== "Escape")
            this.leadPlayer = this.players[this.cards.indexOf(this.leadCard)]
        }
        for (const card of this.cards) {
            if (card.suit === "Jolly Roger" && ["Pirate", "Mermaid", "Skull King"].indexOf(this.leadCard.suit) === -1) {
                if (card.value > this.leadCard.value || ["Parrot", "Treasure Chest", "Map"].indexOf(this.leadCard.suit) !== -1) {
                    this.leadCard = card
                    this.leadPlayer = this.players[this.cards.indexOf(this.leadCard)]
                }
            } else if (card.suit === "Pirate" && this.leadCard.suit !== "Skull King") {
                if (this.leadCard.suit === card.suit) {
                    continue
                }
                this.leadCard = card
                this.leadPlayer = this.players[this.cards.indexOf(this.leadCard)]
            } else if ((card.suit === "Mermaid" && this.leadCard.suit !== "Pirate") || (card.suit === "Mermaid" && this.cards.some((card) => card.suit === "Skull King"))) {
                if (this.leadCard.suit === card.suit) {
                    continue
                }
                this.leadCard = card
                this.leadPlayer = this.players[this.cards.indexOf(this.leadCard)]
            } else if (card.suit === "Skull King" && this.cards.every((card) => card.suit !== "Mermaid")) {
                this.leadCard = card
                this.leadPlayer = this.players[this.cards.indexOf(this.leadCard)]
            } else {
                if (card.suit === this.leadCard.suit) {
                    if (card.value > this.leadCard.value) {
                        this.leadCard = card
                        this.leadPlayer = this.players[this.cards.indexOf(this.leadCard)]
                    }
                }
            }
        }
        this.winner = this.leadPlayer
        console.log(this.leadCard)
        return this.winner
    }
}

const x = new Trick([{suit: "Pirate", value: 15}, {suit: "Mermaid", value: 15}, {
    suit: "Escape",
    value: 0
}, {suit: "Skull King", value: 13},], ["1", "2", "3", "4"])

console.log("Player: ", x.determineWinner())
module.exports = Trick