// Создание элементов
const $app = document.getElementById('app');

const $addForm = document.getElementById('add-form');
const $surnameInput = document.getElementById('surname');
const $nameInput = document.getElementById('name');
const $lastnameInput = document.getElementById('lastname');
const $facultyInput = document.getElementById('faculty');
const $birthdayInput = document.getElementById('birth');
const $studyStartInput = document.getElementById('studyStart');
const $formValid = document.getElementById('form-valid');
// eslint-disable-next-line no-unused-vars
const $formBtn = document.getElementById('formBtn');

const $formFilter = document.getElementById('filter-form');
const $fullNameFilter = document.getElementById('filter-form__fullName-inp');
const $facultyFilter = document.getElementById('filter-form__faculty-inp');
const $studyStartFilter = document.getElementById('filter-form__adm-inp');
const $graduateYearFilter = document.getElementById('filter-form__grad-inp');

const $sortFullNameBtn = document.getElementById('sort__fullName');
const $sortFacultyBtn = document.getElementById('sort__faculty');
const $sortDbAgeBtn = document.getElementById('sort__DbAge');
const $sortYearsAndCurseBtn = document.getElementById('sort__yearsAndCurse');

const $table = document.createElement('table');
const $tableHead = document.createElement('thead');
const $tableBody = document.createElement('tbody');

const $tableHeadTr = document.createElement('tr');
const $tableHeadThName = document.createElement('th');
const $tableHeadThFac = document.createElement('th');
const $tableHeadThDB = document.createElement('th');
const $tableHeadThDS = document.createElement('th');
const $tableHeadTHDelete = document.createElement('th');

$table.classList.add('table', 'table-success', 'table-striped');
$tableHeadThName.classList.add('table-head');
$tableHeadThFac.classList.add('table-head');
$tableHeadThDB.classList.add('table-head');
$tableHeadThDS.classList.add('table-head');
$tableHeadTHDelete.classList.add('table-head');

$tableHeadThName.textContent = 'Ф. И. О. студента';
$tableHeadThFac.textContent = 'Факультет';
$tableHeadThDB.textContent = 'Дата рождения и возраст';
$tableHeadThDS.textContent = 'Годы обучения';
$tableHeadTHDelete.textContent = 'Удалить';

$tableHeadThName.append($sortFullNameBtn);
$tableHeadThFac.append($sortFacultyBtn);
$tableHeadThDB.append($sortDbAgeBtn);
$tableHeadThDS.append($sortYearsAndCurseBtn);

$tableHeadTr.append($tableHeadThName);
$tableHeadTr.append($tableHeadThFac);
$tableHeadTr.append($tableHeadThDB);
$tableHeadTr.append($tableHeadThDS);
$tableHeadTr.append($tableHeadTHDelete);

$tableHead.append($tableHeadTr);
$table.append($tableHead);
$table.append($tableBody);

$app.append($table);

// Tr одного пользователя
function createUserTr(oneUser) {
  // Создание пользователя
  const $userTr = document.createElement('tr');
  const $userFullName = document.createElement('th');
  const $userFac = document.createElement('th');
  const $userDbAge = document.createElement('th');
  const $userDS = document.createElement('th');
  const $userDelete = document.createElement('th');
  const $userDeleteBtn = document.createElement('button');

  $userDeleteBtn.classList.add('btn', 'btn-primary', 'btn-delete');

  $userFullName.textContent = oneUser.fullName;
  $userFac.textContent = oneUser.faculty;
  $userDbAge.textContent = oneUser.DbAge;
  $userDS.textContent = oneUser.yearsAndCurse;
  $userDeleteBtn.textContent = 'Удалить';

  $userTr.append($userFullName);
  $userTr.append($userFac);
  $userTr.append($userDbAge);
  $userTr.append($userDS);
  $userTr.append($userDelete);
  $userDelete.append($userDeleteBtn);

  const copyListData = [];
  // Удаление пользователя
  $userDeleteBtn.addEventListener('click', () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Вы уверены?')) {
      // Из таблицы
      $userTr.remove();
      // Из массива
      fetch(`http://localhost:3000/api/students/${oneUser.id}`, {
        method: 'DELETE',
      });
      return;
    }
    // eslint-disable-next-line no-use-before-define
    render(copyListData);
  });
  return $userTr;
}

