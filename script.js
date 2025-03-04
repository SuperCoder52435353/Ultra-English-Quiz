// Foydalanuvchi ma'lumotlari va natijalarni saqlash
let userData = JSON.parse(localStorage.getItem('userData')) || {};
let results = JSON.parse(localStorage.getItem('results')) || {};
let allResults = JSON.parse(localStorage.getItem('allResults')) || [];
let usedWords = JSON.parse(localStorage.getItem('usedWords')) || {};
let restrictedUsers = JSON.parse(localStorage.getItem('restrictedUsers')) || [];

// Forma tekshiruvi
function checkForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = document.getElementById('age').value;
    const error = document.getElementById('error');

    error.textContent = '';
    error.style.display = 'none';

    const letterPattern = /^[A-Za-z]+$/;

    // Ism va familiya tekshiruvi
    if (!letterPattern.test(firstName) || !letterPattern.test(lastName)) {
        error.textContent = 'Iltimos, faqat harflardan tashkil topgan ism va familiya kiriting!';
        error.style.display = 'block';
        return;
    }

    // Ism uzunligi tekshiruvi (3-18 harf)
    if (firstName.length < 3 || firstName.length > 18) {
        error.textContent = 'Ismingiz 3 harfdan kam yoki 18 harfdan ko‘p bo‘lmasligi kerak!';
        error.style.display = 'block';
        return;
    }

    // Familiya uzunligi tekshiruvi (4-32 harf)
    if (lastName.length < 4 || lastName.length > 32) {
        error.textContent = 'Familiyangiz 4 harfdan kam yoki 32 harfdan ko‘p bo‘lmasligi kerak!';
        error.style.display = 'block';
        return;
    }

    // Yosh tekshiruvi (Abduraxmon Admin uchun cheklov yo‘q)
    const isAdmin = firstName.toLowerCase() === 'abduraxmon' && lastName.toLowerCase() === 'admin';
    if (!isAdmin && age === '1') {
        error.textContent = 'Iltimos, yoshingizni tanlang!';
        error.style.display = 'block';
        return;
    }

    userData = { firstName, lastName, age };
    localStorage.setItem('userData', JSON.stringify(userData));
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('userName').textContent = `${firstName} ${lastName}`;

    // Agar Abduraxmon Admin bo‘lsa, results.html ga link qo‘shamiz
    if (isAdmin) {
        const adminLink = document.createElement('a');
        adminLink.href = 'results.html';
        adminLink.textContent = 'Umumiy Natijalarni Ko‘rish';
        adminLink.className = 'profile-link';
        document.querySelector('.content').insertBefore(adminLink, document.querySelector('.playlists'));
    }
}

// Yosh slayderini ko‘rsatish
if (document.getElementById('age')) {
    document.getElementById('age').addEventListener('input', function() {
        document.getElementById('ageValue').textContent = this.value;
    });
}

