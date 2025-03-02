let modInfo = {
	name: "The Generic Tree",
	id: "startingsave",
	author: "Buddy (ONLY WORKS TO ROW 3. ACHIEVEMENTS WORK BUT NOTHING ELSE FOR ROW 4+)",
	pointsName: "Value",
	modFiles: ["layers.js", "tree.js"],

	discordName: "there is no server for this",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 48,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3",
	name: "The Morbidly Obese Update"
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3</h3><br>
		- replaced the entirety of row/layer 2 <br>
		- row/layer 3 is unlockable but still wip... going to release soon!`

let winText = `Wow you actually did that`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything","display"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('p', 11)) gain = gain.times(1.5)
		if (hasUpgrade('p', 12)) gain = gain.times(upgradeEffect('p', 12))
					if (hasUpgrade('p', 13)) gain = gain.times(upgradeEffect('p', 13))
					if (hasUpgrade('p', 23)) gain = gain.times(upgradeEffect('p', 23))
						if (hasUpgrade('m', 23)) gain = gain.times(upgradeEffect('m', 23))
				if (player.n.unlocked) gain = gain.times(tmp.n.numberMult)
					if (player.m.unlocked) gain = gain.times(tmp.m.effect)
						if (player.d.unlocked) gain = gain.times(tmp.d.dimensionPow)
							//if (hasMilestone('u', 0)) gain = gain.times(1.2)
							//if (hasUpgrade('u', 21)) gain = gain.pow(1.1)
							if (player.i.unlocked) gain = gain.pow(buyableEffect('i',11))
						if (hasUpgrade('p', 32)) gain = gain.pow(1.05)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("eee33"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
