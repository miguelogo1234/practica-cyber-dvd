/* ============================================
   PRIVACY IS POWER — Script Principal
   SPA Logic + vis-network Interactive Graph
   ============================================ */

'use strict';

/* ====== STATE ====== */
const sections = ['resumen', 'impresiones', 'critica', 'mapa'];
let currentSectionIndex = 0;
let timecodeInterval = null;
let startTime = null;
let network = null;

/* ====== INTRO → MAIN ====== */
function enterMain() {
  const intro = document.getElementById('intro-screen');
  const app   = document.getElementById('main-app');

  intro.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  intro.style.opacity    = '0';
  intro.style.transform  = 'scale(0.98)';

  setTimeout(() => {
    intro.style.display = 'none';
    app.classList.remove('hidden');
    startTimecode();
    // Init graph after a short delay so the DOM is ready
    setTimeout(initGraph, 400);
  }, 800);
}

// Also allow keyboard press to enter
document.addEventListener('keydown', (e) => {
  const intro = document.getElementById('intro-screen');
  if (intro && intro.style.display !== 'none' && !intro.classList.contains('hidden')) {
    enterMain();
  }
});

/* ====== TIMECODE ====== */
function startTimecode() {
  startTime = Date.now();
  timecodeInterval = setInterval(updateTimecode, 1000);
  updateTimecode();
}

function updateTimecode() {
  const el = document.getElementById('timecode');
  if (!el || !startTime) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  el.textContent =
    String(h).padStart(2, '0') + ':' +
    String(m).padStart(2, '0') + ':' +
    String(s).padStart(2, '0');
}

/* ====== SECTION NAVIGATION ====== */
function showSection(name, btn) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show target
  const target = document.getElementById('section-' + name);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');

  // Update index
  currentSectionIndex = sections.indexOf(name);

  // If showing map, ensure graph is initialized
  if (name === 'mapa' && !network) {
    setTimeout(initGraph, 100);
  }
}

function prevSection() {
  currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
  const name = sections[currentSectionIndex];
  const btn = document.querySelector(`[data-section="${name}"]`);
  showSection(name, btn);
}

function nextSection() {
  currentSectionIndex = (currentSectionIndex + 1) % sections.length;
  const name = sections[currentSectionIndex];
  const btn = document.querySelector(`[data-section="${name}"]`);
  showSection(name, btn);
}

