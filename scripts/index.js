// CONTROL DEL REPRODUCTOR
const musicPlayer = document.getElementById('musicPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const disc = document.querySelector('.disc');

let isPlaying = false;

musicPlayer.pause()
disc.style.animationPlayState = 'paused';
playPauseBtn.classList.toggle('paused');

playPauseBtn.addEventListener('click', () => {
    if (!isPlaying) {
        showCountdown()
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
const colors = ['255, 105, 180, 0.5', '255, 20, 147, 0.6', '219, 112, 147, 0.5'];

const hearthPath = new Path2D("M23.6,0c-3.4,0-6.4,2.1-7.6,5.1C14.8,2.1,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.3,16,20.6,16,20.6s16-11.3,16-20.6C32,3.8,28.2,0,23.6,0z");

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
    let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2025-10-04T00:00:00');

    function update() {
        const now = new Date();
        let diff = now - startDate;
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let seconds = Math.floor((diff / 1000) % 60);

        container.innerHTML =
            `Estoy loco por ti desde hace: <br></br> 
            <b>${days}</b> días, <b>${hours}</b> horas, <b>${minutes}</b> minutos y <b>${seconds}</b> segundos`
        container.classList.add('visible')
    }
    update();
    setInterval(update, 1000);
}