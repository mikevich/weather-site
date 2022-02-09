const getWeather = (input) => {
    fetch(`/weather?address=${input}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            if (data.error) {
                results.textContent = '';
                error.textContent = data.error;
            }
            results.textContent = data.result;
        })
};


const form = document.querySelector('form');
const input = document.querySelector('input');
const results = document.querySelector('#results');
const error = document.querySelector('#error');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    results.textContent = "Loading...";
    error.textContent = '';

    const location = input.value;
    getWeather(location);
})