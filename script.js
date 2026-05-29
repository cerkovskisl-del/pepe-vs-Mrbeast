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

loadGame();

// Clicking Loģika (Ar Blue 1 un Blue 2 prasmēm)
pepeImg.addEventListener("click", () => {
    let gained = clickPower;
    
    if (skills.blue1.purchased) gained *= 2; // Double Click skill
    
    if (skills.blue2.purchased) {
        if (Math.random() < 0.05) { // 5% Critical chance
            gained *= 10;
        }
    }
    
    pepeFollowers += gained;
    updateUI();
});

// Click Upgrade Pirkšana
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

// Pasīvo uzlabojumu pirkšana
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

// Izmaksu modifikators (Zaļā 1 prasme - Lētākas cenas)
function getModifiedCost(originalCost) {
    if (skills.green1.purchased) {
        return Math.round(originalCost * 0.85); // 15% discount
    }
    return originalCost;
}

// Prasmju koka pirkšanas sistēma
function buySkill(id) {
    let skill = skills[id];
    if (skill.purchased) return;
    
    // Pārbauda vai iepriekšējā prasme ir nopirkta
    if (skill.req && !skills[skill.req].purchased) {
        alert("You must unlock the previous skill first!");
        return;
    }
    
    if (skillPoints >= skill.cost) {
        skillPoints -= skill.cost;
        skill.purchased = true;
        
        // Īpašie prasmju efekti tūlītējai iedarbināšanai (Sarkanā 2)
        if (id === "red2") {
            mrBeastFollowers = Math.max(0, mrBeastFollowers - 10000000);
        }
        
        updateUI();
        updateSkillTreeUI();
        saveGame();
    } else {
        alert("Not enough Skill Points! Earn them via Rebirth.");
    }
}

// REBIRTH (Prestige) Mehānika
function triggerRebirth() {
    if (pepeFollowers >= 100000) {
        if (confirm("Rebirth will reset your followers and upgrades, but you will gain 1 Skill Point. Proceed?")) {
            skillPoints += 1;
            rebirthsCount += 1;
            
            // Reset main status
            pepeFollowers = 0;
            clickPower = 1;
            clickUpgradeCost = 50;
            
            // Reset shop upgrades
            for (let id in upgrades) {
                upgrades[id].count = 0;
                upgrades[id].cost = upgrades[id].baseCost;
            }
            
            updateUI();
            updateSkillTreeUI();
            saveGame();
        }
    } else {
        alert("You need at least 100,000 followers to Rebirth!");
    }
}

// Atjauno kopējo vizuālo daļu
function updateUI() {
    // Aprēķina kopējo FPS (Ar Zaļās 2 prasmes bonusu)
    let calculatedFPS = 0;
    for (let id in upgrades) {
        calculatedFPS += upgrades[id].count * upgrades[id].fpsBonus;
    }
    if (skills.green2.purchased) {
        calculatedFPS = Math.round(calculatedFPS * 1.25); // +25% FPS Boost
    }
    followersPerSecond = calculatedFPS;

    // Uzlabojumu pogu teksti (parāda modificētās cenas)
    document.getElementById("upgrade0-btn").innerText = `Cost: ${getModifiedCost(clickUpgradeCost).toLocaleString()} followers`;
    for (let id in upgrades) {
        let btn = document.getElementById(`upgrade${id}-btn`);
        if (btn) btn.innerText = `Cost: ${getModifiedCost(upgrades[id].cost).toLocaleString()} followers`;
    }

    pepeCountDisplay.innerText = Math.floor(pepeFollowers).toLocaleString();
    beastCountDisplay.innerText = Math.floor(mrBeastFollowers).toLocaleString();
    fpsCountDisplay.innerText = followersPerSecond.toLocaleString();
    clickPowerDisplay.innerText = clickPower.toLocaleString();
    spCountDisplay.innerText = skillPoints;

    // MrBeast augšanas ātrums (Sarkanā 1 prasme samazina to)
    let beastSpeed = skills.red1.purchased ? 1 : 2;
    beastGrowthRateDisplay.innerText = beastSpeed;

    // Rebirth pogas stāvoklis
    if (pepeFollowers >= 100000) {
        rebirthBtn.style.background = "#e91e63";
    } else {
        rebirthBtn.style.background = "#9c27b0";
    }

    if (pepeFollowers >= mrBeastFollowers && mrBeastFollowers !== Infinity) {
        alert("Unbelievable! Pepe has overtaken MrBeast and became the King of the Internet! 🐸👑");
        mrBeastFollowers = Infinity;
    }
}

// Atjauno prasmju koka pogu krāsas un stāvokļus
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

// Saglabāšana
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

// Ielāde
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
    if (confirm("Are you sure you want to completely clear ALL data including skills?")) {
        localStorage.removeItem("pepeClickerAdvancedSave");
        location.reload();
    }
}

// Galvenais cikls (10 reizes sekundē)
setInterval(() => {
    if (followersPerSecond > 0) {
        pepeFollowers += (followersPerSecond / 10);
    }
    
    if (mrBeastFollowers !== Infinity) {
        // Ja nopirkta Red 1 prasme, Beast aug par 1/sek, ja nē — par 2/sek
        let speed = skills.red1.purchased ? 0.1 : 0.2;
        mrBeastFollowers += speed;
    }
    
    updateUI();
}, 100);

// Auto save ik pēc 30 sek
setInterval(saveGame, 30000);
