function saveDates() {
    const checkinDateInput = document.getElementById('checkin-date').value;
    const checkoutDateInput = document.getElementById('checkout-date').value;
    const guestName = document.getElementById('guest-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const numberOfGuests = document.getElementById('number-of-guests').value;

    // Convert dates from mm/dd/yyyy to YYYY-MM-DD
    function formatDate(dateString) {
        const [month, day, year] = dateString.split('/').map(Number);
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    const checkinDate = formatDate(checkinDateInput);
    const checkoutDate = formatDate(checkoutDateInput);

    // Collect data
    const data = {
        checkinDate,
        checkoutDate,
        guestName,
        phoneNumber,
        numberOfGuests,
    };

    // Send data to server
    fetch('/create-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Event created successfully:', result);
        // Handle success (e.g., show a message to the user)
    })
    .catch(error => {
        console.error('Error creating event:', error);
        // Handle error (e.g., show an error message to the user)
    });
}

document.getElementById('checkin-date').addEventListener('change', calculateTotal);
document.getElementById('checkout-date').addEventListener('change', calculateTotal);

function calculateTotal() {
    const checkinDate = new Date(document.getElementById('checkin-date').value);
    const checkoutDate = new Date(document.getElementById('checkout-date').value);
    const pricePerNight = parseFloat(document.querySelector('.checkout-box-details').getAttribute('data-price'));

    if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
        const timeDifference = checkoutDate - checkinDate;
        const totalDays = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days

        const totalCost = totalDays * pricePerNight;

        document.getElementById('total-days').textContent = totalDays;
        document.getElementById('total-cost').textContent = totalCost.toFixed(2); // Showing price with two decimal points
    } else {
        document.getElementById('total-days').textContent = 0;
        document.getElementById('total-cost').textContent = 0;
    }
}
