class Game {
    constructor(players, deck) {
        this.players = players
        this.rounds = 10
        this.round = 10
        this.deck = deck
    }

    // get players() { return this.players }
    // get round() {return this.round}
    // get deck() {return this.deck}
    // get rounds() {return this.rounds}

    dealCards() {
        this.deck.shuffle()
        for (let i = 0; i < this.round; i++) {
            for (const player of this.players) {
                player.drawCard(this.deck)
            }
        }
    }

    calculatePoints() {
        const stats = []
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
            stats.push({playerName: player.name, points: player.points})
            player.tricks = 0
            player.bid = 0
        }

        return stats
    }
}

module.exports = Game