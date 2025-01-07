fetch('https://crmasjidscreen.pages.dev/data/jamaat/2025.json')
  .then(response => response.json())
  .then(data => {
      setInterval(() => {
          const now = new Date();
          data.forEach(event => {
              const eventTime = new Date(event.date + 'T' + event.time);
              if (now >= eventTime && now <= new Date(eventTime.getTime() + 10 * 60000)) {
                  document.body.style.cssText = 'background-color: black !important; visibility: hidden !important;';
                  document.documentElement.style.cssText = 'background-color: black !important; visibility: hidden !important;';
              }
          });
      }, 1000); // Check every second
  })
  .catch(error => console.error('Error loading the data:', error));