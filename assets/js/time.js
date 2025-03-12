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

  let day = moment(now).weekday(); // 4 = Friday
  let fajrmoment = moment(today + timestoday.fajr, 'YYYY-MM-DD HH:mm');
  let sunrisemoment = moment(today + timestoday.sunrise, 'YYYY-MM-DD HH:mm');
  let dhuhrmoment = moment(today + timestoday.dhuhr, 'YYYY-MM-DD HH:mm');
  let asrmoment = moment(today + timestoday.asr, 'YYYY-MM-DD HH:mm');
  let maghribmoment = moment(today + timestoday.maghrib, 'YYYY-MM-DD HH:mm');
  let ishamoment = moment(today + timestoday.isha, 'YYYY-MM-DD HH:mm');

  let fajriqamahmoment = moment(today + jamaattoday.fajr, 'YYYY-MM-DD HH:mm');
  let dhuhriqamahmoment, jumuah1iqamahmoment, jumuah2iqamahmoment, jumuahdhuhr;
  if (day === 4) {
    jumuah1iqamahmoment = moment(today + jamaattoday.jumuah1, 'YYYY-MM-DD HH:mm');
    jumuah2iqamahmoment = moment(today + jamaattoday.jumuah2, 'YYYY-MM-DD HH:mm');
    jumuahdhuhr = jamaattoday.jumuah1;
    dhuhriqamahmoment = jumuah1iqamahmoment;
    event[2].iqamah = jumuahdhuhr;
  } else {
    dhuhriqamahmoment = moment(today + jamaattoday.dhuhr, 'YYYY-MM-DD HH:mm');
    jumuahdhuhr = jamaattoday.dhuhr.trim();
  }
  let asriqamahmoment = moment(today + jamaattoday.asr, 'YYYY-MM-DD HH:mm');
  let maghribiqamahmoment = moment(today + jamaattoday.maghrib, 'YYYY-MM-DD HH:mm');
  let ishaiqamahmoment = moment(today + jamaattoday.isha, 'YYYY-MM-DD HH:mm');

  if (now < fajrmoment) { nextevent = 0, iqamah = 0, nexttime = fajrmoment; } else // before Fajr
  
    // Fajr start
    if (now < fajriqamahmoment) { fajr = ' active', nextevent = 0, iqamah = 1, nexttime = fajriqamahmoment; } else // Fajr starts, before Iqamah
      if (nowminus < fajriqamahmoment) { fajr = ' active', nextevent = 0, iqamah = 0, salah = 1, nexttime = sunrisemoment; } else // Fajr Iqamah starts and shows for 10 minutes
        if (now < sunrisemoment) { fajr = ' active', nextevent = 2, iqamah = 0, salah = 0, nexttime = sunrisemoment; } else // after Fajr Salah & before Sunrise

          // Sunrise start
       // if (now < dhuhrmoment) { sunrise = ' active', nextevent = 2, iqamah = 0, salah = 0, nexttime = dhuhrmoment; } else // after Sunrise & before Dhuhr
            // Dhuhr start
            if (now < jumuah1iqamahmoment) { dhuhr = ' active'; nextevent = 7, iqamah = 1, nexttime = jumuah1iqamahmoment, event1name = "Khutbah", event2name = "Salah"; } else // Dhuhr starts, before Jumu'ah 1 Iqamah
            if (now < dhuhriqamahmoment) { dhuhr = ' active'; nextevent = 2, iqamah = 1, nexttime = dhuhriqamahmoment; } else // Dhuhr starts, before Iqamah
              if (nowminus < jumuah1iqamahmoment) { dhuhr = ' active'; nextevent = 7, iqamah = 0, salah = 1, nexttime = jumuah2iqamahmoment, event1name = "Jumu'ah 1", event2name = "Jumu'ah 2"; } else // Jumu'ah 1 Iqamah starts and shows for 10 minutes
              if (nowminus < dhuhriqamahmoment) { dhuhr = ' active'; nextevent = 2, iqamah = 0, salah = 1, nexttime = asrmoment; } else // Dhuhr Iqamah starts and shows for 10 minutes
                if (now < jumuah2iqamahmoment) { dhuhr = ' active'; nextevent = 7, iqamah = 1, nexttime = jumuah2iqamahmoment, event1name = "Jumu'ah 1", event2name = "Jumu'ah 2"; } else // Jumu'ah 1 finished, before Jumu'ah 2 Iqamah
                if (nowminus < jumuah2iqamahmoment) { dhuhr = ' active'; nextevent = 7, iqamah = 0, salah = 1, nexttime = asrmoment, event1name = "Jumu'ah 1", event2name = "Jumu'ah 2"; } else // Jumu'ah 2 Iqamah starts and shows for 10 minutes
                if (now < asrmoment) { dhuhr = ' active'; nextevent = 3, iqamah = 0, salah = 0, nexttime = asrmoment; } else // after Dhuhr Salah & before Asr

                  // Asr start
                  if (now < asriqamahmoment) { asr = ' active'; nextevent = 3, iqamah = 1, nexttime = asriqamahmoment; } else // Asr starts, before Iqamah
                    if (nowminus < asriqamahmoment) { asr = ' active'; nextevent = 3, iqamah = 0, salah = 1, nexttime = maghribmoment; } else // Asr Iqamah starts and shows for 10 minutes
                      if (now < maghribmoment) { dhuhr = ''; asr = ' active'; nextevent = 4, iqamah = 0, salah = 0, nexttime = maghribmoment;  } else // after Asr Salah & before Maghrib

                  // Maghrib start
                  if (now < maghribiqamahmoment) { maghrib = ' active'; nextevent = 4, iqamah = 1, nexttime = maghribiqamahmoment; } else // Maghrib starts, before Iqamah (won't fire if same time)
                    if (nowminus < maghribiqamahmoment) { maghrib = ' active'; nextevent = 4, iqamah = 0, salah = 1, nexttime = ishamoment; } else // Maghrib starts and shows for 10 minutes
                      if (now < ishamoment) { asr = ''; maghrib = ' active'; nextevent = 5, iqamah = 0, salah = 0, nexttime = ishamoment; } else // after Maghrib Salah & before Isha

                        // Isha start
                        if (now < ishaiqamahmoment) { isha = ' active'; nextevent = 5, iqamah = 1, nexttime = ishaiqamahmoment; } else // Isha starts, before Iqamah
                          if (nowminus20 < ishaiqamahmoment) { isha = ' active'; nextevent = 5, iqamah = 0, salah = 1, nexttime = nextfajrmoment; } else // Isha starts and shows for 10 minutes
                            if (now < nextfajrmoment) { maghrib = ''; isha = ' active'; nextevent = 6, iqamah = 0, salah = 0, nexttime = nextfajrmoment; } else { console.log('no match'); }

  // an override for showing Sunrise as the next countdown on the sidebar, while the event times are of Dhuhr
  let nextmoment = nextevent;
  if (nexttime === sunrisemoment) {nextmoment = 1}
  
  // work out time remaining and upcoming event times for the sidebar
  let timetogo = moment.duration(nexttime.diff(now));
  event1time = event[nextevent].athan, event2time = event[nextevent].iqamah;

  let clockspace = `<span id="hijri">${now.format('iD iMMMM iYYYY')}</span><br />
  <span id="date">${now.format('dddd LL')}</span>
  <div id="clockdiv"><span id="now">${now.format('LTS')}</span></div>`;

  let nextspace = `<h2>Time to <span id="next">${event[nextmoment].en}</span></h2>
  <div id="timediv">
    <span id="hours">${timetogo.hours().toLocaleString('en-gb',{minimumIntegerDigits:2})}</span>:<span id="minutes">${timetogo.minutes().toLocaleString('en-gb',{minimumIntegerDigits:2})}</span>:<span id="seconds">${timetogo.seconds().toLocaleString('en-gb',{minimumIntegerDigits:2})}</span>
  </div>`;

