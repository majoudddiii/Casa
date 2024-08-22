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

    // Save these dates to your server or local storage
    console.log('Check-in Date:', checkinDate);
    console.log('Check-out Date:', checkoutDate);
    alert('Dates saved successfully!');
}