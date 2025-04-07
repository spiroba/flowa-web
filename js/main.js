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

// Простая функция для отображения опроса
function showSurvey() {
    console.log('Вызвана функция showSurvey');
    try {
        const container = document.getElementById('survey-content');
        console.log('Контейнер найден:', !!container);
        
        if (container) {
            const params = new URLSearchParams(window.location.search);
            const surveyId = params.get('surveyId') || 'DEMO';
            console.log('ID опроса:', surveyId);
            
            container.innerHTML = `
                <div class="survey-header">
                    <h3>Тестовый опрос #${surveyId}</h3>
                </div>
                <div class="survey-questions">
                    <div class="question">
                        <p>Работает ли опрос?</p>
                        <button onclick="alert('Да, работает!')">Да</button>
                    </div>
                </div>
            `;
            console.log('Опрос отображен');
        }
    } catch (error) {
        console.error('Ошибка:', error);
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