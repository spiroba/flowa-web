// Базовая диагностика
console.log('Начало выполнения скрипта');

// Функция для проверки console
(function() {
    try {
        console.log('Проверка console.log');
    } catch (e) {
        window.console = { log: function() {} };
    }
})();

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
const analytics = firebase.analytics();

// Функция для отображения опроса
async function showSurvey() {
    console.log('Вызвана функция showSurvey');
    try {
        const container = document.getElementById('survey-content');
        console.log('Контейнер найден:', !!container);
        
        if (container) {
            const params = new URLSearchParams(window.location.search);
            const surveyId = params.get('surveyId');
            console.log('ID опроса:', surveyId);
            
            if (!surveyId) {
                renderError(container, 'Не указан ID опроса');
                return;
            }

            // Загружаем опрос из Firestore
            const surveyDoc = await db.collection('surveys').doc(surveyId).get();
            
            if (!surveyDoc.exists) {
                renderError(container, 'Опрос не найден');
                return;
            }

            const survey = surveyDoc.data();
            renderSurvey(container, survey);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        const container = document.getElementById('survey-content');
        if (container) {
            renderError(container, 'Произошла ошибка при загрузке опроса');
        }
    }
}

// Функция для отображения ошибки
function renderError(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <div class="error-icon">!</div>
            <h3>Ошибка</h3>
            <p>${message}</p>
        </div>
    `;
}

// Функция для отображения опроса
function renderSurvey(container, survey) {
    console.log('Рендеринг опроса:', survey);
    
    let questionsHTML = '';
    survey.questions.forEach((question, index) => {
        let inputHTML = '';
        
        switch (question.type) {
            case 'rating':
                inputHTML = `
                    <div class="rating-control">
                        ${[1,2,3,4,5].map(value => `
                            <label>
                                <input type="radio" name="q${index}" value="${value}">
                                <span>${value}</span>
                            </label>
                        `).join('')}
                    </div>`;
                break;
            case 'text':
                inputHTML = `
                    <div class="text-control">
                        <textarea name="q${index}" rows="3" placeholder="Ваш ответ..."></textarea>
                    </div>`;
                break;
            case 'choice':
                inputHTML = `
                    <div class="choice-control">
                        ${question.options.map(option => `
                            <label>
                                <input type="radio" name="q${index}" value="${option.value}">
                                ${option.label}
                            </label>
                        `).join('')}
                    </div>`;
                break;
        }

        questionsHTML += `
            <div class="question">
                <div class="question-text">${question.text}</div>
                ${inputHTML}
            </div>
        `;
    });

    container.innerHTML = `
        <div class="survey-header">
            <h3>${survey.title}</h3>
            <p>${survey.description || ''}</p>
        </div>
        <div class="survey-questions">
            ${questionsHTML}
        </div>
        <div class="survey-actions">
            <button id="submitButton" class="submit-button">Отправить ответы</button>
        </div>
    `;

    // Добавляем обработчик события для кнопки отправки
    document.getElementById('submitButton').addEventListener('click', () => submitSurvey(survey));
}

// Функция отправки опроса
async function submitSurvey(survey) {
    console.log('Начало отправки опроса');
    const button = document.querySelector('.submit-button');
    const container = document.getElementById('survey-content');
    
    if (button && container) {
        button.disabled = true;
        button.textContent = 'Отправка...';
        
        try {
            // Собираем ответы
            const answers = {
                surveyId: survey.id,
                answers: survey.questions.map((_, index) => {
                    const input = document.querySelector(`input[name="q${index}"]:checked, textarea[name="q${index}"]`);
                    return input ? input.value : null;
                }),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            console.log('Собранные ответы:', answers);
            
            // Сохраняем ответы в Firebase
            const docRef = await db.collection('responses').add(answers);
            console.log('Ответ сохранен с ID:', docRef.id);
            
            container.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">✓</div>
                    <h3>${survey.successTitle || 'Спасибо за ваши ответы!'}</h3>
                    <p>${survey.successMessage || 'Ваше мнение очень важно для нас.'}</p>
                </div>
            `;
        } catch (error) {
            console.error('Ошибка при сохранении ответов:', error);
            button.disabled = false;
            button.textContent = 'Отправить ответы';
            alert('Произошла ошибка при отправке ответов. Пожалуйста, попробуйте еще раз.');
        }
    }
}

// Отслеживаем загрузку страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded наступил');
    showSurvey();
});

// Пробуем запустить сразу
console.log('Пробуем запустить showSurvey немедленно');
showSurvey();

console.log('Конец выполнения скрипта');