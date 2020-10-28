let container = document.getElementsByClassName('container')[0]
let card = document.createElement('div')
let home = document.getElementById('home')
let addQuote = document.getElementById('add_quote')

const BASE_URL = 'http://localhost:8000/api/v1/';
const url_detail = 'http://localhost:8000/api/v1/quote/'
const url_rating = 'http://localhost:8000/api/v1/rating/'

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


async function makeRequest(url, method='GET', data=undefined) {
    let opts = {method, headers: {}};

    if (!csrfSafeMethod(method))
        opts.headers['X-CSRFToken'] = getCookie('csrftoken');

    if (data) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
    }

    let response = await fetch(url, opts);

    if (response.ok) {  // нормальный ответ
        return await response.json();
    } else {            // ошибка
        console.log(response.statusText);
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}


async function getHome(){
    let data = await fetch(url_detail)
        .then(response => response.json());
    card.innerHTML=''
    for (let i = 0; i < data.length; i++){
        card.innerHTML+=(`<div class="card mt-2">
                        <div class="card-body">
                        <p class="card-text">${data[i].text}</p>
                        <p class="card-text">${data[i].author}</p>
                        <p class="card-text">Рейтинг: ${data[i].rating}</p>
                        <p class="btn btn-primary" id="${data[i].id}"> Просмотр</p>
<!--                        <p class="btn btn-primary" id="${data[i].id}"> Удалить</p>-->
<!--                        <a href="#" class="btn btn-primary" id="">${data[i].id}</a>-->
                        </div>
                        </div>
                        `)
    }
    container.append(card)
        let button = document.getElementsByClassName('btn btn-primary')
    for (let i = 0; i < button.length; i++){
        button[i].onclick = function () {getDetail(button[i].id)

        }
    }
}

async function getForm(){
    card.innerHTML= '<div class="card mt-2 p-5">' +
        '<form><p class="card-text"><b>Создания Цитаты</b></p> ' +
        '<p class="card-text"><span>Введите текст: </span> <textarea id="text" cols="30" rows="10"></textarea><Br> ' +
        '<span>Введите Имя: </span> <input class="mb-1" type="text" id="author"><Br> ' +
        '<span>Введите Email: </span> <input class="mb-1" type="email" id="email"><Br> ' +
        '<p class="btn btn-primary" id="submit_add">Добавить</p> ' +
        '</form>' +
        '</div>'
    container.append(card)
    let submit_add=document.getElementById("submit_add")
    submit_add.onclick=async function () {
        let text = document.getElementById('text');
        let author = document.getElementById('author')
        let email = document.getElementById('email');
        let dataForm = {'text':text.value,'author':author.value,'email':email.value}
        try{
            let request= await makeRequest(url_detail,"POST",dataForm)
            alert('Созданна цитата')
            await getHome()
        }
        catch (e) {
            alert(e.message)

            console.log(e);
        }

        // if (request.id > 0){
        //     let mesage = document.createElement("div")
        //     mesage.innerHTML=`<div class="card">
        //                         <p>Цитата успешна созданна</p></div>`
        //     container.insertAdjacentHTML(afterbegin,mesage);}
        // else (console.log(request.response))
    }
}

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
                        <a href="http://localhost:8000/" id="back_home" class="btn btn-secondary">Назад</a>
                        </div>
                        </div>
                        `)
    container.append(card)
    let backHome= document.getElementById('back_home')
    backHome.onclick = async function(event){
        event.preventDefault()
        await getHome()
    }
    let button = document.getElementsByClassName('btn btn-primary')
    for (let i = 0; i < button.length; i++){
        button[i].onclick = function () {getRating(button[i].id, button[i].dataset.target)
        }
    }
}


async function onLoad() {
    await getHome()
    home.onclick = async function(event){
        event.preventDefault()
        await getHome()
    }
    addQuote.onclick = async function (event) {
        event.preventDefault()
        await getForm()
    }
}
window.addEventListener('load', onLoad);