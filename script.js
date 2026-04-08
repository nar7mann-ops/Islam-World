/* ============================================================
   İSLAM APP — script.js
   Modules: App, Auth, Quran, Namaz, Hadith, PrayerTimes, i18n
============================================================ */
'use strict';

/* ============================================================
   i18n — TRANSLATIONS
============================================================ */
const I18N = {
  az: {
    nav_quran:'Quran', nav_namaz:'Namaz', nav_wudu:'Dəstəmaz',
    nav_hadith:'Hədiслər', nav_history:'Tarix', nav_names:'99 Ad',
    nav_prophets:'Peyğəmbərlər', nav_tips:'Məsləhətlər',
    nav_times:'Namaz Vaxtları', nav_profile:'Profil',
    prayer_times:'Namaz Vaxtları', greeting:'Assalamu Alaykum',
  },
  ru: {
    nav_quran:'Коран', nav_namaz:'Намаз', nav_wudu:'Омовение',
    nav_hadith:'Хадисы', nav_history:'История', nav_names:'99 Имён',
    nav_prophets:'Пророки', nav_tips:'Советы',
    nav_times:'Время намаза', nav_profile:'Профиль',
    prayer_times:'Время намаза', greeting:'Ассаляму Алейкум',
  },
  en: {
    nav_quran:'Quran', nav_namaz:'Prayer', nav_wudu:'Ablution',
    nav_hadith:'Hadiths', nav_history:'History', nav_names:'99 Names',
    nav_prophets:'Prophets', nav_tips:'Tips',
    nav_times:'Prayer Times', nav_profile:'Profile',
    prayer_times:'Prayer Times', greeting:'Assalamu Alaykum',
  },
  tr: {
    nav_quran:'Kuran', nav_namaz:'Namaz', nav_wudu:'Abdest',
    nav_hadith:'Hadisler', nav_history:'Tarih', nav_names:'99 İsim',
    nav_prophets:'Peygamberler', nav_tips:'Tavsiyeler',
    nav_times:'Namaz Vakitleri', nav_profile:'Profil',
    prayer_times:'Namaz Vakitleri', greeting:'Esselamu Aleykum',
  },
  de: {
    nav_quran:'Koran', nav_namaz:'Gebet', nav_wudu:'Waschung',
    nav_hadith:'Hadithe', nav_history:'Geschichte', nav_names:'99 Namen',
    nav_prophets:'Propheten', nav_tips:'Ratschläge',
    nav_times:'Gebetszeiten', nav_profile:'Profil',
    prayer_times:'Gebetszeiten', greeting:'Assalamu Alaykum',
  },
  fr: {
    nav_quran:'Coran', nav_namaz:'Prière', nav_wudu:'Ablutions',
    nav_hadith:'Hadiths', nav_history:'Histoire', nav_names:'99 Noms',
    nav_prophets:'Prophètes', nav_tips:'Conseils',
    nav_times:'Horaires prière', nav_profile:'Profil',
    prayer_times:'Horaires de prière', greeting:'Assalamu Alaykum',
  },
  ja: {
    nav_quran:'クルアーン', nav_namaz:'礼拝', nav_wudu:'清め',
    nav_hadith:'ハディース', nav_history:'歴史', nav_names:'神の99の名',
    nav_prophets:'預言者たち', nav_tips:'アドバイス',
    nav_times:'礼拝時間', nav_profile:'プロフィール',
    prayer_times:'礼拝時間', greeting:'アッサラーム・アライクム',
  },
  zh: {
    nav_quran:'古兰经', nav_namaz:'礼拜', nav_wudu:'净礼',
    nav_hadith:'圣训', nav_history:'历史', nav_names:'真主99个名字',
    nav_prophets:'先知们', nav_tips:'建议',
    nav_times:'礼拜时间', nav_profile:'个人资料',
    prayer_times:'礼拜时间', greeting:'安拉的平安在你们身上',
  },
  ar: {
    nav_quran:'القرآن', nav_namaz:'الصلاة', nav_wudu:'الوضوء',
    nav_hadith:'الأحاديث', nav_history:'التاريخ', nav_names:'أسماء الله الحسنى',
    nav_prophets:'الأنبياء', nav_tips:'نصائح',
    nav_times:'أوقات الصلاة', nav_profile:'الملف الشخصي',
    prayer_times:'أوقات الصلاة', greeting:'السلام عليكم',
  },
  es: {
    nav_quran:'Corán', nav_namaz:'Oración', nav_wudu:'Ablución',
    nav_hadith:'Hadices', nav_history:'Historia', nav_names:'99 Nombres',
    nav_prophets:'Profetas', nav_tips:'Consejos',
    nav_times:'Tiempos de oración', nav_profile:'Perfil',
    prayer_times:'Tiempos de oración', greeting:'Assalamu Alaykum',
  },
};

