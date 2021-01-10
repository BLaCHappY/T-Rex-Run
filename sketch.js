var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bg, bgImage, trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var jumpImage;
var cloud, cloudsGroup, cloudImage;
var cact1, cact2, cact3, cact4, cact5, cact6, cactGroup, birdsGroup, birds;
var score = 0;
var num = 0;
var gameOver, gameOverImage, restart, restartImage, jumpSound, dieSound, checkSound, bird, birdFly;

localStorage["HighScore"]=0;


function preload() {

  trex_running = loadAnimation("dr1.png", "dr2.png", "dr3.png");

  birdFly = loadAnimation("panchi 1.png", "panchi 2.png");

  trex_collided = loadImage("dd.png");

  groundImage = loadImage("ground2.png")

  jumpImage = loadImage("dj.png")

  cloudImage = loadImage("cloud (2).png");

  gameOverImage = loadImage("gameOver.png");

  restartImage = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");

  dieSound = loadSound("die.mp3");

  checkSound = loadSound("checkPoint.mp3");

  bgImage = loadImage("bg 1.jpg")

  cact1 = loadImage("obstacle1.png");
  cact2 = loadImage("obstacle2.png");
  cact3 = loadImage("obstacle3.png");
  cact4 = loadImage("obstacle4.png");
  cact5 = loadImage("obstacle5.png");
  cact6 = loadImage("obstacle6.png");

}

function setup() {

  createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  //trex.debug=true
  trex.setCollider("circle", -100, 0, 210)
  trex.addAnimation("running", trex_running);
  trex.addAnimation("jumping", jumpImage);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.15;

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -10;


  //creating the invisible ground.

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 75);
  gameOver.scale = 0.7
  gameOver.addImage(gameOverImage);
  gameOver.visible = false

  restart = createSprite(300, 125);
  restart.scale = 0.5
  restart.addImage(restartImage);
  restart.visible = false

  cactGroup = new Group();
  cloudsGroup = new Group();
  birdsGroup = new Group();
}

function draw() {


  background(245);
  

  if (gameState === PLAY) {

    if (score % 700 === 0 && score > 0) {
      num = 1
    } else if (score % 1401 === 0) {
      num = 0
    }

    if (num === 0) {
      background(245)
    }

    if (num === 1) {
      background("black")
    }

    score = score + Math.round(frameRate() / 60)

    if (score % 100 === 0 && score > 1) {
      checkSound.play();
    }

    if (keyDown("space") && trex.y >= 145) {
      trex.velocityY = -17;
      jumpSound.play();
    }

    if (trex.y < 145) {
      trex.changeAnimation("jumping", jumpImage)
    } else {
      trex.changeAnimation("running", trex_running);
    }

    trex.velocityY = trex.velocityY + 1.5

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();

    spawnCact();
    
    spawnbird();


    ground.velocityX = -(10 + 3 * score / 100);

    if (cactGroup.isTouching(trex)) {
      dieSound.play();
      gameState = END
    }

  } else if (gameState === END) {
    ground.velocityX = 0;
    cactGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided", trex_collided)
    cactGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0

    gameOver.visible = true
    restart.visible = true
  }

  if (mousePressedOver(restart)) {
    reset();
  }



  //jump when the space button is pressed

  //console.log(trex.y);
  //console.count("data frame is called: ");
  //console.time();
  //console.info("start of the draw function");
  //console.error("this is how error appears: ");
  //console.warn("A warning");



  trex.collide(invisibleGround);



  drawSprites();

  textFont("consolas")
  textSize(20)
  text("Score: " + score, 450, 50);
  
   if(localStorage["HighScore"]<score){
    localStorage["HighScore"]=score
  }
  
  textFont("consolas")
  textSize(20)
  text("HI: " + localStorage["HighScore"], 360, 50);

  //console.timeEnd();

}

function spawnClouds() {

  //write code here to spawn the clouds
  if (frameCount % 40 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.2;
    cloud.velocityX = -(10 + 3 * score / 100);

    cloud.lifetime = 65

    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }
}

function spawnCact() {
  if (frameCount % 50 === 0) {
    cact = createSprite(600, 160, 10, 40);
    cact.velocityX = -(10 + 3 * score / 100);
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        cact.addImage(cact1);
        break;
      case 2:
        cact.addImage(cact2);
        break;
      case 3:
        cact.addImage(cact3);
        break;
      case 4:
        cact.addImage(cact4);
        break;
      case 5:
        cact.addImage(cact5);
        break;
      case 6:
        cact.addImage(cact6);
        break;
      default:
        break;
    }
    cact.scale = 0.5
    cact.lifetime = 65
    cactGroup.add(cact);
  }
}

function reset() {
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false
  cactGroup.destroyEach();
  cloudsGroup.destroyEach();
  console.log(localStorage["HighScore"])
  score= 0
}

function spawnbird(){
  if (frameCount % 125 === 0 && score>100) {
    bird = createSprite(600, 100, 40, 10);
    bird.addAnimation("bird",birdFly)
    bird.y = Math.round(random(100, 170))
    bird.scale = 1;
    bird.velocityX = -(10 + 3 * score / 100);

    bird.lifetime = 65

    //adjust the depth
    bird.depth = trex.depth
    trex.depth = trex.depth + 1;

    birdsGroup.add(bird);
  }
}