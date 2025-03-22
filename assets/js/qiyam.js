// Existing prayer time script remains unchanged

// New feature: Countdown to the last third of the night
(function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    if (getQueryParam('ramadan') !== '1') return;

    function calculateLastThirdCountdown(maghrib, fajr) {
        const maghribTime = new Date(today.maghrib.trim());
        const fajrTime = new Date(nextfajr.trim());
        
        const nightDuration = (fajrTime - maghribTime) / 1000; // Total night duration in seconds
        const lastThirdStart = fajrTime - (nightDuration / 3) * 1000;
        const now = new Date();

        if (now >= lastThirdStart) {
            return 'The last third of the night has started!';
        }
        
        const timeLeft = lastThirdStart - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        return `Time until last third: ${hours}h ${minutes}m ${seconds}s`;
    }

    function displayCountdown() {
        const container = document.createElement('div');
        container.id = 'last-third-countdown';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'none';
        container.style.background = 'url("starry-night.jpg") center/cover';
        container.style.color = 'white';
        container.style.fontSize = '2rem';
        container.style.textAlign = 'center';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.display = 'flex';
        document.body.appendChild(container);

        function updateCountdown() {
            container.textContent = calculateLastThirdCountdown();
        }

        setInterval(updateCountdown, 1000);

        function toggleScreens() {
            const now = new Date();
            if (now.getHours() >= 22 && now.getMinutes() >= 20) {
                if (container.style.display === 'none') {
                    container.style.display = 'flex';
                } else {
                    container.style.display = 'none';
                }
            }
        }
        setInterval(toggleScreens, 15000);
    }

    displayCountdown();
})();

// Function to get time from the URL
function getTimeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const time = urlParams.get('time'); // Get the value of 'time' from the URL

    if (time) {
        console.log("Time from URL:", time);
        return time; // Store or use this value
    } else {
        console.log("No time parameter found in the URL.");
        return null;
    }
}

const Jummahtimecrm = getTimeFromURL(); // This will contain the extracted time

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let style = params.style; // get value of "style" param
document.body.classList.add(style);
let now = moment().locale('en-gb');
// let now = moment('2023-01-01 00:00:01', 'YYYY-MM-DD HH:mm:ss').locale('en-gb'); // TESTING ONLY

let starttimes, jamaat, today;
const prayerBar = document.getElementById('prayerbar');

async function fetchStart(year) {
  let url = `././data/${year}.json`;
  let response = await fetch(url);

  if (response.status === 200) {
    let data = await response.text();
    starttimes = JSON.parse(data);
  }
}

async function fetchJamaat(year) {
  let url = `././data/jamaat/${year}.json`;
  let response = await fetch(url);

  if (response.status === 200) {
    let data = await response.text();
    jamaat = JSON.parse(data);
  }
}

