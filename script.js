const images = [
    "bebeto.png",
    "cris.png",
    "ronaldo.png",
    "messi.png",
    "ney.png",
    "marradona.png",
];

const cards = [...images, ...images];
const grid = document.querySelector(".grid");
const startButton = document.getElementById("start-button");

const clickSound = new Audio("sounds/click.mp3");
const applauseSound = new Audio("sounds/applause.mp3");

let firstCard, secondCard;
let lockBoard = false;
let time = 60;
let timer;

document.addEventListener("contextmenu", (event) => event.preventDefault());

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startGame() {
    grid.innerHTML = "";
    shuffle(cards).forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = image;

        const img = document.createElement("img");
        img.src = `IMG/${image}`;
        img.alt = "Imagem do jogo";

        card.appendChild(img);
        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    });

    time = 60;
    document.getElementById("time").textContent = time;
    clearInterval(timer);
    timer = setInterval(() => {
        time--;
        document.getElementById("time").textContent = time;

        if (time === 0) {
            clearInterval(timer);
            Swal.fire("Tempo esgotado!", "Você perdeu!", "error");
            startGame();
        }
    }, 1000);
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains("flipped")) return;

    clickSound.play();
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        applauseSound.play();
        resetBoard();
        checkWin();
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
}

function checkWin() {
    const allMatched = document.querySelectorAll(".matched").length === cards.length;
    if (allMatched) {
        clearInterval(timer);
        Swal.fire("Golaaaaaço!", "Você venceu o jogo!", "success");
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}
startButton.addEventListener("click", startGame);
