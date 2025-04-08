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
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Создание опроса...</p>';
    
    try {
        // Создаем документ с указанным ID
        await db.collection('surveys').doc(testSurvey.id).set(testSurvey);
        
        const surveyUrl = `https://spiroba.github.io/flowa-web/?surveyId=${testSurvey.id}`;
        
        resultDiv.innerHTML = `
            <div class="success">
                <h3>Опрос успешно создан!</h3>
                <p>Ссылка на опрос:</p>
                <a href="${surveyUrl}" target="_blank">${surveyUrl}</a>
                <p>Нажмите на ссылку, чтобы открыть опрос в новой вкладке.</p>
            </div>
        `;
        
        console.log('Опрос успешно создан!');
        console.log('Ссылка на опрос:', surveyUrl);
    } catch (error) {
        console.error('Ошибка при создании опроса:', error);
        resultDiv.innerHTML = `
            <div class="error">
                <h3>Ошибка!</h3>
                <p>Не удалось создать опрос: ${error.message}</p>
            </div>
        `;
    }
}

// Создаем опрос при загрузке страницы
document.addEventListener('DOMContentLoaded', createSurvey); 