async function timeCalc() {
  now = moment().locale('en-gb');
  // now = now.locale('en-gb').add(1, 'second'); // TESTING ONLY
  nowminus = moment(now).subtract(10, "minutes").locale('en-gb'); // 10 minutes before now is used to show active Jama'ah time for 10 minutes from the start of Iqamah
  nowminus20 = moment(now).subtract(20, "minutes").locale('en-gb'); // 20 minutes version
  // refresh data every day
  if (today != now.locale('en-gb').format('YYYY-MM-DD ')) {
    today = now.locale('en-gb').format('YYYY-MM-DD ');
    const resultS = await fetchStart(now.format('YYYY'));
    const resultJ = await fetchJamaat(now.format('YYYY'));
  }

  let tomorrow = moment(now).locale('en-gb').add(1, 'day').format('YYYY-MM-DD '); // tomorrow is used for Fajr after Isha

  // find today's start times from the array
  let timestoday = starttimes.filter(obj => {
    return obj.date === now.format('YYYY-MM-DD')
  });
  if(timestoday.length != 0) { timestoday = timestoday[0]; } 

  // find today's Jama'at times from the array
  let jamaattoday = jamaat.filter(obj => {
    return obj.date === now.format('YYYY-MM-DD')
  });
  
  if(jamaattoday.length != 0) { jamaattoday = jamaattoday[0]; } 

  // find tomorrow's Fajr time to use after Isha
  let nextfajr = starttimes.filter(obj => {
    return obj.date == moment(now).locale('en-gb').add(1, 'day').format('YYYY-MM-DD')
  });
  if(nextfajr.length != 0) { nextfajr = nextfajr[0].fajr } else { nextfajr = timestoday.fajr }

  // find tomorrow's Fajr Iqamah time to use after Isha
  let nextfajriqamah = jamaat.filter(obj => {
    return obj.date == moment(now).locale('en-gb').add(1, 'day').format('YYYY-MM-DD')
  });
  if(nextfajriqamah.length != 0) { nextfajriqamah = nextfajriqamah[0].fajr } else { nextfajriqamah = jamaattoday.fajr }
  let nextfajrmoment = moment(tomorrow + nextfajr, 'YYYY-MM-DD HH:mm');

  if (typeof(jamaattoday.maghrib) === "undefined") { jamaattoday.maghrib = timestoday.maghrib.trim() } // if there's no Maghrib Jama'at time, use the start time

  let event = [
    {
      "slug": "fajr",
      "en": "Fajr",
      "ar": "الفجر",
      "athan": timestoday.fajr.trim(),
      "iqamah": jamaattoday.fajr
    }, {
      "slug": "sunrise",
      "en": "Sunrise",
      "ar": "شروق",
      "athan": timestoday.sunrise.trim()
    }, {
      "slug": "dhuhr",
      "en": "Dhuhr",
      "ar": "الظهر",
      "athan": timestoday.dhuhr.trim(),
      "iqamah": jamaattoday.dhuhr
    }, {
      "slug": "asr",
      "en": "Asr",
      "ar": "العصر",
      "athan": timestoday.asr.trim(),
      "iqamah": jamaattoday.asr
    }, {
      "slug": "maghrib",
      "en": "Maghrib",
      "ar": "المغرب",
      "athan": timestoday.maghrib.trim(),
      "iqamah": jamaattoday.maghrib
    }, {
      "slug": "isha",
      "en": "Isha",
      "ar": "العشاء",
      "athan": timestoday.isha.trim(),
      "iqamah": jamaattoday.isha
    }, {
      "slug": "fajr",
      "en": "Fajr",
      "ar": "الفجر",
      "athan": nextfajr.trim(),
      "iqamah": nextfajriqamah,
    }, {
      "slug": "jumuah",
      "en": "Jumu'ah",
      "ar": "الجمعة",
      "athan": jamaattoday.jumuah1,
      "iqamah": jamaattoday.jumuah2
    }
  ];

  let fajr = '',
  sunrise = '',
  dhuhr = '',
  asr = '',
  maghrib = '',
  isha = '',
  nextevent = 0,
  nexttime = '',
  iqamah = 0,
  salah = 0,
  event1name = 'Athan | أذان',
  event1time = '',
  event2name = 'Iqamah | إقامة',
  event2time = '';

  let day = moment(now).weekday(); // 4 = Friday (Jumu'ah)

  if(event) {
    event.forEach(function(a) {
      let athan = moment(tomorrow + a.athan, 'YYYY-MM-DD HH:mm');
      let iqama = moment(tomorrow + a.iqamah, 'YYYY-MM-DD HH:mm');
      if(athan.isBefore(now) && iqama.isAfter(now)) {
        iqamah = iqama.format('HH:mm');
        salah = 1;
      } else if(athan.isAfter(now)) {
        nextevent = 1;
        nexttime = athan.format('HH:mm');
        event1name = a.en + ' | ' + a.ar;
        event1time = nexttime;
      } else if(iqama.isAfter(now)) {
        nextevent = 2;
        nexttime = iqama.format('HH:mm');
        event2name = a.en + ' | ' + a.ar;
        event2time = nexttime;
      } else {
        nexttime = nexttime;
      }

      if(a.slug == 'fajr') { fajr = a.athan }
      else if(a.slug == 'sunrise') { sunrise = a.athan }
      else if(a.slug == 'dhuhr') { dhuhr = a.athan }
      else if(a.slug == 'asr') { asr = a.athan }
      else if(a.slug == 'maghrib') { maghrib = a.athan }
      else if(a.slug == 'isha') { isha = a.athan }
    });
  }

  // Display a message or handle countdown if it's during the last third of the night
  if (nextevent === 2) {
    document.getElementById('countdown-msg').textContent = "Last third of the night is starting soon!";
  }
}

setInterval(timeCalc, 60000);
