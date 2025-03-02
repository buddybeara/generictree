addLayer("p", {
    name: "start", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
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
		if (hasUpgrade('p',32)) mult = mult.add(upgradeEffect('p', 32))
		if (hasUpgrade('n',12)) mult = mult.add(upgradeEffect('n', 12))
		if (hasUpgrade('p',21)) mult = mult.add(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		exp = new Decimal(1)
		if (hasUpgrade('p',23)) exp = exp.add(0.1)
		if (inChallenge('ne',12)) exp = exp.sub(player.points.log(10000))
			return exp
	},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Starting Values", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "One and a half",
		description: "1.5x point generation",
		cost: new Decimal(4),
		},
		12: {
		title: "SV",
		description: "The value of starting values multiplies the gain of Values",
		cost: new Decimal(8),
		 effect() {
			if (hasUpgrade("n",22)) return (player.p.points.add(1).pow(0.2)).times(upgradeEffect('n', 22))			
				else
					return player.p.points.add(1).pow(0.2)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
			13: {
		title: "Value Inflation",
		description: "The value of Values multiplies the gain of Values",
		cost: new Decimal(16),
		 effect() {
			return player.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		21: {
		title: "Moar... 2",
		description: "x2 Starting Value",
		cost: new Decimal(1e6),
		  unlocked() {return hasAchievement("a",14) }
		},
		31: {
		title: "god no (the upgrade)",
		description: "Starting Values are raised to the power of 1.1",
		cost: new Decimal(1e10),
		  unlocked() {return hasAchievement("a",16) }
		},
		32: {
		title: "Thy Removed: E",
		description: "Point gain is put to the power of 1.05.",
		cost: new Decimal(1e15),
		  unlocked() {return hasUpgrade("p",31) }
		},
		33: {
		title: "Thy Removed: U",
		description: "Starting Value Upgrades buff Points",
		cost: new Decimal(1e15),
		effect() {
				return Decimal.pow(4,player.p.upgrades.length)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		  unlocked() {return hasUpgrade("p",31) }
		},
	},
    layerShown(){return true},
	passiveGeneration() { return (hasUpgrade("n", 23)&&true!=false)?1:0 },
	doReset(resettingLayer) {
			let keep = [];
			if (hasMilestone("m", 0) && resettingLayer=="m") keep.push("upgrades")
			if (hasMilestone("n", 0) && resettingLayer=="n") keep.push("upgrades")
			if (layers[resettingLayer].row > this.row) layerDataReset("p", keep)
		},
})
addLayer("n", {
		branches: ['p'],
    name: "n", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		number: new Decimal(0),
    }},
    color: "#d63e5f",  //#ff0339
	unlockedFirst: false,
     requires() { return new Decimal(200) }, // Can be a function that takes requirement increases into account
    resource: "numerical energy", // Name of prestige currency
    baseResource: "Values", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.3,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade('n',21)) mult = mult.times(1/3)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
       mult = new Decimal(1)
			   return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for numerical energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effect() {
		let base = new Decimal(player.n.points);
		base = Decimal.pow(1.5,base)
		if (hasUpgrade('n',11)) base = base.times(2)
			if (hasUpgrade('n',13)) base = base.times(upgradeEffect('n', 13))
		if (hasUpgrade('n',31)) base = base.times(upgradeEffect('n', 31))
			return base.sub(1)
		},
		effectDescription() {
			return "which are increasing the number by +"+format(tmp.n.effect)+"/sec"
		},
	numberMult() {
		base = new Decimal(player.n.number);
			return Decimal.pow(1.25,(base.add(1).log(2)))
		},
		update(diff) {
		if (player.n.unlocked) player.n.number = player.n.number.add(tmp.n.effect.div(20))
	},
	upgrades: {
		11: {
		title: "Numerical Expansion",
		description: "x2 number gained.",
		cost: new Decimal(3),
		},
		12: {
		title: "ONE",
		description: "Numerical Energy multiplies Starting Values.",
		cost: new Decimal(5),
		 effect() {
        return ((player.n.points.add(1)).log(1.1)).add(1)
		 },
		  effectDisplay() {
			  return format(upgradeEffect(this.layer, this.id))+"x"
		  }
		},
		13: {
		title: "Exponentials Return??? (LIES!!)",
		description: "The Number boost's it's own generation.",
		cost: new Decimal(8),
		 effect() {
        return ((((player.n.number.add(1)).log(1.1)).add(1)).log(1.1)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		21: {
		title: "Empower",
		description: "x3 Numerical Energy gained.",
		cost: new Decimal(3),
		unlocked() {return hasMilestone("n",1) }
		},
		22: {
		title: "Complex Numbers",
		description: "The number has the same effect as ONE",
		cost: new Decimal(9),
		 effect() {
        return ((player.n.number.add(1)).log(1.1)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return hasMilestone("n",1) }
		},
		23: {
		title: "Passive Income",
		description: "Automatically gain starting value",
		cost: new Decimal(12),
		unlocked() {return hasMilestone("n",1) }
		},
		31: {
		title: "QUATERNIONS???",
		description: "Number gain is multiplied by values",
		cost: new Decimal(50),
		effect() {
        return ((player.points).add(200)).log(1.01)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		unlocked() {return hasUpgrade("n",21) && hasUpgrade("n",22) && hasUpgrade("n",23) }
		},
	},
	milestones: {
		0: {
			requirementDescription: "5 Numerical Energy",
				done() { return player.n.points.gte(5)},
				effectDescription: "Keep Starting Value upgrades on reset.",
		},
		1: {
			requirementDescription: "8 Numerical Energy",
				done() { return player.n.points.gte(8)},
				effectDescription: "Unlock new upgrades for Numerical Energy and Multipliers."
		},
	},
	tabFormat: ["main-display",
			"prestige-button",
			["display-text",
				function() {return 'The number is equal to ' + format(player.n.number) + ', which boosts Value generation by '+format(tmp.n.numberMult)+'x'},
					{}],
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
    layerShown(){return true},
})
addLayer("m", {
		branches: ['p'],
    name: "m", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#85db4b",
    unlockedFirst: false, 
    requires() { return new Decimal(200) }, // Can be a function that takes requirement increases into account
    resource: "multipliers", // Name of prestige currency
    baseResource: "Values", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.3,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("n", 32)) mult = mult.div(upgradeEffect("n",22))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
				return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for Multipliers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effectBase() {
			let base = new Decimal(1.5);
			if (hasUpgrade('m',11)) base = base.add(0.1)
				if (hasUpgrade('m',12)) base = base.add(upgradeEffect('m', 12))
				if (hasUpgrade('m',13)) base = base.add(upgradeEffect('m', 13))
				if (hasUpgrade('m',21)) base = base.add(0.5)
				if (hasUpgrade('m',23)) base = base.add(upgradeEffect('m', 23))
				if (player.d.unlocked) base = base.add(tmp.d.dimensionPowBase)
			return base
		},
	effect() {
		let m = Decimal.pow(tmp.m.effectBase, player.m.points)
		if (player.m.points.eq(new Decimal("0"))) return 1
		if (inChallenge("ne",11)) {
			return m.div((player.points.add(1)).log(10).add(1)).add(1) // log10
		} else {
			if (hasUpgrade('m',22)) return m
		else if (hasMilestone('m',1)) return m.div((player.points.add(1)).log(10000).add(1)).add(1) //log10k
		else return m.div((player.points.add(1)).log(1000).add(1)).add(1) //log1k
		}
	},
		effectDescription() {
			return "which is boosting Value generation by "+format(tmp.m.effect)+"x"
		},
	findDivider() {
		if (player.m.points.eq(new Decimal("0"))) return player.m.divider = 1
		if (inChallenge("ne",11)) {
			player.m.divider = (player.points.add(1)).log(10).add(1) // log10
		} else {
			if (hasUpgrade('m',22)) player.m.divider = 1
		else if (hasMilestone('m',1)) player.m.divider = (player.points.add(1)).log(10000).add(1) //log10k
		else player.m.divider = (player.points.add(1)).log(1000).add(1) //log1k
		}
	},
	upgrades: {
		11: {
		title: "Addition to Multiplication",
		description: "+0.1 to the Multiplier's base.",
		cost: new Decimal(3),
		},
		12: {
		title: "MOAR!!",
		description: "Starting Values add to Multiplier's base.",
		cost: new Decimal(5),
		 effect() {
        return ((((player.p.points.add(1)).log10()).add(1)).log10())
		 },
		  effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id)) },
		},
		13: {
		title: "GOD STOP STEALING MY NUMBERLINE",
		description: "The Number adds to Multiplier's base.",
		cost: new Decimal(8),
		 effect() {
        return (((player.n.number.add(1)).log(5000)).pow(3)).div(10)
		 },
		  effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))},
		},

		21: {
		title: "More Addition!!!!",
		description: "+0.5 to the multiplier's base",
		cost: new Decimal(5),
		unlocked() {return hasMilestone("n",1) }
		},
		22: {
		title: "Explosion",
		description: "Multiplier's boost is not divided by values.",
		cost: new Decimal(9),
		unlocked() {return hasMilestone("n",1) }
		},
		23: {
		title: "Repetition",
		description: "Multipliers add to their own base.",
		cost: new Decimal(15),
		 effect() {
        return (player.m.points.add(1).log(100)).pow(0.5)
		 },
		  effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))},
		  unlocked() {return hasMilestone("n",1) }
		},
	},
	autoPrestige() { return (hasMilestone("m", 1) && player.m.auto) },
	milestones: {
		0: {
			requirementDescription: "5 Multipliers",
				done() { return player.m.points.gte(5)},
				effectDescription: "Keep Starting Value upgrades on reset.",
		},
		1: {
			requirementDescription: "8 Multipliers",
				done() { return player.m.points.gte(8)},
							effectDescription: "The Point Division is weakened.",
		},
	},
    layerShown(){return true},
	tabFormat: ["main-display",
				["display-text",
				function() {return 'Values are dividing the Multiplier buff by ' + format(player.m.divider) + ' (before adding 1).'},
					{}],
				"blank",
			"prestige-button",
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
})
addLayer("po", {
		branches: ['n'],
		nodeStyle() { return {
			color: ("rgba(0, 0, 0, 0.5)"),
		}},
    name: "p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", /////////////////the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#e1d675",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "positive", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(0.5).pow(5), // Prestige currency exponent
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
    layerShown(){if (player.n.unlocked) return true
	else return true} 
})
addLayer("ne", {
nodeStyle() { return {
			color: ("rgba(255, 255, 255, 0.5)"),
		}},
		branches: ['n'],
    name: "ne", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NE", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1a1936",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "Negatives", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(0.5).pow(5), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "N", description: "Shift+N: Reset for Negatives", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
challenges: {
    rows: 4,
    cols: 2,
    11: {
        name: "Divisors",
        challengeDescription: "Multiplier division effect is buffed. Multiplier Milestone 2 and Repitition are useless.",
        goal: new Decimal(1e35),
		rewardEffect() {
			return (player.ne.points.add(1)).log(100)
		},
		rewardDisplay() {
			return " +"+format(this.rewardEffect())
		},
		rewardDescription: "Negatives add to the Multiplier Base.",
    },
	12: {
        name: "Start and End",
        challengeDescription: "Values decrease Starting Value gain.",
        goal: new Decimal(1e10),
		rewardEffect() {
			return player.ne.points.log(100)
		},
		rewardDisplay() {
			return " +"+format(this.rewardEffect())
		},
		rewardDescription: "Values multiply Starting Value gain.",
    },
	21: {
        name: "Test",
        challengeDescription: "Test",
        goal: new Decimal(100),
    },
	22: {
        name: "Test",
        challengeDescription: "Test",
        goal: new Decimal(100),
    },
	31: {
        name: "Test",
        challengeDescription: "Test",
        goal: new Decimal(100),
    },
	32: {
        name: "Test",
        challengeDescription: "Test",
        goal: new Decimal(100),
    },
	41: {
        name: "Negative Conglomeration",
        challengeDescription: "This counts as EVERY Negative Challenge up to this point.",
        goal: new Decimal(100),
    },
},
    layerShown(){if (player.n.unlocked) return true
	else return true}
})
addLayer("i", {
		branches: ['n','m'],
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
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
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
        return player.points.add(1).pow(new Decimal(0.75).times(player.n.points))
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"+" },
		},
	},

