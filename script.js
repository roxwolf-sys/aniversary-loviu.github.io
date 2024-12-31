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

let clickCount = 0;
let clickTimer = null;
let isFirstClick = true;
let isSecondSongPlaying = false;
const CLICK_THRESHOLD = 8;
const CLICK_TIMEOUT = 2000;

const audioTracks = {
    main: {
        element: document.getElementById('bgMusic'),
        src: 'tu-primer-audio.mp3'
    },
    alternate: {
        element: document.getElementById('alternateMusic'),
        src: 'tu-segundo-audio.mp3'
    }
};

function handleClick() {
    // Reproducir primera canción con un click
    if (isFirstClick) {
        audioTracks.main.element.volume = 0.5;
        audioTracks.alternate.element.volume = 0.5;
        audioTracks.main.element.play().catch(function(error) {
            console.log("Error al reproducir el audio:", error);
        });
        isFirstClick = false;
        return;
    }

    // Solo contar clicks si aún no está sonando la segunda canción
    if (!isSecondSongPlaying) {
        clickCount++;
        
        clearTimeout(clickTimer);
        
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, CLICK_TIMEOUT);
        
        // Cambiar a la segunda canción si se alcanzaron los 8 clicks
        if (clickCount >= CLICK_THRESHOLD) {
            audioTracks.main.element.pause();
            audioTracks.main.element.currentTime = 0;
            
            audioTracks.alternate.element.play().catch(function(error) {
                console.log("Error al cambiar el audio:", error);
            });
            
            isSecondSongPlaying = true;
            clickCount = 0;
            clearTimeout(clickTimer);
        }
    }
}

// Agregar eventos de click/touch
document.addEventListener('click', handleClick);
document.addEventListener('touchstart', handleClick);