/* ====== NODE INFO DATA ====== */
const nodeData = {
  1: {
    name:       'Carissa Véliz',
    affiliation:'NODO CENTRAL · FILÓSOFA POLÍTICA',
    school:     'Universidad de Oxford · St Cross College · Ética y Filosofía de la Mente',
    connection: 'Autora de "Privacy is Power". Sostiene que la privacidad es una condición infraestructural de la democracia y la autonomía individual. Pionera en el argumento de los datos como bien inalienable, comparable a los órganos humanos.',
    work:       'Privacy is Power (2021) · "Privacy is a Political Problem" (Artículo, 2019)',
    quote:      '"La privacidad no es sobre tener algo que esconder. Es sobre tener el poder de dar forma a tu propia narrativa."',
  },
  2: {
    name:       'Shoshana Zuboff',
    affiliation:'ALIADA CONCEPTUAL · ECONOMISTA SOCIAL',
    school:     'Harvard Business School (emérita) · Teoría crítica del capitalismo tardío',
    connection: 'Su concepto de "capitalismo de vigilancia" es el marco económico sobre el que Véliz construye su argumento político. Zuboff describe el mecanismo; Véliz prescribe la solución. Son complementarias: Zuboff explica el "cómo", Véliz el "para qué" y el "qué hacer".',
    work:       'The Age of Surveillance Capitalism (2019) · "Big Other: Surveillance Capitalism and the Prospects of an Information Civilization" (2015)',
    quote:      '"El comportamiento humano es la materia prima gratuita de un nuevo proceso de producción económica."',
  },
  3: {
    name:       'Michel Foucault',
    affiliation:'FUNDAMENTO TEÓRICO · FILÓSOFO',
    school:     'Collège de France · Post-estructuralismo · Historia de los sistemas de poder',
    connection: 'El panóptico de Foucault (de "Vigilar y Castigar") es la metáfora fundacional que Véliz actualiza al siglo XXI. Donde Foucault describe la disciplina como arquitectura espacial, Véliz describe la vigilancia digital como arquitectura de datos. El sujeto foucaultiano que se autodisciplina se convierte en el usuario que se autoexpone.',
    work:       'Surveiller et Punir (1975) · La Volonté de Savoir (1976) · Sécurité, Territoire, Population (1978)',
    quote:      '"El panóptico es una máquina de disociar la dupla ver-ser visto: en el anillo periférico, se es visto sin ver; en la torre central, se ve sin ser visto."',
  },
  4: {
    name:       'Edward Snowden',
    affiliation:'ALIADO EMPÍRICO · WHISTLEBLOWER',
    school:     'NSA / CIA (ex) · Activismo por los derechos digitales · Sin afiliación académica formal',
    connection: 'Las revelaciones de Snowden en 2013 sobre PRISM y XKeyscore son la evidencia empírica más poderosa del argumento de Véliz: que la vigilancia masiva existe, que opera a escala industrial, y que el ciudadano la desconoce. Véliz cita este caso para mostrar que su análisis no es teórico sino descriptivo de una realidad ya operativa.',
    work:       'Permanent Record (Memorias, 2019) · Revelaciones NSA-GCHQ (2013) · Entrevistas a The Guardian',
    quote:      '"Argumentar que no te importa el derecho a la privacidad porque no tienes nada que ocultar es como decir que no te importa la libertad de expresión porque no tienes nada que decir."',
  },
  5: {
    name:       'Bruce Schneier',
    affiliation:'ALIADO TÉCNICO · EXPERTO EN SEGURIDAD',
    school:     'Harvard Kennedy School (fellow) · Escuela del realismo en ciberseguridad',
    connection: 'Schneier aporta la dimensión técnica y pragmática que complementa la filosofía de Véliz. Su concepto de "seguridad como proceso" y su crítica al "teatro de la seguridad" ayudan a Véliz a argumentar que las soluciones técnicas (encriptación, VPNs) son necesarias pero insuficientes sin reforma estructural política. La privacidad requiere leyes, no solo herramientas.',
    work:       'Data and Goliath (2015) · Click Here to Kill Everybody (2018) · Schneier on Security (blog)',
    quote:      '"La privacidad protege a las personas del poder, ya sea el poder de las corporaciones o el poder del Estado. No es un valor del siglo XX —es un valor humano fundamental."',
  },
  6: {
    name:       'Jeff Jarvis',
    affiliation:'CRÍTICO / CONTRARIO · PERIODISTA DIGITAL',
    school:     'CUNY Graduate School of Journalism · Liberalismo tecnológico optimista',
    connection: 'Jarvis representa el contra-argumento más articulado a Véliz. En "Public Parts" defiende la publicidad y la transparencia como fuerzas emancipadoras. Acusa al movimiento privacista de elitismo: los más vulnerables se benefician de plataformas que los conectan, y pagar por privacidad es un privilegio de clase. Su debate con Véliz define el campo intelectual de la cuestión.',
    work:       'What Would Google Do? (2009) · Public Parts (2011) · BuzzMachine (blog)',
    quote:      '"La publicidad no es inherentemente malo. La transparencia radical puede ser una forma de poder, no de servilismo."',
  },
  7: {
    name:       'Helen Nissenbaum',
    affiliation:'FUNDAMENTO TEÓRICO · FILÓSOFA POLÍTICA',
    school:     'Cornell Tech · Ética de la información · Filosofía analítica aplicada',
    connection: 'Su teoría de la "privacidad contextual" (contextual integrity) ofrece un marco alternativo al de Véliz: la privacidad no es sobre ocultación, sino sobre flujos de información apropiados al contexto. Datos médicos compartidos con tu médico son apropiados; los mismos datos vendidos a una aseguradora, no. Este marco influye directamente en el RGPD y es tanto aliado como crítico implícito de la propuesta más absolutista de Véliz.',
    work:       'Privacy in Context (2010) · "A Contextual Approach to Privacy Online" (2011)',
    quote:      '"La privacidad no requiere secreto total. Requiere que la información fluya de forma apropiada al contexto en que fue originalmente compartida."',
  },
};

