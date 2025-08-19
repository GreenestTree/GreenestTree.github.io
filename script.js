let userData = {};

// Переход к следующему шагу
function nextStep(step) {
  const form = document.getElementById(`step${step}`);
  const formData = new FormData(form.querySelector('form'));

  // Валидация
  if (step === 1 && !formData.get('level')) {
    alert('Выберите уровень образования');
    return;
  }

  if (step === 2) {
    const subjects = document.querySelectorAll('input[name="subjects"]:checked');
    if (subjects.length < 3 || subjects.length > 5) {
      alert('Выберите от 3 до 5 предметов');
      return;
    }
    const values = document.querySelectorAll('input[name="values"]:checked');
    if (values.length !== 3) {
      alert('Выберите ровно 3 важных для вас аспекта профессии');
      return;
    }
  }

  // Сохранение данных
  for (let [key, value] of formData.entries()) {
    userData[key] = value;
  }

  // Показ следующего шага
  document.getElementById(`step${step}`).style.display = 'none';
  document.getElementById(`step${step + 1}`).style.display = 'block';

  if (step === 2) generateRecommendations();
  if (step === 3) generateProfileOptions();
}

// Назад
function prevStep(step) {
  document.getElementById(`step${step}`).style.display = 'none';
  document.getElementById(`step${step - 1}`).style.display = 'block';
}

// Генерация рекомендаций (Шаг 3)
function generateRecommendations() {
  const rec = document.getElementById('recommendations');
  rec.innerHTML = '';

  const typeAnswers = [
    userData.type1, userData.type2, userData.type3, userData.type4, userData.type5
  ];
  const counts = { П: 0, Т: 0, Ч: 0, З: 0, Х: 0 };

  typeAnswers.forEach(ans => {
    if (ans) counts[ans]++;
  });

  const max = Math.max(...Object.values(counts));
  const profiles = [];

  if (counts.П >= max) profiles.push('Агротехнологический профиль');
  if (counts.Т >= max) profiles.push('Технологический профиль');
  if (counts.Ч >= max) profiles.push('Социально-экономический профиль');
  if (counts.З >= max) profiles.push('Естественно научный профиль');

  profiles.forEach(p => {
    const div = document.createElement('div');
    div.textContent = p;
    div.onclick = () => selectProfile(p);
    rec.appendChild(div);
  });

  userData.profiles = profiles;
}

// Выбор профиля
function selectProfile(profile) {
  userData.selectedProfile = profile;
  document.querySelectorAll('#recommendations div').forEach(el => el.style.fontWeight = 'normal');
  event.target.style.fontWeight = 'bold';
}

// Генерация направлений (Шаг 4)
function generateProfileOptions() {
  const container = document.getElementById('profileOptions');
  container.innerHTML = '';

  const level = userData.level;
  const profile = userData.selectedProfile || userData.profiles[0];

  const programs = {
    'Естественно научный профиль': {
      '1-8': ['Мастер-классы', 'Научные исследования', 'Экскурсии', 'Подготовительные курсы', 'Олимпиады'],
      '9': ['Агролицей', '36.02.01 Ветеринария', '35.02.05 Агрономия'],
      '11': ['19.03.01 Биотехнология', '35.03.04 Агрономия', '36.03.02 Зоотехния', '36.05.01 Ветеринария'],
      'spo': ['19.03.01 Биотехнология', '35.03.04 Агрономия', '36.03.02 Зоотехния'],
      'vo': ['19.04.01 Биотехнология', '35.04.04 Агрономия', '36.04.02 Зоотехния']
    },
    'Социально-экономический профиль': {
      '1-8': ['Мастер-классы', 'Экскурсии', 'Оценка навыков'],
      '9': ['Агролицей', '38.02.05 Экономика', '40.02.01 Юриспруденция'],
      '11': ['38.03.01 Экономика', '38.03.02 Менеджмент'],
      'spo': ['38.03.01 Экономика', '38.03.02 Менеджмент'],
      'vo': ['38.04.01 Экономика', '38.04.02 Менеджмент']
    },
    'Технологический профиль': {
      '1-8': ['Мастер-классы', 'Экскурсии', 'Конструирование'],
      '9': ['07.02.01 Архитектура', '08.02.01 Строительство', '23.02.03 Автосервис'],
      '11': ['08.03.01 Строительство', '09.03.03 Прикладная информатика', '35.03.06 Агроинженерия'],
      'spo': ['08.03.01 Строительство', '09.03.03 Прикладная информатика'],
      'vo': ['08.04.01 Строительство', '35.04.06 Агроинженерия']
    },
    'Агротехнологический профиль': {
      '1-8': ['Мастер-классы', 'Выращивание растений', 'Экскурсии'],
      '9': ['Агролицей', '35.02.05 Агрономия', '36.02.01 Ветеринария'],
      '11': ['35.03.04 Агрономия', '35.03.07 Переработка продукции', '36.05.01 Ветеринария'],
      'spo': ['35.03.04 Агрономия', '36.03.02 Зоотехния'],
      'vo': ['35.04.04 Агрономия', '36.04.02 Зоотехния']
    }
  };

  const list = programs[profile]?.[level] || ['Информация временно недоступна'];

  list.forEach(prog => {
    const div = document.createElement('div');
    div.textContent = prog;
    container.appendChild(div);
  });
}

// Генерация чек-листа
function generateChecklist() {
  const prof = userData.selectedProfile || userData.profiles[0];
  alert(`Чек-лист сформирован!\nРекомендуемое направление: ${prof}\nИмя: ${userData.name}\nГород: ${userData.city}`);
  // В реальной версии здесь можно сгенерировать PDF или отправить на email
}