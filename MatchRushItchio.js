const maxTilesHor = 5;
const maxTilesVer = 10;
const symbolsWidth = 123;
const symbolsHeight = 123;
const symbolsAmount = 9;
const destructionWidth = 260;
const destructionHeight = 260;
const timeSmash = 50;
const clockRatio = 0.5; //0.5
const buggyRatio = 0.01;
const clockSpeed = 60; // Smaller is faster
const maxTries = 100000;
const titleText1 = "How to play";
const infoText1 = "Select identical tiles to remove them from the board. Don't let the tiles be burned by the laser beam. Swipe down to move the tiles closer to the laser beam.\n\nTap a bomb to destroy many tiles or a clock to freeze time.\n\nSign in to your Google account to save your name in the global leaderboard.";
const titleText2 = "Credits";
const infoText2 = "Coding by Panos Tsikogiannopoulos (pantsik2@gmail.com)\n\nGame engine: Javascript with p5.js library.\nShapes design by Arlequinaperigo (gr.pinterest.com/ Arlequinaperigo).\nMenu and leaderboard vectors from www.freepik.com. Sound effects from freesound.org.";
let tiles=[], types=[], assinments=[];
let tileSize, tilesHor, tilesVer, leftOffset, selectedTiles, speed, maxDistance, symbols;
let leftBackground, topBackground, deviceWidth, laserHeight, laserOffset, score, playing;
let mouseClicks, borderTile, pixel, roundness, level, gameOver, levelFinished, tileCount;
let buttonStart, div1, quiting;
let showningLevel, t, v0, y0, t0, still, duration, decelerationTime, levelPhase;
let entriesArcade=[], listArcade=[], entriesSpeed=[], listSpeed=[], list_new=[], new_entry=[], profilePicArcade=[], profilePicSpeed=[], hiscoresArcade=[], hiscoresSpeed=[];
let newEntryPos = 99;
let formattedNumber, playerName, playerImage, profile, profilePicNew, playerId, playerContact;
let smash, selection, unmatched, shock, getReady, wellDoneSound, gameOverSound, boom, ticktock;
let scoreSessionArcade, scoreSessionSpeed, matchedNo, unmatchedFlag, mousePressedY, mouseReleasedY, swipeY, swipeBegin;
let xGlobal, yGlobal, bombCounter, bombIsDetonating, bombRows, lineColors;
let bombCandPlace=[], bombCoords=[], vanishCandidates=[], vanishTiles=[], bombTile=[];
let sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;
let oldSpeed, clockIsPressed, clockIsTicking, clockCounter, clockIsPresent, inp, newHiScore, bonusRatio, soundPlay;
let speedTrial = false;
let buggy = false;
let modeGrab;
let firstModeClick = true;
let entryShown = false;

function preload() {
  div1 = select("body #google_sign_in");
  div1.center("horizontal");
  div1.position(deviceWidth/2, 15);
  symbols = loadImage("shapes.png");
  tileDestruction = loadImage("tile_distruction.png");
  highScoresTable = loadImage("leaderboard.jpg");
  infoFrame = loadImage("info_frame.png");
  borderImage = loadImage("border.png");
  menuImage = loadImage("menu_background_logo.jpg");
  bombImage = loadImage("bomb.png");
  clockImage = loadImage("clock.png");
  bombDestruction = loadImage("smoke_SpiteSheet.png");
  gameFont = loadFont("BAUHS93.TTF");
  levelFont = loadFont("Lemon-Regular.ttf");
  testFont = loadFont("ARIALNB.TTF");
  hiscoresArcade = loadStrings("boring_arcade_data_file.txt");
  hiscoresSpeed = loadStrings("boring_speed_data_file.txt");
  smash = createAudio("smash.mp3");
  selection = createAudio("selection.mp3");
  unmatched = createAudio("unmatched.mp3");
  shock = createAudio("shock.mp3");
  getReady = createAudio("getready.mp3");
  wellDoneSound = createAudio("welldone.mp3");
  gameOverSound = createAudio("game_over.mp3");
  boom = createAudio("boom.mp3");
  ticktock = createAudio("clock_sound.mp3");
}

function setup() {
  if (window.DeviceOrientationEvent) { window.addEventListener('resize', function() { location.reload(); }, false); } // Reloads page on oriantation change
  formattedNumber = ("00" + random(100)).slice(-5);
  playerName = "Guest_" + formattedNumber;
  if (windowWidth > windowHeight / 2 ) {
    deviceWidth = windowHeight / 2;
    deviceHeight = windowHeight;
  } else {
    deviceWidth = windowWidth;
    deviceHeight = deviceWidth * 2;
  }
  let cnv = createCanvas(deviceWidth, deviceHeight);
  createEntries();
  for (let i = 0; i < entriesArcade.length; i++) {
    profilePicArcade[i] = createImg(entriesArcade[i][0]);
    profilePicArcade[i].hide();
    profilePicSpeed[i] = createImg(entriesSpeed[i][0]);
    profilePicSpeed[i].hide();
  }
  pixel = deviceWidth / 280; // The smallest windowWidth size of any device (Galaxy Fold) is 280
  roundness = 10 * pixel;
  borderTile = 0 * pixel; // From far-left to far-right of the tile, not one edge only
  leftBackground = 17 *pixel;
  tileSize = (deviceWidth - 2*leftBackground) / maxTilesHor - borderTile;
  for (let i = 0; i < symbolsAmount; i++) {
    types[i] = symbols.get(i * symbolsWidth, 0, symbolsWidth, symbolsHeight);
  }
  topBackground = deviceWidth / 6.147;
  laserHeight = topBackground + (tileSize + borderTile) * maxTilesVer;
  laserOffset = deviceWidth / 6.25 - borderTile/2 - 1*pixel;
  maxDistance = maxTilesVer - 1;
  textFont(gameFont);
  noStroke();

  buttonStart = createImg("button_start.png");
  buttonStart.mousePressed(startGame);
  buttonStart.size(90*pixel, 90*pixel);
  buttonStart.position((windowWidth - deviceWidth)/2 + 95*pixel, deviceHeight - 130*pixel);
  buttonLeaderboard = createImg("button_leader.png");
  buttonLeaderboard.mousePressed(showHiScoresArcade);
  buttonLeaderboard.size(60*pixel, 60*pixel);
  buttonLeaderboard.position((windowWidth - deviceWidth)/2 + 200*pixel, deviceHeight - 115*pixel);
  buttonInfo = createImg("button_info.png");
  buttonInfo.mousePressed(showInfo);
  buttonInfo.size(60*pixel, 60*pixel);
  buttonInfo.position((windowWidth - deviceWidth)/2 + 20*pixel, deviceHeight - 115*pixel);
  buttonQuit = createImg("close_button.png");
  buttonQuit.mousePressed(menu);
  buttonQuit.size(30*pixel, 30*pixel);
  buttonQuit.hide();
  buttonNext = createImg("right_arrow_button.png");
  buttonNext.size(30*pixel, 30*pixel);
  buttonNext.hide();
  buttonPrev = createImg("left_arrow_button.png");
  buttonPrev.size(30*pixel, 30*pixel);
  buttonPrev.hide();
  buttonSoundYes = createImg('sound-yes.png');
  buttonSoundYes.mousePressed(toggleSound);
  buttonSoundYes.size(35*pixel, 35*pixel);
  buttonSoundYes.position((windowWidth + deviceWidth)/2 - 45*pixel, 10*pixel);
  buttonSoundNo = createImg('sound-no.png');
  buttonSoundNo.mousePressed(toggleSound);
  buttonSoundNo.size(35*pixel, 35*pixel);
  buttonSoundNo.position((windowWidth + deviceWidth)/2 - 45*pixel, 10*pixel);
  buttonSoundNo.hide();
  buttonArcade = createButton('Arcade mode');
  buttonArcade.addClass('modes');
  buttonArcade.style('font-size', (20*pixel).toString()+'px');
  buttonArcade.size(240*pixel);
  buttonArcade.mousePressed(arcadeMode);
  buttonArcade.position((windowWidth - deviceWidth)/2, deviceHeight - 230*pixel);
  buttonArcade.center('horizontal');
  buttonSpeed = createButton('Speed Trial mode');
  buttonSpeed.addClass('modes');
  buttonSpeed.style('font-size', (20*pixel).toString()+'px');
  buttonSpeed.size(240*pixel);
  buttonSpeed.mousePressed(speedMode);
  buttonSpeed.position((windowWidth - deviceWidth)/2, deviceHeight - 200*pixel);
  buttonSpeed.center('horizontal');

  buttonBuggy = createButton('Buggy mode');
  buttonBuggy.addClass('modes');
  buttonBuggy.style('font-size', (20*pixel).toString()+'px');
  buttonBuggy.size(240*pixel);
  buttonBuggy.mousePressed(buggyMode);
  buttonBuggy.position((windowWidth - deviceWidth)/2, deviceHeight - 170*pixel);
  buttonBuggy.center('horizontal');

  inp = createInput('Type your name');
  inp.addClass('inputbox');
  inp.style('font-size', (20*pixel).toString()+'px');
  inp.size(134*pixel, 19*pixel);
  inp.input(inputEvent);
  inp.hide();

  smash.volume(0.6);
  selection.volume(0.4);
  unmatched.volume(1);
  shock.volume(0.8);
  getReady.volume(1);
  wellDoneSound.volume(0.5);
  gameOverSound.volume(0.8);
  boom.volume(1);
  ticktock.volume(1);

  lineColors = [  color(101,168,250), color(237, 64, 71), color(255,157, 69),
                  color(113,193, 66), color(195, 56,221), color(249, 96,187),
                  color(214,209, 54), color(110, 74,100), color(211,126, 76) ];

  if (iOS()) { soundPlay = false; }
  else { soundPlay = true ; }

  menu();
}