/* ====== VIS-NETWORK GRAPH ====== */
function initGraph() {
  const container = document.getElementById('network-graph');
  if (!container || typeof vis === 'undefined') {
    console.warn('vis-network not loaded or container not found');
    return;
  }

  // Nodes
  const nodes = new vis.DataSet([
    {
      id: 1, label: 'Carissa\nVéliz',
      group: 'center',
      size: 42,
      font: { size: 13, color: '#ffffff', face: 'Orbitron' },
      title: 'Nodo central — Haz clic para más info',
    },
    {
      id: 2, label: 'Shoshana\nZuboff',
      group: 'ally',
      size: 32,
      font: { size: 11, color: '#c8e0f0' },
      title: 'Aliada conceptual',
    },
    {
      id: 3, label: 'Michel\nFoucault',
      group: 'foundational',
      size: 30,
      font: { size: 11, color: '#c8e0f0' },
      title: 'Fundamento teórico',
    },
    {
      id: 4, label: 'Edward\nSnowden',
      group: 'ally',
      size: 28,
      font: { size: 11, color: '#c8e0f0' },
      title: 'Aliado empírico',
    },
    {
      id: 5, label: 'Bruce\nSchneier',
      group: 'ally',
      size: 28,
      font: { size: 11, color: '#c8e0f0' },
      title: 'Aliado técnico',
    },
    {
      id: 6, label: 'Jeff\nJarvis',
      group: 'critic',
      size: 26,
      font: { size: 11, color: '#c8e0f0' },
      title: 'Crítico / Contrario',
    },
    {
      id: 7, label: 'Helen\nNissenbaum',
      group: 'foundational',
      size: 27,
      font: { size: 11, color: '#c8e0f0' },
      title: 'Fundamento teórico',
    },
  ]);

  // Edges with labels
  const edges = new vis.DataSet([
    { from: 1, to: 2, label: 'Capitalismo\nde Vigilancia', arrows: { to: { enabled: false } }, length: 180 },
    { from: 1, to: 3, label: 'Panóptico\n& Biopolítica', arrows: { to: { enabled: false } }, length: 200 },
    { from: 1, to: 4, label: 'Vigilancia\nMasiva', arrows: { to: { enabled: false } }, length: 180 },
    { from: 1, to: 5, label: 'Seguridad\nDigital', arrows: { to: { enabled: false } }, length: 180 },
    { from: 1, to: 6, label: 'Debate:\nPrivacidad vs Publicidad', arrows: { to: { enabled: false } }, length: 210, dashes: true },
    { from: 1, to: 7, label: 'Privacidad\nContextual', arrows: { to: { enabled: false } }, length: 190 },
    { from: 2, to: 3, label: 'Poder\ndisciplinario', arrows: { to: { enabled: false } }, length: 150, color: { color: '#1a3040' } },
    { from: 3, to: 7, label: '', arrows: { to: { enabled: false } }, length: 140, color: { color: '#1a1a3a' } },
    { from: 2, to: 5, label: '', arrows: { to: { enabled: false } }, length: 170, color: { color: '#0d2030' } },
  ]);

  // Color groups
  const groupColors = {
    center:      { background: '#003060', border: '#00c8ff', highlight: { background: '#004080', border: '#60e8ff' } },
    ally:        { background: '#0a2a18', border: '#00ff88', highlight: { background: '#0d3a22', border: '#60ffa8' } },
    critic:      { background: '#2a0a12', border: '#ff2244', highlight: { background: '#3a0a18', border: '#ff6688' } },
    foundational:{ background: '#0a0a2a', border: '#cc44ff', highlight: { background: '#141428', border: '#dd88ff' } },
  };

  const options = {
    nodes: {
      shape: 'dot',
      scaling: { min: 20, max: 45 },
      shadow: {
        enabled: true,
        color:   'rgba(0,0,0,0.8)',
        size:    10,
        x: 3, y: 3,
      },
      borderWidth:         2,
      borderWidthSelected: 3,
      chosen: {
        node: function(values) {
          values.shadowColor = 'rgba(0,200,255,0.6)';
          values.shadowSize  = 20;
        }
      },
    },
    edges: {
      color:  { color: '#1e3848', highlight: '#00c8ff', hover: '#0090aa' },
      width:  1.5,
      selectionWidth: 2.5,
      smooth: { type: 'curvedCW', roundness: 0.1 },
      font: {
        size:      9,
        color:     '#5a7a8a',
        face:      'Share Tech Mono',
        align:     'horizontal',
        background:'rgba(6,8,16,0.8)',
        strokeWidth: 0,
      },
      shadow: { enabled: true, color: 'rgba(0,0,0,0.6)', size: 5 },
    },
    groups: groupColors,
    physics: {
      enabled: true,
      stabilization: { iterations: 150 },
      barnesHut: {
        gravitationalConstant: -4000,
        centralGravity:        0.3,
        springLength:          200,
        springConstant:        0.04,
        damping:               0.09,
      },
    },
    interaction: {
      hover:         true,
      tooltipDelay:  100,
      zoomView:      true,
      dragView:      true,
      navigationButtons: false,
      keyboard:      false,
    },
    layout: {
      improvedLayout: true,
    },
  };

  network = new vis.Network(container, { nodes, edges }, options);

  // Click handler
  network.on('click', function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      showNodePanel(nodeId);
    }
  });

  // Hover effects
  network.on('hoverNode', function() {
    container.style.cursor = 'pointer';
  });
  network.on('blurNode', function() {
    container.style.cursor = 'default';
  });

  // Stabilization finished
  network.on('stabilizationIterationsDone', function() {
    network.setOptions({ physics: { enabled: false } });
  });
}

