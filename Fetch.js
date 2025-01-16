let input = document.getElementById('search') // находим инпут по айди
let datalist = document.createElement('datalist')
datalist.id = `searchDatalist`
let option = document.createElement('option')
bodyDiv.append(datalist)
let addListener = document.getElementById(`searchDatalist`)
let firstTryTest

async function fetchInput() {
 const response = await fetch(`https://api.github.com/search/repositories?q=${input.value}`);
  if (response.ok) { 
    const json = await response.json();

    if (firstTryTest === undefined) {
      json.items.forEach((el, index) => {
        if (index < 5) {
          console.log(el)
          let option = document.createElement('option')
          searchDatalist.append(option)
          option.id = `datalistOption${index}`
          option.innerHTML = el.full_name
          document.getElementById(`datalistOption${index}`)
          function handleInput(event) {
            const selectedValue = event.target.value;
            if (selectedValue === option.innerHTML) {
              console.log('gav');
              event.target.value = null
              let li = document.createElement('li')
              li.classList.add('repositoryBase__element')
              let ul = document.querySelector('.repositoryBase')
              ul.append(li)
              let divName = document.createElement('div')
              divName.classList.add('reposrepositoryBase__name')
              li.append(divName)
              divName.innerHTML = el.name
              let divAuthor = document.createElement('div')
              divAuthor.classList.add('reposrepositoryBase__author')
              divAuthor.innerHTML = el.owner.login
              li.append(divAuthor)
              let divStars = document.createElement('div')
              divStars.classList.add('reposrepositoryBase__stars')
              divStars.innerHTML = el.stargazers_count
              li.append(divStars)
              let svgStar = document.createElement('img')
              svgStar.classList.add('svgStar')
              svgStar.src = 'svgstar.svg'
              divStars.append(svgStar)
              let svgCross = document.createElement('img')
              svgCross.classList.add('svgCross')
              svgCross.src = 'svgcross.svg'
              li.append(svgCross)
              
              svgCross.addEventListener('click', function(event) {
                li.remove()
})
            }
          }
          input.addEventListener('input', handleInput);
        }
      })
      firstTryTest = false // 'это нужно что бы повесить условие на очищение предыдущих опций в даталисте которые остаются после запроса'
      
    }
    else {
      json.items.forEach((el, index) => {
        if (index < 5) {
          let deleteVar = document.getElementById(`datalistOption${index}`) // 'тут мы удаляем опции'
          deleteVar.remove()
          function handleInput(event) {
            const selectedValue = event.target.value;
            if (selectedValue === option.innerHTML) {
              console.log('gav');
              event.target.value = null
              let li = document.createElement('li')
              li.classList.add('repositoryBase__element')
              let ul = document.querySelector('.repositoryBase')
              ul.append(li)
            }
          }
          input.removeEventListener('input', handleInput)
        }
      })
      json.items.forEach((el, index) => {
        if (index < 5) {
          let option = document.createElement('option')
          searchDatalist.append(option)
          option.id = `datalistOption${index}` // 'а тут заново все ставим уже с новыми данными'
          option.innerHTML = el.full_name
          function handleInput(event) {
            const selectedValue = event.target.value;
            if (selectedValue === option.innerHTML) {
              console.log('gav');
              event.target.value = null
              let li = document.createElement('li')
              li.classList.add('repositoryBase__element')
              let ul = document.querySelector('.repositoryBase')
              ul.append(li)
              let divName = document.createElement('div')
              divName.classList.add('reposrepositoryBase__name')
              li.append(divName)
              divName.innerHTML = el.name
              let divAuthor = document.createElement('div')
              divAuthor.classList.add('reposrepositoryBase__author')
              divAuthor.innerHTML = el.owner.login
              li.append(divAuthor)
              let divStars = document.createElement('div')
              divStars.classList.add('reposrepositoryBase__stars')
              divStars.innerHTML = el.stargazers_count
              li.append(divStars)
              let svgStar = document.createElement('img')
              svgStar.classList.add('svgStar')
              svgStar.src = 'svgstar.svg'
              divStars.append(svgStar)
              let svgCross = document.createElement('img')
              svgCross.classList.add('svgCross')
              svgCross.src = 'svgcross.svg'
              li.append(svgCross)
              svgCross.addEventListener('click', function(event) {
                li.remove()
                
  })
            }
          }
          input.addEventListener('input', handleInput);
        }
      })
    }
    
  } else {
    console.log("Ошибка HTTP: " + response.status);
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
input.addEventListener('input', debounce(fetchInput, 1000))  // обработчик событий инпута с дебаунсом
