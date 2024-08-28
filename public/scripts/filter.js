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