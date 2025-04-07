// Получаем доступ к Firestore
const db = firebase.firestore();

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

// Функция для отображения опроса
function showSurvey() {
    console.log('Вызвана функция showSurvey');
    try {
        const container = document.getElementById('survey-content');
        console.log('Контейнер найден:', !!container);
        
        if (container) {
            const params = new URLSearchParams(window.location.search);
            const surveyId = params.get('surveyId') || 'DEMO';
            console.log('ID опроса:', surveyId);
            
            // Загружаем опрос из Firebase
            db.collection('surveys').doc(surveyId).get()
                .then((doc) => {
                    if (doc.exists) {
                        const surveyData = doc.data();
                        renderSurvey(container, surveyData);
                    } else {
                        // Если опрос не найден, показываем демо-версию
                        renderDemoSurvey(container, surveyId);
                    }
                })
                .catch((error) => {
                    console.error('Ошибка при загрузке опроса:', error);
                    renderDemoSurvey(container, surveyId);
                });
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Функция для отображения демо-опроса
function renderDemoSurvey(container, surveyId) {
    container.innerHTML = `
        <div class="survey-header">
            <h3>Тестовый опрос #${surveyId}</h3>
            <p>Пожалуйста, ответьте на несколько вопросов</p>
        </div>
        <div class="survey-questions">
            <div class="question">
                <div class="question-text">Как вы оцениваете наш сервис?</div>
                <div class="rating-control">
                    <label><input type="radio" name="q1" value="1"><span>1</span></label>
                    <label><input type="radio" name="q1" value="2"><span>2</span></label>
                    <label><input type="radio" name="q1" value="3"><span>3</span></label>
                    <label><input type="radio" name="q1" value="4"><span>4</span></label>
                    <label><input type="radio" name="q1" value="5"><span>5</span></label>
                </div>
            </div>
            <div class="question">
                <div class="question-text">Что можно улучшить?</div>
                <div class="text-control">
                    <textarea name="q2" rows="3" placeholder="Ваш ответ..."></textarea>
                </div>
            </div>
            <div class="question">
                <div class="question-text">Порекомендуете ли вы нас друзьям?</div>
                <div class="choice-control">
                    <label><input type="radio" name="q3" value="yes">Да</label>
                    <label><input type="radio" name="q3" value="no">Нет</label>
                    <label><input type="radio" name="q3" value="maybe">Возможно</label>
                </div>
            </div>
        </div>
        <div class="survey-actions">
            <button onclick="submitSurvey()" class="submit-button">Отправить ответы</button>
        </div>
    `;
}

// Функция для отображения реального опроса
function renderSurvey(container, surveyData) {
    // TODO: Реализовать отображение динамического опроса
    renderDemoSurvey(container, surveyData.id);
}

// Функция отправки опроса
window.submitSurvey = function() {
    const button = document.querySelector('.submit-button');
    const container = document.getElementById('survey-content');
    
    if (button && container) {
        button.disabled = true;
        button.textContent = 'Отправка...';
        
        // Собираем ответы
        const answers = {
            q1: document.querySelector('input[name="q1"]:checked')?.value,
            q2: document.querySelector('textarea[name="q2"]')?.value,
            q3: document.querySelector('input[name="q3"]:checked')?.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            surveyId: new URLSearchParams(window.location.search).get('surveyId') || 'DEMO'
        };
        
        // Сохраняем ответы в Firebase
        db.collection('responses').add(answers)
            .then(() => {
                container.innerHTML = `
                    <div class="success-message">
                        <div class="success-icon">✓</div>
                        <h3>Спасибо за ваши ответы!</h3>
                        <p>Ваше мнение очень важно для нас.</p>
                    </div>
                `;
            })
            .catch((error) => {
                console.error('Ошибка при сохранении ответов:', error);
                button.disabled = false;
                button.textContent = 'Отправить ответы';
                alert('Произошла ошибка при отправке ответов. Пожалуйста, попробуйте еще раз.');
            });
    }
};

// Отслеживаем загрузку страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded наступил');
    showSurvey();
});

// Пробуем запустить сразу
console.log('Пробуем запустить showSurvey немедленно');
showSurvey();

console.log('Конец выполнения скрипта');