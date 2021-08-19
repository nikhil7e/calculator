// GLOBAL VARIABLES

let firstNum = "0";
let operator = null;
let secondNum = null;
let hasCalculated = false;
let firstIsFloat = false;
let secondIsFloat = false;
let firstIsNegative = false;
let secondIsNegative = false;

const allNumKeys = document.querySelectorAll(".number");
const currCalc = document.querySelector(".current-calculation");
const lastCalc = document.querySelector(".last-calculation");
const clear = document.querySelector(".clear");
const backspace = document.querySelector(".backspace");
const divide = document.querySelector(".divide");
const multiply = document.querySelector(".multiply");
const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const equals = document.querySelector(".equals");
const point = document.querySelector(".point");


// FUNCTIONS

function updateScreen() {
    currCalc.textContent = firstNum;
    if (operator) {
        currCalc.textContent += " " + operator;
    }
    if (secondNum) {
        currCalc.textContent += " " + secondNum;
    }
}

function operaterHandler(op) {
    if (hasCalculated) {
        lastCalc.textContent = "";
        hasCalculated = false;
    }

    if (operator && secondNumExists()) {
        operate();
        operator = op;
        secondNum = "";
        updateScreen();
        return;
    }

    operator = op;
    secondNum = "";
    updateScreen();
}

function operate() {
    if (!secondNumExists()) {
        return
    }

    let first = Number(firstNum);
    let second = Number(secondNum);
    let ans;

    if (operator === "/") {
        if (second === 0) {
            currCalc.textContent = "ERROR";
            return;
        } else {
            ans = first / second;
        }
    } else if (operator === "*") {
        ans = first * second;
    } else if (operator === "+") {
        ans = first + second;
    } else {
        ans = first - second;
    }

    hasCalculated = true;
    ans = shortenNumber(ans);
    updateValues(ans);
    if (!isFinite(ans)) {
        firstNum = "0";
    }
}

function updateValues(ans) {
    firstNum = "" + ans;
    operator = null;
    secondNum = null;

    lastCalc.textContent = currCalc.textContent + " =";
    currCalc.textContent = ans;
}

function shortenFirstFloat(ans, ansString) {
    ans = parseInt(ans * Math.pow(10, 6));
    ans /= Math.pow(10, 6);
    if ((ansString.substring(0, ansString.indexOf("."))).length > 8) {
        ans = ans.toExponential(6);
    }

    return ans
}


function shortenNumber(ans) {
    checkFloat(ans);

    let ansString = "" + ans;
    if (ansString.length > 12) {
        if (firstIsFloat) {
            ans = shortenFirstFloat(ans, ansString);
        }
        else {
            ans = ans.toExponential(6);
        }
    }

    return ans;
}

function checkFloat(ans) {
    if (ans % 1 !== 0) {
        firstIsFloat = true;
    } else {
        firstIsFloat = false;
    }
}

function checkCurrBounds() {
    if (firstNum.length < 12) {
        if (secondNum && !(secondNum.length < 12)) {
            return false;
        }
        return true;
    } else {

        return false;
    }
}

function secondNumBackspace() {
    if (secondNum.length === 1) {
        secondNum = "";
    } else {
        secondNum = secondNum.substring(0, secondNum.length - 1);
    }
    if (!secondNum.includes(".")) {
        secondIsFloat = false;
    }
}

function firstNumBackspace() {
    if (firstNum.length > 1) {
        firstNum = firstNum.substring(0, firstNum.length - 1);
    } else if (firstNum.length === 1) {
        firstNum = "0";
    }
    if (!firstNum.includes(".")) {
        firstIsFloat = false;
    }
}

function firstNumExists() {
    if (firstNum && firstNum !== "-") {
        return true;
    } else {
        return false;
    }
}

function secondNumExists() {
    if (secondNum && secondNum !== "-") {
        return true;
    } else {
        return false;
    }
}

function addToFirst(e) {
    if (firstNum !== "0") {
        firstNum += e.target.textContent;
    } else {
        firstNum = e.target.textContent;
    }
}

function addToSecond(e) {
    if (secondNum !== "0") {
        secondNum += e.target.textContent;
    } else {
        secondNum = e.target.textContent;
    }
}

function addPointToFirst() {
    if (operator) {
        secondNum += "0.";
        secondIsFloat = true;
    } else if (!firstIsFloat) {
        firstNum += ".";
        firstIsFloat = true;
    }
}

function showMaxReached() {
    lastCalc.textContent = "Max digit length reached";
    setTimeout(() => {
        lastCalc.textContent = "";
    }, 2000);
}

function checkCalculated() {
    if (hasCalculated) {
        lastCalc.textContent = "";
        hasCalculated = false;
    }
}

function negativeHandler() {
    if (firstNum === "0") {
        firstNum = "-";
        firstIsNegative = true;
    } else {
        secondNum = "-";
        secondIsNegative = true;
    }

    updateScreen();
}

// EVENT LISTENERS

allNumKeys.forEach(numKey => {
    numKey.addEventListener("click", (e) => {
        if (!operator) {
            if (firstNum.length > 12) {
                showMaxReached();
                return;
            }
            addToFirst(e);
        } else {
            if (secondNum && secondNum.length > 12) {
                lastCalc.textContent = "Max digit length reached";
                showMaxReached();
                return;
            }
            addToSecond(e);
        }

        checkCalculated();
        updateScreen();
    });
});

clear.addEventListener("click", (e) => {
    firstNum = "0";
    operator = undefined;
    secondNum = undefined;
    firstIsFloat = false;
    secondIsFloat = false;
    firstIsNegative = false;
    secondIsNegative = false;
    lastCalc.textContent = "";
    updateScreen();
});

backspace.addEventListener("click", (e) => {
    if (secondNumExists()) {
        secondNumBackspace();
    } else if (secondIsNegative) {
        currCalc.textContent =
            currCalc.textContent.substring(0, currCalc.textContent.length - 1);
        secondNum = "";
        secondIsNegative = false;
        return;
    } else if (operator) {
        operator = null;
        secondNum = null;
    } else {
        firstNumBackspace();
    }

    // user has modified answer of previous calculation
    if (hasCalculated) {
        lastCalc.textContent = "";
        hasCalculated = false;
    }

    updateScreen();
});

divide.addEventListener("click", (e) => {
    operaterHandler("/");
});

multiply.addEventListener("click", (e) => {
    operaterHandler("*");
});

plus.addEventListener("click", (e) => {
    operaterHandler("+");
});

minus.addEventListener("click", (e) => {
    if ((firstNum === "0" && !operator) || (operator && !secondNumExists())) {
        negativeHandler();
    } else {
        operaterHandler("-");
    }
});


equals.addEventListener("click", (e) => {
    operate();
    secondIsFloat = false;
});

point.addEventListener("click", (e) => {
    if (currCalc.textContent.length > 29) {
        return;
    }

    if (firstNumExists() && !secondNumExists()) {
        addPointToFirst();
    } else if (secondNumExists() && !secondIsFloat) {
        secondNum += ".";
        secondIsFloat = true;
    }

    updateScreen();
});
