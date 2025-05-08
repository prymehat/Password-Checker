// Main password strength check function
async function checkStrength() {
    const password = document.getElementById("password").value;
    const strengthDisplay = document.getElementById("strength");

    if (!password) {
        strengthDisplay.innerHTML = "";
        return;
    }

    // Check against external file of common (banned) passwords
    if (await checkCommonPasswords(password)) {
        updateUI("Weak: Found in common passwords list", "Instantly", "red", "");
        return;
    }

    // Check for date-like patterns
    if (looksLikeDate(password)) {
        updateUI("Weak: Date-based password", "Instantly", "red", "");
        return;
    }

    // Check for keyboard walk patterns (e.g., qwerty, 12345)
    if (isKeyboardWalk(password)) {
        updateUI("Weak: Keyboard pattern", "Instantly", "red", "");
        return;
    }

    // Check for repeating patterns (e.g., abcabcabc)
    if (isRepeatingPattern(password)) {
        updateUI("Weak: Repeating pattern", "Instantly", "red", "");
        return;
    }

    // Evaluate strength based on variety and entropy
    const { score, charsetSize, unmetCriteria } = evaluatePassword(password);
    const entropy = password.length * Math.log2(charsetSize || 1);
    const crackTime = formatTime(Math.pow(2, entropy) / 1e14);

    // Determine strength label and color
    let label, color;
    if (score === 5 && password.length >= 12) {
        label = "Very Strong";
        color = "green";
    } else if (score === 5) {
        label = "Strong";
        color = "blue";
    } else if (score >= 3) {
        label = "Medium: Consider adding more variety";
        color = "orange";
    } else {
        label = "Weak: Easy to guess";
        color = "red";
    }

    // Build advice string from unmet criteria
    const advice = unmetCriteria.length > 0
        ? "Advice: " + unmetCriteria.join(", ")
        : "";

    // Display results
    updateUI(label, crackTime, color, advice);
}

// Compare password to external text file of common passwords
async function checkCommonPasswords(password) {
    try {
        const response = await fetch('common-passwords.txt');
        if (!response.ok) throw new Error('Could not load password list');
        const text = await response.text();
        const passwordList = text.split(/\r?\n/).map(p => p.trim().toLowerCase());
        return passwordList.includes(password.toLowerCase());
    } catch (error) {
        console.error('Error checking common passwords list:', error);
        return false;
    }
}

// Detects date-like strings such as "2023", "12-05-1990"
function looksLikeDate(pwd) {
    return /^\d{4}$/.test(pwd) || /^\d{2}[\/\-]\d{2}[\/\-]?\d{2,4}$/.test(pwd);
}

// Checks for common keyboard walks like "qwerty" or "12345"
function isKeyboardWalk(pwd) {
    const patterns = ["qwerty", "asdf", "zxcv", "12345", "09876"];
    const lowerPwd = pwd.toLowerCase();
    return patterns.some(seq => lowerPwd.includes(seq));
}

// Checks for repeating string patterns like "abcabcabc"
function isRepeatingPattern(pwd) {
    const repeatRegex = /^(.+)\1+$/;
    return repeatRegex.test(pwd);
}

// Evaluates password score based on character type diversity and length
function evaluatePassword(pwd) {
    const rules = {
        lower: /[a-z]/.test(pwd),
        upper: /[A-Z]/.test(pwd),
        digit: /\d/.test(pwd),
        special: /[@$!%*?&#]/.test(pwd)
    };

    const charsetSizes = { lower: 26, upper: 26, digit: 10, special: 32 };
    let charsetSize = 0;
    let score = pwd.length >= 8 ? 1 : 0;

    const unmetCriteria = [];
    if (pwd.length < 8) unmetCriteria.push("minimum 8 characters");
    if (!rules.lower) unmetCriteria.push("add lowercase");
    if (!rules.upper) unmetCriteria.push("add uppercase");
    if (!rules.digit) unmetCriteria.push("add numbers");
    if (!rules.special) unmetCriteria.push("add special characters");

    for (let [key, matched] of Object.entries(rules)) {
        if (matched) {
            charsetSize += charsetSizes[key];
            score++;
        }
    }

    return { score, charsetSize, unmetCriteria };
}

// Converts seconds to a human-readable time estimate
function formatTime(seconds) {
    if (seconds >= 3.1536e11) return "More than 100 centuries";

    const units = [
        { label: "centuries", value: 3.1536e9 },
        { label: "years", value: 3.1536e7 },
        { label: "days", value: 86400 },
        { label: "hours", value: 3600 },
        { label: "minutes", value: 60 },
        { label: "seconds", value: 1 }
    ];

    for (let { label, value } of units) {
        if (seconds >= value) {
            return `${(seconds / value).toFixed(2)} ${label}`;
        }
    }

    return `${seconds.toFixed(2)} seconds`;
}

// Updates the DOM with password strength feedback
function updateUI(strengthText, crackTime, color, advice) {
    const strengthDisplay = document.getElementById("strength");
    strengthDisplay.innerHTML =
        `${strengthText}<br>Estimated crack time: ${crackTime}` +
        (advice ? `<br><span style="font-size: 0.9em; color: gray;"><i>${advice}</i></span>` : "");
    strengthDisplay.style.color = color;
}