// So‘zlar bazasi (takrorlanishni oldini olish uchun kengaytirilgan)
const wordsBase = {
    A1: [
        { word: "Apple", translation: "Olma", options: ["Sichqon", "Nok", "Olma", "Suv"] },
        { word: "Book", translation: "Kitob", options: ["Qalam", "Kitob", "Stol", "Uy"] },
        { word: "Cat", translation: "Mushuk", options: ["It", "Mushuk", "Quyon", "Kaptar"] },
        { word: "Dog", translation: "It", options: ["Mushuk", "It", "Suv", "Quyon"] },
        { word: "House", translation: "Uy", options: ["Stol", "Uy", "Qalam", "Sichqon"] },
        { word: "Car", translation: "Mashina", options: ["Uy", "Mashina", "Stol", "Telefon"] },
        { word: "Table", translation: "Stol", options: ["Stul", "Stol", "Divan", "Kreslo"] },
        { word: "Chair", translation: "Stul", options: ["Stol", "Stul", "Kreslo", "Divan"] },
        { word: "School", translation: "Maktab", options: ["Uy", "Maktab", "Bog‘cha", "Ish"] },
        { word: "Teacher", translation: "O‘qituvchi", options: ["Shifokor", "O‘qituvchi", "Do‘kon", "Sotuvchi"] },
        { word: "Friend", translation: "Do‘st", options: ["Dushman", "Do‘st", "Ota", "Ona"] },
        { word: "Water", translation: "Suv", options: ["Olma", "Suv", "Nok", "Qalam"] },
        { word: "Sun", translation: "Quyosh", options: ["Oy", "Quyosh", "Yulduz", "Bulut"] },
        { word: "Moon", translation: "Oy", options: ["Quyosh", "Oy", "Yulduz", "Sham"] },
        { word: "Star", translation: "Yulduz", options: ["Oy", "Yulduz", "Quyosh", "Sham"] },
        { word: "Pen", translation: "Qalam", options: ["Kitob", "Qalam", "Stol", "Suv"] },
        { word: "Bag", translation: "Sumka", options: ["Uy", "Sumka", "Mashina", "Telefon"] },
        { word: "Window", translation: "Deraza", options: ["Eshik", "Deraza", "Stol", "Uy"] },
        { word: "Door", translation: "Eshik", options: ["Deraza", "Eshik", "Stol", "Uy"] },
        { word: "Tree", translation: "Daraxt", options: ["Gul", "Daraxt", "Suv", "Uy"] },
        { word: "Flower", translation: "Gul", options: ["Daraxt", "Gul", "Suv", "Uy"] },
        { word: "Bird", translation: "Qush", options: ["Mushuk", "Qush", "It", "Suv"] },
        { word: "Fish", translation: "Baliq", options: ["Qush", "Baliq", "It", "Mushuk"] },
        { word: "Sky", translation: "Osmon", options: ["Yer", "Osmon", "Suv", "Bulut"] },
        { word: "Cloud", translation: "Bulut", options: ["Osmon", "Bulut", "Suv", "Yer"] },
        { word: "Rain", translation: "Yomg‘ir", options: ["Qor", "Yomg‘ir", "Suv", "Sham"] },
        { word: "Snow", translation: "Qor", options: ["Yomg‘ir", "Qor", "Suv", "Sham"] },
        { word: "Wind", translation: "Shamol", options: ["Yomg‘ir", "Shamol", "Qor", "Suv"] },
        { word: "River", translation: "Daryo", options: ["Ko‘l", "Daryo", "Suv", "Yer"] },
        { word: "Lake", translation: "Ko‘l", options: ["Daryo", "Ko‘l", "Suv", "Yer"] },
        { word: "Mountain", translation: "Tog‘", options: ["Daraxt", "Tog‘", "Yer", "Suv"] },
        { word: "Forest", translation: "O‘rmon", options: ["Tog‘", "O‘rmon", "Yer", "Suv"] },
        { word: "Road", translation: "Yo‘l", options: ["Uy", "Yo‘l", "Mashina", "Suv"] },
        { word: "City", translation: "Shahar", options: ["Qishloq", "Shahar", "Uy", "Yo‘l"] },
        { word: "Village", translation: "Qishloq", options: ["Shahar", "Qishloq", "Uy", "Yo‘l"] },
        { word: "Baby", translation: "Chaqaloq", options: ["Katta", "Chaqaloq", "Ota", "Ona"] },
        { word: "Mother", translation: "Ona", options: ["Ota", "Ona", "Do‘st", "Dushman"] },
        { word: "Father", translation: "Ota", options: ["Ona", "Ota", "Do‘st", "Dushman"] },
        { word: "Brother", translation: "Aka", options: ["Opa", "Aka", "Do‘st", "Dushman"] },
        { word: "Sister", translation: "Opa", options: ["Aka", "Opa", "Do‘st", "Dushman"] },
        { word: "Boy", translation: "O‘g‘il", options: ["Qiz", "O‘g‘il", "Katta", "Kichik"] },
        { word: "Girl", translation: "Qiz", options: ["O‘g‘il", "Qiz", "Katta", "Kichik"] },
        { word: "Man", translation: "Erkak", options: ["Ayol", "Erkak", "Bola", "Qiz"] },
        { word: "Woman", translation: "Ayol", options: ["Erkak", "Ayol", "Bola", "Qiz"] },
        { word: "Day", translation: "Kun", options: ["Tun", "Kun", "Hafta", "Oy"] },
        { word: "Night", translation: "Tun", options: ["Kun", "Tun", "Hafta", "Oy"] },
        { word: "Week", translation: "Hafta", options: ["Kun", "Hafta", "Oy", "Yil"] },
        { word: "Month", translation: "Oy", options: ["Hafta", "Oy", "Yil", "Kun"] },
        { word: "Year", translation: "Yil", options: ["Oy", "Yil", "Hafta", "Kun"] },
        { word: "Morning", translation: "Tong", options: ["Kech", "Tong", "Kun", "Tun"] },
    ],
    B1: [
        { word: "Challenge", translation: "Qiyinchilik", options: ["Muammo", "Qiyinchilik", "Osonlik", "Yechim"] },
        { word: "Improve", translation: "Yaxshilash", options: ["Yomonlash", "Yaxshilash", "Tugatish", "Boshlash"] },
        { word: "Decision", translation: "Qaror", options: ["Fikr", "Qaror", "Xato", "Muammo"] },
        { word: "Effort", translation: "Harakat", options: ["Dam", "Harakat", "Ish", "Uy"] },
        { word: "Success", translation: "Muvaffaqiyat", options: ["Yutqazish", "Muvaffaqiyat", "Ish", "Xato"] },
        { word: "Mistake", translation: "Xato", options: ["To‘g‘ri", "Xato", "Ish", "Fikr"] },
        { word: "Future", translation: "Kelajak", options: ["Hozir", "Kelajak", "O‘tmish", "Bugun"] },
        { word: "Past", translation: "O‘tmish", options: ["Kelajak", "O‘tmish", "Hozir", "Kecha"] },
        { word: "Plan", translation: "Reja", options: ["Ish", "Reja", "Xato", "Muammo"] },
        { word: "Goal", translation: "Maqsad", options: ["Reja", "Maqsad", "Ish", "Yo‘l"] },
        { word: "Dream", translation: "Orzu", options: ["Reja", "Orzu", "Maqsad", "Xato"] },
        { word: "Hope", translation: "Umid", options: ["Qayg‘u", "Umid", "Reja", "Orzu"] },
        { word: "Fear", translation: "Qo‘rquv", options: ["Umid", "Qo‘rquv", "Xato", "Ish"] },
        { word: "Hobby", translation: "Sevimli mashg‘ulot", options: ["Ish", "Sevimli mashg‘ulot", "Dars", "Uy"] },
        { word: "Travel", translation: "Sayohat", options: ["Ish", "Sayohat", "Dars", "Uy"] },
        { word: "Work", translation: "Ish", options: ["Dam", "Ish", "Harakat", "Uy"] },
        { word: "Study", translation: "O‘qish", options: ["Ish", "O‘qish", "Yozish", "Sotish"] },
        { word: "Learn", translation: "O‘rganish", options: ["Unutish", "O‘rganish", "Yozish", "Sotish"] },
        { word: "Teach", translation: "O‘rgatish", options: ["O‘rganish", "O‘rgatish", "Unutish", "Yozish"] },
        { word: "Think", translation: "O‘ylash", options: ["Yozish", "O‘ylash", "Ishlash", "Sotish"] },
        { word: "Speak", translation: "Gapirish", options: ["Yozish", "Gapirish", "Unutish", "O‘rganish"] },
        { word: "Listen", translation: "Tinglash", options: ["Yozish", "Tinglash", "Gapirish", "O‘rganish"] },
        { word: "Read", translation: "O‘qish", options: ["Yozish", "O‘qish", "Tinglash", "Gapirish"] },
        { word: "Write", translation: "Yozish", options: ["O‘qish", "Yozish", "Tinglash", "Gapirish"] },
        { word: "Sleep", translation: "Uxla", options: ["Ovqatlan", "Uxla", "Ishla", "Yoz"] },
        { word: "Eat", translation: "Ovqatlan", options: ["Uxla", "Ovqatlan", "Ishla", "Yoz"] },
        { word: "Drink", translation: "Ich", options: ["Ovqatlan", "Ich", "Uxla", "Yoz"] },
        { word: "Walk", translation: "Yur", options: ["O‘tir", "Yur", "Ishla", "Yoz"] },
        { word: "Run", translation: "Yugur", options: ["Yur", "Yugur", "O‘tir", "Ishla"] },
        { word: "Play", translation: "O‘ynash", options: ["Ishla", "O‘ynash", "Yozish", "Uxla"] },
    ],
    B2: [
        { word: "Significant", translation: "Muhim", options: ["Oddiy", "Muhim", "Kichik", "Foydasiz"] },
        { word: "Analyze", translation: "Tahlil qilish", options: ["Yozish", "Tahlil qilish", "O‘qish", "Sotish"] },
        { word: "Impact", translation: "Ta’sir", options: ["Foyda", "Ta’sir", "Ziyon", "Qiyinlik"] },
        { word: "Explore", translation: "Kashf qilish", options: ["Yashirish", "Kashf qilish", "Yopish", "Unutish"] },
        { word: "Influence", translation: "Ta’sir qilish", options: ["Yordam", "Ta’sir qilish", "Zarar", "O‘zgartirish"] },
        { word: "Develop", translation: "Rivojlantirish", options: ["Yomonlash", "Rivojlantirish", "To‘xtatish", "Boshlash"] },
        { word: "Achieve", translation: "Erishish", options: ["Yo‘qotish", "Erishish", "To‘xtatish", "Boshlash"] },
        { word: "Discover", translation: "Topish", options: ["Yashirish", "Topish", "Yo‘qotish", "Unutish"] },
        { word: "Create", translation: "Yaratish", options: ["Buzish", "Yaratish", "Yo‘qotish", "Unutish"] },
        { word: "Innovate", translation: "Yangilik kiritish", options: ["O‘zgartirish", "Yangilik kiritish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Adapt", translation: "Moslashish", options: ["Qarshi turish", "Moslashish", "Yo‘qotish", "Unutish"] },
        { word: "Compete", translation: "Raqobatlashish", options: ["Yordamlashish", "Raqobatlashish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Negotiate", translation: "Muzokara qilish", options: ["Rad etish", "Muzokara qilish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Persuade", translation: "Ishontirish", options: ["Rad etish", "Ishontirish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Resolve", translation: "Hal qilish", options: ["Muammolash", "Hal qilish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Organize", translation: "Tashkil qilish", options: ["Buzish", "Tashkil qilish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Collaborate", translation: "Hamkorlik qilish", options: ["Yakkalanmoq", "Hamkorlik qilish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Motivate", translation: "Motivatsiya qilish", options: ["Demotivatsiya qilish", "Motivatsiya qilish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Inspire", translation: "Ilhomlantirish", options: ["Tushkunlikka solish", "Ilhomlantirish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Transform", translation: "O‘zgartirish", options: ["Saqlash", "O‘zgartirish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Evaluate", translation: "Baholash", options: ["E’tiborsizlik", "Baholash", "To‘xtatish", "Yo‘qotish"] },
        { word: "Prioritize", translation: "Ustuvorlik qilish", options: ["E’tiborsizlik", "Ustuvorlik qilish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Implement", translation: "Amalga oshirish", options: ["Bekor qilish", "Amalga oshirish", "To‘xtatish", "Yo‘qotish"] },
        { word: "Maintain", translation: "Saqlash", options: ["Buzish", "Saqlash", "To‘xtatish", "Yo‘qotish"] },
        { word: "Expand", translation: "Kengaytirish", options: ["Qisqartirish", "Kengaytirish", "To‘xtatish", "Yo‘qotish"] },
    ],
    C1: [
        { word: "Eloquent", translation: "Notiq", options: ["Jim", "Notiq", "Oddiy", "Tushunarsiz"] },
        { word: "Obscure", translation: "Tushunarsiz", options: ["Aniq", "Tushunarsiz", "Oson", "Oddiy"] },
        { word: "Profound", translation: "Chuqur", options: ["Sayoz", "Chuqur", "Oddiy", "Keng"] },
        { word: "Resilient", translation: "Bardoshli", options: ["Zaif", "Bardoshli", "Oddiy", "Tez"] },
        { word: "Meticulous", translation: "Sinchkov", options: ["Ehtiyotsiz", "Sinchkov", "Tez", "Oddiy"] },
        { word: "Pervasive", translation: "Keng tarqalgan", options: ["Kamyob", "Keng tarqalgan", "Oddiy", "Maxsus"] },
        { word: "Candid", translation: "Ochiq", options: ["Yopiq", "Ochiq", "Oddiy", "Tez"] },
        { word: "Discreet", translation: "Ehtiyotkor", options: ["Ehtiyotsiz", "Ehtiyotkor", "Oddiy", "Tez"] },
        { word: "Prudent", translation: "Ehtiyotkor", options: ["Ehtiyotsiz", "Ehtiyotkor", "Oddiy", "Tez"] },
        { word: "Tenacious", translation: "Qat’iyatli", options: ["Zaif", "Qat’iyatli", "Oddiy", "Tez"] },
        { word: "Astute", translation: "Ziyrak", options: ["Oddiy", "Ziyrak", "Ehtiyotsiz", "Tez"] },
        { word: "Lucid", translation: "Ravshan", options: ["Tushunarsiz", "Ravshan", "Oddiy", "Tez"] },
        { word: "Subtle", translation: "Nozik", options: ["Qalin", "Nozik", "Oddiy", "Tez"] },
        { word: "Vivid", translation: "Yorqin", options: ["Xira", "Yorqin", "Oddiy", "Tez"] },
        { word: "Cogent", translation: "Ishonchli", options: ["Ishonchsiz", "Ishonchli", "Oddiy", "Tez"] },
        { word: "Erratic", translation: "Notekis", options: ["Doimiy", "Notekis", "Oddiy", "Tez"] },
        { word: "Frugal", translation: "Tejamkor", options: ["Isrofgar", "Tejamkor", "Oddiy", "Tez"] },
        { word: "Gregarious", translation: "Do‘stona", options: ["Yolg‘iz", "Do‘stona", "Oddiy", "Tez"] },
        { word: "Impulsive", translation: "Shoshqaloq", options: ["Ehtiyotkor", "Shoshqaloq", "Oddiy", "Tez"] },
        { word: "Indigenous", translation: "Mahalliy", options: ["Xorijiy", "Mahalliy", "Oddiy", "Tez"] },
        { word: "Lethargic", translation: "Sust", options: ["Tez", "Sust", "Oddiy", "Ehtiyotkor"] },
        { word: "Melancholy", translation: "G‘amgin", options: ["Quvnoq", "G‘amgin", "Oddiy", "Tez"] },
        { word: "Nonchalant", translation: "Beparvo", options: ["Ehtiyotkor", "Beparvo", "Oddiy", "Tez"] },
        { word: "Opulent", translation: "Hashamatli", options: ["Oddiy", "Hashamatli", "Tez", "Ehtiyotkor"] },
        { word: "Pensive", translation: "O‘ychan", options: ["Beparvo", "O‘ychan", "Oddiy", "Tez"] },
    ],
    C2: [
        { word: "Ephemeral", translation: "Vaqtinchalik", options: ["Doimiy", "Vaqtinchalik", "Oddiy", "Abadiy"] },
        { word: "Ubiquitous", translation: "Hamma joyda", options: ["Kamdan-kam", "Hamma joyda", "Yagona", "Maxsus"] },
        { word: "Ebullient", translation: "Jo‘shqin", options: ["Sovuq", "Jo‘shqin", "Oddiy", "Jim"] },
        { word: "Serendipity", translation: "Tasodifiy baxt", options: ["Baxtsizlik", "Tasodifiy baxt", "Reja", "Muammo"] },
        { word: "Quixotic", translation: "Xayolparast", options: ["Haqiqiy", "Xayolparast", "Oddiy", "Amaliy"] },
        { word: "Epiphany", translation: "Ilhom", options: ["Nodonlik", "Ilhom", "Oddiy", "Muammo"] },
        { word: "Ethereal", translation: "Nozik", options: ["Qattiq", "Nozik", "Oddiy", "Tez"] },
        { word: "Inscrutable", translation: "Tushunib bo‘lmas", options: ["Tushunarli", "Tushunib bo‘lmas", "Oddiy", "Tez"] },
        { word: "Lugubrious", translation: "G‘amgin", options: ["Quvnoq", "G‘amgin", "Oddiy", "Tez"] },
        { word: "Magnanimous", translation: "Olijanob", options: ["Xasis", "Olijanob", "Oddiy", "Tez"] },
        { word: "Nefarious", translation: "Yovuz", options: ["Yaxshi", "Yovuz", "Oddiy", "Tez"] },
        { word: "Obstreperous", translation: "Shovqinli", options: ["Jim", "Shovqinli", "Oddiy", "Tez"] },
        { word: "Pernicious", translation: "Zararli", options: ["Foydali", "Zararli", "Oddiy", "Tez"] },
        { word: "Querulous", translation: "Noluvchi", options: ["Sukut", "Noluvchi", "Oddiy", "Tez"] },
        { word: "Recalcitrant", translation: "Qaysar", options: ["Yumshoq", "Qaysar", "Oddiy", "Tez"] },
        { word: "Sagacious", translation: "Dono", options: ["Nodon", "Dono", "Oddiy", "Tez"] },
        { word: "Temerarious", translation: "Jasur", options: ["Qo‘rqoq", "Jasur", "Oddiy", "Tez"] },
        { word: "Unassailable", translation: "Yengib bo‘lmas", options: ["Yengiladigan", "Yengib bo‘lmas", "Oddiy", "Tez"] },
        { word: "Voracious", translation: "Ochko‘z", options: ["Tejamkor", "Ochko‘z", "Oddiy", "Tez"] },
        { word: "Wistful", translation: "Hasratli", options: ["Quvnoq", "Hasratli", "Oddiy", "Tez"] },
        { word: "Zealous", translation: "G‘ayratli", options: ["Sust", "G‘ayratli", "Oddiy", "Tez"] },
        { word: "Aberrant", translation: "Noto‘g‘ri", options: ["To‘g‘ri", "Noto‘g‘ri", "Oddiy", "Tez"] },
        { word: "Capricious", translation: "Injiq", options: ["Doimiy", "Injiq", "Oddiy", "Tez"] },
        { word: "Deleterious", translation: "Zararli", options: ["Foydali", "Zararli", "Oddiy", "Tez"] },
        { word: "Fastidious", translation: "Sinchkov", options: ["Ehtiyotsiz", "Sinchkov", "Oddiy", "Tez"] },
    ]
};

let words = [];
let currentQuiz = null;
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let answeredQuestions = [];
let selectedOption = null;
let currentSession = {
    level: null,
    answered: [],
    score: 0,
    correctAnswers: 0,
    totalQuestions: 0
};

// Profilga kirishni tekshirish
function checkProfileAccess() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const userKey = `${userData.firstName} ${userData.lastName}`;
    if (userKey.toLowerCase() === 'abduraxmon admin') {
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('profile-page').style.display = 'none';
    } else {
        displayProfile();
    }
}

function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    const error = document.getElementById('adminError');
    if (password === 'PASSWORDABDURAXMON') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('profile-page').style.display = 'block';
        displayProfile();
    } else {
        error.textContent = 'Noto‘g‘ri parol!';
        error.style.display = 'block';
    }
}

function startQuiz(level) {
    if (restrictedUsers.includes(`${userData.firstName} ${userData.lastName}`)) {
        alert('Sizga test yechish taqiqlangan!');
        return;
    }

    document.querySelector('.playlists').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    currentQuiz = level;
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    totalQuestions = wordsBase[level].length;
    answeredQuestions = [];
    selectedOption = null;

    // Har bir daraja uchun ishlatilgan so‘zlarni tekshirish
    usedWords[level] = usedWords[level] || [];
    const availableWords = wordsBase[level].filter(word => !usedWords[level].includes(word.word));
    if (availableWords.length < totalQuestions) {
        usedWords[level] = []; // Agar so‘zlar tugasa, qaytadan boshlash
        availableWords.push(...wordsBase[level]);
    }
    words = availableWords.slice(0, totalQuestions);
    words.sort(() => Math.random() - 0.5); // Savollarni tasodifiy tartibda joylashtirish

    currentSession = {
        level: level,
        answered: [],
        score: 0,
        correctAnswers: 0,
        totalQuestions: totalQuestions
    };
    showQuestion();
}

function showQuestion() {
    const quiz = words;
    if (currentQuestion < totalQuestions) {
        const q = quiz[currentQuestion];
        document.getElementById('quizTitle').textContent = `${currentQuiz} Darajasi`;
        document.getElementById('progressText').textContent = `${currentQuestion + 1}/${totalQuestions}`;
        document.getElementById('progressBar').style.width = `${((currentQuestion + 1) / totalQuestions) * 100}%`;
        document.getElementById('question').textContent = `So‘z: ${q.word} - Tarjimasi qaysi?`;

        // Variantlarni tasodifiy tartibda joylashtirish
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        document.getElementById('options').innerHTML = shuffledOptions.map(opt => 
            `<button data-value="${opt}" onclick="selectOption('${opt}', '${q.translation}', this)">${opt}</button>`
        ).join('');

        document.getElementById('quizError').style.display = 'none';
        document.getElementById('nextBtn').disabled = true;
        selectedOption = null;

        // Barcha tugmalardan "selected" classini olib tashlash
        const buttons = document.querySelectorAll('.quiz-options button');
        buttons.forEach(btn => btn.classList.remove('selected'));
    } else {
        finishQuiz();
    }
}

function selectOption(selected, correct, button) {
    selectedOption = { selected, correct };
    currentSession.answered.push(selectedOption);
    document.getElementById('nextBtn').disabled = false;

    // Tanlangan tugmani belgilash
    const buttons = document.querySelectorAll('.quiz-options button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function nextQuestion() {
    if (!selectedOption) {
        document.getElementById('quizError').textContent = 'Iltimos, variant tanlang!';
        document.getElementById('quizError').style.display = 'block';
        return;
    }

    if (selectedOption.selected === selectedOption.correct) {
        const points = { A1: 1, B1: 1.5, B2: 2, C1: 3, C2: 5 };
        score += points[currentQuiz];
        correctAnswers++;
        currentSession.score = score;
        currentSession.correctAnswers = correctAnswers;
    }
    answeredQuestions.push(selectedOption);

    // Har safar savol o‘zgarganda natijani saqlash
    saveCurrentSession();

    // Ishlatilgan so‘zni saqlash
    const currentWord = words[currentQuestion].word;
    usedWords[currentQuiz].push(currentWord);
    localStorage.setItem('usedWords', JSON.stringify(usedWords));

    currentQuestion++;
    showQuestion();
}

function saveCurrentSession() {
    const userKey = `${userData.firstName} ${userData.lastName}`;
    results[userKey] = results[userKey] || {};
    results[userKey][currentQuiz] = results[userKey][currentQuiz] || { score: 0, correct: 0, total: totalQuestions };
    
    // Eng yaxshi natijani saqlash
    if (results[userKey][currentQuiz].correct < currentSession.correctAnswers) {
        results[userKey][currentQuiz].score = currentSession.score;
        results[userKey][currentQuiz].correct = currentSession.correctAnswers;
        results[userKey][currentQuiz].total = totalQuestions;
    }
    localStorage.setItem('results', JSON.stringify(results));

    // Agar foydalanuvchi chiqib ketsa, natijani saqlash uchun
    const existingResultIndex = allResults.findIndex(result => 
        result.user === userKey && result.level === currentQuiz
    );
    if (existingResultIndex !== -1) {
        if (allResults[existingResultIndex].correct < currentSession.correctAnswers) {
            allResults[existingResultIndex] = {
                user: userKey,
                level: currentQuiz,
                total: totalQuestions,
                correct: currentSession.correctAnswers,
                score: currentSession.score,
                date: new Date().toLocaleString(),
                status: currentQuestion < totalQuestions ? 'Tugallanmagan' : 'Tugallangan'
            };
        }
    } else {
        allResults.push({
            user: userKey,
            level: currentQuiz,
            total: totalQuestions,
            correct: currentSession.correctAnswers,
            score: currentSession.score,
            date: new Date().toLocaleString(),
            status: currentQuestion < totalQuestions ? 'Tugallanmagan' : 'Tugallangan'
        });
    }
    localStorage.setItem('allResults', JSON.stringify(allResults));
}

function finishQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.querySelector('.playlists').style.display = 'block';
    const userKey = `${userData.firstName} ${userData.lastName}`;
    results[userKey] = results[userKey] || {};
    results[userKey][currentQuiz] = results[userKey][currentQuiz] || { score: 0, correct: 0, total: totalQuestions };
    
    // Eng yaxshi natijani saqlash
    if (results[userKey][currentQuiz].correct < correctAnswers) {
        results[userKey][currentQuiz].score = score;
        results[userKey][currentQuiz].correct = correctAnswers;
        results[userKey][currentQuiz].total = totalQuestions;
    }
    localStorage.setItem('results', JSON.stringify(results));

    // Umumiy natijalarni saqlash (takrorlanishni oldini olish)
    const existingResultIndex = allResults.findIndex(result => 
        result.user === userKey && result.level === currentQuiz
    );
    if (existingResultIndex !== -1) {
        if (allResults[existingResultIndex].correct < correctAnswers) {
            allResults[existingResultIndex] = {
                user: userKey,
                level: currentQuiz,
                total: totalQuestions,
                correct: correctAnswers,
                score: score,
                date: new Date().toLocaleString(),
                status: 'Tugallangan'
            };
        }
    } else {
        allResults.push({
            user: userKey,
            level: currentQuiz,
            total: totalQuestions,
            correct: correctAnswers,
            score: score,
            date: new Date().toLocaleString(),
            status: 'Tugallangan'
        });
    }
    localStorage.setItem('allResults', JSON.stringify(allResults));

    // Agar 50/50 bo‘lsa tabrik animatsiyasi
    if (correctAnswers === 50 && totalQuestions === 50) {
        document.getElementById('congrats-overlay').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('congrats-overlay').style.display = 'none';
        }, 5000);
    }
}

// Profil sahifasida ma'lumotlarni ko‘rsatish
function displayProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const userKey = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('userFullName').textContent = userKey;
    document.getElementById('userAge').textContent = `Yosh: ${userData.age}`;
    
    const userResults = results[userKey] || {};
    const resultsText = Object.keys(userResults).map(level => 
        `${level}: ${userResults[level].correct}/${userResults[level].total} - ${userResults[level].score} ball`
    ).join('\n');
    document.getElementById('resultsList').textContent = resultsText || 'Hali natijalar yo‘q.';

    // Umumiy ballni hisoblash
    let overallScore = 0;
    Object.keys(userResults).forEach(level => {
        overallScore += userResults[level].score || 0;
    });
    document.getElementById('overallScore').textContent = `Umumiy Ball: ${overallScore}`;

    // Eng yaxshi natijani topish
    let bestResult = { level: '', correct: 0, total: 0, score: 0 };
    Object.keys(userResults).forEach(level => {
        if (userResults[level].score > bestResult.score) {
            bestResult = { level, ...userResults[level] };
        }
    });
    document.getElementById('bestResult').textContent = bestResult.level ? 
        `${bestResult.level}: ${bestResult.correct}/${bestResult.total} - ${bestResult.score} ball` : 
        'Hali eng yaxshi natija yo‘q.';
}

// Umumiy natijalarni ko‘rsatish (faqat Abduraxmon Admin uchun)
function displayAllResults() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') {
        document.getElementById('allResults').innerHTML = '<tr><td colspan="6">Bu sahifa faqat admin uchun!</td></tr>';
        return;
    }

    const resultsHtml = allResults.map(result => 
        `<tr>
            <td>${result.user}</td>
            <td>${result.level}</td>
            <td>${result.total}/${result.correct}</td>
            <td>${result.score}</td>
            <td>${result.date}</td>
            <td>${result.status}</td>
        </tr>`
    ).join('');
    document.getElementById('allResults').innerHTML = resultsHtml || '<tr><td colspan="6">Hali natijalar yo‘q.</td></tr>';
}

// Abduraxmon Admin uchun qo‘shimcha imkoniyatlar
function clearAllResults() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') return;
    if (confirm('Barcha natijalarni o‘chirishni xohlaysizmi?')) {
        allResults = [];
        localStorage.setItem('allResults', JSON.stringify(allResults));
        displayAllResults();
    }
}

function generateReport() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') return;
    
    let report = "Umumiy Natijalar Hisoboti\n\n";
    allResults.forEach(result => {
        report += `Foydalanuvchi: ${result.user}\nDaraja: ${result.level}\nNatija: ${result.total}/${result.correct}\nBall: ${result.score}\nSana: ${result.date}\nStatus: ${result.status}\n\n`;
    });
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'natijalar_hisoboti.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function filterResultsByUser() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') return;

    const userName = prompt('Foydalanuvchi nomini kiriting:');
    if (userName) {
        const filteredResults = allResults.filter(result => result.user.toLowerCase().includes(userName.toLowerCase()));
        const resultsHtml = filteredResults.map(result => 
            `<tr>
                <td>${result.user}</td>
                <td>${result.level}</td>
                <td>${result.total}/${result.correct}</td>
                <td>${result.score}</td>
                <td>${result.date}</td>
                <td>${result.status}</td>
            </tr>`
        ).join('');
        document.getElementById('allResults').innerHTML = resultsHtml || '<tr><td colspan="6">Natijalar topilmadi.</td></tr>';
    }
}

