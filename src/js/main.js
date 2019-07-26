"use strict";

// service worker registration - remove if you're not going to use it

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('serviceworker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// place your code below
const URI = "https://api.github.com";
const button = document.querySelector('.button');
const input = document.querySelector('.input');
const loader = document.querySelector('.lds-roller');
const wrapper = document.querySelector('.wrapper');
const content = document.querySelector('.content')

button.addEventListener('click', () => {
  if (input.value != "") {
    while (content.children.length > 2) {
      content.removeChild(content.lastChild);
    }
    loader.classList.remove('lds-roller--invisible');
    setTimeout(() => {
      getUser(input.value);
      loader.classList.add('lds-roller--invisible');
    }, 300);
  }
  else {
    wrapper.classList.add('wrapper__shake');
  }
})

wrapper.addEventListener('animationend', (e) => {
  wrapper.classList.remove('wrapper__shake')
})

function getUser(username) {
  fetch(`${URI}/users/${username}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        wrapper.classList.add('wrapper__shake');
        throw new Error("Nie znaleziono użytkownika!");
      }
    })
    .then(response => {
      // Fill profile
      console.log(response);

      let profile = document.createElement('section');
      profile.classList = 'profile';

      let img = document.createElement('img');
      img.classList = 'profile__img';
      img.src = response.avatar_url;


      let profileInfo = document.createElement('div');
      profileInfo.classList = 'profile__info';
      let profileName = document.createElement('h2');
      profileName.classList = 'profile__name';
      profileName.innerHTML = response.login;
      profileInfo.appendChild(profileName);




      // Appending
      profile.appendChild(img);
      profile.appendChild(profileInfo);

      content.appendChild(profile);

      profileName.innerHTML = response.login;
      return fetch(`${URI}/users/${username}/repos`);
    })
    .then(secondResponse => secondResponse.json())
    .then(secondResponse => {
      console.log(secondResponse);

      // Creating repos

      let repos = document.createElement('div');
      let repos__wrapper = document.createElement('div');
      repos__wrapper.classList = 'repos__wrapper';
      if (secondResponse.length > 0) {
        let filter = document.createElement('input');
        filter.type = 'text';
        filter.classList = 'filter';
        filter.placeholder = 'Search repository...'
        filter.addEventListener('keyup', filterRepos);
        repos__wrapper.appendChild(filter);
        for (let item in secondResponse) {
          let repo = document.createElement('div');
          repo.classList = 'repo';
          let repoTitle = document.createElement('a');
          repoTitle.href = secondResponse[item].html_url;
          repoTitle.classList = 'repo__title';
          repoTitle.innerHTML = secondResponse[item].name;
          repo.appendChild(repoTitle);
          repos.classList = 'repos';
          repos.appendChild(repo);
          repos__wrapper.appendChild(repos);
        }
        document.querySelector('.profile').appendChild(repos__wrapper);
      }



    })
    .catch(err => { console.dir(err) })
}

function filterRepos(e) {
  var listItems = document.querySelectorAll('.repo');
  Array.from(listItems).forEach(item => {
    if (item.innerText.toLowerCase().includes(e.target.value.toLowerCase()))
      item.style.display = 'block';
    else {
      item.style.display = 'none';
    }
  });
}