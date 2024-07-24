document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
  
    // Fetch and display dogs on page load
    function fetchAndDisplayDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          tableBody.innerHTML = ''; // Clear existing table rows
          dogs.forEach(dog => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${dog.name}</td>
              <td>${dog.breed}</td>
              <td>${dog.sex}</td>
              <td>
                <button class="edit-btn" data-id="${dog.id}">Edit</button>
              </td>
            `;
            tableBody.appendChild(tr);
  
            // Add event listener to edit button
            const editButton = tr.querySelector('.edit-btn');
            editButton.addEventListener('click', () => {
              populateForm(dog); // Populate form with current dog's data
            });
          });
        })
        .catch(error => console.error('Error fetching dogs:', error));
    }
  
    // Function to populate form with dog data for editing
    function populateForm(dog) {
      form['id'].value = dog.id;
      form['name'].value = dog.name;
      form['breed'].value = dog.breed;
      form['sex'].value = dog.sex;
    }
  
    // Handle form submission for editing dog
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      const dogId = formData.get('id');
  
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          breed: formData.get('breed'),
          sex: formData.get('sex'),
        }),
      })
        .then(response => response.json())
        .then(updatedDog => {
          // Update the table row with the updated dog information
          const rowToUpdate = tableBody.querySelector(`[data-id="${updatedDog.id}"]`);
          if (rowToUpdate) {
            rowToUpdate.innerHTML = `
              <td>${updatedDog.name}</td>
              <td>${updatedDog.breed}</td>
              <td>${updatedDog.sex}</td>
              <td>
                <button class="edit-btn" data-id="${updatedDog.id}">Edit</button>
              </td>
            `;
          }
          form.reset(); // Clear form fields
        })
        .catch(error => console.error('Error updating dog:', error));
    });
  
    // Initial fetch and display of dogs
    fetchAndDisplayDogs();
  });
  