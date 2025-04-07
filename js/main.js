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
    
    // Загрузка контента опроса
    function loadSurveyContent() {
        const params = getUrlParams();
        const surveyContent = document.getElementById('survey-content');
        
        if (params.surveyId) {
            surveyContent.innerHTML = `<p>Загрузка опроса ID: ${params.surveyId}...</p>`;
            // Здесь в будущем можно добавить загрузку опроса по API
        } else {
            surveyContent.innerHTML = `
                <div class="no-survey">
                    <p>Опрос не найден. Пожалуйста, убедитесь, что вы отсканировали правильный QR код.</p>
                </div>
            `;
        }
    }

    // Инициализация приложения
    loadSurveyContent();
});
