fetch('https://crmasjidscreen.pages.dev/data/jamaat/2025.json')
  .then(response => response.json())
  .then(data => {
      setInterval(() => {
          const now = new Date();
          data.forEach(event => {
              const eventTime = new Date(event.date + 'T' + event.time);
              if (now >= eventTime) {
                  document.body.style.backgroundColor = 'black';
                  document.body.innerHTML = '';
              }
          });
      }, 1000); // Check every second
  })
  .catch(error => console.error('Error loading the data:', error));