// Рендер
async function render(copyListData) {
  const response = await fetch('http://localhost:3000/api/students');
  const listData = await response.json();
  // eslint-disable-next-line no-param-reassign
  copyListData = [...listData];
  $tableBody.innerHTML = '';

  // Подготовка
  for (const oneUser of copyListData) {
    oneUser.fullName = `${oneUser.surname} ${oneUser.name} ${oneUser.lastname}`;

    // eslint-disable-next-line max-len
    oneUser.age = Math.round((new Date() - (new Date(oneUser.birthday))) / (1000 * 60 * 60 * 24 * 365.25));

    let userDateBirth = `${new Date(oneUser.birthday).getDate()}`;
    if (userDateBirth < 10) {
      userDateBirth = `${0 + userDateBirth}`;
    }
    let userMonthBirth = String(new Date(oneUser.birthday).getMonth() + 1);
    if (userMonthBirth < 10) {
      userMonthBirth = `${0 + userMonthBirth}`;
    }
    const userYearBirth = String(new Date(oneUser.birthday).getFullYear());
    oneUser.DbAge = `${userDateBirth}.${userMonthBirth}.${userYearBirth} (${oneUser.age} лет)`;

    const today = 1970 + Number(Date.now()) / (1000 * 60 * 60 * 24 * 365.25);
    oneUser.dateOfIssue = Number(oneUser.studyStart) + 4.75;
    let curse = null;
    if (today >= oneUser.dateOfIssue) {
      curse = ' (закончил)';
    } else {
      curse = ` (${Math.round(Number(today - oneUser.studyStart))} курс)`;
    }
    oneUser.yearsAndCurse = `${oneUser.studyStart} - ${Math.floor(oneUser.dateOfIssue)}${curse}`;
  }

  // Сортировка
  // eslint-disable-next-line no-param-reassign
  copyListData = copyListData.sort((a, b) => {
    // eslint-disable-next-line no-use-before-define
    let sort = a[sortColumnFlag] < b[sortColumnFlag];
    // eslint-disable-next-line no-use-before-define
    if (sortDirFlag === false) {
      // eslint-disable-next-line no-use-before-define
      sort = a[sortColumnFlag] > b[sortColumnFlag];
    }
    if (sort) return -1;
  });

  // Фильтрация
  if ($fullNameFilter.value.trim() !== '') {
    // eslint-disable-next-line no-param-reassign
    copyListData = copyListData.filter((oneUser) => {
      if (oneUser.fullName.includes($fullNameFilter.value)) {
        return true;
      }

      // Если true - элемент добавляется к результату, и перебор продолжается
      // Если ничего не найдено - возвращается пустой массив
    });
  }

  if ($facultyFilter.value.trim() !== '') {
    // eslint-disable-next-line no-param-reassign
    copyListData = copyListData.filter((oneUser) => {
      if (oneUser.faculty.includes($facultyFilter.value)) {
        return true;
      }

      // Если true - элемент добавляется к результату, и перебор продолжается
      // Если ничего не найдено - возвращается пустой массив
    });
  }

  if ($studyStartFilter.value.trim() !== '') {
    // eslint-disable-next-line no-param-reassign
    copyListData = copyListData.filter((oneUser) => {
      if (oneUser.studyStart.includes($studyStartFilter.value)) {
        return true;
      }

      // Если true - элемент добавляется к результату, и перебор продолжается
      // Если ничего не найдено - возвращается пустой массив
    });
  }

  if ($graduateYearFilter.value.trim() !== '') {
    // eslint-disable-next-line no-param-reassign
    copyListData = copyListData.filter((oneUser) => {
      if (String(oneUser.dateOfIssue)
        .includes($graduateYearFilter.value)) {
        return true;
      }

      // Если true - элемент добавляется к результату, и перебор продолжается
      // Если ничего не найдено - возвращается пустой массив
    });
  }

  // Отрисовка
  for (const oneUser of copyListData) {
    const $newTr = createUserTr(oneUser);
    $tableBody.append($newTr);
  }
}
render();

// Добавление
$addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  // Валидация

  if ($surnameInput.value.trim() === '') {
    $formValid.textContent = 'Фамилия не введена';
    return;
  }

  if ($nameInput.value.trim() === '') {
    $formValid.textContent = 'Имя не введено';
    return;
  }

  if ($lastnameInput.value.trim() === '') {
    $formValid.textContent = 'Отчество не введено';
    return;
  }

  if ($facultyInput.value.trim() === '') {
    $formValid.textContent = 'Факультет не введен';
    return;
  }

  if ($birthdayInput.value.trim() === '') {
    $formValid.textContent = 'Дата рождения не указана';
    return;
  }

  // eslint-disable-next-line max-len
  if ($birthdayInput.valueAsDate < (new Date(1900, 0, 1)) || $birthdayInput.valueAsDate > (new Date())) {
    $formValid.textContent = 'Неправильно указана дата рождения';
    return;
  }

  if ($studyStartInput.value.trim() === '') {
    $formValid.textContent = 'Дата поступления не указана';
    return;
  }

  // eslint-disable-next-line max-len,radix
  if (parseInt($studyStartInput.value) < Number(new Date(2000, 0, 1).getFullYear()) || parseInt($studyStartInput.value) > Number(new Date().getFullYear())) {
    $formValid.textContent = 'Неправильно указан год поступления';
    return;
  }

  // Добавление в массив
  const response = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      surname: $surnameInput.value.trim(),
      name: $nameInput.value.trim(),
      lastname: $lastnameInput.value.trim(),
      birthday: $birthdayInput.valueAsDate,
      // eslint-disable-next-line radix
      studyStart: parseInt($studyStartInput.value),
      faculty: $facultyInput.value.trim(),
    }),
  });
  // eslint-disable-next-line no-unused-vars
  const listData = await response.json();

  await render();

  event.target.reset();
});

let sortColumnFlag = 'fullName';
let sortDirFlag = true;
// Клики сортировки
$sortFullNameBtn.addEventListener('click', () => {
  sortColumnFlag = 'fullName';
  sortDirFlag = !sortDirFlag;
  render();
});
$sortFacultyBtn.addEventListener('click', () => {
  sortColumnFlag = 'faculty';
  sortDirFlag = !sortDirFlag;
  render();
});
$sortDbAgeBtn.addEventListener('click', () => {
  sortColumnFlag = 'age';
  sortDirFlag = !sortDirFlag;
  render();
});
$sortYearsAndCurseBtn.addEventListener('click', () => {
  sortColumnFlag = 'yearsAndCurse';
  sortDirFlag = !sortDirFlag;
  render();
});

// Фильтр
// Добавление
$formFilter.addEventListener('submit', (event) => {
  event.preventDefault();
});

$fullNameFilter.addEventListener('input', () => {
  render();
});
$facultyFilter.addEventListener('input', () => {
  render();
});
$studyStartFilter.addEventListener('input', () => {
  render();
});
$graduateYearFilter.addEventListener('input', () => {
  render();
});