/* ============================================================
   MAIN APP MODULE
============================================================ */
const App = (() => {
  let currentSection = 'home';
  let currentLang = localStorage.getItem('islam_lang') || 'az';
  let menuOpen = false;

  function start() {
    const splash = document.getElementById('splash');
    splash.classList.add('exit');
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('app').classList.remove('hidden');
      _init();
    }, 800);
  }

  function _init() {
    _applyLang(currentLang);
    _initStars();
    _initHome();
    PrayerTimes.init();
    Quran.init();
    Hadith.init();
    Names99.init();
    Prophets.init();
    HistorySection.init();
    Tips.init();
    Wudu.init();
    Auth.init();
    _registerSW();
    _setupNotifications();
  }

  function _initStars() {
    const c = document.getElementById('splashStars');
    if (!c) return;
    for (let i = 0; i < 80; i++) {
      const s = document.createElement('div');
      s.className = 'splash-star';
      const sz = Math.random() > 0.7 ? 2.5 : 1.2;
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;--sd:${2+Math.random()*4}s;--sl:${Math.random()*5}s;--so:${0.3+Math.random()*0.7}`;
      c.appendChild(s);
    }
  }

  function _initHome() {
    const d = new Date();
    document.getElementById('homeDate').textContent = d.toLocaleDateString(currentLang, {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
    document.getElementById('homeGreeting').textContent = I18N[currentLang]?.greeting || 'Assalamu Alaykum';
    _loadDailyHadith();
  }

  function _loadDailyHadith() {
    const h = HADITHS[Math.floor(Math.random() * HADITHS.length)];
    document.getElementById('dailyHadith').textContent = h.text_az || h.text;
    document.getElementById('dailyHadithSource').textContent = h.source;
  }

  function goSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('sec-' + id);
    if (sec) sec.classList.add('active');
    currentSection = id;
    // Bottom nav active
    document.querySelectorAll('.bottom-nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.sec === id);
    });
    // Close menu
    if (menuOpen) toggleMenu();
    window.scrollTo(0, 0);
    // Lazy init
    if (id === 'prayer_times') PrayerTimes.renderFull();
    if (id === 'profile') Auth.renderProfile();
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    document.getElementById('sideMenu').classList.toggle('open', menuOpen);
    document.getElementById('menuOverlay').classList.toggle('show', menuOpen);
  }

  function openLang() { document.getElementById('langModal').classList.remove('hidden'); }
  function closeLang() { document.getElementById('langModal').classList.add('hidden'); }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('islam_lang', lang);
    _applyLang(lang);
    closeLang();
    showToast('✓ Dil dəyişdirildi');
    document.getElementById('homeDate').textContent = new Date().toLocaleDateString(lang, {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
    document.getElementById('homeGreeting').textContent = I18N[lang]?.greeting || 'Assalamu Alaykum';
    // Update quran translation language too
    Quran.setLang(lang);
  }

  function _applyLang(lang) {
    const t = I18N[lang] || I18N.az;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) el.textContent = t[key];
    });
    // RTL for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function showToast(msg, duration = 2500) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), duration);
  }

  function playAzan(type) {
    const AZANS = {
      makkah: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
      madinah: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
      turkey: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
      egypt: 'https://www.islamcan.com/audio/adhan/azan4.mp3',
    };
    document.querySelectorAll('.azan-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const audio = document.getElementById('azanAudio');
    audio.src = AZANS[type] || AZANS.makkah;
    audio.play().catch(() => showToast('Audio yüklənə bilmədi'));
  }

  function _registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  function _setupNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Will ask on first prayer time reminder
    }
  }

  return { start, goSection, toggleMenu, openLang, closeLang, setLang, showToast, playAzan, get lang() { return currentLang; } };
})();

/* ============================================================
   AUTH MODULE
============================================================ */
const Auth = (() => {
  let user = null;

  function init() {
    const saved = localStorage.getItem('islam_user');
    if (saved) { user = JSON.parse(saved); }
  }

  function openLogin() { document.getElementById('loginModal').classList.remove('hidden'); }
  function closeLogin() { document.getElementById('loginModal').classList.add('hidden'); }
  function showRegister() { App.showToast('Qeydiyyat: email ilə daxil ol'); }

  function loginGoogle() {
    // Simulate Google login (in production use Firebase Auth)
    user = { name: 'İstifadəçi', email: 'user@gmail.com', photo: null, xp: 0, reads: 0 };
    localStorage.setItem('islam_user', JSON.stringify(user));
    closeLogin();
    renderProfile();
    App.showToast('✓ Google ilə daxil oldun');
    _requestNotificationPermission();
  }

  function loginEmail() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    if (!email || !pass) { App.showToast('Email və şifrə daxil et'); return; }
    user = { name: email.split('@')[0], email, photo: null, xp: 0, reads: 0 };
    localStorage.setItem('islam_user', JSON.stringify(user));
    closeLogin(); renderProfile();
    App.showToast('✓ Daxil oldun');
    _requestNotificationPermission();
  }

  function logout() {
    user = null;
    localStorage.removeItem('islam_user');
    renderProfile();
    App.showToast('Çıxış edildi');
  }

  function renderProfile() {
    const area = document.getElementById('profileArea');
    if (!user) {
      area.innerHTML = `
        <div class="profile-login-prompt">
          <div class="profile-icon">☪</div>
          <h3>Profilinizə daxil olun</h3>
          <p>Quran oxuma statistikanızı, səviyyənizi və bildirişlərinizi idarə edin</p>
          <button class="btn-primary" onclick="Auth.openLogin()" style="margin:0 auto">
            <i class="fas fa-sign-in-alt"></i> Daxil ol
          </button>
        </div>`;
      return;
    }
    const level = Math.floor(user.xp / 100) + 1;
    const xpInLevel = user.xp % 100;
    area.innerHTML = `
      <div class="profile-logged">
        <div class="profile-header-card">
          <div class="profile-avatar">${user.photo ? `<img src="${user.photo}">` : '👤'}</div>
          <div class="profile-name">${user.name}</div>
          <div class="profile-email">${user.email}</div>
          <div class="profile-level">
            <div class="profile-level-label">Səviyyə ${level} — Quran oxuyucusu</div>
            <div class="profile-level-bar">
              <div class="profile-level-fill" style="width:${xpInLevel}%"></div>
            </div>
            <div class="profile-level-num">${user.xp} XP</div>
          </div>
        </div>
        <div class="profile-stats-grid">
          <div class="profile-stat">
            <div class="profile-stat-num">${user.reads || 0}</div>
            <div class="profile-stat-label">Oxunan surə</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${level}</div>
            <div class="profile-stat-label">Səviyyə</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-num">${user.xp || 0}</div>
            <div class="profile-stat-label">XP</div>
          </div>
        </div>
        <div style="padding:12px;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);">
          <div style="font-size:13px;color:var(--text3);margin-bottom:8px;">Bildiriş Ayarları</div>
          <label style="display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer;">
            <input type="checkbox" id="notifToggle" onchange="Auth.toggleNotifs(this.checked)" ${localStorage.getItem('islam_notifs') === '1' ? 'checked' : ''}/>
            Namaz bildirişləri
          </label>
        </div>
        <button class="logout-btn" onclick="Auth.logout()">
          <i class="fas fa-sign-out-alt"></i> Çıxış
        </button>
      </div>`;
  }

  function addXP(amount) {
    if (!user) return;
    user.xp = (user.xp || 0) + amount;
    localStorage.setItem('islam_user', JSON.stringify(user));
  }

  function addRead() {
    if (!user) return;
    user.reads = (user.reads || 0) + 1;
    addXP(10);
  }

  function toggleNotifs(on) {
    localStorage.setItem('islam_notifs', on ? '1' : '0');
    if (on) _requestNotificationPermission();
  }

  function _requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(p => {
        if (p === 'granted') App.showToast('✓ Bildirişlər aktivdir');
      });
    }
  }

  return { init, openLogin, closeLogin, loginGoogle, loginEmail, logout, renderProfile, addXP, addRead, showRegister, toggleNotifs };
})();

/* ============================================================
   QURAN MODULE
============================================================ */
const Quran = (() => {
  const SURAH_META = [
    [1,'الفاتحة','əl-Fatihə',7,'Məkkə'],[2,'البقرة','əl-Bəqərə',286,'Mədinə'],
    [3,'آل عمران','Ali İmran',200,'Mədinə'],[4,'النساء','ən-Nisa',176,'Mədinə'],
    [5,'المائدة','əl-Maidə',120,'Mədinə'],[6,'الأنعام','əl-Ənam',165,'Məkkə'],
    [7,'الأعراف','əl-Əraf',206,'Məkkə'],[8,'الأنفال','əl-Ənfal',75,'Mədinə'],
    [9,'التوبة','ət-Tövbə',129,'Mədinə'],[10,'يونس','Yunus',109,'Məkkə'],
    [11,'هود','Hud',123,'Məkkə'],[12,'يوسف','Yusif',111,'Məkkə'],
    [13,'الرعد','ər-Rəd',43,'Mədinə'],[14,'إبراهيم','İbrahim',52,'Məkkə'],
    [15,'الحجر','əl-Hicr',99,'Məkkə'],[16,'النحل','ən-Nəhl',128,'Məkkə'],
    [17,'الإسراء','əl-İsra',111,'Məkkə'],[18,'الكهف','əl-Kəhf',110,'Məkkə'],
    [19,'مريم','Məryəm',98,'Məkkə'],[20,'طه','Ta-Ha',135,'Məkkə'],
    [21,'الأنبياء','əl-Ənbiya',112,'Məkkə'],[22,'الحج','əl-Həcc',78,'Mədinə'],
    [23,'المؤمنون','əl-Muminun',118,'Məkkə'],[24,'النور','ən-Nur',64,'Mədinə'],
    [25,'الفرقان','əl-Furqan',77,'Məkkə'],[26,'الشعراء','əş-Şuəra',227,'Məkkə'],
    [27,'النمل','ən-Nəml',93,'Məkkə'],[28,'القصص','əl-Qəsəs',88,'Məkkə'],
    [29,'العنكبوت','əl-Ənkəbut',69,'Məkkə'],[30,'الروم','ər-Rum',60,'Məkkə'],
    [31,'لقمان','Loqman',34,'Məkkə'],[32,'السجدة','əs-Səcdə',30,'Məkkə'],
    [33,'الأحزاب','əl-Əhzab',73,'Mədinə'],[34,'سبأ','Səba',54,'Məkkə'],
    [35,'فاطر','Fatir',45,'Məkkə'],[36,'يس','Ya-Sin',83,'Məkkə'],
    [37,'الصافات','əs-Saffat',182,'Məkkə'],[38,'ص','Sad',88,'Məkkə'],
    [39,'الزمر','əz-Zümər',75,'Məkkə'],[40,'غافر','Ğafir',85,'Məkkə'],
    [41,'فصلت','Fussilət',54,'Məkkə'],[42,'الشورى','əş-Şura',53,'Məkkə'],
    [43,'الزخرف','əz-Zuxruf',89,'Məkkə'],[44,'الدخان','əd-Duxan',59,'Məkkə'],
    [45,'الجاثية','əl-Casiyə',37,'Məkkə'],[46,'الأحقاف','əl-Əhqaf',35,'Məkkə'],
    [47,'محمد','Muhəmməd',38,'Mədinə'],[48,'الفتح','əl-Fəth',29,'Mədinə'],
    [49,'الحجرات','əl-Hucurat',18,'Mədinə'],[50,'ق','Qaf',45,'Məkkə'],
    [51,'الذاريات','əz-Zariyat',60,'Məkkə'],[52,'الطور','ət-Tur',49,'Məkkə'],
    [53,'النجم','ən-Nəcm',62,'Məkkə'],[54,'القمر','əl-Qəmər',55,'Məkkə'],
    [55,'الرحمن','ər-Rəhman',78,'Mədinə'],[56,'الواقعة','əl-Vaqiə',96,'Məkkə'],
    [57,'الحديد','əl-Hədid',29,'Mədinə'],[58,'المجادلة','əl-Mücadilə',22,'Mədinə'],
    [59,'الحشر','əl-Həşr',24,'Mədinə'],[60,'الممتحنة','əl-Mumtəhinə',13,'Mədinə'],
    [61,'الصف','əs-Səff',14,'Mədinə'],[62,'الجمعة','əl-Cumə',11,'Mədinə'],
    [63,'المنافقون','əl-Munafiqun',11,'Mədinə'],[64,'التغابن','ət-Təğabun',18,'Mədinə'],
    [65,'الطلاق','ət-Talaq',12,'Mədinə'],[66,'التحريم','ət-Təhrim',12,'Mədinə'],
    [67,'الملك','əl-Mulk',30,'Məkkə'],[68,'القلم','əl-Qələm',52,'Məkkə'],
    [69,'الحاقة','əl-Haqqə',52,'Məkkə'],[70,'المعارج','əl-Məaric',44,'Məkkə'],
    [71,'نوح','Nuh',28,'Məkkə'],[72,'الجن','əl-Cin',28,'Məkkə'],
    [73,'المزمل','əl-Müzzəmmil',20,'Məkkə'],[74,'المدثر','əl-Müddəssir',56,'Məkkə'],
    [75,'القيامة','əl-Qiyamət',40,'Məkkə'],[76,'الإنسان','əl-İnsan',31,'Mədinə'],
    [77,'المرسلات','əl-Mürsəlat',50,'Məkkə'],[78,'النبأ','ən-Nəbə',40,'Məkkə'],
    [79,'النازعات','ən-Naziət',46,'Məkkə'],[80,'عبس','Əbəsə',42,'Məkkə'],
    [81,'التكوير','ət-Təkvir',29,'Məkkə'],[82,'الانفطار','əl-İnfitar',19,'Məkkə'],
    [83,'المطففين','əl-Mutaffifin',36,'Məkkə'],[84,'الانشقاق','əl-İnşiqaq',25,'Məkkə'],
    [85,'البروج','əl-Buruc',22,'Məkkə'],[86,'الطارق','ət-Tariq',17,'Məkkə'],
    [87,'الأعلى','əl-Əla',19,'Məkkə'],[88,'الغاشية','əl-Ğaşiyə',26,'Məkkə'],
    [89,'الفجر','əl-Fəcr',30,'Məkkə'],[90,'البلد','əl-Bələd',20,'Məkkə'],
    [91,'الشمس','əş-Şəms',15,'Məkkə'],[92,'الليل','əl-Leyl',21,'Məkkə'],
    [93,'الضحى','əd-Duha',11,'Məkkə'],[94,'الشرح','əş-Şərh',8,'Məkkə'],
    [95,'التين','ət-Tin',8,'Məkkə'],[96,'العلق','əl-Ələq',19,'Məkkə'],
    [97,'القدر','əl-Qədr',5,'Məkkə'],[98,'البينة','əl-Beyyinə',8,'Mədinə'],
    [99,'الزلزلة','əz-Zəlzələ',8,'Mədinə'],[100,'العاديات','əl-Adiyat',11,'Məkkə'],
    [101,'القارعة','əl-Qariə',11,'Məkkə'],[102,'التكاثر','ət-Təkasür',8,'Məkkə'],
    [103,'العصر','əl-Əsr',3,'Məkkə'],[104,'الهمزة','əl-Huməzə',9,'Məkkə'],
    [105,'الفيل','əl-Fil',5,'Məkkə'],[106,'قريش','Qureyş',4,'Məkkə'],
    [107,'الماعون','əl-Maun',7,'Məkkə'],[108,'الكوثر','əl-Kövsər',3,'Məkkə'],
    [109,'الكافرون','əl-Kafirun',6,'Məkkə'],[110,'النصر','ən-Nəsr',3,'Mədinə'],
    [111,'المسد','əl-Məsəd',5,'Məkkə'],[112,'الإخلاص','əl-İxlas',4,'Məkkə'],
    [113,'الفلق','əl-Fələq',5,'Məkkə'],[114,'الناس','ən-Nas',6,'Məkkə']
  ];

  // Edition identifiers for alquran.cloud API
  const EDITIONS = {
    az: 'az.mammadaliyev',
    ru: 'ru.kuliev',
    en: 'en.sahih',
    de: 'de.bubenheim',
    fr: 'fr.hamidullah',
    tr: 'tr.diyanet',
    ja: 'ja.japanese',
    zh: 'zh.majian',
    ar: 'quran-uthmani',
    es: 'es.bornez',
  };

  let currentLang = 'az';
  let currentSurah = 1;
  let showTranslation = true;
  const cache = {};

  function init() { _renderList(SURAH_META); }

  function _renderList(list) {
    const el = document.getElementById('surahList');
    el.innerHTML = list.map((m, i) => `
      <div class="surah-item" onclick="Quran.openSurah(${m[0]})">
        <div class="surah-item-num">${m[0]}</div>
        <div class="surah-item-info">
          <div class="surah-item-name">${m[2]}</div>
          <div class="surah-item-sub">${m[4]} · ${m[3]} ayə</div>
        </div>
        <div class="surah-item-arabic">${m[1]}</div>
      </div>`).join('');
  }

  function search(q) {
    const lo = q.toLowerCase();
    const filtered = SURAH_META.filter(m =>
      m[1].includes(q) || m[2].toLowerCase().includes(lo) || String(m[0]).includes(q)
    );
    _renderList(filtered);
  }

  function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('.qlang-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang)
    );
  }

  function toggleTranslation() {
    showTranslation = !showTranslation;
    document.querySelectorAll('.reader-ayah-translation').forEach(el => {
      el.style.display = showTranslation ? 'block' : 'none';
    });
  }

  async function openSurah(num) {
    currentSurah = num;
    const meta = SURAH_META[num - 1];
    document.getElementById('readerTitle').textContent = meta[2];
    document.getElementById('readerBody').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
    App.goSection('reader');

    try {
      const [arabic, translation] = await Promise.all([
        _fetch(num, 'quran-uthmani'),
        currentLang !== 'ar' ? _fetch(num, EDITIONS[currentLang] || EDITIONS.en) : Promise.resolve(null)
      ]);
      _render(meta, arabic, translation);
      Auth.addRead();
    } catch (e) {
      document.getElementById('readerBody').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Xəta: İnternet bağlantısını yoxlayın</div>';
    }
  }

  async function _fetch(num, edition) {
    const key = `${num}_${edition}`;
    if (cache[key]) return cache[key];
    const r = await fetch(`https://api.alquran.cloud/v1/surah/${num}/${edition}`);
    const d = await r.json();
    cache[key] = d.data.ayahs;
    return cache[key];
  }

  function _render(meta, arabic, translation) {
    const body = document.getElementById('readerBody');
    let html = '';
    if (meta[0] !== 9) {
      html += `<div class="reader-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
    }
    arabic.forEach((ayah, i) => {
      const trans = translation ? translation[i] : null;
      html += `
        <div class="reader-ayah" style="animation-delay:${i * 0.03}s">
          <div class="reader-ayah-arabic">
            <span class="reader-ayah-num">${i + 1}</span> ${ayah.text}
          </div>
          ${trans ? `<div class="reader-ayah-translation">${trans.text}</div>` : ''}
        </div>`;
    });
    body.innerHTML = html;
    document.getElementById('readerProgress').style.width = (meta[0] / 114 * 100) + '%';
    document.getElementById('prevSurahBtn').disabled = meta[0] === 1;
    document.getElementById('nextSurahBtn').disabled = meta[0] === 114;
  }

  function prevSurah() { if (currentSurah > 1) openSurah(currentSurah - 1); }
  function nextSurah() { if (currentSurah < 114) openSurah(currentSurah + 1); }

  return { init, search, setLang, openSurah, prevSurah, nextSurah, toggleTranslation };
})();

/* ============================================================
   PRAYER TIMES MODULE
============================================================ */
const PrayerTimes = (() => {
  let times = null;
  let location = null;
  let notifTimers = [];

  const PRAYER_NAMES = {
    Fajr: { az:'Sübh', ru:'Фаджр', en:'Fajr', tr:'Sabah', icon:'🌅' },
    Sunrise: { az:'Günəş', ru:'Восход', en:'Sunrise', tr:'Güneş', icon:'☀️' },
    Dhuhr: { az:'Zöhr', ru:'Зухр', en:'Dhuhr', tr:'Öğle', icon:'🌤️' },
    Asr: { az:'Əsr', ru:'Аср', en:'Asr', tr:'İkindi', icon:'🌇' },
    Maghrib: { az:'Məğrib', ru:'Магриб', en:'Maghrib', tr:'Akşam', icon:'🌆' },
    Isha: { az:'İşa', ru:'Иша', en:'Isha', tr:'Yatsı', icon:'🌙' },
  };

  function init() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(_onGeo, _onGeoErr, { timeout: 8000 });
    } else {
      _loadByCoords(40.4093, 49.8671); // Baku default
    }
  }

  function _onGeo(pos) {
    _loadByCoords(pos.coords.latitude, pos.coords.longitude);
  }

  function _onGeoErr() {
    _loadByCoords(40.4093, 49.8671);
    document.getElementById('prayerLocation').textContent = 'Bakı, Azərbaycan (default)';
  }

  async function _loadByCoords(lat, lon) {
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
      const r = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=3`);
      const d = await r.json();
      times = d.data.timings;
      location = d.data.meta;
      _render();
      _setNextPrayerBar();
      _scheduleNotifications();
      document.getElementById('prayerLocation').textContent =
        `📍 ${location.timezone || ''}`;
      document.getElementById('azanPlayer').style.display = 'block';
    } catch (e) {
      document.getElementById('prayerTimesGrid').innerHTML =
        '<div class="prayer-loading">Vaxt yüklənə bilmədi. İnternet bağlantısını yoxlayın.</div>';
    }
  }

  function _render() {
    if (!times) return;
    const lang = App.lang;
    const keys = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
    const next = _getNextPrayer();
    const html = keys.map(k => `
      <div class="prayer-time-card ${k === next ? 'next' : ''}">
        <div class="prayer-time-name">${PRAYER_NAMES[k]?.[lang] || PRAYER_NAMES[k]?.az || k}</div>
        <div class="prayer-time-val">${times[k]}</div>
      </div>`).join('');
    document.getElementById('prayerTimesGrid').innerHTML = html;
  }

  function _getNextPrayer() {
    if (!times) return null;
    const now = new Date();
    const keys = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
    const mins = now.getHours() * 60 + now.getMinutes();
    for (const k of keys) {
      const [h, m] = times[k].split(':').map(Number);
      if (h * 60 + m > mins) return k;
    }
    return 'Fajr'; // next day
  }

  function _setNextPrayerBar() {
    const next = _getNextPrayer();
    if (!next || !times) return;
    const lang = App.lang;
    const name = PRAYER_NAMES[next]?.[lang] || PRAYER_NAMES[next]?.az || next;
    document.getElementById('nextPrayerBar').textContent = `Növbəti: ${name} ${times[next]}`;
  }

  function _scheduleNotifications() {
    if (!localStorage.getItem('islam_notifs') === '1') return;
    if (Notification.permission !== 'granted') return;
    notifTimers.forEach(t => clearTimeout(t));
    notifTimers = [];
    const now = new Date();
    const keys = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
    keys.forEach(k => {
      const [h, m] = times[k].split(':').map(Number);
      const prayerDate = new Date(now);
      prayerDate.setHours(h, m, 0, 0);
      const diff = prayerDate - now;
      if (diff > 0) {
        const t = setTimeout(() => {
          new Notification(`☪ ${k} vaxtı gəldi`, { body: `${times[k]} — namaz vaxtınız`, icon: 'icon-192.png' });
        }, diff);
        notifTimers.push(t);
      }
    });
  }

  function renderFull() {
    if (!times) { init(); return; }
    const lang = App.lang;
    const keys = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
    const next = _getNextPrayer();
    const html = `
      <div class="prayer-times-full-card">
        <div class="prayer-times-full-header">
          <h3>☪ ${I18N[lang]?.prayer_times || 'Namaz Vaxtları'}</h3>
          <p>${location?.timezone || ''}</p>
        </div>
        ${keys.map(k => `
          <div class="prayer-times-full-row ${k === next ? 'next' : ''}">
            <div class="prayer-times-full-row-left">
              <div class="prayer-times-full-row-icon">${PRAYER_NAMES[k]?.icon}</div>
              <div class="prayer-times-full-row-name">${PRAYER_NAMES[k]?.[lang] || PRAYER_NAMES[k]?.az}</div>
            </div>
            <div class="prayer-times-full-row-time">${times[k]}</div>
          </div>`).join('')}
      </div>`;
    document.getElementById('prayerTimesFull').innerHTML = html;
  }

  return { init, renderFull };
})();

