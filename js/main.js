// Глобальная функция инициализации
window.initializeFlowaSurvey = function(retryCount = 0) {
    console.log('Попытка инициализации Flowa #' + (retryCount + 1));
    
    // Получаем параметры из URL
    const params = new URLSearchParams(window.location.search);
    let surveyId = params.get('surveyId');
    
    // Проверяем путь URL для формата /p/{code}
    if (!surveyId) {
        const path = window.location.pathname;
        const matches = path.match(/\/p\/([^\/]+)\/?$/);
        if (matches && matches[1]) {
            surveyId = matches[1];
        }
    }
    
    console.log('ID опроса:', surveyId);
    
    // Проверяем наличие контейнера
    const container = document.getElementById('survey-content');
    if (!container) {
        console.log('Контейнер не найден, попытка #' + (retryCount + 1));
        if (retryCount < 5) { // Пробуем максимум 5 раз
            setTimeout(() => {
                window.initializeFlowaSurvey(retryCount + 1);
            }, 200); // Увеличиваем интервал между попытками
        } else {
            console.error('Не удалось найти контейнер после 5 попыток');
        }
        return;
    }
    
    // Если контейнер найден, отображаем опрос
    if (surveyId) {
        // Данные демо-опроса
        const survey = {
            title: `Опрос #${surveyId}`,
            description: 'Пожалуйста, уделите несколько минут, чтобы оценить наш сервис',
            questions: [
                {
                    id: 1,
                    type: 'rating',
                    text: 'Насколько вы удовлетворены качеством обслуживания?',
                    scale: 5
                },
                {
                    id: 2,
                    type: 'text',
                    text: 'Что мы можем улучшить?'
                }
            ]
        };
        
        // Формируем HTML опроса
        const html = `
            <div class="survey-header">
                <h3>${survey.title}</h3>
                <p>${survey.description}</p>
            </div>
            <div class="survey-questions">
                ${survey.questions.map(q => {
                    if (q.type === 'rating') {
                        return `
                            <div class="question" data-id="${q.id}">
                                <div class="question-text">${q.text}</div>
                                <div class="rating-control">
                                    ${Array.from({length: q.scale}, (_, i) => i + 1)
                                        .map(n => `
                                            <label class="rating-item">
                                                <input type="radio" name="question_${q.id}" value="${n}">
                                                <span>${n}</span>
                                            </label>
                                        `).join('')}
                                </div>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="question" data-id="${q.id}">
                                <div class="question-text">${q.text}</div>
                                <div class="text-control">
                                    <textarea placeholder="Введите ваш ответ здесь..." rows="4"></textarea>
                                </div>
                            </div>
                        `;
                    }
                }).join('')}
            </div>
            <div class="survey-actions">
                <button type="button" class="btn btn-submit" id="submit-survey">Отправить ответы</button>
            </div>
        `;
        
        // Очищаем контейнер и вставляем опрос
        container.innerHTML = html;
        
        // Добавляем обработчик отправки
        const submitBtn = document.getElementById('submit-survey');
        if (submitBtn) {
            submitBtn.addEventListener('click', function() {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
                
                setTimeout(() => {
                    container.innerHTML = `
                        <div class="success-message">
                            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                            <h3>Спасибо за ваши ответы!</h3>
                            <p>Ваше мнение очень важно для нас.</p>
                        </div>
                    `;
                }, 1000);
            });
        }
    } else {
        container.innerHTML = `
            <div class="no-survey">
                <p>Опрос не найден. Пожалуйста, убедитесь, что вы отсканировали правильный QR код.</p>
                <p>Если проблема повторяется, обратитесь к администратору.</p>
            </div>
        `;
    }
};

// Запускаем первую попытку инициализации немедленно
window.initializeFlowaSurvey();

// Дополнительно пробуем после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded событие');
    window.initializeFlowaSurvey();
});