import React from "react";
import { connect } from "react-redux";
import { addScores } from "../../redux/API/API.actions";

const Questions = ({ addScore }) => {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const createjs = window.createjs;
  let stage;
  let loader;
  let percentLoaded;
  let correct = 0;
  let incorrect = 0;
  let phone;
  let gameState = "LOADING";
  let currentLevel = 1;
  const gameData = [
    {
      question: "is your name?",
      answer: "What",
      options: ["When", "Who", "Is", "What"],
      imgID: "what_is_your_nameIMG",
    },
    {
      question: "is he eating?",
      answer: "What",
      options: ["When", "What", "Why", "Where"],
      imgID: "what_is_he_eatingIMG",
    },
    {
      question: "is lunch?",
      answer: "When",
      options: ["When", "What", "Why", "Where"],
      imgID: "when_is_lunchIMG",
    },
    {
      question: "he a student?",
      answer: "Is",
      options: ["Are", "Who", "What", "Is"],
      imgID: "is_he_a_studentIMG",
    },
    {
      question: "you speak Japanese?",
      answer: "Can",
      options: ["Are", "Is", "Why", "Can"],
      imgID: "can_you_speak_japaneseIMG",
    },
    {
      question: "are you from?",
      answer: "Where",
      options: ["Where", "Who", "Why", "What"],
      imgID: "where_are_you_fromIMG",
    },
    {
      question: "old are you?",
      answer: "How",
      options: ["Where", "Are", "How", "What"],
      imgID: "how_old_are_youIMG",
    },
    {
      question: "is your favourite colour?",
      answer: "What",
      options: ["What", "How", "Where", "Are"],
      imgID: "what_is_your_favourite_colourIMG",
    },
    {
      question: "do you live?",
      answer: "Where",
      options: ["Why", "How", "What", "Where"],
      imgID: "where_do_you_liveIMG",
    },
  ];
  const manifest = [
    {
      id: "where_do_you_liveIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/where_do_you_liveIMG.png",
    },
    {
      id: "what_is_your_favourite_colourIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/what_is_your_favourite_colourIMG.png",
    },
    {
      id: "how_old_are_youIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/how_old_are_youIMG.png",
    },
    {
      id: "what_is_your_nameIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/what_is_your_nameIMG.png",
    },
    {
      id: "where_are_you_fromIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/where_are_you_fromIMG.png",
    },
    {
      id: "can_you_speak_japaneseIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/can_you_speak_japaneseIMG.png",
    },
    {
      id: "what_is_he_eatingIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/what_is_he_eatingIMG.png",
    },
    {
      id: "is_he_a_studentIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/is_he_a_studentIMG.png",
    },
    {
      id: "when_is_lunchIMG",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/questions/when_is_lunchIMG.png",
    },
    {
      id: "speech",
      type: createjs.Types.IMAGE,
      src: "https://f000.backblazeb2.com/file/audio1262/rijKkeX7T.png",
    },
  ];

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

  const runLoadingScreen = () => {
    let loadingScreen = new LoadingScreen(percentLoaded);
    loadingScreen.runLoadingScreen();
  };

  const runGameScreen = () => {
    let gameScreen = new GameScreen();
    gameScreen.runGameScreen();
  };

  const runEndGameScreen = () => {
    const endGameScreen = new EndGameScreen();
    endGameScreen.runEndGameScreen();
  };

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

  class GameScreen extends Screen {
    constructor() {
      super();
      this.level = gameData[Math.floor(Math.random() * gameData.length)];
      this.questionText = new createjs.Text();
    }
    displayImage() {
      const imageContainer = new createjs.Container();
      imageContainer.alpha = 0;
      const image = new createjs.Bitmap(loader.getResult(this.level.imgID));
      image.scaleX = 250 / image.image.width;
      image.scaleY = 250 / image.image.height;
      imageContainer.x = stage.canvas.width * 0.5 - 250 / 2;
      imageContainer.y = phone ? 50 : 10;
      imageContainer.addChild(image);
      createjs.Tween.get(imageContainer).to({ alpha: 1 }, 400);
      stage.addChild(imageContainer);
    }
    displayQuestion() {
      const questionContainer = new createjs.Container();
      questionContainer.alpha = 0;
      questionContainer.name = this.level.question;
      const questionSquare = new createjs.Shape();

      this.questionText.text = "_______ " + this.level.question;
      this.questionText.font = "25px Open Sans";

      questionSquare.graphics.beginFill("white");
      questionSquare.graphics.setStrokeStyle(3).beginStroke("black");
      questionSquare.graphics.drawRect(
        0,
        0,
        this.questionText.getMeasuredWidth() * 1.5,
        50
      );

      this.questionText.x =
        this.questionText.getMeasuredWidth() * 1.5 -
        (this.questionText.getMeasuredWidth() * 1.5) / 2 -
        this.questionText.getMeasuredWidth() / 2;
      this.questionText.y = 50 / 2 - this.questionText.getMeasuredHeight() / 2;

      questionContainer.x =
        stage.canvas.width / 2 -
        (this.questionText.getMeasuredWidth() * 1.5) / 2;
      questionContainer.y = stage.canvas.height / 2;

      questionContainer.addChild(questionSquare, this.questionText);
      createjs.Tween.get(questionContainer).to({ alpha: 1 }, 400);
      stage.addChild(questionContainer);
    }
    displayCurrentLevel() {
      const levelText = new createjs.Text(
        currentLevel + "/10",
        "25px Open Sans",
        "black"
      );
      levelText.x = 0;
      levelText.y = 0;
      stage.addChild(levelText);
    }
    displayContinueButton() {
      console.log("run");
      let buttonContainer = new createjs.Container();
      let buttonShape = new createjs.Shape();
      let buttonText = new createjs.Text();

      // Styling the text
      buttonText.text = "Next level";
      buttonText.font = "27px Open Sans";
      buttonText.x = 200 / 2 - buttonText.getMeasuredWidth() / 2;
      buttonText.y = 50 / 2 - buttonText.getMeasuredHeight() / 2;

      // Styling the shape
      buttonShape.color = buttonShape.graphics.beginFill("lightblue").command;
      buttonShape.graphics.setStrokeStyle(3).beginStroke("black");
      buttonShape.graphics.drawRect(0, 0, 200, 50);

      // Positioning the container
      buttonContainer.x = stage.canvas.width * 0.5 - 100;
      buttonContainer.y = stage.canvas.height * 0.7;
      //buttonContainer.alpha = 0;

      //createjs.Tween.get(buttonContainer).to({ alpha: 1 }, 300);

      buttonContainer.on("mouseover", (e) => {
        e.currentTarget.children[0].color.style = "red";
      });

      buttonContainer.on("mouseout", (e) => {
        e.currentTarget.children[0].color.style = "lightblue";
      });

      buttonContainer.on("click", (e) => {
        if (currentLevel > 10) {
          gameState = "RUN_END_GAME";
        }
        stage.removeAllChildren()
        runGameLoop();
      });
      buttonContainer.addChild(buttonShape, buttonText);
      buttonContainer.alpha = 0;
      createjs.Tween.get(buttonContainer).to({ alpha: 1 }, 400);
      stage.addChild(buttonContainer);
    }
    displayInstructions() {
      if (currentLevel == 1) {
        let img = new createjs.Bitmap(loader.getResult("speech"));
        let container = new createjs.Container();
        img.scaleX = 250 / img.image.width;
        img.scaleY = 120 / img.image.height;
        container.x = phone
          ? stage.canvas.width * 0.5 - 125
          : stage.canvas.width * 0.66;
        container.y = phone
          ? stage.canvas.height * 0.81
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
    displayOptions() {
      // Option one
      const option_one_container = new createjs.Container();
      option_one_container.alpha = 0;
      option_one_container.x = stage.canvas.width * 0.2;
      option_one_container.y = stage.canvas.height * 0.65;
      option_one_container.name = this.level.options[0];
      const option_one_shape = new createjs.Shape();
      option_one_shape.graphics.setStrokeStyle(3).beginStroke("black");
      option_one_shape.graphics.beginFill("white").drawRect(0, 0, 130, 40);

      const option_one_text = new createjs.Text();
      option_one_text.text = this.level.options[0];
      option_one_text.font = "25px Open Sans";
      option_one_text.x = 130 / 2 - option_one_text.getMeasuredWidth() / 2;
      option_one_text.y = 40 / 2 - option_one_text.getMeasuredHeight() / 2;

      option_one_container.on("mouseover", (e) => {
        this.questionText.text =
          this.level.options[0] + " " + this.level.question;
      });

      option_one_container.on("mouseout", (e) => {
        this.questionText.text = "______ " + this.level.question;
      });

      option_one_container.on("click", (e) => {
        if (option_one_container.name === this.level.answer) {
          correct++;
          this.questionText.text =
            this.level.answer + " " + this.level.question;
          option_one_container.removeAllEventListeners();
          for (let i = stage.numChildren - 1; i >= 0; i--) {
            let child = stage.getChildAt(i);
            if (this.level.options.includes(child.name)) {
              stage.removeChild(child);
            }
          }
          this.displayContinueButton();
          currentLevel++;
        }
        if (option_one_container.name !== this.level.answer) {
          incorrect++;
          createjs.Tween.get(option_one_container)
            .to({ alpha: 0 }, 300)
            .call(() => {
              stage.removeChild(option_one_container);
            });
        }
      });

      option_one_container.addChild(option_one_shape, option_one_text);

      // Option two
      const option_two_container = new createjs.Container();
      option_two_container.alpha = 0;
      option_two_container.x = stage.canvas.width * 0.6;
      option_two_container.y = stage.canvas.height * 0.65;
      option_two_container.name = this.level.options[1];
      const option_two_shape = new createjs.Shape();
      option_two_shape.graphics.setStrokeStyle(3).beginStroke("black");
      option_two_shape.graphics.beginFill("white").drawRect(0, 0, 130, 40);

      const option_two_text = new createjs.Text();
      option_two_text.text = this.level.options[1];
      option_two_text.font = "25px Open Sans";
      option_two_text.x = 130 / 2 - option_two_text.getMeasuredWidth() / 2;
      option_two_text.y = 40 / 2 - option_two_text.getMeasuredHeight() / 2;

      option_two_container.on("mouseover", (e) => {
        this.questionText.text =
          this.level.options[1] + " " + this.level.question;
      });

      option_two_container.on("mouseout", (e) => {
        this.questionText.text = "______ " + this.level.question;
      });

      option_two_container.on("click", (e) => {
        if (option_two_container.name === this.level.answer) {
          correct++;
          this.questionText.text =
            this.level.answer + " " + this.level.question;
          option_two_container.removeAllEventListeners();
          for (let i = stage.numChildren - 1; i >= 0; i--) {
            let child = stage.getChildAt(i);
            if (this.level.options.includes(child.name)) {
              stage.removeChild(child);
            }
          }
          this.displayContinueButton();
          currentLevel++;
        }
        if (option_two_container.name !== this.level.answer) {
          incorrect++;
          createjs.Tween.get(option_two_container)
            .to({ alpha: 0 }, 300)
            .call(() => {
              stage.removeChild(option_two_container);
            });
        }
      });

      option_two_container.addChild(option_two_shape, option_two_text);

      // Option three
      const option_three_container = new createjs.Container();
      option_three_container.alpha = 0;
      option_three_container.x = stage.canvas.width * 0.2;
      option_three_container.y = stage.canvas.height * 0.75;
      option_three_container.name = this.level.options[2];
      const option_three_shape = new createjs.Shape();
      option_three_shape.graphics.setStrokeStyle(3).beginStroke("black");
      option_three_shape.graphics.beginFill("white").drawRect(0, 0, 130, 40);

      const option_three_text = new createjs.Text();
      option_three_text.text = this.level.options[2];
      option_three_text.font = "25px Open Sans";
      option_three_text.x = 130 / 2 - option_three_text.getMeasuredWidth() / 2;
      option_three_text.y = 40 / 2 - option_three_text.getMeasuredHeight() / 2;

      option_three_container.on("mouseover", (e) => {
        this.questionText.text =
          this.level.options[2] + " " + this.level.question;
      });

      option_three_container.on("mouseout", (e) => {
        this.questionText.text = "______ " + this.level.question;
      });

      option_three_container.on("click", (e) => {
        if (option_three_container.name === this.level.answer) {
          correct++;
          this.questionText.text =
            this.level.answer + " " + this.level.question;
          option_three_container.removeAllEventListeners();
          for (let i = stage.numChildren - 1; i >= 0; i--) {
            let child = stage.getChildAt(i);
            if (this.level.options.includes(child.name)) {
              stage.removeChild(child);
            }
          }
          this.displayContinueButton();
          currentLevel++;
        }
        if (option_three_container.name !== this.level.answer) {
          incorrect++;
          createjs.Tween.get(option_three_container)
            .to({ alpha: 0 }, 300)
            .call(() => {
              stage.removeChild(option_three_container);
            });
        }
      });

      option_three_container.addChild(option_three_shape, option_three_text);

      // Option four
      const option_four_container = new createjs.Container();
      option_four_container.alpha = 0;
      option_four_container.x = stage.canvas.width * 0.6;
      option_four_container.y = stage.canvas.height * 0.75;
      option_four_container.name = this.level.options[3];
      const option_four_shape = new createjs.Shape();
      option_four_shape.graphics.setStrokeStyle(3).beginStroke("black");
      option_four_shape.graphics.beginFill("white").drawRect(0, 0, 130, 40);

      const option_four_text = new createjs.Text();
      option_four_text.text = this.level.options[3];
      option_four_text.font = "25px Open Sans";
      option_four_text.x = 130 / 2 - option_four_text.getMeasuredWidth() / 2;
      option_four_text.y = 40 / 2 - option_four_text.getMeasuredHeight() / 2;

      option_four_container.on("mouseover", (e) => {
        this.questionText.text =
          this.level.options[3] + " " + this.level.question;
      });

      option_four_container.on("mouseout", (e) => {
        this.questionText.text = "______ " + this.level.question;
      });

      option_four_container.on("click", (e) => {
        if (option_four_container.name === this.level.answer) {
          correct++;
          option_four_container.removeAllEventListeners();
          this.questionText.text =
            this.level.answer + " " + this.level.question;
          for (let i = stage.numChildren - 1; i >= 0; i--) {
            let child = stage.getChildAt(i);
            if (this.level.options.includes(child.name)) {
              stage.removeChild(child);
            }
          }
          this.displayContinueButton();
          currentLevel++;
        }
        if (option_four_container.name !== this.level.answer) {
          incorrect++;
          createjs.Tween.get(option_four_container)
            .to({ alpha: 0 }, 300)
            .call(() => {
              stage.removeChild(option_four_container);
            });
        }
      });

      option_four_container.addChild(option_four_shape, option_four_text);
      createjs.Tween.get(option_one_container).to({ alpha: 1 }, 400);
      createjs.Tween.get(option_two_container).to({ alpha: 1 }, 400);
      createjs.Tween.get(option_three_container).to({ alpha: 1 }, 400);
      createjs.Tween.get(option_four_container).to({ alpha: 1 }, 400);

      stage.addChild(
        option_one_container,
        option_two_container,
        option_three_container,
        option_four_container
      );
    }
    runGameScreen() {
      this.createBackground();
      this.displayInstructions();
      this.displayCurrentLevel();
      this.displayImage();
      this.displayQuestion();
      this.displayOptions();
    }
  }

  class EndGameScreen extends Screen {
    constructor() {
      super();
      this.error = calculateError();
    }
    displayScore() {
      const scoreText = new createjs.Text(
        "Score: " + calculateError() + "%",
        "30px Open Sans",
        "black"
      );
      scoreText.x = stage.canvas.width / 2 - scoreText.getMeasuredWidth() / 2;
      scoreText.y = stage.canvas.height * 0.4;
      stage.addChild(scoreText);
    }
    displayButton() {
      // play again button
      let buttonContainer = new createjs.Container();
      let buttonShape = new createjs.Shape();
      let buttonText = new createjs.Text();

      // Styling the text
      buttonText.text = "Play again";
      buttonText.font = "27px Open Sans";
      buttonText.x = 200 / 2 - buttonText.getMeasuredWidth() / 2;
      buttonText.y = 50 / 2 - buttonText.getMeasuredHeight() / 2;

      // Styling the shape
      buttonShape.color = buttonShape.graphics.beginFill("lightblue").command;
      buttonShape.graphics.setStrokeStyle(3).beginStroke("black");
      buttonShape.graphics.drawRect(0, 0, 200, 50);

      // Positioning the container
      buttonContainer.x = stage.canvas.width * 0.5 - 100;
      buttonContainer.y = stage.canvas.height * 0.6;

      buttonContainer.addChild(buttonShape, buttonText);

      buttonContainer.on("mouseover", (e) => {
        e.currentTarget.children[0].color.style = "red";
      });

      buttonContainer.on("mouseout", (e) => {
        e.currentTarget.children[0].color.style = "lightblue";
      });
      buttonContainer.on("click", (e) => {
        currentLevel = 1;
        incorrect = 0;
        correct = 0;
        gameState = "LOADED";
        runGameLoop();
      });
      stage.addChild(buttonContainer);
    }
    pushScores() {
      addScore(this.error, "Questions");
    }
    runEndGameScreen() {
      this.createBackground();
      this.displayScore();
      this.displayButton();
      this.pushScores();
    }
  }

  const handleResize = (e) => {
    window.innerWidth < 900 ? (phone = true) : (phone = false);
    stage.removeAllEventListeners("click");
    stage.removeAllChildren();
    resizeCanvas();
    runGameLoop();
  };

  const calculateError = () => {
    const score = (correct / (correct + incorrect)) * 100;
    return Math.round(score);
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

  const runGameLoop = () => {
    switch (gameState) {
      case "LOADING":
        runLoadingScreen();
        break;
      case "LOADED":
        runGameScreen();
        break;
      case "RUN_END_GAME":
        runEndGameScreen();
        break;
      default:
        console.log("default_ran");
    }
  };

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
}))(Questions);