function draw() {
  if (playing) {
    translate(leftOffset, 0);
    background(0, 0, 60);
    if (speedTrial) {
      if (speed != 0) {
        speed += 0.00002*pixel;
      }
    } else {
      checkSwipe();
    }
    if (showningLevel) {
      displayLevel();
    } else {
      for (yGlobal = 0; yGlobal < tilesVer; yGlobal++) {
        for (xGlobal = 0; xGlobal < tilesHor; xGlobal++) {
          tiles[xGlobal][yGlobal].show();
        }
      }
      rect(0, 0, deviceWidth, topBackground); //Don't show the tiles behind score
      laser();
    }
    image(borderImage, -leftOffset, 0, deviceWidth, deviceHeight);
    displayScore();
  } else if (gameOver) {
    gameOverFunc();
  } else if (levelFinished) {
    wellDone();
  }
}

function checkNewName() {
  if (entryShown) {
    entryShown = false;
    if (newHiScore) {
      newHiScore = false;
      if (speedTrial) {
        entriesSpeed[newEntryPos][1] = playerName;
        if (score > scoreSessionSpeed) {
          sendEmail(playerImage, playerName, score, playerId, playerContact, "Speed Trial");
        }
      } else {
        entriesArcade[newEntryPos][1] = playerName;
        if (score > scoreSessionArcade) {
          sendEmail(playerImage, playerName, score, playerId, playerContact, "Arcade");
        }
      }
      newEntryPos = 99;
    }
  }
}

function menu() {
  checkNewName();
  initializeSounds();
  noLoop();
  buttonQuit.hide();
  buttonNext.hide();
  buttonPrev.hide();
  inp.hide();
  if (soundPlay) {
    buttonSoundYes.show();
    buttonSoundNo.hide();
  } else {
    buttonSoundYes.hide();
    buttonSoundNo.show();
  }
  if (newEntryPos < 99) {
    if (speedTrial) {
      showHiScoresSpeed();
    } else {
      showHiScoresArcade();
    }
  } else {
    push();
    translate(0, 0);
    image(menuImage, 0, 0, deviceWidth, deviceHeight);
    pop();
    if (profile == null) { div1.show(); }
    else { div1.hide(); }
    buttonStart.show();
    buttonLeaderboard.show();
    buttonInfo.show();
    buttonArcade.show();
    buttonSpeed.show();
    buttonBuggy.show();
    score = 0;
    level = 0;
    playing = false;
    mouseClicks = false;
    if (firstModeClick) {
      firstModeClick = false;
      modeGrab = get(10*pixel, deviceHeight - 250*pixel, deviceWidth - 20*pixel, 120*pixel);
    }
    if (speedTrial) {
      updateMode(200*pixel);
    } else {
      if (! buggy) {
        updateMode(230*pixel);
      } else {
        updateMode(170*pixel);
      }
    }
  }
}

function updateMode(h) {
  push();
  fill(255, 255, 255, 70);
  rect(20*pixel, deviceHeight - h, deviceWidth - 40*pixel, 25*pixel);
  pop();
}

function initializeSounds() {
  if (soundPlay) {
    if (smash.time() > 0) {
      smash.stop();
    }
    if (selection.time() > 0) {
      selection.stop();
    }
    if (unmatched.time() > 0) {
      unmatched.stop();
    }
    if (shock.time() > 0) {
      shock.stop();
    }
    if (getReady.time() > 0) {
      getReady.stop();
    }
    if (wellDoneSound.time() > 0) {
      wellDoneSound.stop();
    }
    if (gameOverSound.time() > 0) {
      gameOverSound.stop();
    }
    if (boom.time() > 0) {
      boom.stop();
    }
    if (ticktock.time() > 0) {
      ticktock.stop();
    }
  }
}

function toggleSound() {
  if (soundPlay) { soundPlay = false; }
  else { soundPlay = true; }
  menu();
}

function arcadeMode() {
  buttonLeaderboard.mousePressed(showHiScoresArcade);
  speedTrial = false;
  buggy = false;
  image(modeGrab, 10*pixel, deviceHeight - 250*pixel);
  updateMode(230*pixel)
}

function speedMode() {
  buttonLeaderboard.mousePressed(showHiScoresSpeed);
  speedTrial = true;
  buggy = false;
  image(modeGrab, 10*pixel, deviceHeight - 250*pixel);
  updateMode(200*pixel)
}

function buggyMode() {
  buttonLeaderboard.mousePressed(showHiScoresArcade);
  speedTrial = false;
  buggy = true;
  image(modeGrab, 10*pixel, deviceHeight - 250*pixel);
  updateMode(170*pixel)
}

function nextPage() {
  buttonNext.hide();
  buttonPrev.position((windowWidth + deviceWidth)/2 - 43*pixel, 515*pixel);
  buttonPrev.mousePressed(showInfo);
  buttonPrev.show();
  push();
  translate(0, 0);
  image(menuImage, 0, 0, deviceWidth + 150*pixel, deviceHeight);
  image(infoFrame, 0, 0, deviceWidth, deviceHeight);

  textFont(levelFont);
  textLeading(25*pixel);

  textSize(27*pixel);
  strokeWeight(5*pixel);
  stroke(59, 77, 79);
  fill(237, 255, 240);
  text(titleText2, 50*pixel, 105*pixel);

  textSize(15*pixel);
  strokeWeight(3*pixel);
  stroke(0, 0, 60);
  fill(135, 230, 214);
  text(infoText2, 50*pixel, 130*pixel, 215*pixel, 450*pixel);

  pop();
}

