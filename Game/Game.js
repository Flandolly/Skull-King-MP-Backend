class Game {
    constructor(players, deck) {
        this.players = players
        this.rounds = 10
        this.round = 1
        this.deck = deck
    }

    dealCards() {
        this.deck.shuffle()
        for (let i = 0; i < this.round; i++) {
            for (const player of this.players) {
                player.drawCard(this.deck)
            }
        }
    }

    calculatePoints() {
        for (const player of this.players) {
            if (player.bid === 0) {
                if (player.tricks === 0) {
                    player.points += (10 * this.round)
                } else {
                    player.points -= (10 * this.round)
                }
            } else if (player.tricks === player.bid) {
                player.points += (20 * player.bid)
            } else {
                player.points -= (10 * Math.abs(player.bid - player.tricks))
            }

            player.tricks = 0
            player.bid = 0
        }
    }
}

module.exports = Game