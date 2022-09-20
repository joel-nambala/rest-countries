'use strict';

// Select DOM Elements
const formLabel = document.querySelector('.form-label');
const formInput = document.querySelector('.form-input');
const results = document.querySelector('.results');

const numberFormatter = number => new Intl.NumberFormat('en-US').format(number);

const displayCountries = function (country) {
  const html = `
      <div class="card">
        <img src="${country.flags.png}" alt="${
    country.name.common
  } flag" class="card-img" />
        <div class="card-details">
          <h2 class="card-name">${country.name.common}</h2>
          <p class="card-population">
            <span class="card-population-span">Population</span> : ${numberFormatter(
              country.population
            )}
          </p>
          <p class="card-region">
            <span class="card-redion-span">Region</span> : ${country.region}
          </p>
          <p class="card-city">
            <span class="card-capital-span">Capital</span> : ${
              country.capital ? country.capital : country.name.common
            }
          </p>
        </div>
      </div>
    `;

  results.insertAdjacentHTML('afterbegin', html);
};

const searchCountries = async function (query) {
  results.innerHTML = '';
  try {
    const search = query === 'all' ? 'all' : `/name/${query}`;
    const response = await fetch(`https://restcountries.com/v3.1/${search}`);
    const result = await response.json();

    result.forEach(function (country, i, arr) {
      displayCountries(country);
    });
  } catch (error) {
    console.log(error);
  }
};

formLabel.addEventListener('submit', function (e) {
  e.preventDefault();

  const searchResult = formInput.value;
  if (searchResult === '') return;
  searchCountries(searchResult);

  formInput.value = '';
});

window.addEventListener('load', function () {
  searchCountries('all');
});