layerShown(){return true}, //player.n.unlocked&&player.m.unlocked
})
addLayer("d", {
		branches: ['m'],
    name: "d", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
    }},
    color: "#b92ce8",
    requires: new Decimal("1e100"), // Can be a function that takes requirement increases into account
    resource: "Dimensions", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("d", 11)) mult = mult.times(2)
        return mult
    },
	effect() {
		effect = new Decimal(10)
		effect = (effect.pow(player.d.points).root(player.d.power.add(1).log(100).add(1)))
		if (hasUpgrade("d", 13)) effect = effect.times(upgradeEffect('d', 13))
			if (hasUpgrade("d", 11)) effect = effect.times(2)
				
		return effect.sub(1)
	},
	metaEffect() {
		effect = new Decimal(10)
		effect = (effect.pow(player.d.points).root(player.d.power.add(1).log(2).add(1)))
		return effect.sub(1)
	},
	dimensionPow() {
		effect = player.d.power
		effect = effect.mul((player.m.points.add(1.5)).log(5))
		effect = effect.pow(1.01)
		return effect.add(1)
	},
	dimensionPowBase() {
		effect = player.d.power
		effect = effect.log(100)
		effect = effect.pow(0.1)
		return effect
	},
	effectDescription() {
		return "that generate "+format(tmp.d.effect)+" Dimensional Power every second."
	},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
	update(diff) {
		if (player.d.unlocked) player.d.power = player.d.power.add(tmp.d.effect.div(20))
	},
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		11: {
		title: "Dimensional Boost",
		description: "x2 Dimensional power and x2 Dimensions",
		cost: new Decimal(10),
		},
		//12: {
		//title: "Dimensional Upgrade",
		//description: "Dimensional Power's buff is buffed by the Upgrader Buff",
		//cost: new Decimal(20),
		 //effect() {
       // return ((tmp.m.effect).pow(0.25))
		// },
		//  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		//},
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
        return(tmp.d.effect.pow(0.125)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
	buyables: {
		11: {
cost(x) { return new Decimal(100).pow(x || getBuyableAmount(this.layer, this.id).add(1)) },
title: "Meta Dimension",
        display() { return "Buy one Meta Dimension. Meta Dimensions: "+getBuyableAmount(this.layer, this.id)+" Cost: "+this.cost()},
        canAfford() { return player[this.layer].points.gte(this.cost())		},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
		},
	},
    layerShown(){return true}, // player.m.unlocked
	tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.d.power) + ' Dimensional Power, which boosts Point generation by '+format(tmp.d.dimensionPow)+'x, and increases the Multiplier base by '+format(tmp.d.dimensionPowBase)+'.'},
					{}],
			"blank",
		 "milestones", "upgrades", "buyables", "blank"],
})
addLayer("sn", {
		branches: ['n'],
    name: "sn", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#a30f2f",
    requires: new Decimal("150"), // Can be a function that takes requirement increases into account
    resource: "Super Numerical Energy", // Name of prestige currency
    baseResource: "Numerical Energy", // Name of resource prestige is based on
    baseAmount() {return player.n.points}, // Get the current amount of baseResource
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
        {key: "N", description: "Press Shift+N to preform a Super Exponential Reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effect() {
		effect = new Decimal(player.n.points)
		effect = effect.pow(player.sn.points)
		return effect
	},
	effectDescription() {
			return "which are multiplying the Exponentials boost by "+format(tmp.sn.effect)+"x"
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
    layerShown(){return true} //player.po.unlocked&&player.ne.unlocked
})
addLayer("sm", {
		branches: ['m'],
    name: "sm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 7, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4a9418",
    requires: new Decimal("150"), // Can be a function that takes requirement increases into account
    resource: "Super Multipliers", // Name of prestige currency
    baseResource: "Multipliers", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
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
    layerShown(){return true} //player.d.unlocked
})
addLayer("l", {
		branches: ['sn'],
    name: "l", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#4b0099",
    requires: new Decimal("25"),
    resource: "Lunar Shards",
    baseResource: "Super Exponentials",
    baseAmount() {return player.sn.points}, // Get the current amount of baseResource
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
    layerShown(){return true} //player.sn.unlocked
})
addLayer("z", {
		branches: ['ne','po'],
    name: "z", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Z", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#8F8F8F",
    requires: new Decimal("1e50"),
    resource: "Zeros", // Name of prestige currency
    baseResource: "P/NE Product", // Name of resource prestige is based on
    baseAmount() {return player.ne.points.mul(player.po.points)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal("0.01").mul(new Decimal("0.6666")), // Prestige currency exponent
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
    layerShown(){return true} //player.n.unlocked&&player.po.unlocked&&player.sn.unlocked
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
    color: "#8400ff",
    requires: new Decimal(Number.MAX_VALUE), // Can be a function that takes requirement increases into account
    resource: "Eternities", // Name of prestige currency
    baseResource: "Infinities", // Name of resource prestige is based on
    baseAmount() {return player.i.points}, // Get the current amount of baseResource
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
    layerShown(){return true} //player.i.unlocked
})
addLayer("ma", {
		branches: ['d','i'],
    name: "ma", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#80d9ed",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "Manifolds", // Name of prestige currency
    baseResource: "Dimension Power", // Name of resource prestige is based on
    baseAmount() {return player.d.power}, // Get the current amount of baseResource
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
    layerShown(){return true} //player.i.unlocked&&player.d.unlocked?, change this later
})
addLayer("s", {
		branches: ['sm'],
    name: "s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ffc038",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "Solar Shards",
    baseResource: "Super Multipliers", // Name of resource prestige is based on
    baseAmount() {return player.sm.points}, // Get the current amount of baseResource
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
    layerShown(){return true} //player.sm.unlocked
})
addLayer("da", {
		branches: ['l'],
		nodeStyle() { return {
			color: ("rgba(255, 255, 255, 0.5)"),
		}},
    name: "da", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#400000",
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
addLayer("li", {
		branches: [['s',2]],
    name: "li", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "LI", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ffff8f",
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
addLayer("c", {
		branches: ['z',['ma',2]],
    name: "c", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#33bd2a",
    requires: new Decimal("1e20"), // Can be a function that takes requirement increases into account
    resource: "Constructs", // Name of prestige currency
    baseResource: "Manifolds", // Name of resource prestige is based on
    baseAmount() {return player.ma.points}, // Get the current amount of baseResource
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
addLayer("an", {
		branches: ['et',['d',3]],
		nodeStyle() {return {
			"background": ((player.an.unlocked||canReset("an"))?"radial-gradient(#ffff00, #00ffff)":"#bf8f8f") ,
        }},
    name: "an", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
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
addLayer("eq", {
		branches: [['li',2],['da',2]],
		nodeStyle() {return {
			"background": ((player.eq.unlocked||canReset("eq"))?"radial-gradient(#ffffff, #000000)":"#bf8f8f") ,
        }},
    name: "eq", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EQ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#808080",
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
addLayer("hn", {
		branches: [['sn',1],['da',1]],
    name: "hn", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "Hyper Numerical Energy", // Name of prestige currency
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
addLayer("V", {
		branches: ['z'],
    name: "hn", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "Voids", // Name of prestige currency
    baseResource: "Zeroes", // Name of resource prestige is based on
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
addLayer("st", {
		branches: [['s',3],['l',3],['et',3]],
    name: "st", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ST", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0d1866",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "Stars", // Name of prestige currency
    baseResource: "Lunar Shards, Solar Shards, and Eternities.", // Name of resource prestige is based on
    baseAmount() {return new Decimal(1e100)}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	req: {l: new Decimal(1e100), s: new Decimal(1e100), et: new Decimal(100)},
	requires() {return this.req},
	exp() { return {l: new Decimal(0.125), s: new Decimal(0.125), et: new Decimal(1)}},
	exponent() { return tmp[this.layer].exp },
	 gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
			let gain = (player.l.points.div(tmp.st.req.l).pow(tmp.st.exp.l).times(player.s.points.div(tmp.st.req.s).pow(tmp.st.exp.s))).times(player.et.points.div(tmp.st.req.et).pow(tmp.st.exp.et));
			return (gain.times(tmp.st.gainMult).floor()).pow(tmp.st.gainExp).floor();
		},
	resetGain() { return this.getResetGain() },
	getNextAt() {
			let gain = tmp.st.getResetGain.div(tmp.st.gainMult).root(tmp.st.gainExp)
			let next = {l: gain.sqrt().root(tmp.st.exp.l).times(tmp.st.req.l), s: gain.sqrt().root(tmp.st.exp.s).times(tmp.st.req.s),  et: gain.sqrt().root(tmp.st.exp.et).times(tmp.st.req.et)};
			return next;
		},
		canReset() {
			return player.l.points.gte(tmp.st.req.l) && player.s.points.gte(tmp.st.req.s) && tmp.st.getResetGain.gt(0) 
		},
		prestigeButtonText() {
		return `${ player.hn.points.lt(1e3) ? (tmp.st.resetDescription !== undefined ? tmp.st.resetDescription : "Reset for ") : ""}+<b>${formatWhole(tmp.st.getResetGain)}</b> ${tmp.st.resource} ${tmp.st.resetGain.lt(100) && player.st.points.lt(1e3) ? `<br><br>Approx next at ${ ('Solar Shards: '+format(tmp.st.nextAt.s)+', Lunar Shards: '+format(tmp.st.nextAt.l)+', Eternities: '+format(tmp.st.nextAt.et))}` : ""}`
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
addLayer("hm", {
		branches: [['sm',2],['li',1]],
    name: "hm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "HM", // This appears on the layer's node. Default is the id with the first letter capitalized
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
            },
			12: {
                name: "Gain MORE",
                done() { return player.n.unlocked },
                tooltip: "Unlock Numerical Energy",
            },
			13: {
                name: "No replicanti?",
                done() { return player.m.unlocked },
                tooltip: "Unlock Multipliers",
            },
			14: {
                name: "The most generic row in a generic tree",
                done() { return player.m.unlocked&&player.n.unlocked },
                tooltip: "Unlock all row 2 stats. Reward: Get 1 Starting Value upgrade.",
            },
			15: {
                name: "Starting Values also aren't free",
                done() { return player.p.points.gte(100) },
                tooltip: "Get 100 Starting Values.",
            },
			16: {
                name: "oh god no",
                done() { return player.p.points.gte("1e10") },
                tooltip: "Get 1e10 Starting Values. Reward: new upgrades for starting values",
            },
			17: {
                name: "The first one doesn't have to be free^25",
                done() { return player.points.gte("1e50") },
                tooltip: "Get 1e50 Points.",
            },
			21: {
                name: "Additive",
                done() { return player.po.points.unlocked },
                tooltip: "Unlock Positives. Reward: x2 to the Exponential Buff",
            },
			22: {
                name: "Subtractive",
                done() { return player.ne.points.unlocked },
                tooltip: "Unlock Negatives. Reward: x2 to point gain.",
            },
			23: {
                name: "N-Dimensional",
                done() { return player.d.points.unlocked},
                tooltip: "Unlock Dimensions. Reward: x2 to Upgrader Buff",
            },
			24: {
                name: "Let me guess, costs like, 2 values?",
                done() { return player.i.points.unlocked },
                tooltip: "Unlock Infinities. Reward: x2 gain to Dimensions, Positives, and Negatives.",
            },
			25: {
                name: "I can't start...",
                done() { return player.p.best.eq(0) && player.points.gte(1e250)},
                tooltip: "Get 1e250 Values without any Starting values.",
            },
			26: {
                name: "Googology???",
                done() { return player.sn.points.unlocked },
                tooltip: "Unlock Super Numerical Energy. Reward: Negativity and Positivity boost eachothers gain.",
            },
			27: {
                name: "Replicanti 2: Electric Boogaloo",
                done() { return player.sm.points.unlocked },
                tooltip: "Unlock Super Multipliers. Reward: still don't know yet",
            },
			31: {
                name: "Oh wow you really did that woah that's really cool wow",
                done() { return player.l.unlocked||player.z.unlocked||player.et.unlocked||player.s.unlocked },
                tooltip: "Do a 4th row reset. Reward: x4 Points gained.",
            },
			32: {
                name: "Eternally only worth 2 values",
                done() { return player.et.points.unlocked },
                tooltip: "Unlock Eternities. Reward: x1.5 Infinities and Big Crunch hardcap is now 2.",
            },
			33: {
                name: "Positives and Negatives Round 2",
                done() { return player.l.unlocked&&player.s.unlocked },
                tooltip: "Get Lunars and Solars. Reward: x2 to the Super Upgraders and Super Exponential Buffs.",
            },
			34: {
                name: "Oh wow you went beyond just really cool",
                done() { return player.l.unlocked&&player.z.unlocked&&player.et.unlocked&&player.s.unlocked },
                tooltip: "Get all 4th row stats. Reward: x4 2nd row stats gained.",
				
            },
			77:{
                name: "Whats 9 + 10",
                done() { return player.points.gte("1e1e21") },
                tooltip: "Get 1e1e21 Values.",
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