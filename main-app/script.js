function checkStrength() {
    let password = document.getElementById("password").value;
    let strengthDisplay = document.getElementById("strength");

    // Common weak passwords
    let weakPasswords = new Set([
        "123456", "password", "123456789", "12345", "12345678", "qwerty", "1234567", "111111", "123123", "abc123",
        "password1", "1234", "iloveyou", "sunshine", "admin", "welcome", "monkey", "football", "charlie", "letmein",
        "princess", "666666", "qwerty123", "superman", "hello123", "1q2w3e4r", "qazwsx", "123qwe", "dragon", "baseball",
        "michael", "shadow", "master", "jennifer", "starwars", "cheese", "soccer", "password123", "hockey", "tigger",
        "george", "trustno1", "whatever", "pokemon", "123abc", "654321", "jordan23", "freedom", "passw0rd", "zaq12wsx",
        "killer", "buster", "qwertyuiop", "asdfghjkl", "zxcvbnm", "loveme", "batman", "letmeinnow", "corona", "coronavirus",
        "summer", "daniel", "hunter", "computer", "ashley", "matthew", "bailey", "qwerty1", "thomas", "mickey", "bailey123",
        "flower", "merlin", "diamond", "love123", "hannah", "fuckyou", "dallas", "pepper", "jessica", "banana", "startrek",
        "12341234", "robert", "harley", "mustang", "asdfgh", "london", "maggie", "ginger", "cookie", "samantha",
        "q1w2e3r4t5", "123321", "hotdog", "baby123", "letmein123", "freedom1", "badboy", "charles", "liverpool",
        "qwert", "test123", "welcome1", "hello", "monkey123", "pass123", "secure123", "securepassword", "batman123",
        "cheese123", "soccer123", "football123", "123pass", "trustme", "changeme", "123456a", "987654", "87654321",
        "passw0rd123", "trustme123", "letmeinnow123", "access", "masterkey", "justme", "guessme", "youshallnotpass",
        "opensesame", "swordfish", "1234567890", "0987654321", "654987", "789654", "admin123", "password321", "password!",
        "pa$$word", "letmein!", "p@ssw0rd", "p@ssword1", "123456pass", "welcome123", "w3lc0m3", "qwerty!", "1q2w3e",
        "1q2w3e4r", "zaq12wsxcde", "pass1234", "loveyou123", "just4me", "youcantguess", "tryagain", "wrongpassword",
        "dontguessme", "youfoundme", "iloveyou1", "god123", "jesus123", "loveislife", "peace123", "money123", "richard",
        "jackson", "johnny", "maxwell", "rockyou", "shadow123", "letmeinplease", "hannah123", "princess1", "spiderman",
        "captainamerica", "ironman", "thor123", "hulk123", "password007", "agent47", "blackwidow", "superman123", "kraken",
        "redbull", "skittles", "oreo123", "starbucks", "dunkin", "coffee123", "fifa123", "playstation", "xbox123",
        "microsoft", "apple123", "google123", "android123", "samsung", "nokia3310", "blackberry", "huawei123", "tesla123",
        "elonmusk", "marscolony", "spacex123", "neuralink", "openai123", "skynet", "cyberdyne", "terminator", "matrix123",
        "neo123", "morpheus", "trinity123", "agent123", "darkknight", "joker123", "harleyquinn", "puddin", "deadpool123",
        "wolverine123", "stormtrooper", "anakin123", "skywalker", "vader123", "palpatine", "sithlord", "jedimaster",
        "han123", "leia123", "r2d2", "c3po123", "bb8123", "yoda123", "lightsaber", "forceisstrong", "darth123",
        "sidious", "kenobi", "ahsoka", "marvel123", "dcuniverse", "jokeriswild", "sanicfast", "mario123", "luigi123",
        "pikachu", "charizard", "eevee123", "pokeball", "snorlax123", "mewtwo123", "ashketchum", "teamrocket",
        "gottacatch", "pokemonrules", "masterchief", "halo123", "cortana", "doomguy", "fortnite123", "pubgrocks",
        "valorant123", "csgo123", "overwatch", "dota123", "league123", "minecraft", "creeper123", "nether123",
        "diamondpickaxe", "redstone", "villager123", "steve123", "alex123", "herobrine", "noobmaster", "callofduty",
        "modernwarfare", "blackops", "battlefield", "warzone", "roblox123", "tiktok123", "instagram", "snapchat",
        "facebook123", "twitter123", "youtube123", "netflix123", "hulu123", "amazon123", "primevideo", "disneyplus",
        "spotify123", "musicislife", "headphones", "audiophile", "bassboost", "soundwave", "speakers123", "loudmusic",
        "guitarhero", "rockstar", "mtvrocks", "gaminglife", "streamer123", "twitch123", "youtuber123", "contentcreator",
        "blogger123", "writerlife", "author123", "journalist123", "freelancer", "developer123", "coderlife", "hacker123",
        "pentester", "ethicalhacker", "bugbounty", "linux123", "terminal123", "bash123", "root123", "sudo123", "admin!",
        "godmode", "iamadmin", "rootaccess", "superuser", "hacked123", "malware123", "ransomware", "trojanhorse",
        "spyware123", "keylogger", "zeroday", "darkweb123", "torbrowser", "onion123", "deepweb", "anonymity", "vpn123",
        "proxy123", "firewall123", "secureme", "cybersecure", "strongpassword", "2faenabled", "mfaenabled"
      ]);
    if (weakPasswords.has(password)) {
        strengthDisplay.innerHTML = "Weak: Common password<br>Estimated crack time: Instantly";
        strengthDisplay.style.color = "red";
        return;
    }

    if (password === "") {
        strengthDisplay.innerHTML = "";
        return;
    }

    let length = password.length;
    let hasLower = /[a-z]/.test(password);
    let hasUpper = /[A-Z]/.test(password);
    let hasDigit = /\d/.test(password);
    let hasSpecial = /[@$!%*?&#]/.test(password);

    let score = hasLower + hasUpper + hasDigit + hasSpecial + (length >= 8);

    // Estimate brute-force time
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10;
    if (hasSpecial) charsetSize += 10;
    let totalCombinations = Math.pow(charsetSize, length);
    let guessesPerSecond = 10 ** 14;
    let secondsToCrack = totalCombinations / guessesPerSecond;

    let timeEstimate = "";
    if (secondsToCrack < 60) timeEstimate = `${secondsToCrack.toFixed(2)} seconds`;
    else if (secondsToCrack < 3600) timeEstimate = `${(secondsToCrack / 60).toFixed(2)} minutes`;
    else if (secondsToCrack < 86400) timeEstimate = `${(secondsToCrack / 3600).toFixed(2)} hours`;
    else if (secondsToCrack < 31536000) timeEstimate = `${(secondsToCrack / 86400).toFixed(2)} days`;
    else if (secondsToCrack < 3153600000) timeEstimate = `${(secondsToCrack / 31536000).toFixed(2)} years`;
    else timeEstimate = `${(secondsToCrack / 3153600000).toFixed(2)} centuries`;

    // Set strength and color
    if (score === 5 && length >= 12) {
        strengthDisplay.innerHTML = `Very Strong<br>Estimated crack time: ${timeEstimate}`;
        strengthDisplay.style.color = "green";
    } else if (score === 5) {
        strengthDisplay.innerHTML = `Strong<br>Estimated crack time: ${timeEstimate}`;
        strengthDisplay.style.color = "blue";
    } else if (score >= 3) {
        strengthDisplay.innerHTML = `Medium: Consider adding more variety<br>Estimated crack time: ${timeEstimate}`;
        strengthDisplay.style.color = "orange";
    } else {
        strengthDisplay.innerHTML = `Weak: Easy to guess<br>Estimated crack time: ${timeEstimate}`;
        strengthDisplay.style.color = "red";
    }
}
