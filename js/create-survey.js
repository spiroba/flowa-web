// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDev8X0EEFOMQ8Gsf3eVi9xv9Sr1SRCCDE",
    authDomain: "flowa-85234.firebaseapp.com",
    projectId: "flowa-85234",
    storageBucket: "flowa-85234.firebasestorage.app",
    messagingSenderId: "28624424621",
    appId: "1:28624424621:web:3cd6bf88fb02ffca65c024",
    measurementId: "G-66VZ20FMV9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Тестовый опрос
const testSurvey = {
    id: 'test1',
    title: 'Оценка качества обслуживания',
    description: 'Пожалуйста, уделите несколько минут, чтобы оценить наш сервис',
    questions: [
        {
            type: 'rating',
            text: 'Насколько вы удовлетворены качеством обслуживания?'
        },
        {
            type: 'text',
            text: 'Что вам понравилось больше всего? Что можно улучшить?'
        },
        {
            type: 'choice',
            text: 'Порекомендуете ли вы наш сервис друзьям и коллегам?',
            options: [
                { value: 'definitely', label: 'Определенно да' },
                { value: 'probably', label: 'Вероятно' },
                { value: 'not_sure', label: 'Не уверен(а)' },
                { value: 'no', label: 'Нет' }
            ]
        }
    ],
    successTitle: 'Благодарим за отзыв!',
    successMessage: 'Ваше мнение поможет нам стать лучше'
};

// Функция для создания опроса
async function createSurvey() {
    try {
        // Создаем документ с указанным ID
        await db.collection('surveys').doc(testSurvey.id).set(testSurvey);
        console.log('Опрос успешно создан!');
        console.log('Ссылка на опрос:', `https://spiroba.github.io/flowa-web/?surveyId=${testSurvey.id}`);
    } catch (error) {
        console.error('Ошибка при создании опроса:', error);
    }
}

// Создаем опрос при загрузке страницы
document.addEventListener('DOMContentLoaded', createSurvey); 