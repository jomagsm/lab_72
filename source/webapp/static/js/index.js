let container = document.getElementsByClassName('container')[0]
let card = document.createElement('div')
console.log(container)

url_detail = 'http://localhost:8000/api/v1/quote/'
url_rating = 'http://localhost:8000/api/v1/rating/'

async function getRating(id,target){
    let data = await fetch(`${url_rating}${id}/${target}/`).then(response => response.json());
    let rating = document.getElementById('rating')
    rating.innerText= `Рейтинг: ${data.rating}`
}

async function getDetail(id){
    let data = await fetch(`${url_detail}${id}/`).then(response => response.json());
    card.innerHTML=(`<div class="card mt-2">
                        <div class="card-body">
                        <p class="card-text">${data.text}</p>
                        <p class="card-text">Автор: ${data.author}</p>
                        <p class="card-text" id="rating">Рейтинг: ${data.rating}
                        <p class="btn btn-primary" id="${data.id}" data-target="+">+</p>
                        <p class="btn btn-primary" id="${data.id}" data-target="-">-</p></p>
                        <p class="card-text"> Статус: ${data.status_display}</p>
<!--                        <p class="btn btn-primary" id="${data.id}"> Просмотр</p>-->
                        <a href="http://localhost:8000/" class="btn btn-secondary">Назад</a>
                        </div>
                        </div>
                        `)
    container.append(card)
    let button = document.getElementsByClassName('btn btn-primary')
    // console.log(button)
    for (let i = 0; i < button.length; i++){
        button[i].onclick = function () {getRating(button[i].id, button[i].dataset.target)
        }
    }


    // weather.innerHTML=('')
    // for (let i = 1; i < 8; i++){
    //     weather.innerHTML+=(`<button type="button" class="btn btn-secondary m-1 ${i}">День ${i}</button>`)
    // }
    // card.append(weather)
}




async function onLoad() {
    let data = await fetch('http://localhost:8000/api/v1/quote/')
        .then(response => response.json());
    console.log(data)
    for (let i = 0; i < data.length; i++){
        card.innerHTML+=(`<div class="card mt-2">
                        <div class="card-body">
                        <p class="card-text">${data[i].text}</p>
                        <p class="card-text">${data[i].author}</p>
                        <p class="btn btn-primary" id="${data[i].id}"> Просмотр</p>
<!--                        <a href="#" class="btn btn-primary" id="">${data[i].id}</a>-->
                        </div>
                        </div>
                        `)
    }
    // console.log(card)
    container.append(card)
    let button = document.getElementsByClassName('btn btn-primary')
    for (let i = 0; i < button.length; i++){
        button[i].onclick = function () {getDetail(button[i].id)

        }
    }
    console.log(button)
    // console.log(container)
    console.log(data)

    // if(weather.innerHTML===''){
    //     getData(data,0)}
    // let button = document.getElementsByClassName('btn btn-primary m-1')
    // for (let i = 0; i < 8; i++){
    //      button[i].onclick = function(){getData(data,button[i].dataset.direction)}

}
window.addEventListener('load', onLoad);

// <div class="card">
//   <h5 class="card-header">Featured</h5>
//   <div class="card-body">
//     <h5 class="card-title">Special title treatment</h5>
//     <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
//     <a href="#" class="btn btn-primary">Go somewhere</a>
//   </div>
// </div>