function showInfo() {
  div1.hide();
  buttonStart.hide();
  buttonLeaderboard.hide();
  buttonInfo.hide();
  buttonSoundYes.hide();
  buttonSoundNo.hide();
  buttonArcade.hide();
  buttonSpeed.hide();
  buttonBuggy.hide();
  buttonQuit.position((windowWidth + deviceWidth)/2 - 43*pixel, 40*pixel);
  buttonQuit.show();
  buttonPrev.hide();
  buttonNext.position((windowWidth + deviceWidth)/2 - 43*pixel, 515*pixel);
  buttonNext.mousePressed(nextPage);
  buttonNext.show();
  push();
  translate(0, 0);
  image(menuImage, 0, 0, deviceWidth + 150*pixel, deviceHeight);
  image(infoFrame, 0, 0, deviceWidth, deviceHeight);

  textFont(levelFont);
  textLeading(27*pixel);

  textSize(27*pixel);
  strokeWeight(5*pixel);
  stroke(59, 77, 79);
  fill(237, 255, 240);
  text(titleText1, 50*pixel, 105*pixel);

  textSize(15*pixel);
  strokeWeight(3*pixel);
  stroke(0, 0, 60);
  fill(135, 230, 214);
  text(infoText1, 50*pixel, 125*pixel, 215*pixel, 450*pixel);

  pop();
}

function showHiScoresArcade() {
  checkNewName();
  div1.hide();
  buttonStart.hide();
  buttonLeaderboard.hide();
  buttonInfo.hide();
  buttonSoundYes.hide();
  buttonSoundNo.hide();
  buttonArcade.hide();
  buttonSpeed.hide();
  buttonBuggy.hide();
  inp.hide();
  buttonQuit.position((windowWidth + deviceWidth)/2 - 37*pixel, 0*pixel);
  buttonQuit.show();
  buttonPrev.hide();
  buttonNext.position((windowWidth - deviceWidth)/2 - 5*pixel, 0*pixel);
  buttonNext.mousePressed(showHiScoresSpeed);
  buttonNext.show();
  let nameWidthLimit = 125*pixel;
  let scaleFactor = 0.8;
  push();
  translate(0, 0);
  image(highScoresTable, 0, 0, deviceWidth, deviceHeight);

  textFont(gameFont);
  textSize(25*pixel);
  textAlign(CENTER);
  fill(94, 200, 242);
  scale(scaleFactor, 1);
  text("Arcade Leaderboard", (deviceWidth/2)/scaleFactor, 39*pixel);
  textFont(testFont);
  scale(1/scaleFactor, 1);
  textSize(20*pixel);
  for (let i = 0; i < entriesArcade.length; i++) {
    image(profilePicArcade[i], 40*pixel, 33*pixel*i + 56*pixel, 30*pixel, 30*pixel);
    textAlign(LEFT);
    fill(255);
    text(entriesArcade[i][1].substring(0, nameCharacters(entriesArcade[i][1], nameWidthLimit)), 85*pixel, 33*pixel*i + 78*pixel);
    textAlign(RIGHT);
    fill(252, 186, 3);
    text(entriesArcade[i][2], deviceWidth - 25*pixel, 33*pixel*i + 78*pixel);
  }
  if (newEntryPos < 99) {
    entryShown = true;
    noFill();
    strokeWeight(3*pixel);
    stroke(255, 128, 0);
    rect(76*pixel, 33*pixel*newEntryPos + 56*pixel, 191*pixel, 30*pixel, 10*pixel);

    if (profile == null) {
      inp.position((windowWidth - deviceWidth)/2 + 83*pixel, 33*pixel*newEntryPos + 61*pixel);
      inp.show();
      inp.elt.focus();
      inp.elt.select();
    } else {
      checkNewName(); //To send the email from the leaderboard screen
    }
  }
  pop();
}

function showHiScoresSpeed() {
  checkNewName();
  div1.hide();
  buttonStart.hide();
  buttonLeaderboard.hide();
  buttonInfo.hide();
  buttonNext.hide();
  buttonSoundYes.hide();
  buttonSoundNo.hide();
  buttonArcade.hide();
  buttonSpeed.hide();
  buttonBuggy.hide();
  inp.hide();
  buttonPrev.position((windowWidth - deviceWidth)/2 - 5*pixel, 0*pixel);
  buttonPrev.mousePressed(showHiScoresArcade);
  buttonPrev.show();
  buttonQuit.position((windowWidth + deviceWidth)/2 - 37*pixel, 0*pixel);
  buttonQuit.show();
  let nameWidthLimit = 125*pixel;
  let scaleFactor = 0.7;
  push();
  translate(0, 0);
  image(highScoresTable, 0, 0, deviceWidth, deviceHeight);

  textFont(gameFont);
  textSize(25*pixel);
  textAlign(CENTER);
  fill(94, 200, 242);
  scale(scaleFactor, 1);
  text("Speed Trial Leaderboard", (deviceWidth/2)/scaleFactor, 39*pixel);
  textFont(testFont);
  scale(1/scaleFactor, 1);
  textSize(20*pixel);
  for (let i = 0; i < entriesSpeed.length; i++) {
    image(profilePicSpeed[i], 40*pixel, 33*pixel*i + 56*pixel, 30*pixel, 30*pixel);
    textAlign(LEFT);
    fill(255);
    text(entriesSpeed[i][1].substring(0, nameCharacters(entriesSpeed[i][1], nameWidthLimit)), 85*pixel, 33*pixel*i + 78*pixel);
    textAlign(RIGHT);
    fill(252, 186, 3);
    text(entriesSpeed[i][2], deviceWidth - 25*pixel, 33*pixel*i + 78*pixel);
  }
  if (newEntryPos < 99) {
    entryShown = true;
    noFill();
    strokeWeight(3*pixel);
    stroke(255, 128, 0);
    rect(76*pixel, 33*pixel*newEntryPos + 56*pixel, 191*pixel, 30*pixel, 10*pixel);

    if (profile == null) {
      inp.position((windowWidth - deviceWidth)/2 + 83*pixel, 33*pixel*newEntryPos + 61*pixel);
      inp.show();
      inp.elt.focus();
      inp.elt.select();
    } else {
      checkNewName(); //To send the email from the leaderboard screen
    }
  }
  pop();
}

function inputEvent() {
  if (this.value() != '') {
    //print(entriesArcade[newEntryPos][1])
    //console.log('you are typing: ', this.value());
    playerName = this.value();
  }
}

function updateLeaderboards() {
  if (speedTrial) {
    newEntryPos = newEntryPositionSpeed(score);
  } else {
    newEntryPos = newEntryPositionArcade(score);
  }
  if (newEntryPos < 99) {
    newHiScore = true;
    new_entry = [playerImage, playerName, score];
    if (speedTrial) {
      profilePicSpeed.splice(newEntryPos, 0, profilePicNew); // Adds the new entry
      profilePicSpeed.splice(profilePicSpeed.length - 1, 1); // Deletes the last entry
      updateEntriesSpeed();
    } else {
      profilePicArcade.splice(newEntryPos, 0, profilePicNew); // Adds the new entry
      profilePicArcade.splice(profilePicArcade.length - 1, 1); // Deletes the last entry
      updateEntriesArcade();
    }
  }
}

