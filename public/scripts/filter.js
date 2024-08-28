document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const town = document.getElementById('townInput').value;
    const beds = document.getElementById('bedsInput').value;
    const bath = document.getElementById('bathInput').value;
    const size = document.getElementById('sizeInput').value;
  
    const searchParams = new URLSearchParams({ city, town, beds, bath, size });
  
    fetch(`/search?${searchParams}`)
      .then(response => response.json())
      .then(data => {
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = '';
  
        data.forEach(post => {
          const postElement = document.createElement('div');
          postElement.innerHTML = `<h2>${post.title}</h2><p>${post.city}, ${post.town}</p>`;
          postsContainer.appendChild(postElement);
        });
      })
      .catch(error => console.error('Error:', error));
  });

  function addFilter() {
    const selectElement = document.getElementById('filterSelect');
    const selectedValue = selectElement.value;
    const filterFieldsContainer = document.getElementById('filterFields');

    if (selectedValue) {
        // Create new filter input field
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-input';

        const input = document.createElement('input');
        input.type = 'text';
        input.name = selectedValue;
        input.placeholder = `Enter ${selectedValue}`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.onclick = () => {
            filterFieldsContainer.removeChild(filterContainer);
        };

        filterContainer.appendChild(input);
        filterContainer.appendChild(removeButton);

        filterFieldsContainer.appendChild(filterContainer);

        // Clear selection
        selectElement.value = '';
    } else {
        alert('Please select a filter option.');
    }
}