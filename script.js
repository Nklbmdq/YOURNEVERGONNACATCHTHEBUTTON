// ==== RESET PROGRESS BUTTON SETUP ====
// Make sure you have this button in your HTML:
// <button id="reset-game">Reset Progress</button>
document.getElementById("reset-game").addEventListener("click", () => {
  localStorage.clear();          // clear all saved progress
  alert("Progress has been reset!");
  currentLevel = 1;              // reset to level 1
  generateLevel(currentLevel);   // regenerate first level
  checkbox.classList.remove("checked"); // reset reCAPTCHA
});

// ==== GAME LOGIC ====
let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
const totalLevels = 50;

const levelContainer = document.getElementById("level-container");
const checkbox = document.getElementById("checkbox");
const spinner = document.getElementById("spinner");

function saveProgress() {
  localStorage.setItem('currentLevel', currentLevel);
}

// Pick challenge type based on level
function pickChallenge(level) {
  if (level <= 10) return 'number';
  if (level <= 20) return 'emoji';
  if (level <= 35) return 'color';
  return 'map';
}

// Generate the level dynamically
function generateLevel(level) {
  levelContainer.innerHTML = "";
  const type = pickChallenge(level);

  const levelBox = document.createElement("div");
  levelBox.classList.add("level-box");
  levelBox.innerHTML = `<h2>Level ${level}</h2>`;

  if(type === 'number'){
    levelBox.innerHTML += `<p>Click all numbers ≤ ${Math.min(level, 9)}</p>`;
    const grid = document.createElement("div");
    grid.classList.add("level-grid");
    for(let i=1;i<=9;i++){
      const cell = document.createElement("div");
      cell.textContent=i;
      cell.dataset.value=i;
      cell.addEventListener("click",()=>cell.classList.toggle("selected"));
      grid.appendChild(cell);
    }
    levelBox.appendChild(grid);

  } else if(type === 'emoji'){
    levelBox.innerHTML += `<p>Click all 🚗 emojis</p>`;
    const grid = document.createElement("div");
    grid.classList.add("level-grid");
    const emojis = ['🚗','🚦','🏠','🌳','🚗','🚲','🚗','🛵','🌲'];
    emojis.forEach(e=>{
      const cell = document.createElement("div");
      cell.textContent=e;
      cell.addEventListener("click",()=>cell.classList.toggle("selected"));
      grid.appendChild(cell);
    });
    levelBox.appendChild(grid);

  } else if(type === 'color'){
    levelBox.innerHTML += `<p>Click all blue squares</p>`;
    const grid = document.createElement("div");
    grid.classList.add("level-grid");
    const colors = ['blue','red','green','blue','yellow','blue','red','green','blue'];
    colors.forEach(c=>{
      const cell = document.createElement("div");
      cell.style.background=c;
      cell.dataset.color=c;
      cell.addEventListener("click",()=>cell.classList.toggle("selected"));
      grid.appendChild(cell);
    });
    levelBox.appendChild(grid);

  } else if(type === 'map'){
    levelBox.innerHTML += `<p>Click the hidden item on the map</p>`;
    const map = document.createElement("div");
    map.classList.add("map-challenge");
    // simulate "hidden item" click
    map.addEventListener("click",()=>map.classList.toggle("selected"));
    levelBox.appendChild(map);
  }

  levelContainer.appendChild(levelBox);
}

// Handle fake reCAPTCHA click
document.getElementById("recaptcha").addEventListener("click",()=>{
  if(checkbox.classList.contains("checked")) return;

  spinner.style.display="block";

  setTimeout(()=>{
    spinner.style.display="none";
    checkbox.classList.add("checked");

    // Check selection
    const selectedCells = Array.from(document.querySelectorAll(".level-grid div.selected,.map-challenge.selected"));
    const correctCells = Array.from(document.querySelectorAll(".level-grid div")).filter(c=>{
      if(c.dataset.value) return parseInt(c.dataset.value)<=Math.min(currentLevel,9);
      if(c.dataset.color) return c.dataset.color==='blue';
      if(c.textContent==='🚗') return true;
      return false;
    });

    if(selectedCells.length===correctCells.length && selectedCells.every(c=>correctCells.includes(c))){
      // short delay for animation
      setTimeout(()=>{
        alert(`Level ${currentLevel} cleared!`);
        currentLevel++;
        if(currentLevel>totalLevels){
          alert("🎉 You completed all 50 levels!");
          currentLevel=1;
        }
        saveProgress();
        checkbox.classList.remove("checked");
        generateLevel(currentLevel);
      },500);
    } else {
      alert("Try again!");
      checkbox.classList.remove("checked");
    }

  },1000); // spinner duration
});

// Initialize first level
generateLevel(currentLevel);
