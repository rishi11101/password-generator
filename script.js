//All needed data members fetching:-
const lengthSlider = document.querySelector("[data-lengthSlider]");
const lengthNumber = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheckbox = document.querySelector("#uppercase");
const lowercaseCheckbox = document.querySelector("#lowercase");
const numbersCheckbox = document.querySelector("#numbers");
const symbolsCheckbox = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-btn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbols = '!@#*?/_';


//some required variable declaration:- (GLOBAL VARIABLES)
let password = "";
let passwordLength = 10;
let checkedCount = 0;

handleSlider();

// =================all needed functions definitions below====================

//function to set passLength acc to slider:
function handleSlider(){
    lengthSlider.value = passwordLength;
    lengthNumber.innerText = passwordLength;

    
    const min = lengthSlider.min;
    const max = lengthSlider.max;
    lengthSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
    // width acc to formula and height is 100%
}

//functions to generate random values using one generic function genRandInt():-
function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber(){
    return getRandomInteger(0, 9);
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateSymbol(){
    const randNum = getRandomInteger(0, symbols.length);  //symbols.len return symbol string len
    console.log(symbols.charAt(randNum));
    return symbols.charAt(randNum);
}


//function to calculate the strength of password:-
function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheckbox.checked) hasUpper = true;
    if (lowercaseCheckbox.checked) hasLower = true;
    if (numbersCheckbox.checked) hasNum = true;
    if (symbolsCheckbox.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

// COPYING TO CLIPBOARD :-

async function copyPassword(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied!";
    }
    catch(e){
        copyMsg.innerText = "Failed to copy!";
    }

    //to make span tag visible, showing copied text!
    copyMsg.classList.add("active");

    //then using timeout, hide the msg after 2 seconds!
    setTimeout( () => {
        copyMsg.classList.remove("active")
    }, 2000);
}


//shuffling password by (FISHER YATES METHOD):-

function shufflePassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// ===========EVENT LISTENERS================

function handleCheckboxChange(){
    checkedCount = 0;

    allCheckbox.forEach( (checkbox) =>{
        if(checkbox.checked)
            checkedCount++;
    });

    //corner case:
    if(passwordLength < checkedCount){
        passwordLength = checkedCount;
        handleSlider();
    }
}

allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})


//to connect and update slider and passlength together!
lengthSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyPassword();
})


generateBtn.addEventListener('click', () => {
    //case 1 : when no checkbox selected:
    // if(checkedCount == 0) return;

    //case 2 : special corner case:
    if(passwordLength < checkedCount){
        passwordLength = checkedCount;
        handleSlider();
    }

    //generate new passwords:

    password = "";

    let functionArray = [];

    if(uppercaseCheckbox.checked)
        functionArray.push(generateUppercase);

    if(lowercaseCheckbox.checked)
        functionArray.push(generateLowercase);

    if(numbersCheckbox.checked)
        functionArray.push(generateNumber);

    if(symbolsCheckbox.checked)
        functionArray.push(generateSymbol);


    //compulsory addition:
    for(let i=0; i<functionArray.length; i++){
        password += functionArray[i]();
    }

    //remaining random addition:
    for(let i=0; i<passwordLength - functionArray.length; i++){
        let randNum = getRandomInteger(0, functionArray.length);
        password += functionArray[randNum]();
    }


    //now shuffle the password:
    password = shufflePassword(Array.from(password));   
                                            //===array.from converts the password in an array======


    //finally display password in UI:-
    passwordDisplay.value = password;

    //then strength also needed to be shown, last and final step!
    calcStrength();


});