function nameCharacters(name, widthLimit) {
  let widthCurrent;
  for (let i = 0; i < name.length; i++) {
    widthCurrent = textWidth(name.substring(0, i));
    if (widthCurrent > widthLimit) {
      return i;
    }
  }
  return name.length;
}

function createEntries() {
  let i;
  for (i = 0; i < hiscoresArcade.length; i++) {
    listArcade.push(hiscoresArcade[i].split(","));
    listSpeed.push(hiscoresSpeed[i].split(","));
  }
  for (i = 0; i < listArcade.length; i++) {
    entriesArcade.push([listArcade[i][0], listArcade[i][1], int(listArcade[i][2])]);
    entriesSpeed.push([listSpeed[i][0], listSpeed[i][1], int(listSpeed[i][2])]);
  }
}

function updateEntriesArcade() {
  entriesArcade.splice(newEntryPos, 0, new_entry); // Adds the new entry
  entriesArcade.splice(entriesArcade.length - 1, 1); // Deletes the last entry
}

function updateEntriesSpeed() {
  entriesSpeed.splice(newEntryPos, 0, new_entry); // Adds the new entry
  entriesSpeed.splice(entriesSpeed.length - 1, 1); // Deletes the last entry
}

function newEntryPositionArcade(sc) {
  for (let i = 0; i < entriesArcade.length; i++) {
    if (sc > entriesArcade[i][2]) {
      return i;
    }
  }
  return 99;
}

function newEntryPositionSpeed(sc) {
  for (let i = 0; i < entriesSpeed.length; i++) {
    if (sc > entriesSpeed[i][2]) {
      return i;
    }
  }
  return 99;
}

function sendEmail(plimg, nck, scr, id, eml, md) {
  let params = {
  from_name: nck,
  message: plimg + "," + nck + "," + str(scr) + "," + id + "," + eml + "," + md
  };
  emailjs.send( 'service_d7c6m1o', 'template_fwhw6qj', params)
  .then(function(response) {
     console.log('Mail send SUCCESS!', response.status, response.text);
  }, function(error) {
     console.log('Mail send FAILED...', error);
  });
}

function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
}

function getProfileData() {
  if (profile == null) {
    playerImage = "https://grifoi.org/match-rush/guest_image.png";
    playerId = "NULL";
    playerContact = "NULL";
  } else {
    playerImage = profile.getImageUrl();
    playerName = profile.getName();
    playerId = profile.getId();
    playerContact = profile.getEmail();
  }
  profilePicNew = createImg(playerImage);
  profilePicNew.hide();
  scoreSessionArcade = getBestScoreArcade(playerName);
  scoreSessionSpeed = getBestScoreSpeed(playerName);
}

function getBestScoreArcade(name) {
  for (let i = 0; i < entriesArcade.length; i++) {
    if (entriesArcade[i][1] == name) {
      return entriesArcade[i][2];
    }
  }
  return 0;
}

function getBestScoreSpeed(name) {
  for (let i = 0; i < entriesSpeed.length; i++) {
    if (entriesSpeed[i][1] == name) {
      return entriesSpeed[i][2];
    }
  }
  return 0;
}

function startGame() {
  div1.hide();
  buttonStart.hide();
  buttonLeaderboard.hide();
  buttonInfo.hide();
  buttonSoundYes.hide();
  buttonSoundNo.hide();
  buttonArcade.hide();
  buttonSpeed.hide();
  buttonBuggy.hide();
  speed = deviceWidth / 920; // Coresponds to level 3 speed
  prepareNewLevel();
  getProfileData();
  newHiScore = false;
  //To test the well done sequence:
  // playing = false;
  // gameOver = false;
  // levelFinished = true;
  // frameCount = 0;
  // mouseClicks = false;

  loop();
}

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function prepareNewLevel() {

  if (speedTrial) {
    showningLevel = false;
    level = 2;
    bonusRatio = 0.05; //0.05
  } else {
    showningLevel = true;
    bonusRatio = 0.2;
  }

  level++;
  let speedFactor = 1000 - int(level - 1) * 40;
  if (speedFactor <= 300) { speedFactor = 300; }
  tilesHor = level % 3;
  if (tilesHor == 0) { tilesHor = 5 }
  else { tilesHor += 2 }
  matchedNo = int(((level - 1) % 9) / 3) + 3;
  bombRows = matchedNo;
  if (matchedNo == 3) {
    tilesVer = 21;
    maxDistance = 9;
  } else if (matchedNo == 4) {
    tilesVer = 20;
    maxDistance = 12 - tilesHor;
  } else { // matchedNo == 5
    tilesVer = 20;
    if (tilesHor == 5) {
      maxDistance = 6;
    } else {
      maxDistance = 8;
    }
  }

  if (speedTrial) { // Don't initialize the speed
    tilesVer = 201; //201
  } else {
    speed = deviceWidth / speedFactor;
  }

  if (buggy) {
    level = 0;
  }

  print("speed:", speed, "speed factor:", speedFactor);
  tileCount = tilesHor * tilesVer;
  selectedTiles = 0;
  leftOffset = (deviceWidth - ((tileSize + borderTile)*tilesHor)) / 2;
  playing = true;
  quiting = false;
  mouseClicks = true;
  gameOver = false;
  levelFinished = false;
  unmatchedFlag = false;
  mousePressedY = 0;
  swipeBegin = false;
  bombCounter = 0;
  bombIsDetonating = false;
  clockIsPressed = false;
  clockIsTicking = false;
  clockIsPresent = false;
  clockCounter = 0;
  bombTile = [tilesHor - 1, tilesVer - 1];
  for (let x = 0; x < tilesHor; x++) {
    if (tiles[x] != null) { tiles[x].splice(0, tiles[x].length); }
    if (assinments[x] != null) { assinments[x].splice(0, assinments[x].length); }
    tiles[x] = [];
    assinments[x] = [];
    for (let y = 0; y < tilesVer; y++) {
      tiles[x][y] = new Tile(x*(tileSize + borderTile) + borderTile/2, -(y+1)*(tileSize + borderTile) + borderTile/2 + topBackground);
      assinments[x][y] = null;
    }
  }
  if (bombCandPlace != null) { bombCandPlace.splice(0, bombCandPlace.length); }
  bombCandPlace = [];
  assignTypes();
  fill(0, 0, 60);
  //displayLevel variables
  t = 0;
  t0 = 0;
  y0 = topBackground + 60*pixel;
  v0 = 0.2*pixel;
  still = false;
  duration = 150;
  decelerationTime = 35;
  levelPhase = 0;
}

function wellDone() {
  if (clockIsTicking) {
    if (soundPlay) { ticktock.stop(); }
  }
  let vel = 1.26;
  mouseClicks = false;
  if (frameCount < 200 / vel) {
    if (frameCount == 1) {
      if (soundPlay) { wellDoneSound.play(); }
    }
    push();
    translate(leftOffset, 0);
    background(0, 0, 60);
    image(borderImage, -leftOffset, 0, deviceWidth, deviceHeight);
    displayScore();
    fill(252, 186, 3);
    textFont(levelFont);
    textAlign(CENTER, CENTER);
    textSize(deviceWidth / (frameCount/50*vel));
    drawingContext.shadowOffsetX = -5*pixel*pixelDensity()/2;
    drawingContext.shadowOffsetY = 5*pixel*pixelDensity()/2;
    drawingContext.shadowBlur = 10*pixel*pixelDensity()/2;
    drawingContext.shadowColor = "orange";
    text("Well", deviceWidth/2 - leftOffset, deviceHeight/2 - (6500/frameCount - frameCount/200)*pixel);
    text("Done!", deviceWidth/2 - leftOffset, deviceHeight/2 + (6500/frameCount - frameCount/200)*pixel);
    pop();
  } else if (frameCount > 270) {
    prepareNewLevel();
  }
}

