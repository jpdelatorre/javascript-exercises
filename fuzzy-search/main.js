// TorontoJS Workshop 2016-12-12
// https://www.meetup.com/torontojs/events/234101793/

function loadData(data) {
  const domElement = document.getElementById('data-list');
  domElement.innerHTML = data.length
    ? data.map(item => `<li class="list-group-item">${item}</li>`).join('')
    : '<li class="list-group-item"><em class="text-muted">Nothing to display</em></li>';
}

function fetchData(url, callback) {
  fetch(url)
    .then(response => response.json())
    .then(json => {
      callback(json);
    })
    .catch(error => {
      console.error(error);
    });
}

function proximity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  let one = checkDistance(a, b);
  let two = checkDistance(b, a);

  let reward = one.reward + two.reward;
  let penalty = one.penalty + two.penalty;

  return reward / (reward + penalty);
}

function checkDistance(a, b) {
  let reward = 0;
  let penalty = 0;

  for (let x = 0; x < a.length - 1; x++) {
    for (let y = x + 1; y < a.length; y++) {
      if (~b.indexOf(a.slice(x, y))) {
        reward += (y - x) * 2;
      } else {
        penalty++;
      }
    }
  }

  return { reward, penalty };
}

(() => {
  let data = [];
  let threshold = 0.15;
  fetchData('https://uinames.com/api/?amount=50&region=canada', json => {
    data = json.map(i => `${i.name} ${i.surname}`);
    loadData(data);
  });
  document.getElementById('search-input').addEventListener(
    'input',
    e => {
      let input = e.target.value;
      let dataToLoad;
      if (input.length > 0) {
        let computed = data.map(item => ({
          item: item,
          proximity: proximity(input, item.toLowerCase()),
        }));
        let adjustedThreshold = input.length > 2 ? threshold : threshold - 0.04;
        dataToLoad = computed
          .filter(row => adjustedThreshold <= row.proximity)
          .sort((a, b) => b.proximity - a.proximity)
          .map(row => row.item);
      } else {
        dataToLoad = data;
      }

      loadData(dataToLoad);
    },
    false
  );
})();
