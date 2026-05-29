// Game Variables
let pepeFollowers = 0;
let followersPerSecond = 0;
let clickPower = 1;
let clickUpgradeCost = 50;
let clickUpgradeLevel = 0;
let mrBeastFollowers = 492000000;

// Speedrun Timer Variables
let startTime = Date.now();
let gameWon = false;
let bestTimes = []; 

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
const currentTimerDisplay = document.getElementById("current-timer");

let sabotageCooldown = false;

const newsDatabase = [
    "MrBeast announces a new massive video. Pepe is eating chips, quietly plotting his next big move.",
    "Financial experts in absolute shock: Pepe Coin value is skyrocketing straight to the moon!",
    "Unconfirmed rumors: Pepe is planning to purchase YouTube and rename it to PepeTube.",
    "MrBeast was spotted trying to design a viral meme, but it wasn't nearly as good as Pepe's.",
    "BREAKING: Millions of followers realize green frogs are way cooler than getting free cars.",
    "Scientists prove: clicking on Pepe improves gaming performance and overall mood by 420%.",
    "MrBeast lost his favorite socks. Meanwhile, Pepe keeps gaining thousands of followers.",
    "Social media is boiling! Pepe posted a simple reaction picture that gained 1M views in 2 seconds."
];

function switchTab(tabId) {
    document.getElementById("tab-shop").classList.remove("active-content");
    document.getElementById("tab-skills").classList.remove("active-content");
    document.getElementById("tab-shop-btn").classList.remove("active");
    document.getElementById("tab-skills-btn").classList.remove("active");

    if (tabId === 'shop') {
        document.getElementById("tab-shop").classList.add("active-content");
        document.getElementById("tab-shop-btn").classList.add("active");
    } else if (tabId === 'skills') {
        document.getElementById("tab-skills").classList.add("active-content");
        document.getElementById("tab-skills-btn").classList.add("active");
    }
}

loadGame();
setupNewsTicker();

pepeImg.addEventListener("click", (e) => {
    let gained = clickPower;
    let isCrit = false;

    if (skills.blue1.purchased) gained *= 2;
    if (skills.blue2.purchased) {
        if (Math.random() < 0.05) {
            gained *= 10;
            isCrit = true;
        }
    }
    pepeFollowers += gained;
    
    createFloatingText(e.clientX, e.clientY, gained, isCrit);
    updateUI();
});

function createFloatingText(x, y, amount, isCrit) {
    const textNode = document.createElement("div");
    textNode.innerText = `+${amount.toLocaleString()}${isCrit ? " CRIT! 🔥" : ""}`;
    textNode.className = isCrit ? "floating-text crit-text" : "floating-text";
    
    if(textNode.style) {
        textNode.style.left = `${x}px`;
        textNode.style.top = `${y}px`;
    }
    
    document.body.appendChild(textNode);
    
    setTimeout(() => {
        textNode.remove();
    }, 1000);
}

function setupNewsTicker() {
    const newsText = document.getElementById("news-text");
    setInterval(() => {
        if (newsText) {
            const randomIndex = Math.floor(Math.random() * newsDatabase.length);
            newsText.innerText = newsDatabase[randomIndex];
        }
    }, 15000);
}

function buyClickUpgrade() {
    let activeCost = getModifiedCost(clickUpgradeCost);
    if (pepeFollowers >= activeCost) {
        pepeFollowers -= activeCost;
        clickUpgradeLevel++;
        
        let baseClickAddition = clickUpgradeLevel;
        let multiplier = 1;
        if (clickUpgradeLevel >= 10) multiplier *= 2;
        if (clickUpgradeLevel >= 25) multiplier *= 2;
        if (clickUpgradeLevel >= 50) multiplier *= 2;
        if (clickUpgradeLevel >= 100) multiplier *= 2;
        
        clickPower = 1 + (baseClickAddition * multiplier);
        clickUpgradeCost = Math.round(clickUpgradeCost * 1.5);
        updateUI();
        saveGame();
    } else {
        alert("You don't have enough followers!");
    }
}

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