function displayLevel() {
  if (t == 0 && showningLevel) {
    if (soundPlay) { getReady.play(); }
  }
  let v, y, a;
  if (! still) {
    if (t <= decelerationTime) {
      a = 0.2*pixel;
    } else {
      a = -0.2*pixel;
    }
    v = a*(t-t0) + v0;
    y = 0.5*a*(t-t0)**2 + v0*(t-t0) + y0;
  } else {
    a = 0;
    v0 = 0.2*pixel;
    v = a*(t-t0) + v0;
    y = 0.5*a*(t-t0)**2 + v0*(t-t0) + y0;

  }
  if (v > -0.1 && v < 0.1) {
    still = true;
    y0 = y - 9*pixel; //The factor 9 is set for smoothness at stop time
  }
  if (t == decelerationTime) {
    v0 = v;
    y0 = y;
    t0 = t;
  }
  if (t <= duration) {
    push();
    translate(-leftOffset, 0);
    fill(230, 230, 70);
    textFont(levelFont);
    textAlign(CENTER, BOTTOM);
    scale(1, 1 + v/30);
    drawingContext.shadowOffsetX = -5*pixel*pixelDensity()/2;
    drawingContext.shadowOffsetY = 5*pixel*pixelDensity()/2;
    drawingContext.shadowBlur = 10*pixel*pixelDensity()/2;
    drawingContext.shadowColor = color(170, 170, 0);
    textSize(deviceWidth / 5);
    text("Level " + level, deviceWidth/2, y - 80*pixel);
    textSize(deviceWidth / 6);
    fill(255 - matchedNo*50, matchedNo*50, 255 - matchedNo*50);
    if (! buggy) {
      text("Match " + matchedNo, deviceWidth/2, y);
    } else {
      text("Match ?", deviceWidth/2, y);
    }
    pop();
    t++;
  } else {
    if (levelPhase == 1) {
      showningLevel = false;
    }
    y0 = y;
    t = 0;
    t0 = 0;
    v0 = 0.2*pixel;
    still = false;
    duration = 100;
    decelerationTime = 100;
    levelPhase = 1;
    displayLevel(); //So it doesn't blink
  }
}

function gameOverFunc() {
  let vel = 4;
  if (frameCount < 121 / vel) {
    if (frameCount == 25) {
        if (soundPlay) { gameOverSound.play(); }
    }
    push();
    fill(0, 0, 60);
    rect(0, deviceHeight/2 - deviceWidth/10.5, deviceWidth, deviceWidth/3.6);
    image(borderImage, 0, 0, deviceWidth, deviceHeight);
    drawingContext.shadowOffsetX = -5*pixel*pixelDensity()/2;
    drawingContext.shadowOffsetY = 5*pixel*pixelDensity()/2;
    drawingContext.shadowBlur = 10*pixel*pixelDensity()/2;
    drawingContext.shadowColor = color(100, 100, 255);
    fill(180, 100, 255);
    rect(-deviceWidth + frameCount*2.48*vel*pixel, deviceHeight/2 - deviceWidth/12.5, deviceWidth - 2*leftBackground, deviceWidth/60);
    rect(deviceWidth + 2*leftBackground - frameCount*2.48*vel*pixel, deviceHeight/2 + deviceWidth/7.5, deviceWidth - 2*leftBackground, deviceWidth/60);
    textSize(deviceWidth / 5.77);
    textAlign(RIGHT, CENTER);
    text("Game", 0 + frameCount*vel*pixel + 20*pixel, deviceHeight/2);
    textAlign(LEFT, CENTER);
    text("Over", deviceWidth - frameCount*vel*pixel, deviceHeight/2);
    pop();
  } else if (frameCount > 1000 / vel) {
    frameCount = 0;
    updateLeaderboards();
    menu();
  }
}

function displayScore() {
  push();
  textSize(deviceWidth / 10.71);
  fill(94, 200, 242);
  text("SCORE", -leftOffset + deviceWidth / 12, deviceWidth / 8.82);
  fill(252, 186, 3);
  text(score, -leftOffset + deviceWidth / 2.5, deviceWidth / 8.82);
  pop();
}

function laser() {
  //The following 10 lines don't relate to the laser function and are placed to trigger the smash sound after a bomb has exploded
  //  if (bombIsDetonating && mouseClicks) { // The mouseClicks check is to prevent smash sound to be heard while burning
  if (bombIsDetonating) {
    if (frameCount == timeSmash && vanishTiles.length > 0) {
      if (soundPlay) {
        if (smash.time() > 0) {
          smash.stop();
        }
        smash.play();
      }
    }
  }

  let rand = random(80);
  let from = color(255 - rand, 255 - rand, 255 - rand);
  let to = color(200 - rand, 0, 0);
  let interA = lerpColor(from, to, 0.33);
  let interB = lerpColor(from, to, 0.66);
  let thickness = deviceWidth / 150;
  let length = deviceWidth / 22.5;
  push();
  translate(-leftOffset + 5*pixel, 0);
  fill(from);
  rect(0, laserHeight+thickness*0, deviceWidth - 10*pixel, thickness);
  fill(interA);
  rect(0, laserHeight+thickness*1, deviceWidth - 10*pixel, thickness);
  rect(0, laserHeight-thickness*1, deviceWidth - 10*pixel, thickness);
  fill(interB);
  rect(0, laserHeight+thickness*2, deviceWidth - 10*pixel, thickness);
  rect(0, laserHeight-thickness*2, deviceWidth - 10*pixel, thickness);
  fill(to);
  rect(0, laserHeight+thickness*3, deviceWidth - 10*pixel, thickness);
  rect(0, laserHeight-thickness*3, deviceWidth - 10*pixel, thickness);
  rand = random(0, deviceWidth - 10*pixel - length);
  rect(rand, laserHeight-thickness*4, length, thickness);
  rand = random(0, deviceWidth - 10*pixel - length);
  rect(rand, laserHeight+thickness*4, length, thickness);
  pop();
}

function assignTypes() {
  let x, y;
  let randType, indexOfType, randX, randY, minY, maxY, placed, placedX, placedY, t;
  let placedAll = 0;
  let tries = 0;

  randType = random(types);
  indexOfType = types.findIndex(t => t === randType);
  while (placedAll < tilesHor * tilesVer && tries < maxTries) {
    for (y = 0; y < tilesVer; y++) {
      for (x = 0; x < tilesHor; x++) {
        if (assinments[x][y] == null) {
          placedX = x;
          placedY = y;
          break;
        }
      }
      if (assinments[placedX][placedY] == null) {
        break;
      }
    }
    randX = placedX;
    randY = placedY;
    indexOfType++;
    if (indexOfType == types.length) {
      indexOfType = 0;
    }
    randType = types[indexOfType];
    placed = 0;
    minY = randY;
    maxY = randY;
    while (placed < matchedNo && tries < maxTries) {
      tries++;
      if (validBlock(randX, randY, minY) && assinments[randX][randY] == null && abs(randY - minY) <  maxDistance && abs(randY - maxY) <  maxDistance) {
        tiles[randX][randY].type = randType;
        assinments[randX][randY] = randType;
        placed++;
        placedAll++;
        if (randY < minY) {
          minY = randY;
        }
        if (randY > maxY) {
          maxY = randY;
        }
        //print("success", "tries", tries, "minY", minY, "maxY", maxY, "randX", randX, "randY", randY, "placed", placed, "placedAll", placedAll, "tiles", maxDistance);
      } else {
        //print("fail", "minY", minY, "maxY", maxY, "randY", randY, "placed", placed, "placedAll", placedAll, "tiles", maxDistance);
      }
      randX = int(random(tilesHor));
      randY = int(random(tilesVer));
    }
  }
  print("tries:", tries, "max distance:", maxDistance);
}

