const container = document.querySelector(".heart-container");
let isDragging = false;
let currentX = 0;
let currentY = 0;
let initialX = 0;
let initialY = 0;
let xOffset = 0;
let yOffset = 0;

function setTransform(x, y) {
  container.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
}

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === container || container.contains(e.target)) {
    isDragging = true;
  }
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTransform(currentX * 0.5, -currentY * 0.5);
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  isDragging = false;
}

container.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

container.addEventListener("touchstart", dragStart);
document.addEventListener("touchmove", drag, { passive: false });
document.addEventListener("touchend", dragEnd);

window.addEventListener("load", function () {
  const bgMusic = document.getElementById("bgMusic");
  bgMusic.volume = 1.0; // Ajusta el volumen (0.0 a 1.0)
  bgMusic.play().catch(function (error) {
    console.log("La reproducción automática fue prevenida:", error);
  });
});
// Agregar al inicio de tu script.js existente
let clickCount = 0;
let clickTimer = null;
const CLICK_THRESHOLD = 8; // Número de clicks necesarios
const CLICK_TIMEOUT = 2000; // Tiempo máximo entre clicks (2 segundos)

const audioTracks = {
  main: {
    element: document.getElementById("bgMusic"),
    src: "Es Verdad.mp3",
  },
  alternate: {
    element: document.getElementById("alternateMusic"),
    src: "Compartir.mp3",
  },
};

let currentTrack = "main";

function handleClick() {
  clickCount++;

  // Reiniciar el temporizador
  clearTimeout(clickTimer);

  // Configurar nuevo temporizador
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, CLICK_TIMEOUT);

  // Verificar si alcanzamos el umbral de clicks
  if (clickCount >= CLICK_THRESHOLD) {
    switchAudio();
    clickCount = 0;
    clearTimeout(clickTimer);
  }
}

function switchAudio() {
  // Pausar la pista actual
  audioTracks[currentTrack].element.pause();
  audioTracks[currentTrack].element.currentTime = 0;

  // Cambiar a la otra pista
  currentTrack = currentTrack === "main" ? "alternate" : "main";

  // Reproducir la nueva pista
  audioTracks[currentTrack].element.play().catch(function (error) {
    console.log("Error al cambiar el audio:", error);
  });
}

// Agregar eventos de click/touch
document.addEventListener("click", handleClick);
document.addEventListener("touchstart", handleClick);

// Iniciar la reproducción cuando se cargue la página
window.addEventListener("load", function () {
  audioTracks.main.element.volume = 1.0;
  audioTracks.alternate.element.volume = 1.0;

  audioTracks.main.element.play().catch(function (error) {
    console.log("La reproducción automática fue prevenida:", error);
  });
});
