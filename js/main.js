// Базовая диагностика при загрузке файла
console.log('Загрузка main.js начата');

// Глобальная функция инициализации
window.initializeFlowaSurvey = function(retryCount = 0) {
    console.log('Вызвана initializeFlowaSurvey');
    
    // Базовая диагностика
    console.log('DOM готов:', document.readyState);
    console.log('URL:', window.location.href);
    
    // Получаем ID опроса
    const params = new URLSearchParams(window.location.search);
    let surveyId = params.get('surveyId');
    
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
    console.log('Контейнер найден:', !!container);
    
    if (!container) {
        if (retryCount < 5) {
            console.log('Повторная попытка через 200мс');
            setTimeout(() => window.initializeFlowaSurvey(retryCount + 1), 200);
        }
        return;
    }
    
    // Отображаем опрос
    if (surveyId) {
        container.innerHTML = `
            <div class="survey-header">
                <h3>Опрос #${surveyId}</h3>
                <p>Демо-версия опроса</p>
            </div>
            <div class="survey-questions">
                <div class="question">
                    <div class="question-text">Как вам наш сервис?</div>
                    <div class="rating-control">
                        <label><input type="radio" name="q1" value="1"><span>1</span></label>
                        <label><input type="radio" name="q1" value="2"><span>2</span></label>
                        <label><input type="radio" name="q1" value="3"><span>3</span></label>
                        <label><input type="radio" name="q1" value="4"><span>4</span></label>
                        <label><input type="radio" name="q1" value="5"><span>5</span></label>
                    </div>
                </div>
            </div>
            <button onclick="alert('Спасибо за ответ!')">Отправить</button>
        `;
    } else {
        container.innerHTML = '<p>Опрос не найден</p>';
    }
};

// Запускаем сразу
console.log('Запуск первой инициализации');
window.initializeFlowaSurvey();

// И после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded наступил');
    window.initializeFlowaSurvey();
});

// Отслеживаем ошибки
window.onerror = function(msg, url, line) {
    console.error('Ошибка:', msg, 'Строка:', line);
    return false;
};

console.log('Загрузка main.js завершена');