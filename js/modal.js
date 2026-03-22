let age = document.getElementById('age');

function showUser(surname, name) {
  alert('Пользователь ' + surname + ' ' + name);
}

showUser.apply(age, ['Рытик', 'Алина']);
