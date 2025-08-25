let travelData = {};

// Fetch JSON
fetch("travel_recommendation_api.json")
  .then(response => response.json())
  .then(data => {
    travelData = data;
    console.log("Data loaded:", travelData);
  })
  .catch(error => console.error("Error loading JSON:", error));


// Function to display results
function displayResults(results) {
  const container = document.getElementById("recommendations");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    `;

    container.appendChild(card);
  });
}


// Normalize keywords
function normalizeKeyword(keyword) {
  keyword = keyword.toLowerCase().trim();

  if (keyword === "beach" || keyword === "beaches") {
    return "beach";
  }
  if (keyword === "temple" || keyword === "temples") {
    return "temple";
  }
  return keyword;
}


// Search button logic
document.querySelector("#search button[type='submit']").addEventListener("click", (e) => {
  e.preventDefault(); // prevent page reload
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const normalized = normalizeKeyword(query);
  let results = [];

  // Beaches
  if (normalized === "beach") {
    results = travelData.beaches?.slice(0, 2) || []; // at least 2
  }
  // Temples
  else if (normalized === "temple") {
    results = travelData.temples?.slice(0, 2) || []; // at least 2
  }
  // Countries
  else {
    travelData.countries?.forEach(country => {
      if (country.name.toLowerCase().includes(normalized)) {
        results = results.concat(country.cities.slice(0, 2)); // at least 2 cities
      } else {
        country.cities.forEach(city => {
          if (city.name.toLowerCase().includes(normalized)) {
            results.push(city);
          }
        });
      }
    });
  }

  displayResults(results);
});


// Clear button logic
document.querySelector("#search button[type='reset']").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("search-input").value = "";
  document.getElementById("recommendations").innerHTML = "";
});
