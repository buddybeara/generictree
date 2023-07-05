addLayer("p", {
    name: "start", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#808080",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "starting values", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade('e',12)) mult = mult.add(upgradeEffect('p', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	exp = new Decimal(1)
	if (hasUpgrade('p',23)) exp = exp.add(1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "One and a half",
		description: "1.5x point generation",
		cost: new Decimal(4),
		},
		12: {
		title: "SV",
		description: "The value of starting values multiplies the value of Values",
		cost: new Decimal(16),
		 effect() {
			 if (player.u.unlocked) return (player[this.layer].points.add(1).pow(0.2)).add(tmp.u.effect)
			 else return player.p.points.add(1).pow(0.2)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
			13: {
		title: "Value Inflation",
		description: "The value of Values multiplies the value of Values",
		cost: new Decimal(256),
		 effect() {
						 if (player.u.unlocked) return (player.points.add(1).pow(0.2)).add(tmp.u.effect)
        else return player.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		21: {
		title: "Exponentially Greater",
		description: "Starting Values are multiplied by Exponentials",
		cost: new Decimal(1024),
		 effect() {
			 if (player.u.unlocked) return (player.points.add(1).pow(0.2)).add(tmp.u.effect)
        return (player.e.points.pow(0.1)).add(2)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() {return player.e.unlocked}
		},
		22: {
		title: "Upgraded Starting Values",
		description: "Starting Values are multiplied by Upgraders",
		cost: new Decimal(1024),
		 effect() {
			 if (player.u.unlocked) return (player.points.add(1).pow(0.2)).add(tmp.u.effect)
        return (player.e.points.pow(0.3333333)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() {return player.u.unlocked}
		},
		23: {
		title: "Exponential Starting Values",
		description: "Starting Values are rauised to the power of 2",
		cost: new Decimal(1e5),
		  unlocked() {return hasUpgrade("u",12) }
		},
	},
    layerShown(){return true},
	passiveGeneration() { return (hasMilestone("e", 0)&&true!=false)?0.2:0 },
	milestones: {
		0: {
			requirementDescription: "15 Exponentials and 15 Upgraders",
				done() { return player.e.points.gte(15)&&player.u.points.gte(15)},
				effectDescription: "Keep Prestige Point Upgrades on both of their resets.",
				unlocked() {return player.e.unlocked&&player.u.unlocked},
		},
	},
	doReset(resettingLayer) {
			let keep = [];
			if (hasMilestone("p", 0) && resettingLayer=="e"||hasMilestone("p", 0) && resettingLayer=="u") keep.push("upgrades")
			if (hasMilestone("p", 0) && resettingLayer=="e"||hasMilestone("p", 0) && resettingLayer=="u") keep.push("milestones")
			if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
		},
})
addLayer("e", {
		branches: ['p'],
    name: "e", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#3380FF",
    requires: new Decimal(1e3), // Can be a function that takes requirement increases into account
    resource: "exponential", // Name of prestige currency
    baseResource: "Values", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for Exponentials", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effect() {
		let base = new Decimal(1);
			base = base.times(player.e.points.pow(0.1))
			base = base.add(player.points.pow(0.5))
			base = base.times(player.e.points)
			if (hasUpgrade("e", 11)) base = base.times(2)
			if (hasUpgrade("e", 21)) base = base.add(player.points.add(1).pow(0.05))
			if (player.se.unlocked) base = base.times(tmp.se.effect)
			return base
		},
		effectDescription() {
			return "which are boosting all point generation by +"+format(tmp.e.effect)
		},
		autoPrestige() { return (hasMilestone("e", 1) && player.e.auto) },
	milestones: {
		0: {
			requirementDescription: "5 Exponentials",
				done() { return player.e.points.gte(5)},
				effectDescription: "Gain 20% of Starting Value gain per second.",
		},
		1: {
			requirementDescription: "10 Exponentials",
				done() { return player.e.points.gte(10)},
				effectDescription: "You can auto buy Exponentials.",
				toggles: [["e", "auto"]],
		},
	},
	upgrades: {
		11: {
		title: "Duplication",
		description: "x2 boost to Value boost",
		cost: new Decimal(3),
		},
		12: {
		title: "Inflation, again",
		description: "Value Inflation also boosts Starting Values",
		cost: new Decimal(3),
		},
		21: {
		title: "Inflation Steal",
		description: "Value Inflation is added to the Value Boost",
		cost: new Decimal(16),
		 effect() {
						 if (player.u.unlocked) return (player.points.add(1).pow(0.2)).add(tmp.u.effect)
        else return player.points.add(1).pow(0.2)
		 },
		effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"+" },
		},
	},
    layerShown(){return true}
})
addLayer("u", {
		branches: ['p'],
    name: "u", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#CF44BB",
    requires: new Decimal(1e3), // Can be a function that takes requirement increases into account
    resource: "Upgraders", // Name of prestige currency
    baseResource: "Values", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "u", description: "U: Reset for Upgraders", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effectBase() {
			let base = new Decimal(10);
			base = base.add(player.points.pow(0.05))
			return base
		},
	effect() {
		let m = Decimal.pow(tmp.u.effectBase, 2)
		m = m.times(player.u.points)
		if (hasUpgrade("u", 11)) m = m.times(2)
			return m
		},
		effectDescription() {
			return "which are boosting all Starting Value Upgrades by +"+format(tmp.u.effect)
		},
	upgrades: {
		11: {
		title: "Upgrading the Upgrader of Upgrades",
		description: "x2 to the Upgrade Boost",
		cost: new Decimal(3),
		},
		12: {
		title: "NO!! TOO MANY!! TOO MANY UPGRADES!!!!",
		description: "Unlock new upgrades for Starting Values and Exponentials.",
		cost: new Decimal(3),
		},
		13: {
		title: "This one might be exponential",
		description: "^1.1 to the Upgrade Boost",
		cost: new Decimal(16),
		unlocked() {return (player.e.unlocked && hasUpgrade("u", 11))},
		},
	},
	autoPrestige() { return (hasMilestone("u", 1) && player.u.auto) },
	milestones: {
		0: {
			requirementDescription: "5 Upgraders",
				done() { return player.u.points.gte(5)},
				effectDescription: "x1.2 buff to Point generation.",
		},
		1: {
			requirementDescription: "10 Upgraders",
				done() { return player.u.points.gte(10)},
							effectDescription: "You can autobuy Upgraders.",
							toggles: [["u", "auto"]]
		},
	},
    layerShown(){return true},
	tabFormat: ["main-display",
			"prestige-button",
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
})
addLayer("po", {
		branches: ['e'],
    name: "p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", /////////////////the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "positive", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){if (player.e.unlocked) return true
	else return false}
})
addLayer("n", {
		branches: ['e'],
    name: "n", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#000000",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "negative", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){if (player.e.unlocked) return true
	else return false}
})
addLayer("i", {
		branches: ['e','u'],
    name: "i", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "∞", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FF6400",
	
    requires: new Decimal(Number.MAX_VALUE), // Can be a function that takes requirement increases into account
    resource: "Infinities", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	buyables: {
		11: {
cost(x) { return new Decimal(2).pow(x || getBuyableAmount(this.layer, this.id)) },
title: "Big Crunch",
cap() { return new Decimal(1.75) },
buffAmount() { effect = new Decimal(0.05)
		effect = effect.times(getBuyableAmount(this.layer, this.id))
		effect = effect.add(1)
		if(effect.gt(1.75)) effect = 1.75
return effect }, //very good code
        display() { return "+0.05 buff on point production per upgrade. Power is "+this.buffAmount()+"+1^, the hard cap is "+this.cap()+", the cost is "+this.cost()},
        canAfford() {effect = new Decimal(0.05)
		effect = effect.times(getBuyableAmount(this.layer, this.id))
		effect = effect.add(1)
		if(effect.gt(1.75)) return false 
else return player[this.layer].points.gte(this.cost())		},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
 effect() {
        effect = new Decimal(0.05)
		effect = effect.times(getBuyableAmount(this.layer, this.id))
		effect = effect.add(1)
		if(effect.gt(this.cap())) effect = 1.75
		return effect
		 },
		},
	},
	upgrades: {
		11: {
		title: "Over Exponentiation",
		description: "Adds Points to the Exponential Buff",
		cost: new Decimal(5),
		 effect() {
        return player.points.add(1).pow(new Decimal(0.75).times(player.e.points))
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"+" },
		},
	},

layerShown(){return player.e.unlocked&&player.u.unlocked},
})
addLayer("d", {
		branches: ['u'],
    name: "d", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e100"), // Can be a function that takes requirement increases into account
    resource: "Dimensions", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
	effect() {
		effect = new Decimal(2)
		effect = effect.pow(player.d.points)
		if (hasUpgrade("d", 13)) effect = effect.times(upgradeEffect('d', 13))
			if (hasUpgrade("d", 11)) effect = effect.times(2)
		return effect
	},
	dimensionPow() {
		effect = player.d.energy
		effect = effect.mul(player.u.points.add(1))
		effect = effect.pow(1.1)
		return effect
	},
	effectDescription() {
		return "that generate "+format(tmp.d.effect)+" Dimensional Energy every second."
	},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
	update(diff) {
		if (player.d.unlocked) player.d.energy = player.d.energy.add(tmp.d.effect)
	},
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Dimensional Boost",
		description: "x2 Dimensional Energy and x2 Dimensions",
		cost: new Decimal(10),
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		12: {
		title: "Dimensional Upgrade",
		description: "Dimensional Power's buff is buffed by the Upgrader Buff",
		cost: new Decimal(20),
		 effect() {
        return ((tmp.u.effect).pow(0.25)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		13: {
		title: "Dimensions Starting Point",
		description: "Dimensional Power Generation is buffed by Starting Value Amount",
		cost: new Decimal(50),
		 effect() {
        return (player.p.points.pow(0.025)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		14: {
		title: "Interdimensional",
		description: "Dimensional Power's generation is buffed by Dimensional Power's buff",
		cost: new Decimal(100),
		 effect() {
        return(player.d.energy.pow(0.125)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return player.u.unlocked},
	tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.d.energy) + ' Dimensional Energy, which boosts Point generation by '+format(tmp.d.dimensionPow)+'x'},
					{}],
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
})
addLayer("se", {
		branches: ['e'],
    name: "se", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("100"), // Can be a function that takes requirement increases into account
    resource: "Super Exponentials", // Name of prestige currency
    baseResource: "Exponentials", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.65, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "E", description: "Press Shift+E to preform a Super Exponential Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effect() {
		effect = new Decimal(player.e.points)
		effect = effect.pow(player.se.points)
		return effect
	},
	effectDescription() {
			return "which are multiplying the Exponentials boost by "+format(tmp.se.effect)+"x"
		},
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return player.po.unlocked&&player.n.unlocked}
})
addLayer("su", {
		branches: ['u'],
    name: "su", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SU", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 7, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("100"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.u.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.65, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return player.d.unlocked}
})
addLayer("l", {
		branches: ['se'],
    name: "l", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("25"),
    resource: "Lunar Shards",
    baseResource: "Super Exponentials",
    baseAmount() {return player.se.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return player.se.points.gte(15)}
})
addLayer("z", {
		branches: ['n','po'],
    name: "z", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Z", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8F8F8F",
    requires: new Decimal("1e400"),
    resource: "Zeros", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.n.points.add(player.po.points)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.95, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return player.n.unlocked&&player.po.unlocked&&player.se.unlocked}
})
addLayer("et", {
		branches: ['i'],
    name: "et", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Δ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal(Number.MAX_VALUE), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Infinities", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return player.i.unlocked}
})
addLayer("s", {
		branches: ['su'],
    name: "s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "Solar Shards",
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("da", {
		branches: ['l'],
    name: "da", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.45, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("on", {
		branches: ['z'],
    name: "on", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ON", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("pa", {
		branches: ['z','i'],
    name: "pa", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "PA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("o", {
		branches: ['et',['se',2]],
    name: "o", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("f", {
		branches: ['et','su'],
    name: "f", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("li", {
		branches: [['s',2]],
    name: "li", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 7, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.45, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("a", {
		branches: ['et',['d',3]],
    name: "a", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 6, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e3080"), // Can be a function that takes requirement increases into account
    resource: "antimatter", // Name of prestige currency
    baseResource: "Dimensions", // Name of resource prestige is based on
    baseAmount() {return player.d.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2345, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("in", {
		branches: [['z',3],'on'],
    name: "f", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "IN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.15, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("eq", {
		branches: [['li',2],['da',2]],
    name: "eq", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EQ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.025, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("t", {
		branches: ['o','f'],
    name: "t", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.35, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 5, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Test",
		description: "Testing that this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("a", {
        startData() { return {
            unlocked: true,
        }},
        color: "green",
        row: "side",
        layerShown() {return true}, 
        tooltip() { // Optional, tooltip displays when the layer is locked
            return ("Achievements")
        },
		requires: new Decimal(0),
		baseResource: "points",
		baseAmount() {return player.points},
        achievements: {
            rows: 7,
            cols: 7,
            11: {
                name: "The first one doesn't have to be free",
                done() { return player.points.gte(100) },
                tooltip: "Get 100 Value.",
				image: "images/achs/11.png",
            },
			12: {
                name: "This isn't exponential though..",
                done() { return player.e.unlocked },
                tooltip: "Unlock Exponentials",
				image: "images/achs/12.png",
            },
			13: {
                name: "How do you upgrade the UPGRADES???",
                done() { return player.u.unlocked },
                tooltip: "Unlock Upgraders",
				image: "images/achs/13.png",
            },
			14: {
                name: "Did you even think starting values were free?",
                done() { return player.p.points.gte(100) },
                tooltip: "Get 100 Starting Values.",
				image: "images/achs/14.png",
            },
			15: {
                name: "That's pretty upbeat",
                done() { return player.po.unlocked },
                tooltip: "Unlock Positives. Reward: x2 to the Exponential Buff",
				image: "images/achs/15.png",
            },
			16: {
                name: ":sob:",
                done() { return player.n.unlocked },
                tooltip: "Unlock Negatives. Reward: x2 to point gain.",
				image: "images/achs/16.png",
            },
			17: {
                name: "Dimensions Starting Point",
                done() { return player.d.unlocked },
                tooltip: "Unlock Dimensions. Reward: x2 to Upgrader Buff",
				image: "images/achs/17.png",
            },
			21: {
                name: "Let me guess, costs like, 2 values?",
                done() { return player.i.unlocked },
                tooltip: "Unlock Infinities. Reward: x2 gain to Dimensions, Positives, and Negatives.",
				image: "images/achs/21.png",
            },
			22: {
                name: "it was always exponential",
                done() { return player.se.unlocked },
                tooltip: "Unlock Super Exponentials. Reward: ^1.1 Points",
				textStyle: {'color': '#ff0000'},
				image: "images/achs/real22.png",
            },
			23: {
                name: "Upgraders for Upgraders (which are upgrades for upgrades)",
                done() { return player.su.unlocked },
                tooltip: "Unlock Super Upgraders. Reward: 3 more Upgrader Upgrades",
				image: "images/achs/real23.png",
            },
			24: {
                name: "Oh wow you really did that woah that's really cool wow",
                done() { return player.l.unlocked||player.z.unlocked||player.et.unlocked||player.s.unlocked },
                tooltip: "Do a 4th row reset. Reward: x4 Points gained.",
				image: "images/achs/22.png",
            },
			25: {
                name: "Eternally only worth 2 values",
                done() { return player.et.unlocked },
                tooltip: "Unlock Eternities. Reward: x1.5 Infinities and Big Crunch hardcap is now 2.",
				image: "images/achs/23.png",
            },
			26: {
                name: "Oh wow you went beyond just really cool",
                done() { return player.l.unlocked&&player.z.unlocked&&player.et.unlocked&&player.s.unlocked },
                tooltip: "Get all 4th row stats. Reward: x4 2nd row stats gained.",
				image: "images/achs/24.png",
				
            },
			27: {
                name: "Positives and Negatives Round 2",
                done() { return player.l.unlocked&&player.s.unlocked },
                tooltip: "Get Lunars and Solars. Reward: x2 to the Super Upgraders and Super Exponential Buffs.",
				image: "images/achs/25.png",
            },
			77:{
                name: "Whats 9 + 10",
                done() { return player.points.gte("1e1e21") },
                tooltip: "Get 1e1e21 Values.",
				image: "images/achs/25.png",
            },
		},
		tabFormat: [
			"blank", 
			["display-text", function() { return "Achievements (ik it's hard to read): "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
			"blank", "blank",
			"achievements",
		],
    }, 
)