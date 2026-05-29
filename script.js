// Game Variables
let pepeFollowers = 0;
let followersPerSecond = 0;
let clickPower = 1;
let clickUpgradeCost = 50;
let mrBeastFollowers = 491000000;

// Skill Tree & Prestige Variables
let skillPoints = 0;
let rebirthsCount = 0;

let skills = {
    blue1: { purchased: false, cost: 1, req: null },
    blue2: { purchased: false, cost: 2, req: "blue1" },
    green1: { purchased: false, cost: 1, req: null },
    green2: { purchased: false, cost: 2, req: "green1" },
    red1: { purchased: false, cost: 1, req: null },
    red2: { purchased: false, cost: 2, req: "red1" }
};

// Passive Upgrades List
let upgrades = {
    1: { name: "Create a Meme", baseCost: 15, cost: 15, fpsBonus: 1, count: 0 },
    2: { name: "Viral Video", baseCost: 100, cost: 100, fpsBonus: 10, count: 0 },
    3: { name: "Collab Stream", baseCost: 1100, cost: 1100, fpsBonus: 100, count: 0 },
    4: { name: "Pepe Crypto Coin", baseCost: 12000, cost: 12000, fpsBonus: 1000, count: 0 },
    5: { name: "World Tour", baseCost: 130000, cost: 130000, fpsBonus: 10000, count: 0 },
    6: { name: "Buy Twitter (X)", baseCost: 1500000, cost: 1500000, fpsBonus: 100000, count: 0 }
};

const pepeCountDisplay = document.getElementById("pepe-count");
const beastCountDisplay = document.getElementById("beast-count");
const fpsCountDisplay = document.getElementById("fps-count");
const clickPowerDisplay = document.getElementById("click-power-count");
const spCountDisplay = document.getElementById("sp-count");
const beastGrowthRateDisplay = document.getElementById("beast-growth-rate");
const rebirthBtn = document.getElementById("rebirth-btn");
const pepeImg = document.getElementById("pepe-img");

// NEW: Tabs Switching Function
function switchTab(tabId) {
    // Hide all contents
    document.getElementById("tab-shop").classList.remove("active-content");
    document.getElementById("tab-skills").classList.remove("active-content");
    document.getElementById("tab-shop-btn").classList.remove("active");
    document.getElementById("tab-skills-btn").classList.remove("active");

    // Show selected content
    if (tabId === 'shop') {
        document.getElementById("tab-shop").classList.add("active-content");
        document.getElementById("tab-shop-btn").classList.add("active");
    } else if (tabId === 'skills') {
        document.getElementById("tab-skills").classList.add("active-content");
        document.getElementById("tab-skills-btn").classList.add("active");
    }
}

loadGame();

// Clicking Logic
pepeImg.addEventListener("click", () => {
    let gained = clickPower;
    if (skills.blue1.purchased) gained *= 2;
    if (skills.blue2.purchased) {
        if (Math.random() < 0.05) gained *= 10;
    }
    pepeFollowers += gained;
    updateUI();
});

// Click Upgrade
function buyClickUpgrade() {
    let activeCost = getModifiedCost(clickUpgradeCost);
    if (pepeFollowers >= activeCost) {
        pepeFollowers -= activeCost;
        clickPower += 1;
        clickUpgradeCost = Math.round(clickUpgradeCost * 1.5);
        updateUI();
        saveGame();
    } else {
        alert("You don't have enough followers!");
    }
}

// Buying Passive Upgrades
function buyUpgrade(id) {
    let upgrade = upgrades[id];
    let activeCost = getModifiedCost(upgrade.cost);
    
    if (pepeFollowers >= activeCost) {
        pepeFollowers -= activeCost;
        upgrade.count++;
        upgrade.cost = Math.round(upgrade.baseCost * Math.pow(1.15, upgrade.count));
        updateUI();
        saveGame();
    } else {
        alert("You don't have enough followers!");
    }
}

function getModifiedCost(originalCost) {
    if (skills.green1.purchased) return Math.round(originalCost * 0.85);
    return originalCost;
}

// Skill Tree Purchases
function buySkill(id) {
    let skill = skills[id];
    if (skill.purchased) return;
    if (skill.req && !skills[skill.req].purchased) {
        alert("You must unlock the previous skill first!");
        return;
    }
    
    if (skillPoints >= skill.cost) {
        skillPoints -= skill.cost;
        skill.purchased = true;
        if (id === "red2") mrBeastFollowers = Math.max(0, mrBeastFollowers - 10000000);
        
        updateUI();
        updateSkillTreeUI();
        saveGame();
    } else {
        alert("Not enough Skill Points!");
    }
}

