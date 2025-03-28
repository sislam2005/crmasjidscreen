document.addEventListener("DOMContentLoaded", function () {
    const adhkar = [
        {
            arabic: "أَسْتَغْفِرُ اللهَ",
            english: "I seek the forgiveness of Allah",
            source: "Muslim",
            repeat: 3,
        },
        {
            arabic: "اللّٰهُمَّ أَنْتَ السَّلاَمُ، وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجلاَلِ وَالْإِكْرَامِ",
            english: "O Allah, You are The Flawless and The Source of Peace, and from You comes peace. Blessed are You, full of Majesty and Honour",
            source: "Muslim",
            repeat: 0,
        },
        {
            arabic: "سُبْحَانَ اللهِ",
            english: "Allah is free from imperfection",
            source: "Muslim",
            repeat: 33,
        },
        {
            arabic: "اَلْحَمْدُ لِلهِ",
            english: "All praise be to Allah",
            source: "Muslim",
            repeat: 33,
        },
        {
            arabic: "اَللهُ أَكْبَرُ",
            english: "Allah is the Greatest",
            source: "Muslim",
            repeat: 33,
        },
        {
            arabic: "لاَ إِلٰهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
            english: "There is no god but Allah. He is Alone and He has no partner whatsoever. To Him Alone belong all sovereignty and all praise. He is over all things All-Powerful",
            source: "Muslim",
            repeat: 0,
        },
        {
            arabic: "لاَ إِلٰهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
            english: "There is no god but Allah. He is Alone and He has no partner whatsoever. To Him Alone belong all sovereignty and all praise. He gives life and He gives death. He is over all things All-Powerful",
            source: "Aḥmad",
            repeat: 10,
        },
        {
            arabic: "اللّٰهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
            english: "O Allah, help me in remembering You, in being grateful to You, and in worshipping You in an excellent manner",
            source: "Abū Dāwud",
            repeat: 0,
        },
        {
            arabic: "سُورَةُ الْإِخْلاَصِ - سُورَةُ الْفَلَقِ - سُورَةُ النَّاسِ",
            english: "Sūrah al-Ikhlāṣ – Sūrah al-Falaq – Sūrah an-Nās",
            source: "Abū Dāwud",
            repeat: 0,
        },
    ];

    const dhikrDisplay = document.getElementById("dhikrDisplay");
    let currentIndex = 0;

    function showDhikr(index) {
        dhikrDisplay.innerHTML = `
            <p class="arabic">${adhkar[index].arabic}</p>
            <p class="english">${adhkar[index].english}</p>
            <p class="source">[${adhkar[index].source}]</p>
            ${adhkar[index].repeat > 0 ? `<p class="repeatCircle">${adhkar[index].repeat}x</p>` : ""}
        `;
    }

    function nextDhikr() {
        currentIndex = (currentIndex + 1) % adhkar.length;
        showDhikr(currentIndex);
    }

    // Show first Dhikr and start the interval
    showDhikr(currentIndex);
    setInterval(nextDhikr, 5000); // Change every 5 seconds
});
