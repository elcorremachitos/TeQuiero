// CONTROL DEL REPRODUCTOR
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const discImage = document.querySelector('.disc img');
const disc = document.querySelector('.disc');

let isPlaying = false;

musicPlayer.pause()
disc.style.animationPlayState = 'paused';
playPauseBtn.classList.toggle('paused');

playPauseBtn.addEventListener('click', () => {
    if (!isPlaying) {
        discImage.src = './sources/images/astralMap.png';
        showCountdown();
        musicPlayer.play();
        disc.style.animationPlayState = 'running';
        playPauseBtn.classList.toggle('paused');
        isPlaying = true;
    }
});

// ANIMACIÓN DE LAS HOJAS
setTimeout(() => {
    const hojas = document.querySelectorAll('[class^="hoja-"]');
    const transformOriginales = Array.from(hojas).map(h =>
        getComputedStyle(h).transform !== 'none' ? getComputedStyle(h).transform : ''
    );

    let angulo = 0;

    function animarHojas() {
        const oscilacion = Math.sin(angulo) * 5;
        hojas.forEach((hoja, i) => {
            hoja.style.transform = transformOriginales[i]
                ? `${transformOriginales[i]} rotate(${oscilacion}deg)`
                : `rotate(${oscilacion}deg)`;
        });
        angulo += 0.02;
        requestAnimationFrame(animarHojas);
    }

    setTimeout(animarHojas, 100);
}, 1000);

// ANIMACIÓN DE PARTÍCULAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const particles = [];
const colors = ['255, 255, 255, 0.9','200, 220, 255, 0.7','180, 200, 255, 0.6','255, 245, 220, 0.6'];


const hearthPath = new Path2D("M16 0 L20 11 L32 12 L23 19 L26 32 L16 25 L6 32 L9 19 L0 12 L12 11 Z");


class Particle {
    constructor(x, y, minR, maxR, color, speed) {
        this.x = x;
        this.y = y;
        this.scale = Math.random() * (maxR - minR) + minR;
        this.color = color;
        this.speed = speed;
        this.maxR = maxR;
        this.minR = minR;
    }

    update() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.fill(hearthPath);
        ctx.restore();

        this.scale += this.speed;
        if (this.scale > this.maxR || this.scale < this.minR) this.speed = -this.speed;
    }
}

function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    particles.length = 0;
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            0.3, 0.8,
            colors[Math.floor(Math.random() * colors.length)],
            Math.random() * 0.005
        ));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animate);
}

resizeCanvas();
animate();
window.addEventListener('resize', resizeCanvas);

// Contador
function getURLParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function showCountdown() {
    const container = document.getElementById('countdown');
    let startParam = getURLParam('start');
    let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-11-07T00:00:00');

    function update() {
        const now = new Date();
        let diff = now - startDate;
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let seconds = Math.floor((diff / 1000) % 60);

        container.innerHTML =
            `Te dedico esta cancion por los: <br><br> 
            <b>${days}</b> días, <b>${hours}</b> horas, <b>${minutes}</b> minutos y <b>${seconds}</b> segundos <br><b>Junto a ti 💕</b>`
        container.classList.add('visible')
    }
    update();
    setInterval(update, 1000);
}