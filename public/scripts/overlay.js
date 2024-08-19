document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');
    const overlayData = document.getElementById('overlayData');
    const closeOverlay = document.getElementById('closeOverlay');

    document.querySelectorAll('.viewButton').forEach((button) => {
        button.addEventListener('click', function () {
            // Retrieve the data attributes from the clicked button
            const picture = button.getAttribute('data-picture')
            const buildingName = button.getAttribute('data-building-name');
            const country = button.getAttribute('data-country');
            const city = button.getAttribute('data-city');
            const address = button.getAttribute('data-address');
            const size = button.getAttribute('data-size');
            const bedrom = button.getAttribute('data-bedrom');
            const bathroom = button.getAttribute('data-bathroom');

            // Populate the overlay with the data
            overlayData.innerHTML = `
                <img src="${picture}" class="bd-placeholder-img card-img-top" alt="Image" width="100%" height="225">
                <hr>
                <h5>${buildingName}</h5>
                <p>${country}, ${city}, ${address}</p>
                <p>Size: ${size} ㎡</p>
                <p>${bedrom} bed, ${bathroom} bath</p>
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
