// Pamata mainīgie
let pepeFollowers = 0;
let followersPerSecond = 0;
let mrBeastFollowers = 491000000;

// Uzlabojumu saraksts (papildināts līdz 6)
let upgrades = {
    1: { name: "Izveidot mēmi", cost: 15, fpsBonus: 1, count: 0 },
    2: { name: "Vīrusu video", cost: 100, fpsBonus: 10, count: 0 },
    3: { name: "Kopīgs strīms", cost: 1100, fpsBonus: 100, count: 0 },
    4: { name: "Pepe Kriptovalūta", cost: 12000, fpsBonus: 1000, count: 0 },
    5: { name: "Pasaules tūre", cost: 130000, fpsBonus: 10000, count: 0 },
    6: { name: "Nopirkt Twitter (X)", cost: 1500000, fpsBonus: 100000, count: 0 }
};

const pepeCountDisplay = document.getElementById("pepe-count");
const beastCountDisplay = document.getElementById("beast-count");
const fpsCountDisplay = document.getElementById("fps-count");
const pepeImg = document.getElementById("pepe-img");

// Ielādējam spēli, kad lapa atveras
loadGame();

// Klikšķis uz Pepe bildes
pepeImg.addEventListener("click", () => {
    pepeFollowers += 1; // Katrs klikšķis dod 1 sekotāju
    updateUI();
});

// Uzlabojumu pirkšana
function buyUpgrade(id) {
    let upgrade = upgrades[id];
    
    if (pepeFollowers >= upgrade.cost) {
        pepeFollowers -= upgrade.cost;
        followersPerSecond += upgrade.fpsBonus;
        upgrade.count++;
        upgrade.cost = Math.round(upgrade.cost * 1.15); // Cena pieaug par 15%
        
        document.getElementById(`upgrade${id}-btn`).innerText = `Cena: ${upgrade.cost.toLocaleString()} sekotāji`;
        
        updateUI();
        saveGame(); // Automātiski saglabā pēc pirkuma
    } else {
        alert("Tev nepietiek sekotāju!");
    }
}

// Skaitļu un ekrāna atjaunošana
function updateUI() {
    pepeCountDisplay.innerText = Math.floor(pepeFollowers).toLocaleString();
    beastCountDisplay.innerText = Math.floor(mrBeastFollowers).toLocaleString();
    fpsCountDisplay.innerText = followersPerSecond.toLocaleString();
    
    if (pepeFollowers >= mrBeastFollowers && mrBeastFollowers !== Infinity) {
        alert("Neticami! Pepe ir apdzinis MrBeast un kļuvis par interneta karali! 🐸👑");
        mrBeastFollowers = Infinity;
    }
}

// Saglabāšanas funkcija (Save Game)
function saveGame() {
    let gameSave = {
        pepeFollowers: pepeFollowers,
        followersPerSecond: followersPerSecond,
        mrBeastFollowers: mrBeastFollowers,
        upgrades: upgrades
    };
    localStorage.setItem("pepeClickerSave", JSON.stringify(gameSave));
}

// Ielādes funkcija (Load Game)
function loadGame() {
    let savedData = localStorage.getItem("pepeClickerSave");
    if (savedData) {
        let save = JSON.parse(savedData);
        pepeFollowers = save.pepeFollowers;
        followersPerSecond = save.followersPerSecond;
        mrBeastFollowers = save.mrBeastFollowers || 491000000;
        
        // Atjaunojam uzlabojumu datus un pogu tekstus
        if (save.upgrades) {
            upgrades = save.upgrades;
            for (let id in upgrades) {
                let btn = document.getElementById(`upgrade${id}-btn`);
                if (btn) {
                    btn.innerText = `Cena: ${upgrades[id].cost.toLocaleString()} sekotāji`;
                }
            }
        }
        updateUI();
    }
}

// Progresa dzēšanas funkcija (Reset)
function resetGame() {
    if (confirm("Vai tiešām vēlies dzēst visu progresu un sākt no jauna?")) {
        localStorage.removeItem("pepeClickerSave");
        location.reload(); // Pārlādē lapu
    }
}

// Galvenais spēles laika cikls (Darbojas 10 reizes sekundē)
setInterval(() => {
    // 1. Pepe pelna sekotājus
    if (followersPerSecond > 0) {
        pepeFollowers += (followersPerSecond / 10);
    }
    
    // 2. MrBeast pelna 2 sekotājus sekundē (0.2 ik pēc 100ms)
    if (mrBeastFollowers !== Infinity) {
        mrBeastFollowers += 0.2;
    }
    
    updateUI();
}, 100);

// Automātiski saglabā spēli ik pēc 30 sekundēm
setInterval(saveGame, 30000);