let salahspace = `<h2>صلاة ${event[nextevent].ar} جماعة</h2>
  <h1 id="timediv" style="display: none;">
    ${event[nextevent].en} Jama'ah
  </h1>
  <html style="display:none !important;></html>
    <section id="sidebar" class="salah" style="display: none !important; background-color: #000!important;"></section>
  <section id="prayerbar" style="display: none !important; background-color: #000 !important;"></section>`;
  
  let eventspace = `<h2><span id="nextar">${event[nextevent].en} time | وقت ${event[nextevent].ar}</span></h2>
  <span class="prayer">
      <span class="time">${event1time}</span>
      <span class="event">${event1name}</span>
  </span><span class="prayer">
      <span class="time">${event2time}</span>
      <span class="event">${event2name}</span>
  </span>`;
// Check if we are within the 10-minute window after the Iqamah time
if (now >= fajriqamahmoment && now <= fajriqamahmoment.add(10, 'minutes')) {
  // Set the background color of the whole view to black
  document.querySelector('#wholeview').style.backgroundColor = '#000';
  
  // Hide the sidebar and prayer bar
  document.querySelector('#sidebar').style.display = 'none';
  document.querySelector('#prayerbar').style.display = 'none';

  // Show them again after 10 minutes and remove the background color
  setTimeout(() => {
    document.querySelector('#wholeview').style.backgroundColor = ''; // Reset the background color
    document.querySelector('#sidebar').style.display = 'block';
    document.querySelector('#prayerbar').style.display = 'block';
  }, 600000); // 600000 ms = 10 minutes
}
  let sidebar = clockspace + nextspace + eventspace;
  if (salah === 1) { sidebar = clockspace + salahspace; }

  let prayerbar = `<span class='headertime'><span id="date">${now.format('dddd LL')}</span><br>
		<span id="now">${now.format('LTS')}</span>
		</span>
	   <span class='prayer${fajr}'>
      <span class='event'>${event[0].en} | ${event[0].ar}</span>
      <span class='iqamah'>${jamaattoday.fajr.trim()}</span>
    </span>
    </span><span class='prayer${dhuhr}'>
      <span class='event'>${event[2].en} | ${event[2].ar}</span>
      <span class='iqamah'>${jumuahdhuhr}</span>
    </span><span class='prayer${asr}'>
      <span class='event'>${event[3].en} | ${event[3].ar}</span>
      <span class='iqamah'>${jamaattoday.asr.trim()}</span>
    </span><span class='prayer${maghrib}'>
      <span class='event'>${event[4].en} | ${event[4].ar}</span>
      <span class='iqamah'>${maghribiqamahmoment.hours().toLocaleString('en-gb',{minimumIntegerDigits:2})}:${maghribiqamahmoment.minutes().toLocaleString('en-gb',{minimumIntegerDigits:2})}</span>
    </span><span class='prayer${isha}'>
      <span class='event'>${event[5].en} | ${event[5].ar}</span>
      <span class='iqamah'>${jamaattoday.isha.trim()}</span>
    </span><span class='prayer active'>
      <span class='event'>Jumu'ah | الجمعة</span>
      <span class='iqamah'>${Jummahtimecrm}</span>
    </span>`;
  document.getElementById('sidebar').innerHTML = sidebar;
  document.getElementById('prayerbar').innerHTML = prayerbar;
  
  if (iqamah===1) {
    document.getElementById('next').innerHTML = event[nextevent].en + ' Iqamah';
    if ( !document.getElementById("sidebar").classList.contains("iqamah") ) {
      document.getElementById("sidebar").classList.add("iqamah");
    };
  } else {
    if ( document.getElementById("sidebar").classList.contains("iqamah") ) {
      document.getElementById("sidebar").classList.remove("iqamah");
    };
  }
  if (salah===1) {
    if ( !document.getElementById("sidebar").classList.contains("salah") ) {
      document.getElementById("sidebar").classList.add("salah");
    };
  } else {
    if ( document.getElementById("sidebar").classList.contains("salah") ) {
      document.getElementById("sidebar").classList.remove("salah");
    };
  }
}

timeCalc(); // run immediately on page load, and then every 1 second

window.onload = function () {
  setInterval(timeCalc, 1000); // timer every second
};