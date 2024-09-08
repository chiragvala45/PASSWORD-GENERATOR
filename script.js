// Selecting DOM elements
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#Uppercase");
const lowercaseCheck = document.querySelector("#Lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

// Symbols set for password generation
const symbols = '~`!@#$%^&*()_-+={}[]|:;"<,>.?/'; 

// Initialize variables
let password = "";
let passwordLength = 10; // Set the default password length to 10
let checkCount = 0;

// Initialize the slider and password length display
function handleSlider() {
    inputSlider.value = passwordLength; // Set the slider value
    lengthDisplay.innerText = passwordLength; // Show length in UI
}

// Set the password strength indicator (green = strong, yellow = medium, red = weak)
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

// Generate random integers between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Generate random characters based on user selection
function generateRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123)); // a-z
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91)); // A-Z
}

function generateSymbol() {
    return symbols.charAt(getRndInteger(0, symbols.length));
}

// Calculate password strength based on criteria
function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numberCheck.checked;
    let hasSym = symbolsCheck.checked;

    // Strong password (has upper, lower, numbers/symbols, and length >= 8)
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // green
    } 
    // Medium strength (has upper or lower and numbers/symbols, and length >= 6)
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // yellow
    } 
    // Weak password
    else {
        setIndicator("#f00"); // red
    }
}

// Copy the generated password to the clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied"; // Show 'Copied' message
    } catch (e) {
        copyMsg.innerText = "Failed"; // Show 'Failed' message if error
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Shuffle the password to make it more secure
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

// Ensure that the password length matches the number of selected criteria
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider(); // Adjust slider to minimum valid length
    }
}

// Attach event listeners for checkbox changes
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Slider event listener for changing password length
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Event listener for the Copy button
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

// Main logic for password generation
generateBtn.addEventListener('click', () => {
    // Ensure at least one checkbox is selected
    if (checkCount === 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Clear old password
    password = "";

    // Array to store the selected functions for password generation
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numberCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    // Add one character from each selected category
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Add remaining characters randomly from selected categories
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle and display the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // Calculate password strength
    calcStrength();
});
