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
		if (hasUpgrade('p',32)) mult = mult.add(upgradeEffect('p', 32))
		if (hasUpgrade('n',12)) mult = mult.add(upgradeEffect('n', 12))
		if (hasUpgrade('p',21)) mult = mult.add(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	exp = new Decimal(1)
	if (hasUpgrade('p',23)) exp = exp.add(0.1)
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
		description: "The value of starting values multiplies the value of Values",
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
		description: "The value of Values multiplies the value of Values",
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
		description: "Point gain is squared.",
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
    color: "#df2049",  //#ff0339
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
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
		if (hasUpgrade("p", 31)) mult = mult.add(1)
			   return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for numerical energy.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	effect() {
		let base = new Decimal(player.n.points);
		base = Decimal.pow(base,0.5)
		if (hasUpgrade('n',11)) base = base.times(2)
			if (hasUpgrade('n',13)) base = base.times(upgradeEffect('n', 13))
		if (hasUpgrade('n',31)) base = base.times(upgradeEffect('n', 31))
			return base
		},
		effectDescription() {
			return "which are increasing the number by +"+format(tmp.n.effect)+"/tick??? (unknown if true)"
		},
	numberMult() {
		base = new Decimal(player.n.number);
			return Decimal.pow(1.15,(base.add(1).log(2)))
		},
		update(diff) {
		if (player.n.unlocked) player.n.number = player.n.number.add(tmp.n.effect)
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
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
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
		description: "The number buffs P12's effect",
		cost: new Decimal(9),
		 effect() {
        return (player.n.number.add(1)).log(1.1)
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
		description: "Number gain is multiplied by points",
		cost: new Decimal(50),
		effect() {
        return (player.points).log(1.01)
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
				function() {return 'The number is equal to ' + format(player.n.number) + ', which boosts Point generation by '+format(tmp.n.numberMult)+'x'},
					{}],
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
    layerShown(){return true}
})
addLayer("m", {
		branches: ['p'],
    name: "m", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		divider: new Decimal(0),
    }},
    color: "#57b319",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
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
				if (hasUpgrade('m',22)) base = base.times(1.1)
			return base
		},
	effect() {
		let m = Decimal.pow(tmp.m.effectBase, player.m.points)
			
			if (hasUpgrade("m",22)) return m
		else 
			if (hasMilestone("m",1)) return m.div((player.points).div((player.m.points.add(1)).times(10000)).add(1)).add(1)
		else return m.div((player.points).div((player.m.points.add(1)).times(1000)).add(1)).add(1)
		},
		effectDescription() {
			return "which is boosting Value generation by "+format(tmp.m.effect)+"x"
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
        return ((((player.p.points.add(1)).log10()).add(1)).log10()).add(1)
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
		description: "Multiplier's boost is not divided by points.",
		cost: new Decimal(9),
		unlocked() {return hasMilestone("n",1) }
		},
		23: {
		title: "Repetition",
		description: "Each multiplier gives a x2 point gain (n multipliers gives a buff of 2^n)",
		cost: new Decimal(15),
		 effect() {
        return new Decimal(2).pow(player.m.points)
		 },
		  effectDisplay() { return "x"+format(upgradeEffect(this.layer, this.id))},
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
			"prestige-button",
			"blank",
		 "milestones", "blank", "blank", "upgrades"],
})
addLayer("po", {
		branches: ['n'],
		nodeStyle() { return {
			color: (player.po.unlocked?"rgba(0, 0, 0, 1)":"rgba(0, 0, 0, 0.5)"),
		}},
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
    layerShown(){if (player.n.unlocked) return true
	else return false}
})
addLayer("ne", {
nodeStyle() { return {
			color: (player.ne.unlocked?"rgba(255, 255, 255, 1)":"rgba(0, 0, 0, 0.5)"),
		}},
		branches: ['n'],
    name: "ne", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NE", // This appears on the layer's node. Default is the id with the first letter capitalized
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
    layerShown(){if (player.n.unlocked) return true
	else return false}
})
addLayer("i", {
	nodeStyle() { return {
			background: (player.i.unlocked?"radial-gradient(#ff6400, #ff6400, #000000, #000000)":"rgba(191, 143, 143, 1)"),
			//animation: (),
}
		},
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

layerShown(){return player.n.unlocked&&player.m.unlocked},
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
    color: "#AA00FF",
    requires: new Decimal("1e100"), // Can be a function that takes requirement increases into account
    resource: "Dimensions", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasUpgrade("d", 11)) mult = mult.times(2)
        return mult
    },
	effect() {
		effect = new Decimal(2)
		effect = effect.pow(player.d.points.pow(0.01))
		if (hasUpgrade("d", 13)) effect = effect.times(upgradeEffect('d', 13))
			if (hasUpgrade("d", 11)) effect = effect.times(2)
		return effect.sub(1)
	},
	dimensionPow() {
		effect = player.d.power
		effect = effect.mul(player.m.points.add(1))
		effect = effect.pow(1.1)
		return effect.add(1)
	},
	effectDescription() {
		return "that generate "+format(tmp.d.effect)+" Dimensional Power every second."
	},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
	update(diff) {
		if (player.d.unlocked) player.d.power = player.d.power.add(tmp.d.effect)
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
    layerShown(){return player.m.unlocked},
	tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.d.power) + ' Dimensional Power, which boosts Point generation by '+format(tmp.d.dimensionPow)+'x'},
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
    color: "#0049bf",
    requires: new Decimal("100"), // Can be a function that takes requirement increases into account
    resource: "Super Exponentials", // Name of prestige currency
    baseResource: "Exponentials", // Name of resource prestige is based on
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
    layerShown(){return player.po.unlocked&&player.n.unlocked}
})
addLayer("su", {
		branches: ['m'],
    name: "su", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SU", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 7, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#bf00a3",
    requires: new Decimal("100"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
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
    layerShown(){return player.d.unlocked}
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
    color: "#0000FF",
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
    layerShown(){return player.sn.unlocked}
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
	nodeStyle() { return {
			color: (player.z.unlocked?"rgba(0, 0, 0, 1)":"rgba(0, 0, 0, 0.5)"),
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
    layerShown(){return player.n.unlocked&&player.po.unlocked&&player.sn.unlocked}
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
    layerShown(){return player.su.unlocked}
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
		branches: ['et',['su',2]],
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
addLayer("an", {
		branches: ['et',['d',3]],
    name: "an", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AN", // This appears on the layer's node. Default is the id with the first letter capitalized
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
    name: "in", // This is optional, only used in a few places, If absent it just uses the layer id.
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
                name: "incremental incremental???",
                done() { return player.n.unlocked },
                tooltip: "Unlock Numerical Energy",
				image: "images/achs/12.png",
            },
			13: {
                name: "No replicanti?",
                done() { return player.m.unlocked },
                tooltip: "Unlock Multipliers",
				image: "images/achs/13.png",
            },
			14: {
                name: "The most generic row in a generic tree",
                done() { return player.m.unlocked&&player.n.unlocked },
                tooltip: "Unlock all row 2 stats. Reward: get 3 new prestige upgrades for balancing lol",
				image: "images/achs/real14.png",
            },
			15: {
                name: "Did you even think starting values were free?",
                done() { return player.p.points.gte(100) },
                tooltip: "Get 100 Starting Values.",
				image: "images/achs/14.png",
            },
			16: {
                name: "oh god no",
                done() { return player.p.points.gte("1e10") },
                tooltip: "Get 1e10 Starting Values. Reward: new upgrades for starting values",
				image: "images/achs/real16.png",
            },
			17: {
                name: "That's pretty upbeat",
                done() { return player.po.points.unlocked },
                tooltip: "Unlock Positives. Reward: x2 to the Exponential Buff",
				image: "images/achs/15.png",
            },
			21: {
                name: ":sob:",
                done() { return player.ne.points.unlocked },
                tooltip: "Unlock Negatives. Reward: x2 to point gain.",
				image: "images/achs/16.png",
            },
			22: {
                name: "Dimensions Starting Point",
                done() { return player.d.points.unlocked},
                tooltip: "Unlock Dimensions. Reward: x2 to Upgrader Buff",
				image: "images/achs/17.png",
            },
			23: {
                name: "Let me guess, costs like, 2 values?",
                done() { return player.i.points.unlocked },
                tooltip: "Unlock Infinities. Reward: x2 gain to Dimensions, Positives, and Negatives.",
				image: "images/achs/21.png",
            },
			24: {
                name: "it was always exponential",
                done() { return player.sn.points.unlocked },
                tooltip: "Unlock Super Exponentials. Reward: ^1.1 Points",
				textStyle: {'color': '#ff0000'},
				image: "images/achs/real22.png",
            },
			25: {
                name: "Upgraders for Upgraders (which are upgrades for upgrades)",
                done() { return player.su.points.unlocked },
                tooltip: "Unlock Super Upgraders. Reward: 3 more Upgrader Upgrades",
				image: "images/achs/real23.png",
            },
			26: {
                name: "Oh wow you really did that woah that's really cool wow",
                done() { return player.l.unlocked||player.z.unlocked||player.et.unlocked||player.s.unlocked },
                tooltip: "Do a 4th row reset. Reward: x4 Points gained.",
				image: "images/achs/22.png",
            },
			27: {
                name: "Eternally only worth 2 values",
                done() { return player.et.points.unlocked },
                tooltip: "Unlock Eternities. Reward: x1.5 Infinities and Big Crunch hardcap is now 2.",
				image: "images/achs/23.png",
            },
			31: {
                name: "Oh wow you went beyond just really cool",
                done() { return player.l.unlocked&&player.z.unlocked&&player.et.unlocked&&player.s.unlocked },
                tooltip: "Get all 4th row stats. Reward: x4 2nd row stats gained.",
				image: "images/achs/24.png",
				
            },
			32: {
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