document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
  
    
    function fetchAndDisplayDogs() {
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          tableBody.innerHTML = ''; 
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
  
            
            const editButton = tr.querySelector('.edit-btn');
            editButton.addEventListener('click', () => {
              populateForm(dog); 
            });
          });
        })
        .catch(error => console.error('Error fetching dogs:', error));
    }
  
    function populateForm(dog) {
      form['id'].value = dog.id;
      form['name'].value = dog.name;
      form['breed'].value = dog.breed;
      form['sex'].value = dog.sex;
    }
  
    
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
          form.reset(); 
        })
        .catch(error => console.error('Error updating dog:', error));
    });
  
    fetchAndDisplayDogs();
  });
  