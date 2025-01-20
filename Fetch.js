const input = document.getElementById('search') // находим инпут по айди
const datalist = document.createElement('datalist')
datalist.id = 'searchDatalist'
bodyDiv.append(datalist)
// fetch function
async function fetchInput() {
  if (input.value !== '') {
  removeOptions()
  const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`)
  const jsonResponse = await response.json()
  jsonResponse.items.forEach((object, index) => {
    if (index < 5) {
      addOptions(object, index)  // тут добавляем варианты в даталист
    }  
  })  
  input.oninput = () => listener(jsonResponse); 
  }
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
    li.append(divName, divAuthor, divStars, svgCross)
    divStars.append(svgStar)

    svgCross.addEventListener('click', function(event) { // удаление карточки на крестик
      li.remove()
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
    if (document.getElementById(`datalistOption${index}`).innerHTML === input.value) {
      handleInput(jsonResponse.items[index])
      input.value = null 
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
