let n = 2000;
let t = 0.0;
let dt = 1e-2;
let mic, rec;
let img;
let p = [];
let rdb, chunks = [];
let psel = 0, sel = 0;
let scn, scn_last, scn_time;
let lang = 'en';
let colors = ["#03033F", "#03033F", "#03033F", "#03033F", "#03033F", "#03033F",
              "#03033F", "#03033F", "#8ea604"];//, "#6D6106"];
let plants = { 
  'en': [ 'none', 'rosemary' , 'dumb cane' , 'snake plant', 'guinea henweed', 'pepper', 'rue plant', 'basil', 'nettle' ],
  'pt': [ 'nenhuma', 'alecrim', 'comigo ninguém pode', 'espada de são jorge', 'guiné', 'pimenta', 'arruda', 'manjericão', 'urtiga' ]
};
let plants_panel;
let sound;
let lastRecognition;

function preload() {
  sound = loadSound("aud/chirps.mp3");
  sound.setLoop(true);
  let img1 = loadImage("img/rosemary.jpg");
  let img2 = loadImage("img/dumb_cane.jpg");
  let img3 = loadImage("img/snake_plant.jpg");
  let img4 = loadImage("img/petiveria.jpg");
  let img5 = loadImage("img/pepper.jpg");
  let img6 = loadImage("img/rue_plant.jpg");
  let img7 = loadImage("img/basil.jpg");
  let img8 = loadImage("img/nettle.jpg");
  img = [createImage(300, 300), img1, img2, img3, img4, img5, img6, img7, img8];
}

function newRecognition() {
  // new recognition object
  // This runs when the speech recognition service returns result
  rec = new Recognition((event) => {
    var output = document.getElementById("output");
    var transcript = event.results[event.results.length -1][0].transcript.toLowerCase();
    if (!lang) return;
    if (transcript.includes(plants[lang][1])) { sel = 1 }
    else if (transcript.includes(plants[lang][2])) { sel = 2 }
    else if (transcript.includes(plants[lang][3])) { sel = 3 }
    else if (transcript.includes(plants[lang][4])) { sel = 4 }
    else if (transcript.includes(plants[lang][5])) { sel = 5 }
    else if (transcript.includes(plants[lang][6])) { sel = 6 }
    else if (transcript.includes(plants[lang][7])) { sel = 7 }
    else if (transcript.includes(plants[lang][8])) { sel = 8 }
    else { sel = 0 }
    output.innerHTML = "<b>Recognition:</b> " + transcript;
    output.classList.remove("hide");
  }, () => {
    var output = document.getElementById("output");
    output.innerHTML = "<b>Recognition:</b> voice recognition is only \nsupported in Chrome or Edge browsers";
    output.classList.remove("hide");
  });
  lastRecognition = millis();
}

function setup() {
  let cnv = createCanvas(windowWidth - 10, windowHeight - 120);
  mic = new Mic(cnv);
  pixelDensity(1);
  background(0);
  for (let i = 0; i < n; i++) {
    p.push(
      newParticle(
        random(width), random(height), random(5e1, 5e2), 1
      )
    );
  }
  rdb = createRadio("rdb");
  rdb.option('en');
  rdb.option('pt');
  rdb.selected(lang);
  rdb.style('color', '#000000');
  // panel
  plants_panel = createP(plants[lang].slice(1).join(" | "));
  // recognition
  newRecognition();
}

function draw() {
  // mic
  if (!mic.isAudioRunning()) return;
  // play sound
  if (!sound.isPlaying()) sound.play();
  let level = mic.getLevel();
  // lang
  if (rec.isRecognitionRunning() && lang != rdb.value() && 
      (lastRecognition && (millis() - lastRecognition) > 8000)) {
    lang = rdb.value();
    plants_panel.html(plants[lang].slice(1).join(" | "));
    // recognition
    newRecognition();
  }
  // color
  let bg = color(colors[sel]);
  let ds = 1 / max(width, height);
  // step increment
  t += map(level, 0.01, 0.2, 5 * dt, dt / 100);
  bg.setAlpha(5);
  background(bg);
  strokeWeight(map(level, 0, 0.2, 1, 3));
  updateParticles(p, img[sel], t, ds);
  drawParticles(p, img[sel]);
  psel = sel;
}