function sortResultsByScore() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') return;

    const sortedResults = [...allResults].sort((a, b) => b.score - a.score);
    const resultsHtml = sortedResults.map(result => 
        `<tr>
            <td>${result.user}</td>
            <td>${result.level}</td>
            <td>${result.total}/${result.correct}</td>
            <td>${result.score}</td>
            <td>${result.date}</td>
            <td>${result.status}</td>
        </tr>`
    ).join('');
    document.getElementById('allResults').innerHTML = resultsHtml || '<tr><td colspan="6">Hali natijalar yo‘q.</td></tr>';
}

function restrictUser() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') return;

    const userName = prompt('Cheklash uchun foydalanuvchi nomini kiriting:');
    if (userName && !restrictedUsers.includes(userName)) {
        restrictedUsers.push(userName);
        localStorage.setItem('restrictedUsers', JSON.stringify(restrictedUsers));
        alert(`${userName} cheklandi.`);
    }
}

function viewUserStats() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') return;

    const userName = prompt('Statistikasini ko‘rish uchun foydalanuvchi nomini kiriting:');
    if (userName) {
        let totalAttempts = 0, totalCorrect = 0, totalScore = 0;
        const userAttempts = allResults.filter(result => result.user.toLowerCase() === userName.toLowerCase());
        userAttempts.forEach(attempt => {
            totalAttempts++;
            totalCorrect += attempt.correct;
            totalScore += attempt.score;
        });
        alert(`Foydalanuvchi: ${userName}\nUmumiy urinishlar: ${totalAttempts}\nUmumiy to‘g‘ri javoblar: ${totalCorrect}\nUmumiy ball: ${totalScore}`);
    }
}

function goBack() {
    history.back();
}