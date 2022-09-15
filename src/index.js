import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
let debounce = require('lodash.debounce');
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryName = document.querySelector('#search-box');

countryName.addEventListener('input', debounce(onCountryName, DEBOUNCE_DELAY));

let searchCountryName = '';
Notiflix.Notify.warning('Enter letters from country name');
function onCountryName(event) {
  searchCountryName = event.target.value;
  searchCountryName = searchCountryName.trim();
  if (searchCountryName !== '') {
    fetchCountries(searchCountryName)
      .then(renderCountryList)
      .then()
      .catch(error => {
        renderCountryList('');
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  } else renderCountryList(searchCountryName);
}

function renderCountryList(users) {
  //   console.log('Кол-во стран ==> ', users.length);
  if (users.length === 0) {
    // Notiflix.Notify.warning('Enter letters from ciuntry name');
    const markup = `<p class="country-title"> </p>`;
    countryList.innerHTML = markup;
    return;
  }

  if (users.length > 10) {
    const markup = `<p class="country-title"> </p>`;
    countryList.innerHTML = markup;
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }

  if (users.length > 1 && users.length <= 10) {
    const markup = users
      .map(user => {
        return `<p class="country-title">
        <img width="30" height="20" src="${user.flags.svg}" 
            alt="Flags ${user.name.common} "> ${user.name.common}
        </p>`;
      })
      .join('');
    countryList.innerHTML = markup;
  }

  if (users.length === 1) {
    Notiflix.Notify.success('One match found for your search');
    const markup = users
      .map(user => {
        return `<p class="country-title">
        <img width="30" height="20" src="${user.flags.svg}" 
            alt="Flags ${user.name.common} "> ${user.name.common}
        </p><p><b>Capital</b>: ${user.capital}</p>
        <p><b>Population</b>: ${user.population}</p>
        <p><b>Languages</b>: ${Object.values(user.languages).join(', ')}</p>`;
      })
      .join('');
    countryList.innerHTML = markup;
  }
}
