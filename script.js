// Game Variables
let pepeFollowers = 0;
let followersPerSecond = 0;
let clickPower = 1;
let clickUpgradeCost = 50;
let mrBeastFollowers = 491000000;

// Passive Upgrades List
let upgrades = {
    1: { name: "Create a Meme", cost: 15, fpsBonus: 1, count: 0 },
    2: { name: "Viral Video", cost: 100, fpsBonus: 10, count: 0 },
    3: { name: "Collab Stream", cost: 1100, fpsBonus: 100, count: 0 },
    4: { name: "Pepe Crypto Coin", cost: 12000, fpsBonus: 1000, count: 0 },
    5: { name: "World Tour", cost: 130000, fpsBonus: 10000, count: 0 },
    6: { name: "Buy Twitter (X)", cost: 1500000, fpsBonus: 100000, count: 0 }
};

const pepeCountDisplay = document.getElementById("pepe-count");
const beastCountDisplay = document.getElementById("beast-count");
const fpsCountDisplay = document.getElementById("fps-count");
const clickPowerDisplay = document.getElementById("click-power-count");
const pepeImg = document.getElementById("pepe-img");

// Load the saved game on start
loadGame();

// Clicking on Pepe image
pepeImg.addEventListener("click", () => {
    pepeFollowers += clickPower; // Earn based on current click power
    updateUI();
});

// Buying Click Power Upgrade
function buyClickUpgrade() {
    if (pepeFollowers >= clickUpgradeCost) {
        pepeFollowers -= clickUpgradeCost;
        clickPower += 1; // Increase click power by 1
        clickUpgradeCost = Math.round(clickUpgradeCost * 1.5); // Click upgrade cost increases by 50%
        
        document.getElementById("upgrade0-btn").innerText = `Cost: ${clickUpgradeCost.toLocaleString()} followers`;
        
        updateUI();
        saveGame();
    } else {
        alert("You don't have enough followers!");
    }
}

// Buying Passive Upgrades
function buyUpgrade(id) {
    let upgrade = upgrades[id];
    
    if (pepeFollowers >= upgrade.cost) {
        pepeFollowers -= upgrade.cost;
        followersPerSecond += upgrade.fpsBonus;
        upgrade.count++;
        upgrade.cost = Math.round(upgrade.cost * 1.15); // Cost increases by 15%
        
        document.getElementById(`upgrade${id}-btn`).innerText = `Cost: ${upgrade.cost.toLocaleString()} followers`;
        
        updateUI();
        saveGame();
    } else {
        alert("You don't have enough followers!");
    }
}

// Updating the UI numbers
function updateUI() {
    pepeCountDisplay.innerText = Math.floor(pepeFollowers).toLocaleString();
    beastCountDisplay.innerText = Math.floor(mrBeastFollowers).toLocaleString();
    fpsCountDisplay.innerText = followersPerSecond.toLocaleString();
    clickPowerDisplay.innerText = clickPower.toLocaleString();
    
    if (pepeFollowers >= mrBeastFollowers && mrBeastFollowers !== Infinity) {
        alert("Unbelievable! Pepe has overtaken MrBeast and became the King of the Internet! 🐸👑");
        mrBeastFollowers = Infinity;
    }
}

// Save Game Function
function saveGame() {
    let gameSave = {
        pepeFollowers: pepeFollowers,
        followersPerSecond: followersPerSecond,
        clickPower: clickPower,
        clickUpgradeCost: clickUpgradeCost,
        mrBeastFollowers: mrBeastFollowers,
        upgrades: upgrades
    };
    localStorage.setItem("pepeClickerSave", JSON.stringify(gameSave));
}

// Load Game Function
function loadGame() {
    let savedData = localStorage.getItem("pepeClickerSave");
    if (savedData) {
        let save = JSON.parse(savedData);
        pepeFollowers = save.pepeFollowers;
        followersPerSecond = save.followersPerSecond;
        clickPower = save.clickPower || 1;
        clickUpgradeCost = save.clickUpgradeCost || 50;
        mrBeastFollowers = save.mrBeastFollowers || 491000000;
        
        // Update click upgrade button text
        document.getElementById("upgrade0-btn").innerText = `Cost: ${clickUpgradeCost.toLocaleString()} followers`;
        
        // Update passive upgrades data and button texts
        if (save.upgrades) {
            upgrades = save.upgrades;
            for (let id in upgrades) {
                let btn = document.getElementById(`upgrade${id}-btn`);
                if (btn) {
                    btn.innerText = `Cost: ${upgrades[id].cost.toLocaleString()} followers`;
                }
            }
        }
        updateUI();
    }
}

// Reset Game Function
function resetGame() {
    if (confirm("Are you sure you want to reset all your progress and start over?")) {
        localStorage.removeItem("pepeClickerSave");
        location.reload();
    }
}

// Main Game Loop (Runs 10 times per second)
setInterval(() => {
    if (followersPerSecond > 0) {
        pepeFollowers += (followersPerSecond / 10);
    }
    
    if (mrBeastFollowers !== Infinity) {
        mrBeastFollowers += 0.2; // Gaining 2 per second
    }
    
    updateUI();
}, 100);

// Auto-save game every 30 seconds
setInterval(saveGame, 30000);
