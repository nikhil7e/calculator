// GLOBAL VARIABLES
let firstNum = "0";
let operator = null;
let secondNum = null;
let hasCalculated = false;
let firstIsDecimal = false;
let secondIsDecimal = false;

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
allNumKeys.forEach(numKey => {
    numKey.addEventListener("click", (e) => {
        if (!operator && currCalc.textContent.length > 11) {
            return;
        } else if (currCalc.textContent.length > 14) {
            return
        }

        if (operator === null || operator === undefined) {
            if (firstNum !== "0") {
                firstNum += e.target.textContent;
            } else {
                firstNum = e.target.textContent;
            }
        } else {
            if (secondNum !== "0") {
                secondNum += e.target.textContent;
            } else {
                secondNum = e.target.textContent;
            }
        }

        // user has modified answer of previous calculation
        if (hasCalculated && !secondNum) {
            lastCalc.textContent = "";
        }

        updateScreen();
    });
});

function updateScreen() {
    currCalc.textContent = firstNum;
    if (operator) {
        currCalc.textContent += " " + operator;
    }
    if (secondNum) {
        currCalc.textContent += " " + secondNum;
    }

}

clear.addEventListener("click", (e) => {
    firstNum = "0";
    operator = undefined;
    secondNum = undefined;
    firstIsDecimal = false;
    secondIsDecimal = false;
    lastCalc.textContent = "";
    updateScreen();
});

backspace.addEventListener("click", (e) => {
    if (secondNum) {
        if (secondNum.length === 1) {
            secondNum = "";
        } else {
            secondNum = secondNum.substring(0, secondNum.length - 1);
        }
        if (!secondNum.includes(".")) {
            secondIsDecimal = false;
        }
    } else if (operator) {
        operator = null;
        secondNum = null;
    } else {
        if (firstNum.length > 1) {
            firstNum = firstNum.substring(0, firstNum.length - 1);
        } else if (firstNum.length === 1) {
            firstNum = "0";
        }
        if (!firstNum.includes(".")) {
            firstIsDecimal = false;
        }
    }

    // user has modified answer of previous calculation
    if (hasCalculated) {
        lastCalc.textContent = "";
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
    operaterHandler("-");
});

function operaterHandler(op) {
    operator = op;
    secondNum = "";
    updateScreen();
}

equals.addEventListener("click", (e) => {
    operate();
    secondIsDecimal = false;
    hasCalculated = true;
});

point.addEventListener("click", (e) => {
    if (currCalc.textContent.length > 13) {
        return;
    }

    if (!secondNum && !firstIsDecimal) {
        firstNum += ".";
        firstIsDecimal = true;
    } else if (secondNum && !secondIsDecimal) {
        secondNum += ".";
        secondIsDecimal = true;
    }

    updateScreen();
});

function operate() {
    if (!secondNum) {
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

    // if float
    if (ans % 1 !== 0) {
        firstIsDecimal = true;
    }

    let ansString = "" + ans;
    if (ansString.length > 10) {
        if (firstIsDecimal) {
            ans = parseInt(ans * Math.pow(10, 3));
            ans /= Math.pow(10, 3);
        } else {
            ans = ans.toExponential(2);
        }
    }

    firstNum = "" + ans;
    operator = null;
    secondNum = null;



    lastCalc.textContent = currCalc.textContent + " =";
    currCalc.textContent = ans;
}

// LOGIC




