const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let style = params.style;
document.body.classList.add(style);
let now = moment('2025-01-10 08:05:01', 'YYYY-MM-DD HH:mm:ss').locale('en-gb');

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
  now = now.locale('en-gb').add(1, 'second');
  let nowminus15 = moment(now).subtract(15, 'minutes').locale('en-gb');

  if (today != now.format('YYYY-MM-DD')) {
    today = now.format('YYYY-MM-DD');
    await fetchStart(now.format('YYYY'));
    await fetchJamaat(now.format('YYYY'));
  }

  let timestoday = starttimes.find(obj => obj.date === now.format('YYYY-MM-DD')) || {};
  let jamaattoday = jamaat.find(obj => obj.date === now.format('YYYY-MM-DD')) || {};

  let events = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  events.forEach(event => {
    let startMoment = moment(`${today} ${timestoday[event]}`, 'YYYY-MM-DD HH:mm');
    let iqamahMoment = moment(`${today} ${jamaattoday[event]}`, 'YYYY-MM-DD HH:mm');

    if (now.isAfter(iqamahMoment) && now.isBefore(iqamahMoment.clone().add(15, 'minutes'))) {
      document.querySelector(`#${event}`).style.display = 'none';
    } else {
      document.querySelector(`#${event}`).style.display = 'block';
    }
  });
}

timeCalc();
setInterval(timeCalc, 1000);
