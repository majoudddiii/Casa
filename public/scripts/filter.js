// Define the options for each filter type
const filterOptions = {
  city: ['Tripoli', 'Benghazi', 'Misrata', 'Khoms'],
  beds: ['1', '2', '3', '4'],
  bath: ['1', '2', '3'],
};

function addFilter() {
  const selectElement = document.getElementById('filterSelect');
  const selectedValue = selectElement.value;
  const filterFieldsContainer = document.getElementById('filterFields');

  // Check if the filter already exists
  const existingFilters = filterFieldsContainer.querySelectorAll('.filter-input select');
  const existingFilterTypes = Array.from(existingFilters).map(select => select.name);

  // Ensure that the selected filter isn't already added
  if (existingFilterTypes.includes(selectedValue)) {
    alert(`You can only add one ${selectedValue} filter.`);
    return;
  }

  // Ensure that no more than three filters can be added in total
  if (existingFilters.length >= 3) {
    alert('You can only add up to three filters.');
    return;
  }

  if (selectedValue) {
    // Create new filter dropdown container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-input';

    // Create and append a label
    const label = document.createElement('label');
    label.textContent = selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1) + ': ';
    label.className = 'textLabel'; // Add your desired class here
    filterContainer.appendChild(label);

    // Create the dropdown
    const dropdown = document.createElement('select');
    dropdown.name = selectedValue;
    dropdown.className = 'searchInput'; // Apply the class for consistent styling
    dropdown.style.width = '100px'; // Set a consistent width for all dropdowns

    // Add options for the dropdown
    filterOptions[selectedValue].forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.toLowerCase().replace(/\s+/g, '-'); // Ensure value is URL-friendly
      optionElement.textContent = option;
      dropdown.appendChild(optionElement);
    });

    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.onclick = () => {
      filterFieldsContainer.removeChild(filterContainer);
    };

    // Append dropdown and remove button to filterContainer
    filterContainer.appendChild(dropdown);
    filterContainer.appendChild(removeButton);

    // Append filterContainer to filterFieldsContainer
    filterFieldsContainer.appendChild(filterContainer);

    // Clear selection
    selectElement.value = '';
  } else {
    alert('Please select a filter option.');
  }
}
