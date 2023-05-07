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
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
	exp = new Decimal(1)
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
			 else return player[this.layer].points.add(1).pow(0.2)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
			13: {
		title: "Value Inflation",
		description: "The value of Values multiplies the value of Values",
		cost: new Decimal(256),
		 effect() {
						 if (player.u.unlocked) return (player.points.add(1).pow(0.01)).add(tmp.u.effect)
        else return player.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		21: {
		title: "Exponentially Greater",
		description: "Starting Values are multiplied by Exponentials",
		cost: new Decimal(1024),
		 effect() {
        return (player.e.points.pow(0.1)).add(2)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
		22: {
		title: "Upgraded Starting Values",
		description: "Starting Values are multiplied by Upgraders",
		cost: new Decimal(1024),
		 effect() {
        return (player.e.points.pow(0.3333333)).add(1)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
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
    exponent: 1, // Prestige currency exponent
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
	effectBase() {
			let base = new Decimal(10);
			base = base.add(player.points.pow(0.05))
			return base
		},
	effect() {
		let m = Decimal.pow(tmp.e.effectBase, 2)
		if (hasUpgrade("e", 11)) m = m.times(2)
			return m
		},
		effectDescription() {
			return "which are boosting Value generation by +"+format(tmp.e.effect)
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
    exponent: 1, // Prestige currency exponent
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
	effect() {
		let base = new Decimal(1);
			base = base.times(player.u.points.pow(0.1))
			base = base.add(player.points.pow(0.5))
			return base
		},
		effectDescription() {
			return "which are boosting all Starting Value Upgrades by +"+format(tmp.u.effect)
		},
	upgrades: {
		11: {
		title: "Test",
		description: "Testingthat  this actually works",
		cost: new Decimal(100),
		 effect() {
        return player.p.points.add(1).pow(0.05)
		 },
		  effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
		},
	},
    layerShown(){return true}
})
addLayer("po", {
		branches: ['e'],
    name: "p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
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
    exponent: 1.5, // Prestige currency exponent
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
    layerShown(){return true}
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
    exponent: 1.5, // Prestige currency exponent
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
    layerShown(){return true}
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
    color: "#0000FF",
    requires: new Decimal(Number.MAX_VALUE), // Can be a function that takes requirement increases into account
    resource: "Infinities", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    layerShown(){return true}
})
addLayer("d", {
		branches: ['u'],
    name: "d", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#0000FF",
    requires: new Decimal("1e12"), // Can be a function that takes requirement increases into account
    resource: "negative", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    layerShown(){return true}
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
    resource: "negative", // Name of prestige currency
    baseResource: "Super Exponentials", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    layerShown(){return true}
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
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    layerShown(){return true}
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
    requires: new Decimal("5"), // Can be a function that takes requirement increases into account
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.se.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    requires: new Decimal("1e9"), // Can be a function that takes requirement increases into account
    resource: "Zeros", // Name of prestige currency
    baseResource: "Negatives and Positives (VALUE IS ADDED)", // Name of resource prestige is based on
    baseAmount() {return player.n.points.add(player.po.points)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
addLayer("et", {
		branches: ['i'],
    name: "et", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ET", // This appears on the layer's node. Default is the id with the first letter capitalized
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
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    resource: "super", // Name of prestige currency
    baseResource: "Upgraders", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
    exponent: 1.5, // Prestige currency exponent
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
