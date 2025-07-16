// Carrossel funcionalidade
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.carousel-img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let current = 0;

    function showImage(idx) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === idx);
        });
    }

    function nextImage() {
        current = (current + 1) % images.length;
        showImage(current);
    }

    function prevImage() {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    }

    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Troca automática a cada 5s
    setInterval(nextImage, 5000);

    showImage(current);
});
