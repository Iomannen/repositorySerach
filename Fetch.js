const input = document.getElementById('search') // находим инпут по айди
const datalist = document.createElement('datalist')
datalist.id = 'searchDatalist'
bodyDiv.append(datalist)
const spinner = document.getElementById('spinner');
addCardFromLocalStorage() // функция добавляющая карточки из хранилища
let abortController = null; 
// fetch function
async function fetchInput() {
  if (input.value !== '') {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    const signal = abortController.signal;
  
    hideTooltip();
    removeOptions();
    spinner.style.display = 'block';
    const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`, { signal });
    console.log(response);
    const jsonResponse = await response.json();
    if (jsonResponse.total_count === 0) { // проверка указывающая на ненаход
      showTooltip();
    }
    spinner.style.display = 'none';
    jsonResponse.items.forEach((object, index) => {
      if (index < 5) {
        addOptions(object, index)  // тут добавляем варианты в даталист
      }  
    })  
    input.oninput = () => listener(jsonResponse);
  } else removeOptions()
}

function addOptions(object, index) {
  const option = document.createElement('option')
  searchDatalist.append(option)
  option.id = `datalistOption${index}`
  option.innerHTML = object.full_name
  document.getElementById(`datalistOption${index}`)
}
function handleInput(object) {
    

    let li = document.createElement('li')
    li.classList.add('repositoryBase__element')
    let ul = document.querySelector('.repositoryBase')

    let hiddenFullName = document.createElement('div')
    hiddenFullName.classList.add('hiddenFullName')
    hiddenFullName.innerHTML = object.full_name

    let divName = document.createElement('div')
    divName.classList.add('reposrepositoryBase__name')
    divName.innerHTML = object.name

    let divAuthor = document.createElement('div')
    divAuthor.classList.add('reposrepositoryBase__author')
    divAuthor.innerHTML = object.owner.login

    let divStars = document.createElement('div')
    divStars.classList.add('reposrepositoryBase__stars')
    divStars.innerHTML = object.stargazers_count

    let svgStar = document.createElement('img')
    svgStar.classList.add('svgStar')
    svgStar.src = 'svgstar.svg'
 
    let svgCross = document.createElement('img')
    svgCross.classList.add('svgCross')
    svgCross.src = 'svgcross.svg'
    ul.append(li)
    li.append(divName, divAuthor, divStars, svgCross, hiddenFullName)
    divStars.append(svgStar);
    if (object.full_name !== undefined) { // этa костыльная проверка позволяет не создавать лишнюю карточку функцией addCardFromLocalStorage()
      localStorage.setItem(`${object.full_name}`, `${object.name}\n${object.owner.login}\n${object.stargazers_count}`)
    }
    svgCross.addEventListener('click', function(event) { // удаление карточки на крестик
      li.remove()
      localStorage.removeItem(`${hiddenFullName.innerHTML}`)
})
}
function removeOptions() { // функция которая удаляет опции из дата листа, используется после того как мы добавляем карточку в список добавленных
  for (let index = 0; index < 5; index++) {
    if (document.getElementById(`datalistOption${index}`) !== null) {
      document.getElementById(`datalistOption${index}`).remove()
    }
  }
}
function listener(jsonResponse) {
  for (let index = 0; index < 5; index++) {
    if(document.getElementById(`datalistOption${index}`) !== null) {
      if (document.getElementById(`datalistOption${index}`).innerHTML === input.value) {
        handleInput(jsonResponse.items[index])
        input.value = null 
      } 
    }
  }
}

function debounce(func, ms) { // просто дебаунс
  let timeout;
  return function() {
    clearTimeout(timeout);
    try {
      timeout = setTimeout(() => func.apply(this, arguments), ms);
    }
    catch (e) {
      console.log(e)
    }
  };
}
input.addEventListener('input', debounce(fetchInput, 1000)) 

function addCardFromLocalStorage() {
const keys = Object.keys(localStorage); // тут перебор локалстореджа 
for (let key of keys) {              // тут перебор локалстореджа 
const localStorageValue = `${localStorage.getItem(key)}`.split(`\n`, 3) // тут мы разибваем строку получаемую в хранилище и превращаем ее в массив
const obj = {
  owner: {
    login: localStorageValue[1]     // создаем обьект с которым вызовем handleInput(obj), именно в таком формате для совемстимости
  },
  name: localStorageValue[0],         // создаем обьект с которым вызовем handleInput(obj), именно в таком формате для совемстимости
  stargazers_count: localStorageValue[2],    // создаем обьект с которым вызовем handleInput(obj), именно в таком формате для совемстимости
  full_name: key // передаем фул нейм что бы в функции handleInput(obj) в обработчике крестика удалять из localStorage репозиторий
} 
handleInput(obj)    // вызываем просто функцию которая добавляет карточку
}
}

function showTooltip() {
  const tooltip = document.getElementById('tooltip')
  tooltip.style.visibility = 'visible'
  tooltip.style.opacity = '1'
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip')
  tooltip.style.visibility = 'hidden'
  tooltip.style.opacity = '0'
}
