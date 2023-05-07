
// A side layer with achievements, with no prestige
addLayer("a", {
    name: 'Achievements',
	symbol: 'A',
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: '#A5BCC2',
	resource: 'achievements',
	row: 'side',
	layerShown() { return true },
	effectDescription() {
		let text = ['<br>which are multiplying your point ', '', '', ''];
		if (hasUpgrade('ds', 21)) {
			if (hasUpgrade('ds', 24)) text[0] += 'and essence gain by <h2 class="layer-A">' + format(player.A.points.mul(0.2)) + '</h2>x';
			else {
				text[0] += 'gain by <h2 class="layer-A">' + format(player.A.points.mul(0.1).add(1)) + '</h2>x';
				text[1] += 'essence gain by <h2 class="layer-A">' + format(player.A.points.mul(0.2)) + '</h2>x';
			};
			if (hasUpgrade('ds', 23) && !hasUpgrade('ds', 24) && !hasUpgrade('p', 31)) text[2] += 'core and quark gain by <h2 class="layer-A">' + format(player.A.points.pow(2).div(100)) + '</h2>x';
			if (hasUpgrade('ds', 23) && hasUpgrade('ds', 24) && !hasUpgrade('p', 31)) text[1] += 'core and quark gain by <h2 class="layer-A">' + format(player.A.points.pow(2).div(100)) + '</h2>x';
			if (hasUpgrade('ds', 23) && hasUpgrade('ds', 24) && hasUpgrade('p', 31)) text[1] += 'core, prayer, and quark gain by <h2 class="layer-A">' + format(player.A.points.pow(2).div(100)) + '</h2>x';
		} else text[0] += 'gain by <h2 class="layer-A">' + format(player.A.points.mul(0.1).add(1)) + '</h2>x';
		if (hasUpgrade('a', 51)) text[3] += 'subatomic particle gain by <h2 class="layer-A">' + format(player.A.points.pow(1.25)) + '</h2>x';
		if (player.nerdMode) {
			if (hasUpgrade('ds', 21)) {
				if (hasUpgrade('ds', 24)) text[0] += ' (formula: x*0.2)';
				else {
					text[0] += ' (formula: x*0.1+1)';
					text[1] += ' (formula: x*0.2)';
				};
				if (hasUpgrade('ds', 23) && !hasUpgrade('ds', 24) && !hasUpgrade('p', 31)) text[2] += ' (formula: (x^2)/100)';
				if (hasUpgrade('ds', 23) && hasUpgrade('ds', 24)) text[1] += ' (formula: (x^2)/100)';
			} else text[0] += ' (formula: x*0.1+1)';
			if (hasUpgrade('a', 51)) text[3] += ' (formula: x^1.25)';
		};
		let fintext = text[0];
		if (text[1]) fintext += '<br>and also multiplying ' + text[1];
		if (text[2]) fintext += '<br>additionally, also multiplying ' + text[2];
		if (text[3]) fintext += '<br>and lastly, also multiplying ' + text[3];
		return fintext;
	},
	update(diff) {
		player.A.points = new Decimal(player.A.achievements.length);
	},
	tabFormat: [
		"main-display",
		"achievements",
	],
    achievements: {
        11: {
            image: "discord.png",
            name: "Get me!",
            done() {return true}, // This one is a freebie
            goalTooltip: "How did this happen?", // Shows when achievement is not completed
            doneTooltip: "You did it!", // Showed when the achievement is completed
        },
        12: {
            name: "Impossible!",
            done() {return false},
            goalTooltip: "Mwahahaha!", // Shows when achievement is not completed
            doneTooltip: "HOW????", // Showed when the achievement is completed
            textStyle: {'color': '#04e050'},
        },
        13: {
            name: "EIEIO",
            done() {return player.f.points.gte(1)},
            tooltip: "Get a farm point.\n\nReward: The dinosaur is now your friend (you can max Farm Points).", // Showed when the achievement is completed
            onComplete() {console.log("Bork bork bork!")}
        },
    },
    midsection: ["grid", "blank"],
    grid: {
        maxRows: 3,
        rows: 2,
        cols: 2,
        getStartData(id) {
            return id
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return player.points.eq(10)
        },
        getStyle(data, id) {
            return {'background-color': '#'+ (data*1234%999999)}
        },
        onClick(data, id) { // Don't forget onHold
            player[this.layer].grid[id]++
        },
        getTitle(data, id) {
            return "Gridable #" + id
        },
        getDisplay(data, id) {
            return data
        },
    },
},
)