// Глобальная функция инициализации
window.initializeFlowaSurvey = function(retryCount = 0) {
    console.log('=== Диагностика Flowa ===');
    console.log('Версия: 1.5.0 (с расширенной диагностикой)');
    console.log('Время:', new Date().toISOString());
    console.log('Состояние DOM:', document.readyState);
    console.log('URL:', window.location.href);
    console.log('Referrer:', document.referrer);
    console.log('User Agent:', navigator.userAgent);
    
    // Получаем параметры из URL
    const params = new URLSearchParams(window.location.search);
    let surveyId = params.get('surveyId');
    
    // Проверяем путь URL для формата /p/{code}
    if (!surveyId) {
        const path = window.location.pathname;
        const matches = path.match(/\/p\/([^\/]+)\/?$/);
        if (matches && matches[1]) {
            surveyId = matches[1];
            console.log('ID опроса получен из пути:', surveyId);
        }
    } else {
        console.log('ID опроса получен из параметров:', surveyId);
    }
    
    console.log('Итоговый ID опроса:', surveyId);
    
    // Проверяем структуру DOM
    console.log('=== Диагностика DOM ===');
    console.log('Body присутствует:', !!document.body);
    console.log('Элементы в body:', document.body ? document.body.children.length : 0);
    console.log('Наличие #app:', !!document.getElementById('app'));
    console.log('Наличие .survey-section:', !!document.querySelector('.survey-section'));
    console.log('Наличие #survey-content:', !!document.getElementById('survey-content'));
    
    // Проверяем наличие контейнера
    const container = document.getElementById('survey-content');
    if (!container) {
        console.log(`Попытка #${retryCount + 1}: контейнер не найден`);
        console.log('Текущее содержимое body:', document.body ? document.body.innerHTML.substring(0, 200) + '...' : 'body отсутствует');
        
        if (retryCount < 5) {
            console.log(`Запланирована следующая попытка через 200мс`);
            setTimeout(() => {
                window.initializeFlowaSurvey(retryCount + 1);
            }, 200);
        } else {
            console.error('Не удалось найти контейнер после 5 попыток');
            console.log('=== Финальная диагностика ===');
            console.log('HTML страницы:', document.documentElement.innerHTML.substring(0, 500) + '...');
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

// Отслеживаем все этапы загрузки страницы
document.addEventListener('readystatechange', function() {
    console.log('Изменение состояния DOM:', document.readyState);
});

// Логируем ошибки
window.onerror = function(msg, url, line, col, error) {
    console.error('=== Ошибка JavaScript ===');
    console.error('Сообщение:', msg);
    console.error('URL:', url);
    console.error('Строка:', line);
    console.error('Колонка:', col);
    console.error('Стек вызовов:', error && error.stack);
    return false;
};

// Запускаем первую попытку инициализации немедленно
console.log('Запуск немедленной инициализации');
window.initializeFlowaSurvey();

// Дополнительно пробуем после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded ===');
    console.log('Время от запуска:', performance.now(), 'мс');
    window.initializeFlowaSurvey();
});