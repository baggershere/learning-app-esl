import { array } from "prop-types";

export const calculateCategoryX = (width, index) => {
  return index === 1 || index === 4 || index === 7 || index === 10
    ? width * 0.2
    : index === 2 || index === 5 || index === 8 || index === 11
    ? width * 0.5
    : index === 3 || index === 6 || index === 9 || index === 12
    ? width * 0.8
    : 0;
};
export const calculateCategoryY = (height, index) => {
  return index >= 1 && index <= 3
    ? height * 0.33
    : index >= 4 && index <= 6
    ? height * 0.66
    : index >= 7 && index <= 9
    ? height * 1
    : 0;
};
export const selectRandomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export function shuffle(array) {
  //ref = https://stackoverflow.com/a/2450976
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const placeBox = (arrayLength, index, stage, phone, type) => {
  let x;
  let y;
  if (!phone) {
    if (arrayLength === 3) {
      if (index === 0) {
        x = stage.canvas.width * 0.2;
        y =
          type === "box"
            ? stage.canvas.height * 0.5
            : stage.canvas.height * 0.65;
      }
      if (index === 1) {
        x = stage.canvas.width * 0.4;
        y =
          type === "box"
            ? stage.canvas.height * 0.5
            : stage.canvas.height * 0.65;
      }
      if (index === 2) {
        x = stage.canvas.width * 0.6;
        y =
          type === "box"
            ? stage.canvas.height * 0.5
            : stage.canvas.height * 0.65;
      }
    }
    if (arrayLength === 4) {
      if (index === 0) {
        x = stage.canvas.width * 0.1;
        y = stage.canvas.height * 0.5;
      }
      if (index === 1) {
        x = stage.canvas.width * 0.3;
        y = stage.canvas.height * 0.5;
      }
      if (index === 2) {
        x = stage.canvas.width * 0.5;
        y = stage.canvas.height * 0.5;
      }
      if (index === 3) {
        x = stage.canvas.width * 0.7;
        y = stage.canvas.height * 0.5;
      }
    }
    if (arrayLength === 5) {
      if (index === 0) {
        x = stage.canvas.width * 0.2;
        y = stage.canvas.height * 0.5;
      }
      if (index === 1) {
        x = stage.canvas.width * 0.4;
        y = stage.canvas.height * 0.5;
      }
      if (index === 2) {
        x = stage.canvas.width * 0.6;
        y = stage.canvas.height * 0.5;
      }
      if (index === 3) {
        x = stage.canvas.width * 0.3;
        y = stage.canvas.height * 0.625;
      }
      if (index === 4) {
        x = stage.canvas.width * 0.5;
        y = stage.canvas.height * 0.625;
      }
    }
  }
  if (phone) {
    if (arrayLength === 3) {
      if (index === 0) {
        x = stage.canvas.width * 0.125;
        y = type === "word" ? stage.canvas.height * 0.6 : stage.canvas.height * 0.5;
      }
      if (index === 1) {
        x = stage.canvas.width * 0.375;
         y = type === "word" ? stage.canvas.height * 0.6 : stage.canvas.height * 0.5;
      }
      if (index === 2) {
        x = stage.canvas.width * 0.625;
         y = type === "word" ? stage.canvas.height * 0.6 : stage.canvas.height * 0.5;
      }
    }
    if (arrayLength === 4) {
      if (index === 0) {
        x = stage.canvas.width * 0.125;
        y = stage.canvas.height * 0.5;
      }
      if (index === 1) {
        x = stage.canvas.width * 0.375;
        y = stage.canvas.height * 0.5;
      }
      if (index === 2) {
        x = stage.canvas.width * 0.625;
        y = stage.canvas.height * 0.5;
      }
      if (index === 3) {
        x = stage.canvas.width * 0.375;
        y = stage.canvas.height * 0.6;
      }
    }
    if (arrayLength === 5) {
      if (index === 0) {
        x = stage.canvas.width * 0.125;
        y = stage.canvas.height * 0.5;
      }
      if (index === 1) {
        x = stage.canvas.width * 0.375;
        y = stage.canvas.height * 0.5;
      }
      if (index === 2) {
        x = stage.canvas.width * 0.625;
        y = stage.canvas.height * 0.5;
      }
      if (index === 3) {
        x = stage.canvas.width * 0.25;
        y = stage.canvas.height * 0.6;
      }
      if (index === 4) {
        x = stage.canvas.width * 0.5;
        y = stage.canvas.height * 0.6;
      }
    }
  }
  return {
    x,
    y,
  };
};
export function collision(obj1, obj2) {
  var objBounds1 = obj1.getBounds().clone();
  var objBounds2 = obj2.getBounds().clone();

  var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);

  var h1 = -(objBounds1.height / 2 + objBounds2.height - objBounds1.height / 2);
  var h2 = objBounds2.height / 2;
  var w1 = -(objBounds1.width / 2 + objBounds2.width - objBounds1.width / 2);
  var w2 = objBounds2.width / 2;
  if (pt.x > w2 || pt.x < w1) {
    return false;
  }
  if (pt.y > h2 || pt.y < h1) {
    return false;
  }
  return true;
}

