let fields = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

let currentPlayer = 'circle'; // Startspieler

function init() {
  fields = Array(9).fill(null);
  render();
  updatePlayerHighlight();
}

function render() {
  let contentDiv = document.getElementById('content');

  let tableHTML = '<table>';
  for (let row = 0; row < 3; row++) {
    tableHTML += '<tr>';
    for (let col = 0; col < 3; col++) {
      let index = row * 3 + col;
      let symbol = '';
      if (fields[index] === 'circle') {
        symbol = generateCircleSVG();
      } else if (fields[index] === 'cross') {
        symbol = generateCrossSVG();
      }
      tableHTML += `<td onclick="handleClick(this,${index})">${symbol}</td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</table>';

  contentDiv.innerHTML = tableHTML;
}

function handleClick(cell, index) {
  if (fields[index] === null) {
    fields[index] = currentPlayer;
    cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
    cell.onclick = null;
    const result = checkWinner();
    if (result) {
      if (result.winner === "draw") {
        document.getElementById("winner").textContent = "🤝 Unentschieden!";
      } else {
        drawWinningLine(result.combination, result.winner);
        disableAllClicks();
      }
      return; // Spiel stoppen
    }
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    updatePlayerHighlight();
  }
}

function updatePlayerHighlight() {
  const circleEl = document.getElementById('player-circle');
  const crossEl = document.getElementById('player-cross');

  circleEl.classList.remove('active');
  crossEl.classList.remove('active');

  if (currentPlayer === 'circle') {
    circleEl.classList.add('active');
  } else {
    crossEl.classList.add('active');
  }
}

// Gewinn-Kombinationen (Index im fields-Array)
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Reihen
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
  [0, 4, 8], [2, 4, 6]           // Diagonalen
];

function checkWinner() {
  for (let combo of WINNING_COMBINATIONS) {
    let [a, b, c] = combo;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return { winner: fields[a], combination: combo };
    }
  }

  if (!fields.includes(null)) {
    return { winner: "draw" }; // Alle Felder belegt, kein Gewinner
  }

  return null;
}

function drawWinningLine(combo, winner) {
  // Positionen der Zellen herausfinden
  const cells = combo.map(i => document.querySelectorAll("td")[i]);
  const rects = cells.map(cell => cell.getBoundingClientRect());

  // Mittelpunkt der ersten und letzten Zelle
  const startX = rects[0].left + rects[0].width / 2;
  const startY = rects[0].top + rects[0].height / 2;
  const endX = rects[2].left + rects[2].width / 2;
  const endY = rects[2].top + rects[2].height / 2;

  // Overlay-SVG erzeugen
  const overlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  overlay.setAttribute("class", "overlay-line");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.pointerEvents = "none"; // Klicks gehen durch

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", startX);
  line.setAttribute("y1", startY);
  line.setAttribute("x2", endX);
  line.setAttribute("y2", endY);
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "5");
  line.setAttribute("stroke-linecap", "round");

  overlay.appendChild(line);
  document.body.appendChild(overlay);

  const winnerDiv = document.getElementById("winner");
  if (winner === "circle") {
    winnerDiv.innerHTML = `<svg width="70" height="70">
              <circle cx="35" cy="35" r="30" stroke="#00B0EF" stroke-width="5" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
              </circle>
            </svg> <div>Kreis hat gewonnen!</div>`;
  } else if (winner === "cross") {
    winnerDiv.innerHTML = `<svg width="70" height="70" viewBox="0 0 70 70">
      <!-- Erste Linie -->
      <line 
        x1="10" y1="10" 
        x2="60" y2="60" 
        stroke="#FFC000" stroke-width="5" 
        stroke-linecap="round"
        stroke-dasharray="1" 
        stroke-dashoffset="71">
      </line>
      
      <!-- Zweite Linie -->
      <line 
        x1="60" y1="10" 
        x2="10" y2="60" 
        stroke="#FFC000" stroke-width="5" 
        stroke-linecap="round"
        stroke-dasharray="1" 
        stroke-dashoffset="71">
      </line>
    </svg> <div>Kreuz hat gewonnen!</div>`;
  }
}

function disableAllClicks() {
  document.querySelectorAll("td").forEach(td => td.onclick = null);
}

function generateCircleSVG() {
  const color = '#00B0EF';
  const width = 70;
  const height = 70;

  return `<svg width="${width}" height="${height}">
              <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.2s" fill="freeze" />
              </circle>
            </svg>`;
}

function generateCrossSVG() {
  const color = '#FFC000';
  const size = 70;
  const strokeWidth = 5;
  const margin = 10;
  const lineLength = Math.sqrt(2) * (size - 2 * margin);
  console.log(lineLength);


  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Erste Linie -->
      <line 
        x1="${margin}" y1="${margin}" 
        x2="${size - margin}" y2="${size - margin}" 
        stroke="${color}" stroke-width="${strokeWidth}" 
        stroke-linecap="round"
        stroke-dasharray="${lineLength}" 
        stroke-dashoffset="${lineLength}">
        <animate 
          attributeName="stroke-dashoffset" 
          from="${lineLength}" 
          to="0" 
          dur="0.2s" 
          fill="freeze" />
      </line>
      
      <!-- Zweite Linie -->
      <line 
        x1="${size - margin}" y1="${margin}" 
        x2="${margin}" y2="${size - margin}" 
        stroke="${color}" stroke-width="${strokeWidth}" 
        stroke-linecap="round"
        stroke-dasharray="${lineLength}" 
        stroke-dashoffset="${lineLength}">
        <animate 
          attributeName="stroke-dashoffset" 
          from="${lineLength}" 
          to="0" 
          dur="0.2s" 
          begin="0" 
          fill="freeze" />
      </line>
    </svg>
  `;
}

function restartGame() {
  fields = Array(9).fill(null);
  currentPlayer = 'circle';
  clearWinningLine();   // Gewinnlinie löschen
  document.getElementById("winner").textContent = "";
  render();
  updatePlayerHighlight();
}

function clearWinningLine() {
  const overlays = document.querySelectorAll(".overlay-line");
  overlays.forEach(overlay => overlay.remove());
}