function validBlock(rx, ry, my) {
  let x, y;
  let blankRows, filledRows, blanksBeforeFilled, actualValue, firstFilledRow;
  let availableSpaces = [];

  actualValue = assinments[rx][ry];
  assinments[rx][ry] = types[0];
  for (y = 0; y < tilesVer; y++) {
    availableSpaces[y] = false;
    for (x = 0; x < tilesHor; x++) {
      if (assinments[x][y] == null) {
        availableSpaces[y] = true;
        break;
      }
    }
  }
  assinments[rx][ry] = actualValue;

  blankRows = 0;
  filledRows = 0;
  blanksBeforeFilled = 0;
  firstFilledRow = false;
  for (y = 0; y < tilesVer; y++) {
    if (availableSpaces[y]) {
      blanksBeforeFilled = 0;
      blankRows++;
      filledRows = 0;
      firstFilledRow = true;
    } else {
      filledRows++;
      if (firstFilledRow) {
        blanksBeforeFilled = blankRows;
        firstFilledRow = false;
      }
      if (y <= ry && (abs(y - my) + 1 >= maxDistance || filledRows > maxDistance - matchedNo) && blanksBeforeFilled < matchedNo && blanksBeforeFilled > 0) {
        //print("filledRows false", filledRows, "blanksBeforeFilled", blanksBeforeFilled);
        return false;
      }
      blankRows = 0;
    }
  }
  //print("filledRows true", filledRows, "blanksBeforeFilled", blanksBeforeFilled);
  return true;
}

function checkMatch() {
  let select = [];
  let i;
  for (i = 0; i < matchedNo; i++) {
    select[i] = [];
  }
  i = 0;
  for (let y = 0; y < tilesVer; y++) {
    for (let x = 0; x < tilesHor; x++) {
      if (tiles[x][y].selected) {
        select[i][0] = x;
        select[i][1] = y;
        i++;
      }
    }
  }
  let same = tiles[select[0][0]][select[0][1]].type;
  let matched = true;
  for (i = 1; i < matchedNo; i++) {
    if (tiles[select[i][0]][select[i][1]].type != same) {
      matched = false;
    }
  }
  if (matched) {
    if (soundPlay) {
      if (smash.time() > 0) {
        smash.stop();
      }
      smash.play();
    }
    for (i = 0; i < matchedNo; i++) {
      tiles[select[i][0]][select[i][1]].shown = false;
      tiles[select[i][0]][select[i][1]].selected = false;
      frameCount = 0;
      selectedTiles--;
      score += 1;
    }
  } else {
    if (soundPlay) {
      if (unmatched.time() > 0) {
        unmatched.stop();
      }
      unmatched.play();
    }
    // print("No match");
    for (i = 0; i < matchedNo; i++) {
      tiles[select[i][0]][select[i][1]].selected = false;
      tiles[select[i][0]][select[i][1]].matched = false;
      frameCount = 0;
      selectedTiles--;
    }
  }
}

function checkSwipe() {
  if (mousePressedY != 0) {
    mouseReleasedY = mouseY;
    swipeY = mouseReleasedY - mousePressedY;
    if (swipeY > 20 && swipeBegin) {
      swipeBegin = false;
    }
    if (swipeY > 0 && ! swipeBegin) {
      for (let y = 0; y < tilesVer; y++) {
        for (let x = 0; x < tilesHor; x++) {
          tiles[x][y].y += swipeY;
          mousePressedY = mouseReleasedY;
        }
      }
    }
  }
}

function mouseReleased() {
  if (playing && ! showningLevel) {
    mousePressedY = 0;
  }
}

function mousePressed() {
  // Το έβγαλα γιατί μπορεί να θέλει ο παίκτης να συμπληρώσει κάτι στο όνονά του. Επίσης δεν λειτουργεί με το πρώτο click εκτός inputbox αλλά με το δεύτερο.
  // if (entryShown && document.activeElement != document.querySelector('.inputbox')) {
  //   checkNewName(); //To send the email from the leaderboard screen
  // }
  if (! mouseClicks) {
    return true; // So that it check if a button is pressed on main menu.
  } else {
    if (! playing) {
      if (mouseY < topBackground - 12*pixel && mouseX > deviceWidth * 65/80 && mouseX < deviceWidth * 73/80 && quiting) {
        menu();
      } else {
        playing = true;
        quiting = false;
        loop();
        if (clockIsTicking) {
          if (soundPlay) { ticktock.play(); }
        }
      }
    }
    else if (mouseY > topBackground) {
      bombIsDetonating = false;
      tiles[bombTile[0]][bombTile[1]].bomb = false; // So that it stops enter the explodeBomb function
      if (! showningLevel) {
        if (mousePressedY == 0) {
          mousePressedY = mouseY;
          swipeBegin = true;
        }
      }
      for (let y = 0; y < tilesVer; y++) {
        for (let x = 0; x < tilesHor; x++) {
          if (tiles[x][y].shown) {
           if (mouseX >= tiles[x][y].x - borderTile/2 + leftOffset && mouseX < tiles[x][y].x + tileSize + borderTile/2 + leftOffset && mouseY >= tiles[x][y].y - borderTile/2 && mouseY < tiles[x][y].y + tileSize + borderTile/2) {
              if (tiles[x][y].selected) {
                tiles[x][y].selected = false;
                selectedTiles--;
                unmatchedFlag = false;
              } else {
                if (unmatchedFlag) {
                  unmatchedFlag = false;
                  for (let j = 0; j < tilesVer; j++) {
                    for (let i = 0; i < tilesHor; i++) {
                      tiles[i][j].selected = false;
                    }
                  }
                  selectedTiles -= matchedNo;
                }
                if (! tiles[x][y].bomb && ! tiles[x][y].clock) {
                  tiles[x][y].selected = true;
                  selectedTiles++;
                  if (selectedTiles == matchedNo) {
                    checkMatch();
                  } else {
                    if (soundPlay) {
                      if (selection.time() > 0) {
                        selection.stop();
                      }
                      selection.play();
                    }
                  }
                } else {
                  tiles[x][y].selected = true;
                  detonateBomb(x, y);
                }
              }
            }
          }
        }
      }
    } else if (mouseY < topBackground - 12*pixel) {
      if (mouseX > deviceWidth * 53/80 && mouseX < deviceWidth * 62/80 && playing) {
        //print("pause");
        playing = false;
        noLoop();
        if (clockIsTicking) {
          if (soundPlay) { ticktock.stop(); }
        }
        push();
        translate(0, 0);
        background(0, 0, 60);
        image(borderImage, -leftOffset, 0, deviceWidth, deviceHeight);
        displayScore();
        fill(94, 200, 242);
        textSize(deviceWidth / 4);
        textAlign(CENTER, CENTER);
        text("PAUSED", deviceWidth/2 -leftOffset, deviceHeight/2);
        textSize(deviceWidth / 10);
        text("Tap anywhere", deviceWidth/2 -leftOffset, deviceHeight/2 + 70*pixel);
        text("on screen to resume", deviceWidth/2 -leftOffset, deviceHeight/2 + 100*pixel);
        pop();
      } else if (mouseX > deviceWidth * 53/80 && mouseX < deviceWidth * 62/80 && ! playing) {
        //print("resumed");
        loop();
        playing = true;
      } else if (mouseX > deviceWidth * 65/80 && mouseX < deviceWidth * 73/80) {
        //print("quit");
        playing = false;
        quiting = true;
        noLoop();
        if (clockIsTicking) {
          if (soundPlay) { ticktock.stop(); }
        }
        push();
        translate(0, 0);
        background(0, 0, 60);
        image(borderImage, -leftOffset, 0, deviceWidth, deviceHeight);
        displayScore();
        fill(94, 200, 242);
        textSize(deviceWidth / 7);
        textAlign(CENTER, CENTER);
        text("QUIT GAME?", deviceWidth/2 -leftOffset, deviceHeight/2);
        textSize(deviceWidth / 10);
        text("Tap quit button", deviceWidth/2 -leftOffset, deviceHeight/2 + 70*pixel);
        text("again to exit game", deviceWidth/2 -leftOffset, deviceHeight/2 + 100*pixel);
        pop();
      }
    }
    return false; // Prevents rapid selection-deselection
  }
}