export const mouseObjCollision = (x, y, obj2) => {
  var objBounds2 = obj2.getBounds().clone();
  if (
    x >= objBounds2.x + objBounds2.width ||
    x <= objBounds2.x ||
    y >= objBounds2.y + objBounds2.height ||
    y <= objBounds2.y
  ) {
    return false;
  }
  return true;
};

export const checker = arr => arr.every(v => v !== "");

export const computerKeyboard = [
  {key:'a', row:1, id: 1, break: false},
  {key:'b', row:1, id: 2, break: false},
  {key:'c', row:1, id: 3, break: false},
  {key:'d', row:1, id: 4, break: false},
  {key:'e', row:1, id: 5, break: false},
  {key:'f', row:1, id: 6, break: false},
  {key:'g', row:1, id: 7, break: false},
  {key:'h', row:1, id: 8, break: false},
  {key:'i', row:1, id: 9, break: true},
  {key:'j', row:2, id: 10, break: false},
  {key:'k', row:2, id: 11, break: false},
  {key:'l', row:2, id: 12, break: false},
  {key:'m', row:2, id: 13, break: false},
  {key:'n', row:2, id: 14, break: false},
  {key:'o', row:2, id: 15, break: false},
  {key:'p', row:2, id: 16, break: false},
  {key:'q', row:2, id: 17, break: false},
  {key:'r', row:2, id: 18, break: true},
  {key:'s', row:3, id: 19, break: false},
  {key:'t', row:3, id: 20, break: false},
  {key:'u', row:3, id: 21, break: false},
  {key:'v', row:3, id: 22, break: false},
  {key:'w', row:3, id: 23, break: false},
  {key:'x', row:3, id: 24, break: false},
  {key:'y', row:3, id: 25, break: false},
  {key:'z', row:3, id: 26, break: false},
]
export const phoneKeyboard = [
  {key:'a', row:1, id: 1, break: false},
  {key:'b', row:1, id: 2, break: false},
  {key:'c', row:1, id: 3, break: false},
  {key:'d', row:1, id: 4, break: false},
  {key:'e', row:1, id: 5, break: false},
  {key:'f', row:1, id: 6, break: false},
  {key:'g', row:1, id: 7, break: true},
  {key:'h', row:2, id: 8, break: false},
  {key:'i', row:2, id: 9, break: false},
  {key:'j', row:2, id: 10, break: false},
  {key:'k', row:2, id: 11, break: false},
  {key:'l', row:2, id: 12, break: false},
  {key:'m', row:2, id: 13, break: false},
  {key:'n', row:2, id: 14, break: true},
  {key:'o', row:3, id: 15, break: false},
  {key:'p', row:3, id: 16, break: false},
  {key:'q', row:3, id: 17, break: false},
  {key:'r', row:3, id: 18, break: false},
  {key:'s', row:3, id: 19, break: false},
  {key:'t', row:3, id: 20, break: false},
  {key:'u', row:3, id: 21, break: true},
  {key:'v', row:4, id: 22, break: false},
  {key:'w', row:4, id: 23, break: false},
  {key:'x', row:4, id: 24, break: false},
  {key:'y', row:4, id: 25, break: false},
  {key:'z', row:4, id: 26, break: false},
]

export const calcKeyYPosition = (phone,key) => {
  if (phone) {
    if (key.row == 1) return 510;
    if (key.row == 2) return 570; 
    if (key.row == 3) return 630; 
    if (key.row == 4) return 690; 
  }
  if (!phone) {
    if (key.row == 1) return 360;
    if (key.row == 2) return 420; 
    if (key.row == 3) return 480; 
  }
}