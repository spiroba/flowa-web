// Немедленно запускаем инициализацию при загрузке скрипта
(function() {
    console.log('Скрипт Flowa запущен - версия 1.3.0');
    console.log('Проверка DOM перед DOMContentLoaded:', document.readyState);
    
    // Функция немедленной инициализации - не зависит от DOMContentLoaded
    function initializeSurvey() {
        console.log('Начата немедленная инициализация опроса');
        console.log('Текущее состояние DOM:', document.readyState);
        
        // Объект для хранения параметров URL
        const params = {};
        
        // Получаем параметры из URL-запроса
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        
        // Проверяем URL-путь для формата /p/{code}
        const path = window.location.pathname;
        const matches = path.match(/\/p\/([^\/]+)\/?$/);
        if (matches && matches[1]) {
            params.surveyId = matches[1];
            console.log('Найден ID опроса в пути URL:', params.surveyId);
        }
        
        console.log('Параметры URL:', params);
        
        // Демонстрационные данные опроса
        const surveyData = {
            id: params.surveyId || 'DEMO',
            title: params.surveyId ? `Опрос #${params.surveyId}` : 'Демонстрационный опрос',
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
        };
        
        // Функция для отрисовки вопроса в зависимости от типа
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
        
        // Функция для отправки данных опроса
        function setupSubmitHandler() {
            const submitBtn = document.getElementById('submit-survey');
            if (!submitBtn) {
                console.error('Кнопка отправки не найдена!');
                return;
            }
            
            submitBtn.addEventListener('click', function() {
                console.log(`Отправка данных опроса с ID: ${surveyData.id}`);
                
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
            });
            
            console.log('Обработчик отправки настроен');
        }
        
        // Функция для отображения опроса
        function displaySurvey() {
            const surveyContainer = document.getElementById('survey-content');
            if (!surveyContainer) {
                console.error('КРИТИЧЕСКАЯ ОШИБКА: Элемент #survey-content не найден в DOM!');
                
                // Дополнительная диагностика
                console.log('Текущие элементы в body:', document.body.innerHTML.substring(0, 500));
                
                // Попытка создать элемент, если он не существует
                if (document.querySelector('.survey-section')) {
                    console.log('Секция опроса найдена, создаем элемент survey-content');
                    const surveySection = document.querySelector('.survey-section');
                    const newSurveyContent = document.createElement('div');
                    newSurveyContent.id = 'survey-content';
                    surveySection.appendChild(newSurveyContent);
                    
                    // Пытаемся отобразить содержимое в новом элементе
                    displaySurvey();
                    return;
                }
                
                return;
            }
            
            console.log('survey-content найден, отображаем опрос');
            
            // Готовим HTML для опроса
            const surveyHtml = `
                <div class="survey-header">
                    <h3>${surveyData.title}</h3>
                    <p>${surveyData.description}</p>
                </div>
                <div class="survey-questions">
                    ${surveyData.questions.map(q => renderQuestion(q)).join('')}
                </div>
                <div class="survey-actions">
                    <button type="button" class="btn btn-submit" id="submit-survey">Отправить ответы</button>
                </div>
            `;
            
            // Вставляем HTML в контейнер
            surveyContainer.innerHTML = surveyHtml;
            console.log('HTML опроса отрисован');
            
            // Настраиваем обработчик отправки
            setupSubmitHandler();
        }
        
        // Функция для отображения сообщения об ошибке
        function displayError() {
            const surveyContainer = document.getElementById('survey-content');
            if (!surveyContainer) {
                console.error('КРИТИЧЕСКАЯ ОШИБКА: Элемент #survey-content не найден в DOM!');
                return;
            }
            
            surveyContainer.innerHTML = `
                <div class="no-survey">
                    <p>Опрос не найден. Пожалуйста, убедитесь, что вы отсканировали правильный QR код.</p>
                    <p>Если проблема повторяется, обратитесь к администратору.</p>
                </div>
            `;
        }
        
        // Основная логика отображения
        if (params.surveyId) {
            console.log('ID опроса найден, отображаем опрос');
            
            // Если DOM еще не загружен, ждем загрузки
            if (document.readyState === 'loading') {
                console.log('DOM еще не загружен, ждем DOMContentLoaded');
                document.addEventListener('DOMContentLoaded', displaySurvey);
            } else {
                // DOM уже доступен, отображаем опрос немедленно
                console.log('DOM уже загружен, отображаем опрос немедленно');
                displaySurvey();
            }
        } else {
            console.log('ID опроса не найден, отображаем сообщение об ошибке');
            
            // Если DOM еще не загружен, ждем загрузки
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', displayError);
            } else {
                // DOM уже доступен
                displayError();
            }
        }
    }
    
    // Запуск с минимальной задержкой для гарантии загрузки DOM
    setTimeout(initializeSurvey, 0);
    
    // Дополнительно выполняем при полной загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded: страница полностью загружена');
        console.log('Состояние элемента survey-content:', 
            document.getElementById('survey-content') ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
        
        // Проверяем содержимое элемента survey-content
        if (document.getElementById('survey-content')) {
            const content = document.getElementById('survey-content').innerHTML;
            console.log('Содержимое survey-content:', content.substring(0, 100) + '...');
            
            // Если элемент содержит только спиннер загрузки, запускаем инициализацию повторно
            if (content.includes('loading-spinner')) {
                console.log('Обнаружен спиннер загрузки, принудительно запускаем инициализацию опроса');
                initializeSurvey();
            }
        }
    });
})();