class Tile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = null;
    this.selected = false;
    this.shown = true;
    this.matched = true;
    this.vanishAnim = true;
    this.lose = false;
    this.originalX = x;
    this.bomb = false;
    this.exploding = false;
    this.clock = false;
  }

  show() {

    if (buggy) {
      if (random(1) < buggyRatio) {
        if (random(1) < 0.5) {
          this.selected = true;
        } else {
          this.selected = false;
        }
        if (random(1) < 0.5) {
          this.shown = true;
        } else {
          this.shown = false;
        }
        if (random(1) < 0.5) {
          this.vanishAnim = true;
        } else {
          this.vanishAnim = false;
        }
      }
    }

    if (! this.lose) {
      if (this.shown) {

        if (this.bomb) {
          let glow = map(sin(frameCount/50), 0.99, 1, 0, 255);
          push();
          fill(glow, glow, glow);
          //rect(this.x - 2*pixel, this.y + 3*pixel, tileSize - 1*pixel, tileSize - 0*pixel, tileSize/2);
          rect(this.x - 1*pixel, this.y + 4*pixel, tileSize - 3*pixel, tileSize - 2*pixel, tileSize/2);
          //rect(this.x - 0*pixel, this.y + 5*pixel, tileSize - 5*pixel, tileSize - 4*pixel, tileSize/2);
          pop();
        }

        if (this.y + laserOffset > laserHeight) {
          speed = 0;
          frameCount = 0;
          this.lose = true;
        }
        if (this.selected) {
          this.x = this.originalX; //If it is shaking, it restores its position
          push();
          fill(100, 200, 100);
          rect(this.x - borderTile/2, this.y - borderTile/2, tileSize + borderTile, tileSize + borderTile, roundness);
          pop();
        } else {
          if (this.matched) {
          } else {
            if (frameCount < 33) {
              mouseClicks = false; // So no more tiles can be selected while shaking
              switch (frameCount % 8) {
                case 0: this.x -= pixel;
                case 1: this.x -= pixel;
                case 2: this.x += pixel;
                case 3: this.x += pixel;
                case 4: this.x += pixel;
                case 5: this.x += pixel;
                case 6: this.x -= pixel;
                case 7: this.x -= pixel;
              }
              push();
              fill(200, 75, 75);
              rect(this.x - borderTile/2, this.y - borderTile/2, tileSize + borderTile, tileSize + borderTile, roundness);
              pop();
            } else {
              mouseClicks = true;
              this.matched = true;
              this.selected = true;
              selectedTiles++;
              unmatchedFlag = true;
            }
          }
        }
        image(this.type, this.x, this.y, tileSize, tileSize);
      } else if (this.vanishAnim) {
        if (! this.exploding) {
          if (frameCount < 26) {
            image(tileDestruction, [sx=this.x - borderTile/2], [sy=this.y - borderTile/2], [sWidth=tileSize + borderTile], [sHeight=tileSize + borderTile], [dx=int(frameCount/2)*destructionWidth], [dy=0], [dWidth=destructionWidth], [dHeight=destructionHeight]);
          } else {
            this.vanishAnim = false;
            if (! buggy) {
              tileCount--;
            }
            if (tileCount == 0) {
              playing = false;
              levelFinished = true;
              frameCount = 0;
            // Disable bombs and clocks in Speed Trial mode:   } else if (! clockIsPressed && tileCount > 0 && ! speedTrial) { checkNewBomb(this.y); }
            } else if (! clockIsPressed && tileCount > 0) { checkNewBomb(this.y); }
          }
        }
      }
    } else { // this.lose == true
      let rand = random(50, 255);
      mouseClicks = false;
      bombIsDetonating = false;
      clockIsPressed = false;
      if (frameCount <= 170 && ! gameOver) {
        if (frameCount == 1) {
          if (soundPlay) { shock.play(); }
        }
        push();
        fill(rand, 0, 0);
        rect(this.x - 2*pixel, this.y - 2*pixel, tileSize + 4*pixel, tileSize + 4*pixel, tileSize/2);
        image(this.type, this.x, this.y, tileSize, tileSize);
        pop();
      } else {
        push();
        fill(255, 0, 0);
        rect(this.x - 2*pixel, this.y - 2*pixel, tileSize + 4*pixel, tileSize + 4*pixel, tileSize/2);
        image(this.type, this.x, this.y, tileSize, tileSize);
        pop();
        playing = false;
        gameOver = true;
        frameCount = 0;
      }
    }

    //if (((this.exploding || this.bomb) && mouseClicks) || (this.clock && clockIsPressed)) { // The mouseClicks check is to prevent detonating while burning
    if (((this.exploding || this.bomb) && bombIsDetonating) || (this.clock && clockIsPressed)) { // The bombIsDetonating check is to prevent detonating while burning
      explodeBomb(this);
    }

    this.y += speed;
  }
}

function checkNewBomb(y) {
  if (! bombIsDetonating) {
    bombCandPlace[bombCounter] = int((y - topBackground) / tileSize);
    if (bombCounter > 0) {
      if (bombCandPlace[bombCounter] < bombCandPlace[bombCounter - 1]) {
        bombCoords = [xGlobal, yGlobal];
      }
    } else { //bombCounter == 0
      bombCoords = [xGlobal, yGlobal];
    }
    bombCounter++;
    if (bombCounter == matchedNo) {
      bombCounter = 0;
      // To make a bomb or a clock only if all matched tiles are on top rows: if (max(bombCandPlace) < bombRows) {
      if (random(1) < bonusRatio) {
        if(random(1) > clockRatio || clockIsPresent) {
          tiles[bombCoords[0]][bombCoords[1]].type = bombImage.get(0, 0, symbolsWidth, symbolsHeight);
          tiles[bombCoords[0]][bombCoords[1]].bomb = true;
        } else {
          tiles[bombCoords[0]][bombCoords[1]].type = clockImage.get(0, 0, symbolsWidth, symbolsHeight);
          tiles[bombCoords[0]][bombCoords[1]].clock = true;
          clockCounter = 0;
          clockIsPresent = true;
        }
        tiles[bombCoords[0]][bombCoords[1]].selected = false;
        tiles[bombCoords[0]][bombCoords[1]].shown = true;
        tiles[bombCoords[0]][bombCoords[1]].vanishAnim = true;
        tileCount++;
      }
    }
  }
}