/* ====== NODE PANEL ====== */
function showNodePanel(nodeId) {
  const data  = nodeData[nodeId];
  const panel = document.getElementById('node-panel');
  if (!data || !panel) return;

  document.getElementById('panel-affiliation').textContent = data.affiliation;
  document.getElementById('panel-name').textContent        = data.name;
  document.getElementById('panel-school').textContent      = data.school;
  document.getElementById('panel-connection').textContent  = data.connection;
  document.getElementById('panel-work').textContent        = data.work;
  document.getElementById('panel-quote').textContent       = data.quote;

  panel.classList.remove('hidden');
}

function closePanel() {
  document.getElementById('node-panel').classList.add('hidden');
}

/* ====== KEYBOARD NAVIGATION (in app) ====== */
document.addEventListener('keydown', (e) => {
  const app = document.getElementById('main-app');
  if (!app || app.classList.contains('hidden')) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextSection();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    prevSection();
  } else if (e.key === 'Escape') {
    closePanel();
  }
});

/* ====== SCANLINE FLICKER (extra atmosphere) ====== */
function randomFlicker() {
  const scanlines = document.querySelector('.scanlines');
  if (!scanlines) return;

  const delay = 5000 + Math.random() * 15000;
  setTimeout(() => {
    scanlines.style.opacity = '0.4';
    setTimeout(() => {
      scanlines.style.opacity = '1';
      setTimeout(randomFlicker, 100);
    }, 80 + Math.random() * 120);
  }, delay);
}

/* ====== INIT ====== */
document.addEventListener('DOMContentLoaded', () => {
  // Show first section by default
  showSection('resumen', document.querySelector('[data-section="resumen"]'));

  // Start flicker effect
  setTimeout(randomFlicker, 3000);

  // Hint: graph init deferred until section is opened
});