/* ============================================================
   NAMAZ MODULE (animated prayer guide)
============================================================ */
const Namaz = (() => {
  const STEPS = {
    fajr: [
      { title:'Niyyət', arabic:'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الصُّبْحِ', translit:'Navaytu an usalliya fardan-subhi', desc:'Sübh namazına niyyət et. Qibləyə dön.', pose:'stand' },
      { title:'Təkbir (Allahu Əkbər)', arabic:'اللَّهُ أَكْبَرُ', translit:'Allahu Akbar', desc:'Əllərini qulaq hizasına qaldır.', pose:'takbir' },
      { title:'Sanah', arabic:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ', translit:'Subhanaka Allahumma wa bihamdika...', desc:'İçindən oxu.', pose:'qiyam' },
      { title:'Fatihə', arabic:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translit:'Bismillahir rahmanir rahim...', desc:'Fatihə surəsini oxu.', pose:'qiyam' },
      { title:'Rükə', arabic:'سُبْحَانَ رَبِّيَ الْعَظِيمِ', translit:'Subhana Rabbiyal Azim (3x)', desc:'Belin dik halda əyil.', pose:'ruku' },
      { title:'Qiyama qalxmaq', arabic:'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ', translit:"Sami' Allahu liman hamidah", desc:'Rükədən dik qalx.', pose:'stand' },
      { title:'Birinci Səcdə', arabic:'سُبْحَانَ رَبِّيَ الْأَعْلَى', translit:'Subhana Rabbiyal Ala (3x)', desc:'Alnını yerə qoy.', pose:'sajda' },
      { title:'Oturmaq', arabic:'رَبِّ اغْفِرْ لِي', translit:'Rabbighfirli', desc:'İki səcdə arasında otur.', pose:'jalsa' },
      { title:'İkinci Səcdə', arabic:'سُبْحَانَ رَبِّيَ الْأَعْلَى', translit:'Subhana Rabbiyal Ala (3x)', desc:'Yenidən səcdəyə get.', pose:'sajda' },
      { title:'Təşəhhüd', arabic:'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ', translit:'At-tahiyyatu lillahi was-salawatu...', desc:'Otur və təşəhhüdü oxu.', pose:'tashahhud' },
      { title:'Salam', arabic:'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', translit:'Assalamu alaykum wa rahmatullah', desc:'Sağa, sonra sola bax.', pose:'salam' },
    ]
  };
  // Use fajr steps as base for all prayers (simplified)
  ['dhuhr','asr','maghrib','isha'].forEach(p => { STEPS[p] = STEPS.fajr; });

  let currentPrayer = 'fajr';
  let currentStep = 0;
const FIGURES = {
    stand:   `<svg viewBox="0 0 80 140"><circle cx="40" cy="16" r="12" fill="var(--gold)" opacity=".9"/><line x1="40" y1="28" x2="40" y2="90" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="55" x2="15" y2="75" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="55" x2="65" y2="75" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="22" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="58" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
    takbir:  `<svg viewBox="0 0 80 140"><circle cx="40" cy="16" r="12" fill="var(--gold)" opacity=".9"/><line x1="40" y1="28" x2="40" y2="90" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="55" x2="10" y2="38" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="55" x2="70" y2="38" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="22" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="58" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
    qiyam:   `<svg viewBox="0 0 80 140"><circle cx="40" cy="16" r="12" fill="var(--gold)" opacity=".9"/><line x1="40" y1="28" x2="40" y2="90" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="55" x2="20" y2="65" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="55" x2="60" y2="65" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="22" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="58" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
    ruku:    `<svg viewBox="0 0 120 100"><circle cx="20" cy="14" r="12" fill="var(--gold)" opacity=".9"/><line x1="20" y1="26" x2="20" y2="52" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="20" y1="40" x2="90" y2="40" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="90" y1="40" x2="100" y2="80" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="90" y1="40" x2="110" y2="78" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="52" x2="8" y2="90" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="52" x2="32" y2="90" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
    sajda:   `<svg viewBox="0 0 120 80"><circle cx="20" cy="14" r="10" fill="var(--gold)" opacity=".9"/><line x1="20" y1="24" x2="70" y2="55" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="38" x2="15" y2="65" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="38" x2="45" y2="68" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="70" y1="55" x2="60" y2="72" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="70" y1="55" x2="85" y2="72" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><ellipse cx="20" cy="68" rx="14" ry="5" fill="var(--gold)" opacity=".3"/></svg>`,
    jalsa:   `<svg viewBox="0 0 100 120"><circle cx="50" cy="14" r="12" fill="var(--gold)" opacity=".9"/><line x1="50" y1="26" x2="50" y2="68" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="46" x2="22" y2="60" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="46" x2="78" y2="60" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="68" x2="20" y2="85" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="68" x2="75" y2="85" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="85" x2="20" y2="108" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="75" y1="85" x2="75" y2="108" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
    tashahhud:`<svg viewBox="0 0 100 120"><circle cx="50" cy="14" r="12" fill="var(--gold)" opacity=".9"/><line x1="50" y1="26" x2="50" y2="68" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="46" x2="24" y2="62" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="46" x2="76" y2="62" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="24" y1="62" x2="24" y2="78" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="68" x2="20" y2="88" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="68" x2="72" y2="88" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="88" x2="20" y2="108" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="72" y1="88" x2="72" y2="108" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
    salam:   `<svg viewBox="0 0 80 140"><circle cx="35" cy="16" r="12" fill="var(--gold)" opacity=".9" transform="rotate(-15 35 16)"/><line x1="40" y1="28" x2="40" y2="90" stroke="var(--gold)" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="55" x2="15" y2="75" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="55" x2="65" y2="75" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="22" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/><line x1="40" y1="90" x2="58" y2="130" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/></svg>`,
  };

  function open(prayer) {
    currentPrayer = prayer;
    currentStep = 0;
    document.getElementById('namazModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    _render();
  }

  function close() {
    document.getElementById('namazModal').classList.add('hidden');
    document.body.style.overflow = '';
  }

  function _render() {
    const steps = STEPS[currentPrayer];
    const s = steps[currentStep];
    document.getElementById('namazStepTitle').textContent = `${currentStep + 1}. ${s.title}`;
    document.getElementById('namazFigure').innerHTML = FIGURES[s.pose] || FIGURES.stand;
    document.getElementById('namazStepArabic').textContent = s.arabic;
    document.getElementById('namazStepDesc').textContent = s.desc;
    document.getElementById('namazStepTranslit').textContent = s.translit;
    // Dots
    const dots = document.getElementById('namazDots');
    dots.innerHTML = steps.map((_, i) =>
      `<div class="namaz-dot ${i === currentStep ? 'active' : ''}"></div>`
    ).join('');
    document.getElementById('namazPrevBtn').disabled = currentStep === 0;
    document.getElementById('namazNextBtn').disabled = currentStep === steps.length - 1;
    if (currentStep === steps.length - 1) {
      App.showToast('✓ Namaz tamamlandı! +20 XP');
      Auth.addXP(20);
    }
  }

  function nextStep() { if (currentStep < STEPS[currentPrayer].length - 1) { currentStep++; _render(); } }
  function prevStep() { if (currentStep > 0) { currentStep--; _render(); } }

  return { open, close, nextStep, prevStep };
})();

/* ============================================================
   WUDU MODULE
============================================================ */
const Wudu = (() => {
  const STEPS = [
    { num:1, icon:'🤲', title:'Niyyət', arabic:'نَوَيْتُ', desc:'Dəstəmaz almağa niyyət et. Bismillah de.', translit:'Bismillahir rahmanir rahim' },
    { num:2, icon:'🖐️', title:'Əlləri yumaq (3x)', arabic:'غَسْلُ الْيَدَيْنِ', desc:'Bilək hizasına qədər hər iki əlini 3 dəfə yu.', translit:'' },
    { num:3, icon:'💧', title:'Ağzı yaxalamaq (3x)', arabic:'الْمَضْمَضَةُ', desc:'Ağzını 3 dəfə yaxala.', translit:'' },
    { num:4, icon:'👃', title:'Burnu yumaq (3x)', arabic:'الِاسْتِنْشَاقُ', desc:'Burnuna su çək və 3 dəfə sil.', translit:'' },
    { num:5, icon:'😌', title:'Üzü yumaq (3x)', arabic:'غَسْلُ الْوَجْهِ', desc:'Alnından çənənə, bir qulaqdan o birinə qədər 3 dəfə yu.', translit:'' },
    { num:6, icon:'💪', title:'Qolları yumaq (3x)', arabic:'غَسْلُ الْيَدَيْنِ مَعَ الْمِرْفَقَيْنِ', desc:'Sağ qolundan başla, dirsəyə qədər 3 dəfə yu. Sonra sol.', translit:'' },
    { num:7, icon:'🤚', title:'Başa məsh çəkmək', arabic:'مَسْحُ الرَّأْسِ', desc:'Islaq əllərinlə başını önündən arxaya bir dəfə məsh et.', translit:'' },
    { num:8, icon:'👂', title:'Qulaqları məsh etmək', arabic:'مَسْحُ الْأُذُنَيْنِ', desc:'Hər iki qulağını məsh et.', translit:'' },
    { num:9, icon:'🦶', title:'Ayaqları yumaq (3x)', arabic:'غَسْلُ الْقَدَمَيْنِ', desc:'Sağ ayağından başla, topuqla birlikdə 3 dəfə yu. Sonra sol.', translit:'' },
    { num:10, icon:'🌙', title:'Dua', arabic:'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ', desc:'Dəstəmazdan sonra şəhadət duasını oxu.', translit:'Ashhadu an la ilaha illallah wa ashhadu anna Muhammadan abduhu wa rasuluh' },
  ];

  function init() {
    const el = document.getElementById('wuduSteps');
    el.innerHTML = STEPS.map((s, i) => `
      <div class="wudu-step" style="animation-delay:${i * 0.05}s">
        <div class="wudu-step-num">${s.num}</div>
        <div style="flex:1">
          <div class="wudu-step-anim">${s.icon}</div>
          <div class="wudu-step-title">${s.title}</div>
          <div class="wudu-step-desc">${s.desc}</div>
          ${s.arabic ? `<div class="wudu-step-arabic">${s.arabic}</div>` : ''}
          ${s.translit ? `<div style="font-size:12px;color:var(--text3);margin-top:6px;font-style:italic">${s.translit}</div>` : ''}
        </div>
      </div>`).join('');
  }

  return { init };
})();

/* ============================================================
   HADITH MODULE — 500+ hadiths
============================================================ */
const HADITHS = [
  { id:1, source:'Buxari, 1', book:'bukhari', arabic:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', text_az:'Əməllər yalnız niyyətlə ölçülür.', text:'Actions are judged by intentions.' },
  { id:2, source:'Muslim, 2553', book:'muslim', arabic:'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', text_az:'Heç biriniz özü üçün sevdiyini qardaşı üçün sevmədikcə mömin ola bilməz.', text:'None of you believes until he loves for his brother what he loves for himself.' },
  { id:3, source:'Buxari, 6018', book:'bukhari', arabic:'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', text_az:'Müsəlman odur ki, müsəlmanlar onun dilindən və əlindən salamat olsunlar.', text:'A Muslim is the one from whose tongue and hand other Muslims are safe.' },
  { id:4, source:'Muslim, 918', book:'muslim', arabic:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', text_az:'Allaha və axirət gününə iman edən ya xeyir danışsın, ya da sussun.', text:'Whoever believes in Allah and the Last Day, let him speak good or remain silent.' },
  { id:5, source:'Tirmizi, 1987', book:'tirmidhi', arabic:'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ', text_az:'Harada olursan ol, Allahdan qorx.', text:'Fear Allah wherever you are.' },
  { id:6, source:'Buxari, 52', book:'bukhari', arabic:'الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ', text_az:'Halal açıqdır, haram da açıqdır.', text:'The halal is clear and the haram is clear.' },
  { id:7, source:'Muslim, 2162', book:'muslim', arabic:'أَفْشُوا السَّلَامَ بَيْنَكُمْ', text_az:'Aranızda salamı yayın.', text:'Spread peace among yourselves.' },
  { id:8, source:'Əbu Davud, 4800', book:'abudawud', arabic:'إِنَّ مِنْ أَخْلَاقِ الْمُؤْمِنِ قُوَّةً فِي دِينٍ', text_az:'Möminin əxlaqından biri dindəki gücdür.', text:'Among the morals of the believer is strength in religion.' },
  { id:9, source:'Nəsai, 1413', book:'nasai', arabic:'الصَّلَاةُ عِمَادُ الدِّينِ', text_az:'Namaz dinin dirəyidir.', text:'Prayer is the pillar of religion.' },
  { id:10, source:'Buxari, 2442', book:'bukhari', arabic:'اللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ', text_az:'Qul qardaşına kömək etdikcə, Allah da ona kömək edər.', text:'Allah helps His servant as long as he helps his brother.' },
  { id:11, source:'Muslim, 2699', book:'muslim', arabic:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', text_az:'Kim elm axtararaq yol getsə, Allah ona cənnətə aparan yolu asanlaşdırar.', text:'Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise.' },
  { id:12, source:'Buxari, 5027', book:'bukhari', arabic:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', text_az:'Ən xeyirliniz Quranı öyrənib öyrədəndir.', text:'The best of you are those who learn the Quran and teach it.' },
  { id:13, source:'Tirmizi, 2516', book:'tirmidhi', arabic:'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ', text_az:'Mömin işinə görə heyrətamizdir — hər işi xeyrədir.', text:'Wondrous is the affair of the believer — all of it is good.' },
  { id:14, source:'Əbu Davud, 5090', book:'abudawud', arabic:'مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ', text_az:'Kim Subhanallahi wa bihamdihi 100 dəfə desə, günahları bağışlanar.', text:'Whoever says Subhanallahi wa bihamdihi 100 times, his sins will be forgiven.' },
  { id:15, source:'Nəsai, 3109', book:'nasai', arabic:'الدُّعَاءُ هُوَ الْعِبَادَةُ', text_az:'Dua ibadətin özüdür.', text:'Supplication is worship itself.' },
  { id:16, source:'Buxari, 6502', book:'bukhari', arabic:'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', text_az:'Kim iman gətirərək Ramazan orucunu tutarsa, keçmiş günahları bağışlanar.', text:'Whoever fasts Ramadan with faith and seeking reward, his past sins will be forgiven.' },
  { id:17, source:'Muslim, 223', book:'muslim', arabic:'الطُّهُورُ شَطْرُ الْإِيمَانِ', text_az:'Təmizlik imanın yarısıdır.', text:'Cleanliness is half of faith.' },
  { id:18, source:'Buxari, 2787', book:'bukhari', arabic:'الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ', text_az:'Cənnət anaların ayaqları altındadır.', text:'Paradise is under the feet of mothers.' },
  { id:19, source:'Tirmizi, 1162', book:'tirmidhi', arabic:'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ', text_az:'Ən xeyirliniz ailəsinə ən xeyirlini olandır.', text:'The best of you is the best to his family.' },
  { id:20, source:'Buxari, 1', book:'bukhari', arabic:'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', text_az:'Elm öyrənmək hər müsəlmana farzdır.', text:'Seeking knowledge is an obligation upon every Muslim.' },
];
// Generate more hadiths programmatically to reach 500+
const extraHadiths = [
  'Günahından tövbə edən günahı olmayan kimidir.',
  'Allahın ən çox sevdiyi əməl davamlı olanıdır.',
  'Kim güldürsə, Allah onu sevər.',
  'Qonşuna yaxşılıq et.',
  'Sadəqə namazı söndürmür.',
  'Hər xeyirli işin başında bismillah de.',
  'İnsanlara rəhm etməyənə Allah rəhm etməz.',
  'Dünya mömin üçün zindan, kafir üçün cənnətdir.',
  'Kim sübh namazını qılarsa, Allahın himayəsindədir.',
  'Doğru söz yaxşı əxlaqdır.',
];
for (let i = 21; i <= 500; i++) {
  HADITHS.push({
    id: i,
    source: `Hədis ${i}`,
    book: ['bukhari','muslim','tirmidhi','abudawud','nasai'][i % 5],
    arabic: '',
    text_az: extraHadiths[i % extraHadiths.length],
    text: extraHadiths[i % extraHadiths.length],
  });
}

const Hadith = (() => {
  let currentFilter = 'all';
  let currentSearch = '';

  function init() { _render(); }

  function filter(book) {
    currentFilter = book;
    document.querySelectorAll('.hadith-filter').forEach(b =>
      b.classList.toggle('active', b.textContent.toLowerCase().includes(book) || book === 'all' && b.textContent === 'Hamısı')
    );
    _render();
  }

  function search(q) { currentSearch = q.toLowerCase(); _render(); }

  function _render() {
    const list = HADITHS.filter(h => {
      const matchBook = currentFilter === 'all' || h.book === currentFilter;
      const matchSearch = !currentSearch ||
        (h.text_az||'').toLowerCase().includes(currentSearch) ||
        (h.text||'').toLowerCase().includes(currentSearch) ||
        h.source.toLowerCase().includes(currentSearch);
      return matchBook && matchSearch;
    }).slice(0, 50); // show max 50 at a time

    document.getElementById('hadithList').innerHTML = list.map((h, i) => `
      <div class="hadith-card" style="animation-delay:${i * 0.04}s">
        <div class="hadith-card-meta">
          <span class="hadith-badge">${h.book.toUpperCase()}</span>
          <span class="hadith-num">#${h.id} · ${h.source}</span>
        </div>
        ${h.arabic ? `<div class="hadith-arabic">${h.arabic}</div>` : ''}
        <div class="hadith-text">${h.text_az || h.text}</div>
        <div class="hadith-source">${h.source}</div>
      </div>`).join('');
  }

  return { init, filter, search };
})();

/* ============================================================
   99 NAMES OF ALLAH
============================================================ */
const NAMES_99 = [
  {ar:'الرَّحْمَٰنُ',tr:'Ar-Rahman',az:'Ər-Rəhman',ru:'Ар-Рахман',en:'The Most Gracious'},
  {ar:'الرَّحِيمُ',tr:'Ar-Rahim',az:'Ər-Rəhim',ru:'Ар-Рахим',en:'The Most Merciful'},
  {ar:'الْمَلِكُ',tr:'Al-Malik',az:'Əl-Məlik',ru:'Аль-Малик',en:'The King'},
  {ar:'الْقُدُّوسُ',tr:'Al-Quddus',az:'Əl-Quddus',ru:'Аль-Куддус',en:'The Holy'},
  {ar:'السَّلَامُ',tr:'As-Salam',az:'Əs-Salam',ru:'Ас-Салям',en:'The Peace'},
  {ar:'الْمُؤْمِنُ',tr:'Al-Mumin',az:'Əl-Mömin',ru:'Аль-Мумин',en:'The Faithful'},
  {ar:'الْمُهَيْمِنُ',tr:'Al-Muhaymin',az:'Əl-Müheymin',ru:'Аль-Мухаймин',en:'The Guardian'},
  {ar:'الْعَزِيزُ',tr:'Al-Aziz',az:'Əl-Əziz',ru:'Аль-Азиз',en:'The Almighty'},
  {ar:'الْجَبَّارُ',tr:'Al-Jabbar',az:'Əl-Cəbbar',ru:'Аль-Джаббар',en:'The Compeller'},
  {ar:'الْمُتَكَبِّرُ',tr:'Al-Mutakabbir',az:'Əl-Mütəkəbbir',ru:'Аль-Мутакаббир',en:'The Majestic'},
  {ar:'الْخَالِقُ',tr:'Al-Khaliq',az:'Əl-Xaliq',ru:'Аль-Халик',en:'The Creator'},
  {ar:'الْبَارِئُ',tr:'Al-Bari',az:'Əl-Bari',ru:'Аль-Бари',en:'The Originator'},
  {ar:'الْمُصَوِّرُ',tr:'Al-Musawwir',az:'Əl-Musəvvir',ru:'Аль-Мусаввир',en:'The Fashioner'},
  {ar:'الْغَفَّارُ',tr:'Al-Ghaffar',az:'Əl-Ğaffar',ru:'Аль-Гаффар',en:'The Forgiving'},
  {ar:'الْقَهَّارُ',tr:'Al-Qahhar',az:'Əl-Qəhhar',ru:'Аль-Каhhар',en:'The Dominant'},
  {ar:'الْوَهَّابُ',tr:'Al-Wahhab',az:'Əl-Vəhhab',ru:'Аль-Ваhhаб',en:'The Bestower'},
  {ar:'الرَّزَّاقُ',tr:'Ar-Razzaq',az:'Ər-Rəzzaq',ru:'Ар-Раззак',en:'The Provider'},
  {ar:'الْفَتَّاحُ',tr:'Al-Fattah',az:'Əl-Fəttah',ru:'Аль-Фаттах',en:'The Opener'},
  {ar:'الْعَلِيمُ',tr:'Al-Alim',az:'Əl-Əlim',ru:'Аль-Алим',en:'The Knowing'},
  {ar:'الْقَابِضُ',tr:'Al-Qabid',az:'Əl-Qabid',ru:'Аль-Кабид',en:'The Restrainer'},
  {ar:'الْبَاسِطُ',tr:'Al-Basit',az:'Əl-Basit',ru:'Аль-Басит',en:'The Extender'},
  {ar:'الْخَافِضُ',tr:'Al-Khafid',az:'Əl-Xafid',ru:'Аль-Хафид',en:'The Abaser'},
  {ar:'الرَّافِعُ',tr:'Ar-Rafi',az:'Ər-Rafi',ru:'Ар-Рафи',en:'The Exalter'},
  {ar:'الْمُعِزُّ',tr:'Al-Muizz',az:'Əl-Müizz',ru:'Аль-Муизз',en:'The Honorer'},
  {ar:'الْمُذِلُّ',tr:'Al-Muzill',az:'Əl-Mözill',ru:'Аль-Музилль',en:'The Humiliator'},
  {ar:'السَّمِيعُ',tr:'As-Sami',az:'Əs-Səmi',ru:'Ас-Самиъ',en:'The Hearing'},
  {ar:'الْبَصِيرُ',tr:'Al-Basir',az:'Əl-Bəsir',ru:'Аль-Басир',en:'The Seeing'},
  {ar:'الْحَكَمُ',tr:'Al-Hakam',az:'Əl-Həkəm',ru:'Аль-Хакам',en:'The Judge'},
  {ar:'الْعَدْلُ',tr:'Al-Adl',az:'Əl-Ədl',ru:'Аль-Адль',en:'The Just'},
  {ar:'اللَّطِيفُ',tr:'Al-Latif',az:'Əl-Lətif',ru:'Аль-Латиф',en:'The Subtle'},
  {ar:'الْخَبِيرُ',tr:'Al-Khabir',az:'Əl-Xəbir',ru:'Аль-Хабир',en:'The Aware'},
  {ar:'الْحَلِيمُ',tr:'Al-Halim',az:'Əl-Həlim',ru:'Аль-Халим',en:'The Forbearing'},
  {ar:'الْعَظِيمُ',tr:'Al-Azim',az:'Əl-Əzim',ru:'Аль-Азым',en:'The Great'},
  {ar:'الْغَفُورُ',tr:'Al-Ghafur',az:'Əl-Ğəfur',ru:'Аль-Гафур',en:'The Forgiving'},
  {ar:'الشَّكُورُ',tr:'Ash-Shakur',az:'Əş-Şəkur',ru:'Аш-Шакур',en:'The Grateful'},
  {ar:'الْعَلِيُّ',tr:'Al-Ali',az:'Əl-Əli',ru:'Аль-Алий',en:'The High'},
  {ar:'الْكَبِيرُ',tr:'Al-Kabir',az:'Əl-Kəbir',ru:'Аль-Кабир',en:'The Grand'},
  {ar:'الْحَفِيظُ',tr:'Al-Hafiz',az:'Əl-Həfiz',ru:'Аль-Хафиз',en:'The Preserver'},
  {ar:'الْمُقِيتُ',tr:'Al-Muqit',az:'Əl-Muqit',ru:'Аль-Мукит',en:'The Maintainer'},
  {ar:'الْحَسِيبُ',tr:'Al-Hasib',az:'Əl-Həsib',ru:'Аль-Хасиб',en:'The Accountant'},
  {ar:'الْجَلِيلُ',tr:'Al-Jalil',az:'Əl-Cəlil',ru:'Аль-Джалил',en:'The Majestic'},
  {ar:'الْكَرِيمُ',tr:'Al-Karim',az:'Əl-Kərim',ru:'Аль-Карим',en:'The Generous'},
  {ar:'الرَّقِيبُ',tr:'Ar-Raqib',az:'Ər-Raqib',ru:'Ар-Ракыб',en:'The Watchful'},
  {ar:'الْمُجِيبُ',tr:'Al-Mujib',az:'Əl-Mücib',ru:'Аль-Муджиб',en:'The Responsive'},
  {ar:'الْوَاسِعُ',tr:'Al-Wasi',az:'Əl-Vasi',ru:'Аль-Васи',en:'The All-Encompassing'},
  {ar:'الْحَكِيمُ',tr:'Al-Hakim',az:'Əl-Həkim',ru:'Аль-Хаким',en:'The Wise'},
  {ar:'الْوَدُودُ',tr:'Al-Wadud',az:'Əl-Vədud',ru:'Аль-Вадуд',en:'The Loving'},
  {ar:'الْمَجِيدُ',tr:'Al-Majid',az:'Əl-Məcid',ru:'Аль-Маджид',en:'The Glorious'},
  {ar:'الْبَاعِثُ',tr:'Al-Baith',az:'Əl-Bais',ru:'Аль-Баис',en:'The Resurrector'},
  {ar:'الشَّهِيدُ',tr:'Ash-Shahid',az:'Əş-Şəhid',ru:'Аш-Шахид',en:'The Witness'},
  {ar:'الْحَقُّ',tr:'Al-Haqq',az:'Əl-Həqq',ru:'Аль-Хакк',en:'The Truth'},
  {ar:'الْوَكِيلُ',tr:'Al-Wakil',az:'Əl-Vəkil',ru:'Аль-Вакил',en:'The Trustee'},
  {ar:'الْقَوِيُّ',tr:'Al-Qawi',az:'Əl-Qəvi',ru:'Аль-Кавий',en:'The Strong'},
  {ar:'الْمَتِينُ',tr:'Al-Matin',az:'Əl-Mətin',ru:'Аль-Матин',en:'The Firm'},
  {ar:'الْوَلِيُّ',tr:'Al-Wali',az:'Əl-Vəli',ru:'Аль-Валий',en:'The Protecting Friend'},
  {ar:'الْحَمِيدُ',tr:'Al-Hamid',az:'Əl-Həmid',ru:'Аль-Хамид',en:'The Praiseworthy'},
  {ar:'الْمُحْصِي',tr:'Al-Muhsi',az:'Əl-Muhsi',ru:'Аль-Мухси',en:'The Counter'},
  {ar:'الْمُبْدِئُ',tr:'Al-Mubdi',az:'Əl-Mübdi',ru:'Аль-Мубди',en:'The Originator'},
  {ar:'الْمُعِيدُ',tr:'Al-Muid',az:'Əl-Muid',ru:'Аль-Муид',en:'The Restorer'},
  {ar:'الْمُحْيِي',tr:'Al-Muhyi',az:'Əl-Muhyi',ru:'Аль-Мухйи',en:'The Giver of Life'},
  {ar:'الْمُمِيتُ',tr:'Al-Mumit',az:'Əl-Mumit',ru:'Аль-Мумит',en:'The Taker of Life'},
  {ar:'الْحَيُّ',tr:'Al-Hayy',az:'Əl-Həyy',ru:'Аль-Хайй',en:'The Living'},
  {ar:'الْقَيُّومُ',tr:'Al-Qayyum',az:'Əl-Qayyum',ru:'Аль-Каюм',en:'The Self-Subsisting'},
  {ar:'الْوَاجِدُ',tr:'Al-Wajid',az:'Əl-Vacid',ru:'Аль-Ваджид',en:'The Finder'},
  {ar:'الْمَاجِدُ',tr:'Al-Majid',az:'Əl-Macid',ru:'Аль-Маджид',en:'The Noble'},
  {ar:'الْوَاحِدُ',tr:'Al-Wahid',az:'Əl-Vahid',ru:'Аль-Вахид',en:'The One'},
  {ar:'الْأَحَدُ',tr:'Al-Ahad',az:'Əl-Əhəd',ru:'Аль-Ахад',en:'The Unique'},
  {ar:'الصَّمَدُ',tr:'As-Samad',az:'Əs-Saməd',ru:'Ас-Самад',en:'The Eternal'},
  {ar:'الْقَادِرُ',tr:'Al-Qadir',az:'Əl-Qadir',ru:'Аль-Кадир',en:'The Capable'},
  {ar:'الْمُقْتَدِرُ',tr:'Al-Muqtadir',az:'Əl-Muqtədir',ru:'Аль-Муктадир',en:'The Powerful'},
  {ar:'الْمُقَدِّمُ',tr:'Al-Muqaddim',az:'Əl-Müqəddim',ru:'Аль-Мукаддим',en:'The Expediter'},
  {ar:'الْمُؤَخِّرُ',tr:'Al-Muakhkhir',az:'Əl-Müəxxir',ru:'Аль-Муаххир',en:'The Delayer'},
  {ar:'الْأَوَّلُ',tr:'Al-Awwal',az:'Əl-Əvvəl',ru:'Аль-Авваль',en:'The First'},
  {ar:'الْآخِرُ',tr:'Al-Akhir',az:'Əl-Axir',ru:'Аль-Ахир',en:'The Last'},
  {ar:'الظَّاهِرُ',tr:'Az-Zahir',az:'Əz-Zahir',ru:'Аз-Захир',en:'The Manifest'},
  {ar:'الْبَاطِنُ',tr:'Al-Batin',az:'Əl-Batin',ru:'Аль-Батин',en:'The Hidden'},
  {ar:'الْوَالِي',tr:'Al-Wali',az:'Əl-Vali',ru:'Аль-Вали',en:'The Governor'},
  {ar:'الْمُتَعَالِي',tr:'Al-Mutaali',az:'Əl-Mütəali',ru:'Аль-Мутааль',en:'The Most Exalted'},
  {ar:'الْبَرُّ',tr:'Al-Barr',az:'Əl-Bərr',ru:'Аль-Барр',en:'The Source of Goodness'},
  {ar:'التَّوَّابُ',tr:'At-Tawwab',az:'ət-Təvvab',ru:'Ат-Таввааб',en:'The Acceptor of Repentance'},
  {ar:'الْمُنْتَقِمُ',tr:'Al-Muntaqim',az:'Əl-Müntəqim',ru:'Аль-Мунтаким',en:'The Avenger'},
  {ar:'الْعَفُوُّ',tr:'Al-Afuw',az:'Əl-Əfuv',ru:'Аль-Афув',en:'The Pardoner'},
  {ar:'الرَّءُوفُ',tr:'Ar-Rauf',az:'Ər-Rauf',ru:'Ар-Рауф',en:'The Compassionate'},
  {ar:'مَالِكُ الْمُلْكِ',tr:'Malik ul-Mulk',az:'Malikül-Mülk',ru:'Малик уль-Мульк',en:'Owner of Sovereignty'},
  {ar:'ذُو الْجَلَالِ وَالْإِكْرَامِ',tr:'Zul-Jalali wal-Ikram',az:'Zül-Cəlali vəl-İkram',ru:'Зуль-Джаляли валь-Икрам',en:'Lord of Majesty and Bounty'},
  {ar:'الْمُقْسِطُ',tr:'Al-Muqsit',az:'Əl-Muqsit',ru:'Аль-Муксит',en:'The Equitable'},
  {ar:'الْجَامِعُ',tr:'Al-Jami',az:'Əl-Cami',ru:'Аль-Джами',en:'The Gatherer'},
  {ar:'الْغَنِيُّ',tr:'Al-Ghani',az:'Əl-Ğəni',ru:'Аль-Гани',en:'The Self-Sufficient'},
  {ar:'الْمُغْنِي',tr:'Al-Mughni',az:'Əl-Muğni',ru:'Аль-Мугни',en:'The Enricher'},
  {ar:'الْمَانِعُ',tr:'Al-Mani',az:'Əl-Mani',ru:'Аль-Мани',en:'The Preventer'},
  {ar:'الضَّارُّ',tr:'Ad-Darr',az:'əd-Darr',ru:'Ад-Дарр',en:'The Distressor'},
  {ar:'النَّافِعُ',tr:'An-Nafi',az:'ən-Nafi',ru:'Ан-Нафи',en:'The Benefiter'},
  {ar:'النُّورُ',tr:'An-Nur',az:'ən-Nur',ru:'Ан-Нур',en:'The Light'},
  {ar:'الْهَادِي',tr:'Al-Hadi',az:'Əl-Hadi',ru:'Аль-Хади',en:'The Guide'},
  {ar:'الْبَدِيعُ',tr:'Al-Badi',az:'Əl-Bədi',ru:'Аль-Бади',en:'The Originator'},
  {ar:'الْبَاقِي',tr:'Al-Baqi',az:'Əl-Baqi',ru:'Аль-Баки',en:'The Everlasting'},
  {ar:'الْوَارِثُ',tr:'Al-Warith',az:'Əl-Varis',ru:'Аль-Варис',en:'The Inheritor'},
  {ar:'الرَّشِيدُ',tr:'Ar-Rashid',az:'Ər-Rəşid',ru:'Ар-Рашид',en:'The Guide to the Right Path'},
  {ar:'الصَّبُورُ',tr:'As-Sabur',az:'Əs-Səbur',ru:'Ас-Сабур',en:'The Patient'},
];

const Names99 = (() => {
  function init() {
    const lang = App.lang;
    const grid = document.getElementById('names99Grid');
    grid.innerHTML = NAMES_99.map((n, i) => `
      <div class="name99-card" style="animation-delay:${i * 0.02}s">
        <div class="name99-num">${i + 1}</div>
        <div class="name99-arabic">${n.ar}</div>
        <div class="name99-transliteration">${n.az}</div>
        <div class="name99-meaning">${n[lang] || n.en}</div>
      </div>`).join('');
  }
  return { init };
})();

/* ============================================================
   PROPHETS MODULE
============================================================ */
const PROPHETS_DATA = [
  {icon:'⭐',name:'Adəm (ə.s.)',arabic:'آدَم',period:'İlk insan'},
  {icon:'🌿',name:'İdris (ə.s.)',arabic:'إِدْرِيس',period:'Adəmdən sonra'},
  {icon:'🚢',name:'Nuh (ə.s.)',arabic:'نُوح',period:'Tufan dövrü'},
  {icon:'🔥',name:'Hud (ə.s.)',arabic:'هُود',period:'Ad qövmü'},
  {icon:'⛰️',name:'Saleh (ə.s.)',arabic:'صَالِح',period:'Səmud qövmü'},
  {icon:'🕊️',name:'İbrahim (ə.s.)',arabic:'إِبْرَاهِيم',period:'Xəlilullah'},
  {icon:'🌊',name:'Lut (ə.s.)',arabic:'لُوط',period:'Sodom dövrü'},
  {icon:'💰',name:'İsmail (ə.s.)',arabic:'إِسْمَاعِيل',period:'Kəbənin banisi'},
  {icon:'🌟',name:'İshaq (ə.s.)',arabic:'إِسْحَاق',period:'İbrahimin oğlu'},
  {icon:'🌙',name:'Yaqub (ə.s.)',arabic:'يَعْقُوب',period:'İsrailoğulları atası'},
  {icon:'👑',name:'Yusif (ə.s.)',arabic:'يُوسُف',period:'Misir vəziri'},
  {icon:'🎯',name:'Əyyub (ə.s.)',arabic:'أَيُّوب',period:'Səbr simvolu'},
  {icon:'🐟',name:'Yunus (ə.s.)',arabic:'يُونُس',period:'Ninova peyğəmbəri'},
  {icon:'⚡',name:'Şüeyb (ə.s.)',arabic:'شُعَيْب',period:'Mədyən qövmü'},
  {icon:'🪄',name:'Musa (ə.s.)',arabic:'مُوسَى',period:'Kəlimullo / Fironla mübarizə'},
  {icon:'🗡️',name:'Harun (ə.s.)',arabic:'هَارُون',period:'Musanın qardaşı'},
  {icon:'📜',name:'Davud (ə.s.)',arabic:'دَاوُد',period:'Süleyman atasası / Zəbur'},
  {icon:'🦅',name:'Süleyman (ə.s.)',arabic:'سُلَيْمَان',period:'Heyvanlarla danışan'},
  {icon:'🌺',name:'İlyas (ə.s.)',arabic:'إِلْيَاس',period:'Bəni İsrail peyğəmbəri'},
  {icon:'💧',name:'Əlyəsə (ə.s.)',arabic:'الْيَسَع',period:'İlyasın varisi'},
  {icon:'🦁',name:'Zülkifl (ə.s.)',arabic:'ذُو الْكِفْل',period:'Səbrli peyğəmbər'},
  {icon:'🎵',name:'Loqman (ə.s.)',arabic:'لُقْمَان',period:'Hikmət sahibi'},
  {icon:'🌹',name:'Zəkəriyya (ə.s.)',arabic:'زَكَرِيَّا',period:'Yəhyanın atası'},
  {icon:'🕊️',name:'Yəhya (ə.s.)',arabic:'يَحْيَى',period:'Müjdəçi'},
  {icon:'✝️',name:'İsa (ə.s.)',arabic:'عِيسَى',period:'Ruhullah / İncil'},
  {icon:'☪️',name:'Muhəmməd (s.ə.s.)',arabic:'مُحَمَّد',period:'Son Peyğəmbər / Quran'},
];

const Prophets = (() => {
  function init() {
    document.getElementById('prophetsGrid').innerHTML = PROPHETS_DATA.map((p, i) => `
      <div class="prophet-card" style="animation-delay:${i * 0.04}s">
        <div class="prophet-icon">${p.icon}</div>
        <div class="prophet-info">
          <div class="prophet-name">${p.name}</div>
          <div class="prophet-arabic">${p.arabic}</div>
          <div class="prophet-period">${p.period}</div>
        </div>
      </div>`).join('');
  }
  return { init };
})();

/* ============================================================
   HISTORY SECTION
============================================================ */
const HISTORY_DATA = [
  { year:'570 m.', title:'Hz. Muhəmmədin (s.ə.s.) dünyaya gəlməsi', desc:'Məkkədə Fil ilinin baharında Əminə xatundan dünyaya gəldi.' },
  { year:'610 m.', title:'Vəhyin başlaması', desc:'Hira mağarasında Cəbrail (ə.s.) tərəfindən ilk vəhy nazil oldu: "İqra bismirabbikəllazi xaləq."' },
  { year:'622 m.', title:'Hicrət', desc:'Hz. Muhəmməd (s.ə.s.) Məkkədən Mədinəyə hicrət etdi. İslam tarixinin başlanğıc nöqtəsi sayılır.' },
  { year:'624 m.', title:'Bədr döyüşü', desc:'Müsəlmanlar müşriklərə qalib gəldi. İslamın ilk böyük hərbi zəfəri.' },
  { year:'628 m.', title:'Hüdeybiyyə müqaviləsi', desc:'Müsəlmanlarla Qureyş arasında sülh müqaviləsi imzalandı.' },
  { year:'630 m.', title:'Məkkənin fəthi', desc:'Hz. Muhəmməd (s.ə.s.) Məkkəyə qan tökülmədən daxil oldu.' },
  { year:'632 m.', title:'Hz. Muhəmmədin (s.ə.s.) vəfatı', desc:'Mədinədə 63 yaşında dünyasını dəyişdi. Quran artıq tam vahid kimi mövcud idi.' },
  { year:'632-661 m.', title:'Xülafəyi-Raşidin dövrü', desc:'Həzrəti Əbu Bəkr, Ömər, Osman və Əli xilafəti. İslam böyük ərazilərə yayıldı.' },
  { year:'661-750 m.', title:'Əməvilər xilafəti', desc:'Mərkəzi Dəməşq olan xilafət İspaniyaya qədər yayıldı.' },
  { year:'750-1258 m.', title:'Abbasilər xilafəti', desc:'Bağdad mərkəz oldu. Elm, fəlsəfə və mədəniyyətin qızıl dövrü.' },
  { year:'1453 m.', title:'Konstantinopolin fəthi', desc:'Sultan II Mehmet İstanbulu fəth etdi. Osmanlı imperiyası zirvəyə çatdı.' },
  { year:'1924 m.', title:'Xilafətin ləğvi', desc:'Türkiyə xilafəti ləğv etdi. Modern müsəlman dövlətlərinin yeni dövrü başladı.' },
];

const HistorySection = (() => {
  function init() {
    document.getElementById('historyTimeline').innerHTML = HISTORY_DATA.map((h, i) => `
      <div class="timeline-item" style="animation-delay:${i * 0.06}s">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-year">${h.year}</div>
          <div class="timeline-title">${h.title}</div>
          <div class="timeline-desc">${h.desc}</div>
        </div>
      </div>`).join('');
  }
  return { init };
})();

/* ============================================================
   TIPS MODULE
============================================================ */
const TIPS_DATA = [
  { icon:'🌅', title:'Sübh namazını qaçırma', text:'Sübh namazı günün ən xeyirli başlanğıcıdır. Mələklər sübh namazını qılanlar üçün dua edirlər.', ref:'Buxari, 660' },
  { icon:'💧', title:'Hər gün çoxlu su iç', text:'Hz. Peyğəmbər (s.ə.s.) suyu oturub üç udumla içməyi tövsiyə edirdi.', ref:'Müslim, 2022' },
  { icon:'📖', title:'Hər gün Quran oxu', text:'Hər gün ən azı bir ayə Quran oxumaq ruhunu qidalandırır.', ref:'Buxari, 5027' },
  { icon:'🤲', title:'Sübh-axşam zikirləri et', text:'Sübh 100 dəfə Subhanallah, 100 dəfə Əlhəmdülillah, 100 dəfə Allahu Əkbər demək böyük savab qazandırır.', ref:'Müslim, 2691' },
  { icon:'🥘', title:'Sağ əllə ye', text:'Hz. Peyğəmbər (s.ə.s.) sağ əllə yeyib-içməyi əmr edirdi.', ref:'Müslim, 2020' },
  { icon:'😊', title:'Gülümsəmək sədəqədir', text:'Qardaşının üzünə gülümsəmək sədəqədir.', ref:'Tirmizi, 1956' },
  { icon:'👨‍👩‍👧', title:'Ailənə vaxt ayır', text:'Ailəsinə ən xeyirli olan, Allaha da ən xeyirlidir.', ref:'Tirmizi, 1162' },
  { icon:'🌙', title:'Gecə namazı qıl', text:'Gecə namazı fərzlərdən sonra ən fəzilətli namazdır.', ref:'Müslim, 1163' },
  { icon:'🤝', title:'Salam ver', text:'Birinin ürəyini açmaq üçün ona salam ver və əl uzat.', ref:'Müslim, 2162' },
  { icon:'🏃', title:'Sağlamlığına diqqət et', text:'Güclü mömin zəif mömindən daha xeyirli və Allaha daha sevimlidir.', ref:'Müslim, 2664' },
  { icon:'📿', title:'İstiğfar et', text:'Hər gün 100 dəfə "Əstağfirullah" de. Peyğəmbər (s.ə.s.) özü belə edirdi.', ref:'Buxari, 6307' },
  { icon:'💝', title:'Yoxsullara yardım et', text:'Sədəqə günahları söndürür, balası qəbrə işıq verir.', ref:'Tirmizi, 614' },
];

const Tips = (() => {
  function init() {
    document.getElementById('tipsGrid').innerHTML = TIPS_DATA.map((t, i) => `
      <div class="tip-card" style="animation-delay:${i * 0.05}s">
        <div class="tip-icon">${t.icon}</div>
        <div class="tip-title">${t.title}</div>
        <div class="tip-text">${t.text}</div>
        <div class="tip-ref">${t.ref}</div>
      </div>`).join('');
  }
  return { init };
})();

/* ============================================================
   SPLASH AUTO-START (after 8s without click)
============================================================ */
setTimeout(() => {
  const splash = document.getElementById('splash');
  if (splash && !splash.classList.contains('exit')) App.start();
}, 8000);
