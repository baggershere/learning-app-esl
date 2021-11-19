import React from "react";
import { connect } from "react-redux";
import {
  checker,
  collision,
  mouseObjCollision,
  placeBox,
  selectRandomFromArray,
  shuffle,
} from "./util";
import { addScores } from "../../redux/API/API.actions";

const Sentences = ({ addScore }) => {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const createjs = window.createjs;
  const manifest = [
    {
      id: "present_apples",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/sentences/present/present_apples.jpg",
    },
    {
      id: "present_bananas",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/sentences/present/present_bananas.png",
    },
    {
      id: "present_water",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/sentences/present/present_water.jpg",
    },
    {
      id: "Japan",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/japan.png",
    },
    {
      id: "Spain",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/spain.png",
    },
    {
      id: "AnimalsCat",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/animalcat.png",
    },
    {
      id: "CountriesCat",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/nouns/images/countriesCat+(1).png",
    },
    {
      id: "speech",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/rijKkeX7T.png",
    },
  ];

  let selectedCategory;
  let stage, phone, loader, percentLoaded, offset;
  let correctBoxes = 0;
  let gameState = "LOADING";
  let categories = ["Present Simple", "Past Simple", "Future Simple"];
  let gameLevel = 10;
  let presentSimple = [
    { sentence: ["I", "eat", "apples"], imgID: "present_apples" },
    { sentence: ["He", "eats", "bananas"], imgID: "present_bananas" },
    { sentence: ["We", "drink", "water"], imgID: "present_water" },
  ];
  let currentBoxes = [];
  let currentWords = [];
  let incorrectGuesses = 0;
  let correctGuesses = 0;

  const init = () => {
    stage = new createjs.Stage(canvasRef.current);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage, false, true);
    createjs.Ticker.framerate = 30;
    createjs.Ticker.addEventListener("tick", stage);

    createjs.Sound.volume = 0.5;
    loader = new createjs.LoadQueue(false, null, true);
    loader.installPlugin(createjs.Sound);
    loader.loadManifest(manifest);
    loader.addEventListener("error", function (e) {
      console.log(e);
    });
    loader.on("progress", (e) => {
      let loadingProgress = Math.round(loader.progress * 100);
      percentLoaded = loadingProgress;
      runLoadingScreen();
    });
    loader.on("complete", (e) => {
      gameState = "LOADED";
      runGameLoop();
    });
    window.addEventListener("resize", handleResize);
    resizeCanvas();
  };

  // ##################################### Game loop functions ###########################################

  const runLoadingScreen = () => {
    let loadingScreen = new LoadingScreen(percentLoaded);
    loadingScreen.runLoadingScreen();
  };

  const runCategoriesScreen = () => {
    let categoriesScreen = new CategoriesScreen();
    categoriesScreen.runCategoriesScreen();
  };

  const runLevelScreen = () => {
    let levelScreen = new LevelScreen();
    levelScreen.displayLevelScreen();
  };

  const runEndLevelScreen = () => {
    let endLevelScreen = new EndLevelScreen();
    endLevelScreen.displayEndLevel();
  };

  // ###################################### Game classes #################################################

  class Screen {
    createBackground() {
      let background = new createjs.Shape();
      background.name = "background";
      background.graphics
        .beginLinearGradientFill(
          ["#36d1dc ", "#5b86e5"],
          [0, 0.5, 1],
          0,
          200,
          0,
          600
        )
        .drawRect(0, 0, stage.canvas.width, stage.canvas.height);
      stage.addChild(background);
    }
  }

  class LoadingScreen extends Screen {
    createLoadingStatusText() {
      let progressContainer = new createjs.Container();
      progressContainer.x = stage.canvas.width / 2 - (25 * 10.5) / 2 - 15;
      progressContainer.y = stage.canvas.height / 2 - 30 / 2;
      let progressBox = new createjs.Shape();
      progressBox.graphics.beginFill("");
      progressBox.graphics.setStrokeStyle(5).beginStroke("black");
      progressBox.graphics.drawRect(20, 0, 25 * 10.5, 30);

      progressContainer.addChild(progressBox);
      let progressStage = Math.floor(percentLoaded / 10);
      for (let i = 1; i <= progressStage; i++) {
        let block = new createjs.Shape();
        block.graphics.beginFill("black").drawRect(i * 25, 5, 20, 20);
        progressContainer.addChild(block);
      }

      let text = new createjs.Text(
        `${percentLoaded}%`,
        "50px Open Sans",
        "black"
      );
      text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.55;

      const messageText = new createjs.Text();
      messageText.text = "Loading / 加载中";
      messageText.font = "25px Open Sans";
      messageText.x =
        stage.canvas.width / 2 - messageText.getMeasuredWidth() / 2;
      messageText.y = stage.canvas.height * 0.4;
      stage.addChild(text, messageText, progressContainer);
    }
    runLoadingScreen() {
      this.createBackground();
      this.createLoadingStatusText();
    }
  }

  class CategoriesScreen extends Screen {
    constructor() {
      super();
      this.categories = categories;
    }
    showCategories() {
      let categoryContainers = [];
      let categoryCoordinates = [
        {
          x: phone ? stage.canvas.width * 0.1 : stage.canvas.width * 0.05,
          y: stage.canvas.height * 0.4,
        },
        {
          x: phone ? stage.canvas.width * 0.55 : stage.canvas.width * 0.375,
          y: stage.canvas.height * 0.4,
        },
        {
          x: phone ? stage.canvas.width * 0.325 : stage.canvas.width * 0.7,
          y: phone ? stage.canvas.height * 0.525 : stage.canvas.height * 0.4,
        },
      ];
      for (let i = 0; i < this.categories.length; i++) {
        let categoryContainer = new createjs.Container();
        let categoryShape = new createjs.Shape();
        let categoryText = new createjs.Text();

        // Styling the text
        categoryText.text = categories[i];
        categoryText.font = "27px Open Sans";
        categoryText.x = 200 / 2 - categoryText.getMeasuredWidth() / 2;
        categoryText.y = 50 / 2 - categoryText.getMeasuredHeight() / 2;

        // Styling the shape
        categoryShape.color =
          categoryShape.graphics.beginFill("lightblue").command;
        categoryShape.graphics.setStrokeStyle(4).beginStroke("black");
        categoryShape.graphics.drawRect(0, 0, 200, 50);

        // Positioning and naming the container
        categoryContainer.x = categoryCoordinates[i].x;
        categoryContainer.y = categoryCoordinates[i].y;
        categoryContainer.name = categories[i];
        categoryContainer.alpha = 0;
        createjs.Tween.get(categoryContainer).to({ alpha: 1 }, 300);

        // Mouseover event listeners
        categoryContainer.on("mouseover", (e) => {
          categoryShape.color.style = "red";
        });

        categoryContainer.on("mouseout", (e) => {
          categoryShape.color.style = "lightblue";
        });

        categoryContainer.on("click", (e) => {
          gameState = "RUN_LEVEL";
          selectedCategory = categoryContainer.name;
          fadeOutChildren(300);
          setTimeout(() => {
            runGameLoop();
          }, 300);
        });

        categoryContainer.addChild(categoryShape, categoryText);
        stage.addChild(categoryContainer);
      }
    }
    showCategoriesText() {
      const text = new createjs.Text();
      text.text = "Choose a category";
      text.font = "30px Open Sans";
      text.x = stage.canvas.width / 2 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.25;

      stage.addChild(text);
    }
    runCategoriesScreen() {
      this.createBackground();
      this.showCategoriesText();
      this.showCategories();
    }
  }

  class LevelScreen extends Screen {
    constructor() {
      super();
      this.currentWords = [];
      this.currentBoxes = [];
      this.playerWords = [];
      this.imgID = "";
    }
    selectRandomSentence() {
      if (selectedCategory === "Present Simple") {
        const randomLevel = selectRandomFromArray(presentSimple);
        const randomSentence = randomLevel.sentence;
        this.imgID = randomLevel.imgID;
        const randomSentenceClone = [...randomSentence];
        const shuffledArray = shuffle(randomSentenceClone);
        // Assign to class
        this.randomSentence = randomSentence;
        this.shuffledArray = shuffledArray;
      }
    }
    buildPlayerWordsArray() {
      this.currentWords.forEach(() => this.playerWords.push(""));
    }
    createEmpytyBoxes() {
      // Create a container for each word in the target sentence.
      for (let i = 0; i < this.randomSentence.length; i++) {
        // Create a container that holds everything for each word
        const boxContainer = new createjs.Container();
        boxContainer.name = this.randomSentence[i] + "_box";
        boxContainer.alpha = 0;
        createjs.Tween.get(boxContainer).to({ alpha: 1 }, 300);
        const boxContainerCoordinates = placeBox(
          this.randomSentence.length,
          i,
          stage,
          phone,
          "box"
        );
        boxContainer.x = boxContainerCoordinates.x;
        boxContainer.y = boxContainerCoordinates.y;
        boxContainer.setBounds(
          boxContainer.x,
          boxContainer.y,
          phone ? 130 : 150,
          50
        );
        // Create the background
        const boxShape = new createjs.Shape();
        boxShape.color = boxShape.graphics.beginFill("white").command;
        boxShape.stroke = boxShape.graphics
          .setStrokeStyle(2)
          .beginStroke("black").command;
        boxShape.graphics.drawRect(0, 0, phone ? 130 : 150, 50);

        boxContainer.addChild(boxShape);

        this.currentBoxes.push(boxContainer);
      }
    }
    displayRandomWords() {
      for (let i = 0; i < this.shuffledArray.length; i++) {
        // Create random word container
        const wordContainer = new createjs.Container();
        wordContainer.name = this.shuffledArray[i] + "_word";
        let coordinates = placeBox(
          this.shuffledArray.length,
          i,
          stage,
          phone,
          "word"
        );
        wordContainer.x = coordinates.x;
        wordContainer.y = coordinates.y;
        wordContainer.setBounds(
          wordContainer.x,
          wordContainer.y,
          phone ? 130 : 150,
          50
        );
        // Create word shape
        const wordShape = new createjs.Shape();
        wordShape.color = wordShape.graphics.beginFill("lightblue").command;
        wordShape.graphics.setStrokeStyle(3).beginStroke("black");
        wordShape.graphics.drawRect(0, 0, phone ? 130 : 150, 50);
        // Create word text
        const wordText = new createjs.Text();
        wordText.text = this.shuffledArray[i];
        wordText.font = phone ? "25px Open Sans" : "30px Open Sans";

        wordText.x = phone
          ? 130 / 2 - wordText.getMeasuredWidth() / 2
          : 150 / 2 - wordText.getMeasuredWidth() / 2;
        wordText.y = 50 / 2 - wordText.getMeasuredHeight() / 2;

        wordContainer.addChild(wordShape, wordText);
        // Add dragging event listener

        this.currentWords.push(wordContainer);
      }
    }
    displayInstructions() {
      if (gameLevel == 1) {
        let img = new createjs.Bitmap(loader.getResult("speech"));
        let container = new createjs.Container();
        img.scaleX = 250 / img.image.width;
        img.scaleY = 120 / img.image.height;
        container.x = phone
          ? stage.canvas.width * 0.5 - 125
          : stage.canvas.width * 0.66;
        container.y = phone
          ? stage.canvas.height * 0.7
          : stage.canvas.height * 0.2;

        let text_one = new createjs.Text();
        text_one.lineWidth = 150;
        text_one.text = "拖放单词将它们按 正确的顺序排列";
        text_one.font = "20px Open Sans";
        
        text_one.x = 45;
        text_one.y = 40;
        container.addChild(img, text_one);
        stage.addChild(container);
      }
    }
    displayLevelImage() {
      const imageContainer = new createjs.Container();

      const image = new createjs.Bitmap(loader.getResult(this.imgID));
      image.scaleX = 250 / image.image.width;
      image.scaleY = 250 / image.image.height;
      imageContainer.x = stage.canvas.width * 0.5 - 250 / 2;
      imageContainer.y = phone ? 50 : 10;
      imageContainer.addChild(image);
      stage.addChild(imageContainer);
    }
    handleMovement() {
      for (let i = 0; i < this.currentBoxes.length; i++) {
        stage.addChild(this.currentBoxes[i]);
      }
      for (let i = 0; i < this.currentWords.length; i++) {
        stage.addChild(this.currentWords[i]);
      }
      for (let i = 0; i < this.currentWords.length; i++) {
        let origX;
        let origY;

        this.currentWords[i].on("mousedown", (e) => {
          origX = e.currentTarget.x;
          origY = e.currentTarget.y;

          offset = {
            x: this.currentWords[i].x - e.stageX,
            y: this.currentWords[i].y - e.stageY,
          };
          stage.setChildIndex(this.currentWords[i], stage.getNumChildren() - 1);
        });

        this.currentWords[i].on("pressmove", (e) => {
          e.currentTarget.x = e.stageX + offset.x;
          e.currentTarget.y = e.stageY + offset.y;

          for (let j = 0; j < this.currentBoxes.length; j++) {
            if (mouseObjCollision(e.stageX, e.stageY, this.currentBoxes[j])) {
            }
          }
        });

        this.currentWords[i].on("pressup", (e) => {
          for (let j = 0; j < this.currentBoxes.length; j++) {
            if (mouseObjCollision(e.stageX, e.stageY, this.currentBoxes[j])) {
              if (this.playerWords[j] !== "") {
                this.currentWords[i].x = origX;
                this.currentWords[i].y = origY;
              }
              if (this.playerWords[j] === "") {
                this.currentWords[i].x = this.currentBoxes[j].x;
                this.currentWords[i].y = this.currentBoxes[j].y;
                this.playerWords[j] = this.currentWords[i].name.slice(0, -5);
                this.currentWords[i].removeAllEventListeners();
              }
            }
          }
          if (checker(this.playerWords)) {
            if (this.checkAnswers()) {
              correctGuesses++;
              this.showCorrect();
            }
            if (!this.checkAnswers()) {
              incorrectGuesses++;
              this.showIncorrect();
            }
          }
          if (!checker(this.playerWords)) {
            console.log("Not correct");
          }
        });
      }
    }
    showCorrect() {
      this.currentBoxes.forEach((box) => {
        box.children[0].stroke.style = "green";
      });
      const text = new createjs.Text();
      text.text = "Correct!";
      text.font = "20px Open Sans";
      text.x = stage.canvas.width * 0.5 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.625;
      text.alpha = 0;
      createjs.Tween.get(text).to({ alpha: 1 }, 300);
      stage.addChild(text);

      const buttonContainer = new createjs.Container();
      buttonContainer.x = stage.canvas.width / 2 - 75;
      buttonContainer.y = stage.canvas.height * 0.7;
      const buttonText = new createjs.Text();
      buttonText.text = "Continue";
      buttonText.font = "20px Open Sans";

      const buttonShape = new createjs.Shape();
      buttonShape.color = buttonShape.graphics.beginFill("pink").command;
      buttonShape.graphics.setStrokeStyle(3).beginStroke("black");
      buttonShape.graphics.drawRect(0, 0, 150, 50);
      buttonContainer.addChild(buttonShape, buttonText);

      buttonText.x = 150 / 2 - buttonText.getMeasuredWidth() / 2;
      buttonText.y = 50 / 2 - buttonText.getMeasuredHeight() / 2;

      buttonContainer.on("mouseover", (e) => {
        buttonShape.color.style = "red";
      });
      buttonContainer.on("mouseout", (e) => {
        buttonShape.color.style = "pink";
      });

      buttonContainer.on("click", (e) => {
        fadeOutChildren(300);
        setTimeout(() => {
          stage.removeAllChildren();
          gameLevel++;
          if (gameLevel === 11) gameState = "RUN_END_LEVEL";
          this.currentWords = [];
          this.currentBoxes = [];
          this.playerWords = [];
          runGameLoop();
        }, 500);
      });

      stage.addChild(buttonContainer);
      //fadeOutChildren(300)
      // setTimeout(() => {
      //   stage.removeAllChildren();
      //   this.currentWords = [];
      //   this.currentBoxes = [];
      //   this.playerWords = [];
      //   runGameLoop();
      // }, 1000);
    }
    showIncorrect() {
      this.currentBoxes.forEach((box) => {
        console.log(box.children[0]);
        box.children[0].stroke.style = "red";
      });
      // Add incorrect text
      const text = new createjs.Text();
      text.text = "不对， 在试一试";
      text.font = "20px Open Sans";
      text.x = stage.canvas.width * 0.5 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.625;
      text.alpha = 0;
      createjs.Tween.get(text).to({ alpha: 1 }, 300);
      stage.addChild(text);
      setTimeout(() => {
        stage.removeAllChildren();
        this.currentWords = [];
        this.currentBoxes = [];
        this.playerWords = [];
        this.replayLevel();
      }, 2000);
    }
    checkAnswers() {
      return this.playerWords.every(
        (value, index) => value === this.randomSentence[index]
      );
    }
    displayCurrentLevel() {
      const levelText = new createjs.Text();
      levelText.text = `${gameLevel}/10`;
      levelText.font = "20px Open Sans";
      levelText.x = 10;
      levelText.y = 10;
      stage.addChild(levelText);
    }
    replayLevel() {
      this.createBackground();
      this.displayInstructions()
      this.displayCurrentLevel();
      this.createEmpytyBoxes();
      this.displayLevelImage();
      this.displayRandomWords();
      this.buildPlayerWordsArray();
      this.handleMovement();
    }
    displayLevelScreen() {
      this.createBackground();
      this.displayInstructions()
      this.displayCurrentLevel();
      this.selectRandomSentence();
      this.displayLevelImage();
      this.createEmpytyBoxes();
      this.displayRandomWords();
      this.buildPlayerWordsArray();
      this.handleMovement();
    }
  }

  class EndLevelScreen extends Screen {
    constructor() {
      super();
    }
    displayText() {
      const text = new createjs.Text();
      text.text = "Game complete";
      text.font = "25px Open Sans";
      text.x = stage.canvas.width * 0.5 - text.getMeasuredWidth() / 2;
      text.y = stage.canvas.height * 0.5 - text.getMeasuredHeight() / 2;

      const score = new createjs.Text();
      score.text = "Score: " + calculateError();
      score.font = "20px Open Sans";
      score.x = score.x =
        stage.canvas.width * 0.5 - score.getMeasuredWidth() / 2;
      score.y = stage.canvas.height * 0.6 - score.getMeasuredHeight() / 2;

      const buttonContainer = new createjs.Container();
      buttonContainer.x = stage.canvas.width / 2 - 75;
      buttonContainer.y = stage.canvas.height * 0.7;
      const buttonText = new createjs.Text();
      buttonText.text = "Play again";
      buttonText.font = "20px Open Sans";
      buttonText.x = 150 / 2 - buttonText.getMeasuredWidth() / 2;
      buttonText.y = 50 / 2 - buttonText.getMeasuredHeight() / 2;

      const buttonShape = new createjs.Shape();
      buttonShape.color = buttonShape.graphics.beginFill("pink").command;
      buttonShape.graphics.setStrokeStyle(3).beginStroke("black");
      buttonShape.graphics.drawRect(0, 0, 150, 50);
      buttonContainer.addChild(buttonShape, buttonText);

      buttonContainer.on("click", (e) => {
        addScore(calculateError(), "Sentences");
        gameLevel = 1;
        correctGuesses = 0;
        incorrectGuesses = 0;
        gameState = "LOADED";
        runGameLoop();
      });

      stage.addChild(text, score, buttonContainer);
    }
    displayEndLevel() {
      this.createBackground();
      this.displayText();
    }
  }

  const runGameLoop = () => {
    switch (gameState) {
      case "LOADING":
        runLoadingScreen();
        break;
      case "LOADED":
        runCategoriesScreen();
        break;
      case "RUN_LEVEL":
        runLevelScreen();
        break;
      case "RUN_END_LEVEL":
        runEndLevelScreen();
        break;
      default:
        console.log("default_ran");
    }
  };

  // #################################### Util functions ############################################

  const fadeOutChildren = (time) => {
    stage.children.forEach((child) => {
      child.name !== "background" &&
        createjs.Tween.get(child).to({ alpha: 0 }, time);
    });
  };
  const calculateError = () => {
    return (correctGuesses / (correctGuesses + incorrectGuesses)) * 100;
  };
  const handleResize = (e) => {
    window.innerWidth < 900 ? (phone = true) : (phone = false);
    stage.removeAllEventListeners("click");
    stage.removeAllChildren();
    currentBoxes = [];
    currentWords = [];
    resizeCanvas();
    runGameLoop();
  };

  function resizeCanvas() {
    if (window.innerWidth >= 800) {
      phone = false;
      canvasRef.current.width = 800;
      canvasRef.current.height = 550;

      let widthToHeight = 800 / 550;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight - 200;
      let newWidthToHeight = newWidth / newHeight;
      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      } else {
        newHeight = newWidth / widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      }
    } else {
      phone = true;
      canvasRef.current.width = canvasRef ? 550 : null;
      canvasRef.current.height = canvasRef ? 800 : null;
      let widthToHeight = 550 / 800;
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight - 200;
      let newWidthToHeight = newWidth / newHeight;
      if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      } else {
        newHeight = newWidth / widthToHeight;
        containerRef.current.style.height = newHeight + "px";
        containerRef.current.style.width = newWidth + "px";
      }
    }
  }

  React.useEffect(() => {
    init();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return (
    <div ref={containerRef} className="canvas-holder">
      <canvas
        id="canvas2"
        ref={canvasRef}
        width="800px"
        height="550px"
      ></canvas>
    </div>
  );
};

export default connect(null, (dispatch) => ({
  addScore: (score, gameName) => dispatch(addScores(score, gameName)),
}))(Sentences);
