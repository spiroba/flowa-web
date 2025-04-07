document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    console.log('Flowa web application initialized');
    
    // Получаем параметры из URL
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        
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
            // Эмулируем задержку запроса
            setTimeout(() => {
                if (surveyId) {
                    // Для демонстрации всегда используем один и тот же опрос,
                    // но используем ID из URL для персонализации
                    const surveyData = { ...demoSurveys.default };
                    surveyData.id = surveyId;
                    surveyData.title = `Опрос #${surveyId}`;
                    resolve(surveyData);
                } else {
                    reject(new Error('Идентификатор опроса не найден'));
                }
            }, 1500); // 1.5 секунды задержки для эмуляции загрузки
        });
    }
    
    // Отрисовка опроса
    function renderSurvey(surveyData) {
        const surveyContent = document.getElementById('survey-content');
        
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
        
        // Добавляем обработчик события для отправки
        document.getElementById('submit-survey').addEventListener('click', function() {
            submitSurvey(surveyData.id);
        });
    }
    
    // Отрисовка вопроса в зависимости от типа
    function renderQuestion(question) {
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
        const submitBtn = document.getElementById('submit-survey');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        // Эмулируем отправку данных
        setTimeout(() => {
            const surveyContent = document.getElementById('survey-content');
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
        }, 1000);
    }
    
    // Загрузка контента опроса
    function loadSurveyContent() {
        const params = getUrlParams();
        const surveyContent = document.getElementById('survey-content');
        
        if (params.surveyId) {
            // Показываем сначала загрузчик
            surveyContent.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Загрузка опроса ID: ${params.surveyId}...</p>
                </div>
            `;
            
            fetchSurveyData(params.surveyId)
                .then(data => {
                    renderSurvey(data);
                })
                .catch(error => {
                    surveyContent.innerHTML = `
                        <div class="error-message">
                            <p>Ошибка при загрузке опроса: ${error.message}</p>
                            <button class="btn" onclick="location.reload()">Попробовать снова</button>
                        </div>
                    `;
                });
        } else {
            surveyContent.innerHTML = `
                <div class="no-survey">
                    <p>Опрос не найден. Пожалуйста, убедитесь, что вы отсканировали правильный QR код.</p>
                    <p>Если проблема повторяется, обратитесь к администратору.</p>
                </div>
            `;
        }
    }

    // Инициализация приложения
    loadSurveyContent();
});
