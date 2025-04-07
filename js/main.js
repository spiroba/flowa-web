// Базовая диагностика при загрузке файла
console.log('Загрузка main.js начата');

// Проверяем доступность console
if (typeof console === 'undefined') {
    window.console = {
        log: function() {},
        error: function() {}
    };
}

// Глобальная функция инициализации
window.initializeFlowaSurvey = function(retryCount = 0) {
    try {
        console.log('=== Попытка инициализации #' + (retryCount + 1) + ' ===');
        console.log('DOM готов:', document.readyState);
        console.log('URL:', window.location.href);
        console.log('User Agent:', navigator.userAgent);
        
        // Получаем ID опроса
        const params = new URLSearchParams(window.location.search);
        let surveyId = params.get('surveyId');
        
        if (!surveyId) {
            const path = window.location.pathname;
            console.log('Путь:', path);
            const matches = path.match(/\/p\/([^\/]+)\/?$/);
            if (matches && matches[1]) {
                surveyId = matches[1];
                console.log('ID получен из пути:', surveyId);
            }
        } else {
            console.log('ID получен из параметров:', surveyId);
        }
        
        // Проверяем наличие контейнера
        const container = document.getElementById('survey-content');
        console.log('Контейнер найден:', !!container);
        
        if (!container) {
            console.log('DOM структура:', document.documentElement.innerHTML.substring(0, 200));
            if (retryCount < 5) {
                console.log('Повторная попытка через 200мс');
                setTimeout(() => window.initializeFlowaSurvey(retryCount + 1), 200);
            } else {
                console.error('Не удалось найти контейнер после 5 попыток');
            }
            return;
        }
        
        // Отображаем опрос
        if (surveyId) {
            console.log('Отображаем опрос:', surveyId);
            const html = `
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
            container.innerHTML = html;
            console.log('Опрос отображен');
        } else {
            console.log('ID опроса не найден');
            container.innerHTML = '<p>Опрос не найден</p>';
        }
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
};

// Отслеживаем все этапы загрузки страницы
document.addEventListener('readystatechange', (event) => {
    console.log('Состояние DOM изменилось:', document.readyState);
});

// Запускаем сразу
console.log('Запуск первой инициализации');
window.initializeFlowaSurvey();

// И после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded наступил');
    window.initializeFlowaSurvey();
});

// Дополнительная попытка после полной загрузки
window.addEventListener('load', () => {
    console.log('Страница полностью загружена');
    window.initializeFlowaSurvey();
});

// Отслеживаем ошибки
window.onerror = function(msg, url, line, col, error) {
    console.error('=== Ошибка JavaScript ===');
    console.error('Сообщение:', msg);
    console.error('URL:', url);
    console.error('Строка:', line);
    console.error('Колонка:', col);
    console.error('Стек вызовов:', error && error.stack);
    return false;
};

console.log('Загрузка main.js завершена');