// Rebirth
function triggerRebirth() {
    if (pepeFollowers >= 100000) {
        if (confirm("Reset progress for 1 Skill Point?")) {
            skillPoints += 1;
            rebirthsCount += 1;
            pepeFollowers = 0;
            clickPower = 1;
            clickUpgradeCost = 50;
            
            for (let id in upgrades) {
                upgrades[id].count = 0;
                upgrades[id].cost = upgrades[id].baseCost;
            }
            
            updateUI();
            updateSkillTreeUI();
            saveGame();
        }
    } else {
        alert("You need 100,000 followers!");
    }
}

function updateUI() {
    let calculatedFPS = 0;
    for (let id in upgrades) {
        calculatedFPS += upgrades[id].count * upgrades[id].fpsBonus;
    }
    if (skills.green2.purchased) calculatedFPS = Math.round(calculatedFPS * 1.25);
    followersPerSecond = calculatedFPS;

    document.getElementById("upgrade0-btn").innerText = `${getModifiedCost(clickUpgradeCost).toLocaleString()}`;
    for (let id in upgrades) {
        let btn = document.getElementById(`upgrade${id}-btn`);
        if (btn) btn.innerText = `${getModifiedCost(upgrades[id].cost).toLocaleString()}`;
    }

    pepeCountDisplay.innerText = Math.floor(pepeFollowers).toLocaleString();
    beastCountDisplay.innerText = Math.floor(mrBeastFollowers).toLocaleString();
    fpsCountDisplay.innerText = followersPerSecond.toLocaleString();
    clickPowerDisplay.innerText = clickPower.toLocaleString();
    spCountDisplay.innerText = skillPoints;

    let beastSpeed = skills.red1.purchased ? 1 : 2;
    beastGrowthRateDisplay.innerText = beastSpeed;

    if (pepeFollowers >= 100000) {
        rebirthBtn.style.background = "#e91e63";
    } else {
        rebirthBtn.style.background = "#7b1fa2";
    }

    if (pepeFollowers >= mrBeastFollowers && mrBeastFollowers !== Infinity) {
        alert("Pepe wins! 🐸👑");
        mrBeastFollowers = Infinity;
    }
}

function updateSkillTreeUI() {
    for (let id in skills) {
        let btn = document.getElementById(`skill-${id}`);
        if (!btn) continue;

        if (skills[id].purchased) {
            btn.className = "unlocked";
            btn.innerText = "UNLOCKED";
        } else if (skills[id].req && !skills[skills[id].req].purchased) {
            btn.className = "locked";
        } else {
            btn.className = "";
        }
    }
}

function saveGame() {
    let gameSave = {
        pepeFollowers: pepeFollowers,
        clickPower: clickPower,
        clickUpgradeCost: clickUpgradeCost,
        mrBeastFollowers: mrBeastFollowers,
        skillPoints: skillPoints,
        rebirthsCount: rebirthsCount,
        skills: skills,
        upgrades: upgrades
    };
    localStorage.setItem("pepeClickerAdvancedSave", JSON.stringify(gameSave));
}

function loadGame() {
    let savedData = localStorage.getItem("pepeClickerAdvancedSave");
    if (savedData) {
        let save = JSON.parse(savedData);
        pepeFollowers = save.pepeFollowers || 0;
        clickPower = save.clickPower || 1;
        clickUpgradeCost = save.clickUpgradeCost || 50;
        mrBeastFollowers = save.mrBeastFollowers || 491000000;
        skillPoints = save.skillPoints || 0;
        rebirthsCount = save.rebirthsCount || 0;
        
        if (save.skills) skills = save.skills;
        if (save.upgrades) upgrades = save.upgrades;
    }
    updateUI();
    updateSkillTreeUI();
}

function resetGame() {
    if (confirm("Reset everything?")) {
        localStorage.removeItem("pepeClickerAdvancedSave");
        location.reload();
    }
}

setInterval(() => {
    if (followersPerSecond > 0) pepeFollowers += (followersPerSecond / 10);
    if (mrBeastFollowers !== Infinity) mrBeastFollowers += (skills.red1.purchased ? 0.1 : 0.2);
    updateUI();
}, 100);

setInterval(saveGame, 30000);
