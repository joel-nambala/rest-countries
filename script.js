'use strict';

// Select DOM Elements
const formLabel = document.querySelector('.form-label');
const formInput = document.querySelector('.form-input');
const results = document.querySelector('.results');
const filterRegion = document.querySelector('.filter');
const regionDOM = document.getElementById('region');

// Function to format numbers
const numberFormatter = number => new Intl.NumberFormat('en-US').format(number);

// Function to display results to the user interface
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

// Function to display the selection category HTML
const displayFilterSelection = function (region) {
  const html = `<option value="${region}">${region}</option>`;

  regionDOM.insertAdjacentHTML('beforeend', html);
};

// Function to request countries data from an API
const searchCountries = async function (query) {
  // Clear the results container
  results.innerHTML = '';
  try {
    const search = query === 'all' ? 'all' : `/name/${query}`;

    // Fetch the result from the external API
    const response = await fetch(`https://restcountries.com/v3.1/${search}`);

    // Convert the response into a JSON format
    const result = await response.json();

    // Get all the regions from the API
    const regions = result
      .reduce(function (acc, cur, i, arr) {
        if (!acc.includes(cur.region)) acc.push(cur.region);
        return acc;
      }, [])
      .sort();

    // Loop over the regions array
    regions.forEach(function (region, i, arr) {
      // Call the disply filter selection function
      displayFilterSelection(region);
    });

    // Add an event listener to the filter btn
    filterRegion.addEventListener('click', function (e) {
      results.innerHTML = '';
      const query = e.target.value;
      if (query === '') {
        result.forEach(function (country, i, arr) {
          // Call the displayCountries function
          displayCountries(country);
        });
      }

      result
        .filter(function (reg) {
          return reg.region === query;
        })
        .forEach(function (reg) {
          displayCountries(reg);
        });
    });

    // Loop over the result
    result.forEach(function (country, i, arr) {
      // Call the displayCountries function
      displayCountries(country);
    });
  } catch (error) {
    console.log(error);
  }
};

// An event listener to the form element
formLabel.addEventListener('submit', function (e) {
  // Prevent the default behaviour
  e.preventDefault();

  // Get the search result
  const searchResult = formInput.value;
  if (searchResult === '') return;

  // Pass the search result into the asynchronous function
  searchCountries(searchResult);

  // Clear the input fields
  formInput.value = '';
});

// An event listener to the window
window.addEventListener('load', function () {
  searchCountries('all');
});
