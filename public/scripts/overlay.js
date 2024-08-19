document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('overlay');
    var showOverlayBtn = document.getElementById('showOverlayBtn');
    var closeOverlayBtn = document.getElementById('closeOverlayBtn');

    showOverlayBtn.addEventListener('click', function() {
        overlay.style.display = 'block';
    });

    closeOverlayBtn.addEventListener('click', function() {
        overlay.style.display = 'none';
    });

    // Close overlay if clicked outside the content
    window.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });
});