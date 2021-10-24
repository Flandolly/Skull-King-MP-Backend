class Player {
    constructor(name) {
        this.name = name
        this.hand = []
        this.bid = 0
        this.tricks = 0
        this.points = 0
    }

    set setBid(bid) {
        this.bid = bid
    }

    set setTricks(tricks) {
        this.tricks = tricks
    }

    set setPoints(points) {
        this.points = points
    }

    drawCard(deck) {
        this.hand.push(deck.pop())
    }

    playCard(card) {
        this.hand.splice(this.hand.indexOf(card), 1)
    }

    handSize() {
        return this.hand.length
    }

    showHand() {
        this.hand.sort((a, b) => a.suit > b.suit && 1 || -1)
        return this.hand
    }
}

module.exports = Player