function triggerRebirth() {
    if (pepeFollowers >= 100000) {
        if (confirm("Reset progress for 1 Skill Point?")) {
            skillPoints += 1;
            rebirthsCount += 1;
            pepeFollowers = 0;
            clickPower = 1;
            clickUpgradeCost = 50;
            clickUpgradeLevel = 0;
            
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

function triggerSabotage() {
    if (sabotageCooldown) return;

    window.open("https://www.youtube.com/@MrBeast", "_blank");

    if (mrBeastFollowers !== Infinity) {
        mrBeastFollowers = Math.max(0, mrBeastFollowers - 50000);
        const newsText = document.getElementById("news-text");
        if (newsText) newsText.innerText = "🚨 BREAKING: Mysteriously, MrBeast just lost 50,000 followers! Pepe looks totally innocent...";
    }
    pepeFollowers += 25000;

    sabotageCooldown = true;
    let timeLeft = 60;
    const sabotageBtn = document.getElementById("sabotage-btn");

    updateUI();
    saveGame();

    let cooldownTimer = setInterval(() => {
        timeLeft--;
        if (sabotageBtn) {
            sabotageBtn.innerText = `⏳ Cooldown: ${timeLeft}s`;
            sabotageBtn.style.background = "#555";
            sabotageBtn.style.cursor = "not-allowed";
        }

        if (timeLeft <= 0) {
            clearInterval(cooldownTimer);
            sabotageCooldown = false;
            if (sabotageBtn) {
                sabotageBtn.innerText = "🔴 Unsubscribe from MrBeast (-50k Beast / +25k Pepe)";
                sabotageBtn.style.background = "#ff0000";
                sabotageBtn.style.cursor = "pointer";
            }
        }
    }, 1000);
}

function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    let display = "";
    if (hours > 0) display += (hours < 10 ? "0" : "") + hours + ":";
    display += (minutes < 10 ? "0" : "") + minutes + ":";
    display += (seconds < 10 ? "0" : "") + seconds;
    return display;
}

function updateUI() {
    let calculatedFPS = 0;

    for (let id in upgrades) {
        let upgrade = upgrades[id];
        let currentItemFPS = upgrade.count * upgrade.fpsBonus;
        
        let itemMultiplier = 1;
        if (upgrade.count >= 10) itemMultiplier *= 2;
        if (upgrade.count >= 25) itemMultiplier *= 2;
        if (upgrade.count >= 50) itemMultiplier *= 2;
        if (upgrade.count >= 100) itemMultiplier *= 2;
        
        calculatedFPS += (currentItemFPS * itemMultiplier);

        let lvlDisplay = document.getElementById(`upgrade${id}-lvl`);
        if (lvlDisplay) {
            lvlDisplay.innerText = `Lvl ${upgrade.count}`;
            if (itemMultiplier > 1) lvlDisplay.innerText += ` (x${itemMultiplier})`;
        }
    }

    let clickLvlDisplay = document.getElementById(`upgrade0-lvl`);
    if (clickLvlDisplay) {
        clickLvlDisplay.innerText = `Lvl ${clickUpgradeLevel}`;
        let clickMultiplier = 1;
        if (clickUpgradeLevel >= 10) clickMultiplier *= 2;
        if (clickUpgradeLevel >= 25) clickMultiplier *= 2;
        if (clickUpgradeLevel >= 50) clickMultiplier *= 2;
        if (clickUpgradeLevel >= 100) clickMultiplier *= 2;
        if (clickMultiplier > 1) clickLvlDisplay.innerText += ` (x${clickMultiplier})`;
    }

    if (skills.green2.purchased) calculatedFPS = Math.round(calculatedFPS * 1.25);
    followersPerSecond = calculatedFPS;

    let clickBtn = document.getElementById("upgrade0-btn");
    if (clickBtn) clickBtn.innerText = `${getModifiedCost(clickUpgradeCost).toLocaleString()}`;
    
    for (let id in upgrades) {
        let btn = document.getElementById(`upgrade${id}-btn`);
        if (btn) btn.innerText = `${getModifiedCost(upgrades[id].cost).toLocaleString()}`;
    }

    if (pepeCountDisplay) pepeCountDisplay.innerText = Math.floor(pepeFollowers).toLocaleString();
    if (beastCountDisplay) beastCountDisplay.innerText = Math.floor(mrBeastFollowers).toLocaleString();
    if (fpsCountDisplay) fpsCountDisplay.innerText = followersPerSecond.toLocaleString();
    if (clickPowerDisplay) clickPowerDisplay.innerText = clickPower.toLocaleString();
    if (spCountDisplay) spCountDisplay.innerText = skillPoints;

    let beastSpeed = skills.red1.purchased ? 1 : 2;
    if (beastGrowthRateDisplay) beastGrowthRateDisplay.innerText = beastSpeed;

    if (rebirthBtn) {
        if (pepeFollowers >= 100000) {
            rebirthBtn.style.background = "#e91e63";
        } else {
            rebirthBtn.style.background = "#7b1fa2";
        }
    }

    if (pepeFollowers >= mrBeastFollowers && mrBeastFollowers !== Infinity && !gameWon) {
        gameWon = true;
        let timeTaken = Date.now() - startTime;
        
        alert(`🏆 TU UZVARĒJI MRBEAST LAIKĀ: ${formatTime(timeTaken)}!`);

        bestTimes.push(timeTaken);
        mrBeastFollowers = Infinity;
        saveGame();
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
        clickUpgradeLevel: clickUpgradeLevel,
        mrBeastFollowers: mrBeastFollowers,
        skillPoints: skillPoints,
        rebirthsCount: rebirthsCount,
        skills: skills,
        upgrades: upgrades,
        startTime: startTime,
        gameWon: gameWon,
        bestTimes: bestTimes
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
        clickUpgradeLevel = save.clickUpgradeLevel || 0;
        mrBeastFollowers = save.mrBeastFollowers || 492000000;
        skillPoints = save.skillPoints || 0;
        rebirthsCount = save.rebirthsCount || 0;
        startTime = save.startTime || Date.now();
        gameWon = save.gameWon || false;
        bestTimes = save.bestTimes || [];
        
        if (save.skills) skills = save.skills;
        if (save.upgrades) upgrades = save.upgrades;
    }
    updateUI();
    updateSkillTreeUI();
}

function resetGame() {
    if (confirm("Reset your current followers and upgrades to start a new speedrun?")) {
        localStorage.removeItem("pepeClickerAdvancedSave");
        
        pepeFollowers = 0;
        clickPower = 1;
        clickUpgradeCost = 50;
        clickUpgradeLevel = 0;
        mrBeastFollowers = 492000000;
        skillPoints = 0;
        rebirthsCount = 0;
        startTime = Date.now(); 
        gameWon = false;
        bestTimes = [];

        for (let id in upgrades) {
            upgrades[id].count = 0;
            upgrades[id].cost = upgrades[id].baseCost;
        }
        for (let id in skills) {
            skills[id].purchased = false;
        }
        
        saveGame();
        location.reload();
    }
}

// Spēles galvenais darbības cikls (10 reizes sekundē)
setInterval(() => {
    if (followersPerSecond > 0) pepeFollowers += (followersPerSecond / 10);
    if (mrBeastFollowers !== Infinity) mrBeastFollowers += (skills.red1.purchased ? 0.01 : 0.02);
    
    if (!gameWon && currentTimerDisplay) {
        let currentDuration = Date.now() - startTime;
        currentTimerDisplay.innerText = formatTime(currentDuration);
    }
    
    updateUI();
}, 100);

setInterval(saveGame, 30000);