function detonateBomb(xBomb, yBomb) {
  let x, y, i, j, t, indexOfType, vanishType, tilesSelected;
  let sum = [];
  frameCount = 0;
  bombTile = [xBomb, yBomb];
  tiles[xBomb][yBomb].vanishAnim = false;
  if (tiles[xBomb][yBomb].bomb) { // The tile clicked was a bomb
    tileCount--;
    tiles[xBomb][yBomb].shown = false;
    if (soundPlay) {
      if (boom.time() > 0) {
        boom.stop();
      }
      boom.play();
    }

    vanishCandidates.splice(0, vanishCandidates.length);
    vanishTiles.splice(0, vanishTiles.length);
    bombIsDetonating = true;
    // bombTile = [xBomb, yBomb];
    // tiles[xBomb][yBomb].shown = false;
    // tiles[xBomb][yBomb].vanishAnim = false;
    // tileCount--;

    for (i = 0; i < symbolsAmount; i++) {
      sum[i] = 0;
    }
    for (y = 0; y < tilesVer; y++) {
      for (x = 0; x < tilesHor; x++) {
        if (! tiles[x][y].bomb) {
          tiles[x][y].selected = false;
        }
        selectedTiles = 0;
        if (tiles[x][y].y > topBackground && tiles[x][y].shown) {
          vanishType = tiles[x][y].type;
          indexOfType = types.findIndex(t => t === vanishType);
          vanishCandidates.push([x, y, indexOfType]);
          sum[indexOfType]++;
        }
      }
    }

    for (i = 0; i < symbolsAmount; i++) {
      if (sum[i] >= matchedNo) {
        tilesSelected = 0;
        for (j = 0; j < vanishCandidates.length; j++) {
          if (vanishCandidates[j][2] == i && tilesSelected < matchedNo) {
            tiles[vanishCandidates[j][0]][vanishCandidates[j][1]].exploding = true;
            tilesSelected++;
            frameCount = 0;
            vanishTiles.push([vanishCandidates[j][0], vanishCandidates[j][1]]);
          }
        }
      }
    }
    vanishTiles.sort(sortBySecondColumn); // Sorts vanishTiles by row

  // Swap the exploding tiles with past broken tiles, so that the bomb lines go over all the tiles
  if (vanishTiles.length > 0) {
      i = 0;
      for (y = tilesVer - 1; y >= 0; y--) {
        for (x = tilesHor - 1; x >= 0; x--) {
          if (! tiles[x][y].bomb) {
            [tiles[vanishTiles[i][0]][vanishTiles[i][1]], tiles[x][y]] = [tiles[x][y], tiles[vanishTiles[i][0]][vanishTiles[i][1]]];
            i++;
            if (i == vanishTiles.length) { break; }
          }
        }
        if (i == vanishTiles.length) { break; }
      }
    }

  } else { // The tile clicked was a clock
    if (clockIsPressed) { // The clock has been pressed again and now is smashed
      tiles[xBomb][yBomb].clock = false;
      tiles[xBomb][yBomb].selected = false;
      tiles[xBomb][yBomb].shown = false;
      tiles[xBomb][yBomb].vanishAnim = true;
      if (soundPlay) {
        if (smash.time() > 0) {
          smash.stop();
        }
        smash.play();
      }
      speed = oldSpeed;
      if (clockIsTicking) {
        if (soundPlay) { ticktock.stop(); }
      }
      clockIsTicking = false;
      clockIsPressed = false;
      clockIsPresent = false;
      clockCounter = 0;
    } else { // The clock is pressed for the first time
      clockIsPressed = true;
      if (speed != 0) {
        oldSpeed = speed;
        speed = 0;
      }
    }
  }
}

function sortBySecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function explodeBomb(th) {
  if (th.clock) {
    clockCounter++;
    //print(clockCounter);
    th.selected = false;
    if (ticktock.time() == 0 && ! clockIsTicking) {
      if (soundPlay) { ticktock.play(); }
      clockIsTicking = true;
    }
    if (ticktock.time() > 1.74 && clockIsTicking) { // Max is 1.854694. Optimal is 1.74 but it stalls on mobiles
      if (soundPlay) { ticktock.stop(); }
      clockIsTicking = false;
    }
    if (clockCounter < 6.25 * clockSpeed) {
      clockAnimation(th);
    } else { // Clock has run out
      clockAnimation(th);
      th.shown = false;
      th.clock = false;
      speed = oldSpeed;
      if (clockIsTicking) {
        if (soundPlay) { ticktock.stop(); }
      }
      clockIsTicking = false;
      clockIsPressed = false;
      clockIsPresent = false;
      clockCounter = 0;
      tileCount--;
    }
  }

  if (th.bomb) {
    if (frameCount < 15) {
      if (th.selected) {
        image(bombDestruction, [sx=th.x - borderTile/2], [sy=th.y - borderTile/2], [sWidth=tileSize + borderTile], [sHeight=tileSize + borderTile], [dx=int(frameCount/3)*36], [dy=0], [dWidth=36], [dHeight=36]);
      }
    } else {
      th.selected = false;
    }
  }

  if (! th.bomb && ! th.clock && bombIsDetonating) {

    if (frameCount == 1) {
      th.selected = true;
    }

    if (frameCount < timeSmash) {
      mouseClicks = false;
      let t;
      let startX = tiles[bombTile[0]][bombTile[1]].x + tileSize/2;
      let startY = tiles[bombTile[0]][bombTile[1]].y + tileSize/2;
      let difX = th.x + tileSize/2 - startX;
      let difY = th.y + tileSize/2 - startY;
      let fracX = difX / timeSmash;
      let fracY = difY / timeSmash;
      let indexOfType = types.findIndex(t => t === th.type);
      if (typeof indexOfType == "undefined" || indexOfType == null || indexOfType >= symbolsAmount  || indexOfType < 0) { indexOfType = 0; }
      push();
      stroke(lineColors[indexOfType]);
      strokeWeight(7*pixel);
      line(startX + fracX*frameCount*4/5, startY + fracY*frameCount*4/5, startX + fracX*frameCount, startY + fracY*frameCount);
      pop();
    }

    if (frameCount == timeSmash - 1) {
      th.shown = false;
      th.selected = false;
    }

    if (frameCount >= timeSmash && frameCount < timeSmash + 26) {
      image(tileDestruction, [sx=th.x - borderTile/2], [sy=th.y - borderTile/2], [sWidth=tileSize + borderTile], [sHeight=tileSize + borderTile], [dx=int((frameCount-timeSmash)/2)*destructionWidth], [dy=0], [dWidth=destructionWidth], [dHeight=destructionHeight]);
    }

    if (frameCount == timeSmash + 26) {
      mouseClicks = true;
      th.exploding = false;
      score += 1;
    }

  }
  //The following 6 lines are placed only to change level when only a bomb is remaining
  if (tileCount == 0 && frameCount > 15) {
    playing = false;
    levelFinished = true;
    frameCount = 0;
    th.bomb = false;
    th.clock = false;
  }
}

function clockAnimation(t) {
  push();
  strokeWeight(1*pixel);
  stroke(0, 0, 60);
  for (let i = 0; i <= clockCounter; i++) {
    line(t.x + tileSize/2, t.y + tileSize/2, t.x + tileSize/2 + cos(i/clockSpeed - PI/2)*tileSize/2, t.y + tileSize/2 + sin(i/clockSpeed - PI/2)*tileSize/2);
  }
  pop();
}
