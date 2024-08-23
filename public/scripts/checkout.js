function updateCost() {
    const checkinDateValue = document.getElementById('checkin-date').value;
    const checkoutDateValue = document.getElementById('checkout-date').value;
    const pricePerNight = document.querySelector('.checkout-box').getAttribute('data-price');

    if (checkinDateValue && checkoutDateValue) {
        const checkinDate = new Date(checkinDateValue);
        const checkoutDate = new Date(checkoutDateValue);

        if (checkoutDate > checkinDate) {
            const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
            const totalDays = timeDiff / (1000 * 3600 * 24);

            document.getElementById('total-days').innerText = totalDays;
            document.getElementById('total-cost').innerText = totalDays * pricePerNight;
        } else {
            document.getElementById('total-days').innerText = '0';
            document.getElementById('total-cost').innerText = '0';
        }
    }
}

document.getElementById('checkin-date').addEventListener('change', updateCost);
document.getElementById('checkout-date').addEventListener('change', updateCost);

function saveDates() {
    const checkinDate = document.getElementById('checkin-date').value;
    const checkoutDate = document.getElementById('checkout-date').value;
    const guestName = document.getElementById('guest-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const numberOfGuests = document.getElementById('number-of-guests').value;

    fetch('/create-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            checkinDate,
            checkoutDate,
            guestName,
            phoneNumber,
            numberOfGuests
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}