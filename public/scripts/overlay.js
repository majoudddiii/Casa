document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');
    const overlayData = document.getElementById('overlayData');
    const closeOverlay = document.getElementById('closeOverlay');

    document.querySelectorAll('.viewButton').forEach((button, index) => {
        button.addEventListener('click', function () {
            // Retrieve the data attributes from the clicked button
            const pictures = button.getAttribute('data-picture').split(','); // Assuming pictures is a comma-separated string
            const buildingName = button.getAttribute('data-building-name');
            const city = button.getAttribute('data-city');
            const town = button.getAttribute('data-town');
            const address = button.getAttribute('data-address');
            const size = button.getAttribute('data-size');
            const bedrom = button.getAttribute('data-bedrom');
            const bathroom = button.getAttribute('data-bathroom');
            const pool = button.getAttribute('data-pool') === 'true';
            const poolSize = button.getAttribute('data-poolsize');
            const roomService = button.getAttribute('data-roomService');
            const commentsText = button.getAttribute('data-commentsText');

            const poolMessage = pool ? "Yes" : "No";
            const roomServiceMessage = roomService ? "Yes" : "No";

            // Build the carousel for the overlay
            let carouselIndicators = '';
            let carouselItems = '';

            pictures.forEach((picture, picIndex) => {
                carouselIndicators += `
                    <button 
                        type="button" 
                        data-bs-target="#carouselOverlay${index}" 
                        data-bs-slide-to="${picIndex}" 
                        class="${picIndex === 0 ? 'active' : ''}" 
                        aria-current="${picIndex === 0 ? 'true' : 'false'}" 
                        aria-label="Slide ${picIndex + 1}">
                    </button>
                `;

                carouselItems += `
                    <div class="carousel-item ${picIndex === 0 ? 'active' : ''}">
                        <img src="${picture}" class="d-block w-100" alt="Image">
                    </div>
                `;
            });

            overlayData.innerHTML = `
                <div id="carouselOverlay${index}" class="carousel slide mb-6">
                    <div class="carousel-indicators">
                        ${carouselIndicators}
                    </div>
                    <div class="carousel-inner">
                        ${carouselItems}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselOverlay${index}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselOverlay${index}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <h5 style="padding-top: 10px;">${buildingName}</h5>
                <hr>
                <p>${city}, ${town}, ${address}</p>
                <p>Size: ${size} ㎡, ${bedrom} bed, ${bathroom} bath</p>
                <ul>
                    <li>Pool: ${poolMessage}</li>
                    ${pool && poolSize ? `<li>Pool Size: ${poolSize}</li>` : ''}
                    <li>Room Service: ${roomServiceMessage}</li>
                </ul>
                <hr>
                <p style="text-decoration: underline;">Comments: </p>
                <p>${commentsText}</p>
            `;

            // Show the overlay
            overlay.style.display = 'flex';
        });
    });

    // Close the overlay when the close button is clicked
    closeOverlay.addEventListener('click', function () {
        overlay.style.display = 'none';
    });

    // Close the overlay when clicking outside the overlay content
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });
});
