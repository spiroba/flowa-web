document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения с явным логированием
    console.log('Flowa web application initialized - версия 1.2.0');
    console.log('Проверка наличия элемента survey-content:', document.getElementById('survey-content') ? 'найден' : 'не найден');
    
    // Получаем параметры из URL
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        
        // Проверяем путь URL для поддержки формата /p/{code}
        const path = window.location.pathname;
        const matches = path.match(/\/p\/([^\/]+)\/?$/);
        if (matches && matches[1]) {
            params.surveyId = matches[1];
            console.log('Найден ID опроса в пути URL:', params.surveyId);
        }
        
        console.log('Полученные параметры URL:', params);
        
        return params;
    }
    
    // Демо опросы для отображения
    const demoSurveys = {
        // Универсальный опрос, который будет показан для любого surveyId
        "default": {
            title: "Оценка качества обслуживания",
            description: "Пожалуйста, уделите несколько минут, чтобы оценить наш сервис",
            questions: [
                {
                    id: 1,
                    type: "rating",
                    text: "Насколько вы удовлетворены качеством обслуживания?",
                    scale: 5
                },
                {
                    id: 2,
                    type: "text",
                    text: "Что мы можем улучшить?"
                }
            ]
        }
    };
    
    // Эмуляция загрузки данных опроса (вместо реального API)
    function fetchSurveyData(surveyId) {
        return new Promise((resolve, reject) => {
            console.log('Запуск fetchSurveyData для ID:', surveyId);
            // Уменьшаем задержку до 100мс для максимально быстрой загрузки
            setTimeout(() => {
                if (surveyId) {
                    console.log(`Получение данных для опроса с ID: ${surveyId}`);
                    // Для демонстрации всегда используем один и тот же опрос,
                    // но используем ID из URL для персонализации
                    const surveyData = { ...demoSurveys.default };
                    surveyData.id = surveyId;
                    surveyData.title = `Опрос #${surveyId}`;
                    resolve(surveyData);
                } else {
                    console.error('ID опроса не найден');
                    reject(new Error('Идентификатор опроса не найден'));
                }
            }, 100); // Минимальная задержка для эмуляции API
        });
    }
    
    // Отрисовка опроса
    function renderSurvey(surveyData) {
        console.log('Начинаем отрисовку опроса:', surveyData);
        const surveyContent = document.getElementById('survey-content');
        
        if (!surveyContent) {
            console.error('Элемент survey-content не найден в DOM!');
            return;
        }
        
        console.log('survey-content найден, продолжаем отрисовку');
        
        const surveyHtml = `
            <div class="survey-header">
                <h3>${surveyData.title}</h3>
                <p>${surveyData.description}</p>
            </div>
            <div class="survey-questions">
                ${surveyData.questions.map(question => renderQuestion(question)).join('')}
            </div>
            <div class="survey-actions">
                <button type="button" class="btn btn-submit" id="submit-survey">Отправить ответы</button>
            </div>
        `;
        
        surveyContent.innerHTML = surveyHtml;
        console.log('HTML опроса отрисован, добавляем обработчик');
        
        // Добавляем обработчик события для отправки
        const submitButton = document.getElementById('submit-survey');
        if (submitButton) {
            submitButton.addEventListener('click', function() {
                submitSurvey(surveyData.id);
            });
            console.log('Обработчик на кнопку добавлен');
        } else {
            console.error('Кнопка submit-survey не найдена после отрисовки!');
        }
    }
    
    // Отрисовка вопроса в зависимости от типа
    function renderQuestion(question) {
        console.log('Отрисовка вопроса:', question);
        let questionHtml = `
            <div class="question" data-id="${question.id}">
                <div class="question-text">${question.text}</div>
        `;
        
        if (question.type === 'rating') {
            questionHtml += `
                <div class="rating-control">
                    ${Array.from({length: question.scale}, (_, i) => i + 1).map(n => `
                        <label class="rating-item">
                            <input type="radio" name="question_${question.id}" value="${n}">
                            <span>${n}</span>
                        </label>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'text') {
            questionHtml += `
                <div class="text-control">
                    <textarea placeholder="Введите ваш ответ здесь..." rows="4"></textarea>
                </div>
            `;
        }
        
        questionHtml += `</div>`;
        return questionHtml;
    }
    
    // Эмуляция отправки данных
    function submitSurvey(surveyId) {
        console.log(`Отправка данных опроса с ID: ${surveyId}`);
        const submitBtn = document.getElementById('submit-survey');
        if (!submitBtn) {
            console.error('Кнопка отправки не найдена!');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Эмулируем отправку данных
        setTimeout(() => {
            const surveyContent = document.getElementById('survey-content');
            if (!surveyContent) {
                console.error('Элемент survey-content не найден при отправке!');
                return;
            }
            
            surveyContent.innerHTML = `
                <div class="success-message">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <h3>Спасибо за ваши ответы!</h3>
                    <p>Ваше мнение очень важно для нас.</p>
                </div>
            `;
            console.log('Успешно отображено сообщение об успешной отправке');
        }, 1000);
    }
    
    // Функция для немедленного отображения демо-опроса
    function forceLoadDemoSurvey(surveyId) {
        console.log(`Начало принудительной загрузки демо-опроса для ID: ${surveyId}`);
        const surveyData = { ...demoSurveys.default };
        surveyData.id = surveyId || 'DEMO';
        surveyData.title = surveyId ? `Опрос #${surveyId}` : 'Демонстрационный опрос';
        
        // Явное удаление загрузчика перед отрисовкой
        const surveyContent = document.getElementById('survey-content');
        if (surveyContent) {
            console.log('Очищаем содержимое перед загрузкой демо-опроса');
            // Удаляем спиннер загрузки, если он есть
            const spinner = surveyContent.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
                console.log('Спиннер загрузки удален');
            }
        }
        
        renderSurvey(surveyData);
        console.log('Демо-опрос должен быть отрисован');
    }
    
    // Загрузка контента опроса
    function loadSurveyContent() {
        const params = getUrlParams();
        const surveyId = params.surveyId || params.id || '';
        
        console.log(`Начало загрузки опроса с ID: ${surveyId}`);
        
        if (surveyId) {
            console.log('ID опроса найден, начинаем загрузку демо-опроса');
            // НЕМЕДЛЕННО показываем демо-опрос без задержки
            forceLoadDemoSurvey(surveyId);
            
            // Попытка получить реальные данные выполняется параллельно, но не блокирует отображение
            console.log('Параллельно запускаем загрузку реальных данных');
            fetchSurveyData(surveyId)
                .then(data => {
                    // Реальные данные можно будет использовать в будущем
                    console.log('Данные опроса успешно загружены, но используем демо-версию');
                })
                .catch(error => {
                    console.error('Ошибка загрузки опроса:', error);
                });
        } else {
            console.log('ID опроса не указан, отображаем пустую страницу');
            const surveyContent = document.getElementById('survey-content');
            if (!surveyContent) {
                console.error('Элемент survey-content не найден для отображения сообщения об ошибке!');
                return;
            }
            
            surveyContent.innerHTML = `
                <div class="no-survey">
                    <p>Опрос не найден. Пожалуйста, убедитесь, что вы отсканировали правильный QR код.</p>
                    <p>Если проблема повторяется, обратитесь к администратору.</p>
                </div>
            `;
        }
    }

    // Запускаем инициализацию с небольшой задержкой для надежности
    console.log('Запланирован запуск loadSurveyContent с задержкой 10мс');
    setTimeout(loadSurveyContent, 10);
    
    // Экстренная диагностика - проверяем DOM каждые 500мс в течение 3 секунд
    for (let i = 1; i <= 6; i++) {
        setTimeout(() => {
            const surveyContent = document.getElementById('survey-content');
            console.log(`Диагностика #${i}: элемент survey-content ${surveyContent ? 'найден' : 'НЕ НАЙДЕН'}`);
            if (surveyContent) {
                console.log(`Содержимое: ${surveyContent.innerHTML.substring(0, 50)}...`);
            }
        }, i * 500);
    }
});