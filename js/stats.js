// Получаем доступ к Firestore
const db = firebase.firestore();

// Глобальные переменные для графиков
let ratingChart = null;
let recommendationChart = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadSurveyList();
    loadStats('DEMO');
    
    // Обработчик изменения выбранного опроса
    document.getElementById('surveySelect').addEventListener('change', function(e) {
        loadStats(e.target.value);
    });
});

// Загрузка списка опросов
function loadSurveyList() {
    db.collection('surveys').get()
        .then((querySnapshot) => {
            const select = document.getElementById('surveySelect');
            querySnapshot.forEach((doc) => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = doc.data().title || `Опрос #${doc.id}`;
                select.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Ошибка при загрузке списка опросов:', error);
        });
}

// Загрузка статистики для выбранного опроса
function loadStats(surveyId) {
    db.collection('responses')
        .where('surveyId', '==', surveyId)
        .get()
        .then((querySnapshot) => {
            const responses = [];
            querySnapshot.forEach((doc) => {
                responses.push(doc.data());
            });
            updateCharts(responses);
            updateFeedbackList(responses);
        })
        .catch((error) => {
            console.error('Ошибка при загрузке статистики:', error);
        });
}

// Обновление графиков
function updateCharts(responses) {
    // Подготовка данных для графика оценок
    const ratings = [0, 0, 0, 0, 0];
    responses.forEach(response => {
        if (response.q1) {
            ratings[parseInt(response.q1) - 1]++;
        }
    });
    
    // Обновление графика оценок
    if (ratingChart) {
        ratingChart.destroy();
    }
    const ratingCtx = document.getElementById('ratingChart').getContext('2d');
    ratingChart = new Chart(ratingCtx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                label: 'Количество оценок',
                data: ratings,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Подготовка данных для графика рекомендаций
    const recommendations = {
        'yes': 0,
        'no': 0,
        'maybe': 0
    };
    responses.forEach(response => {
        if (response.q3) {
            recommendations[response.q3]++;
        }
    });
    
    // Обновление графика рекомендаций
    if (recommendationChart) {
        recommendationChart.destroy();
    }
    const recommendationCtx = document.getElementById('recommendationChart').getContext('2d');
    recommendationChart = new Chart(recommendationCtx, {
        type: 'pie',
        data: {
            labels: ['Да', 'Нет', 'Возможно'],
            datasets: [{
                data: [
                    recommendations.yes,
                    recommendations.no,
                    recommendations.maybe
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 206, 86, 0.5)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Обновление списка отзывов
function updateFeedbackList(responses) {
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';
    
    responses.forEach(response => {
        if (response.q2 && response.q2.trim()) {
            const feedback = document.createElement('div');
            feedback.className = 'feedback-item';
            
            const rating = document.createElement('div');
            rating.className = 'feedback-rating';
            rating.textContent = `Оценка: ${response.q1 || 'Не указана'}`;
            
            const text = document.createElement('div');
            text.className = 'feedback-text';
            text.textContent = response.q2;
            
            const date = document.createElement('div');
            date.className = 'feedback-date';
            date.textContent = response.timestamp ? new Date(response.timestamp.toDate()).toLocaleString() : 'Недавно';
            
            feedback.appendChild(rating);
            feedback.appendChild(text);
            feedback.appendChild(date);
            
            feedbackList.appendChild(feedback);
        }
    });
    
    if (feedbackList.children.length === 0) {
        feedbackList.innerHTML = '<div class="no-feedback">Пока нет отзывов</div>';
    }
} 