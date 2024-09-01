document.addEventListener("DOMContentLoaded", function() {
    const ratings = document.querySelectorAll('.rating');

    ratings.forEach(rating => {
        const value = parseFloat(rating.textContent.trim());
        rating.innerHTML = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= value) {
                rating.innerHTML += '<i class="fas fa-star"></i>'; // Full star
            } else if (i - 0.5 <= value) {
                rating.innerHTML += '<i class="fas fa-star-half-alt"></i>'; // Half star
            } else {
                rating.innerHTML += '<i class="far fa-star"></i>'; // Empty star
            }
        }
    });
});
