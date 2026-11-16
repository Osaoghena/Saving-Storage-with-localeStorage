const trailList = document.getElementById("trail-list");
const savedList = document.getElementById("saved-list");
const savedCount = document.getElementById("saved-count");
const trailCount = document.getElementById("trail-count");

//load saved IDs from localStorage
let savedTrailIds = JSON.parse(
  localStorage.getItem("savedTrails")
) || [];

let trails = [];

//load trail dataset
async function loadTrails() {
  try {
    const response = await fetch("trails.json");

    if (!response.ok) {
      throw new Error("Could not load trails.");
    }

    trails = await response.json();

    renderPage();
  } catch (error) {
    console.error(error);

    trailList.innerHTML =
      '<p class="empty-message">Unable to load trails. Please check that trails.json is available.</p>';
  }
}

//get an icon for each difficulty
function getTrailIcon(difficulty) {
  if (difficulty === "Easy") return "";
  if (difficulty === "Moderate") return "";
  return "️";
}

//creates trail card
function createTrailCard(trail) {
  const isSaved = savedTrailIds.includes(trail.id);

  return `
    <article class="trail-card" data-id="${trail.id}">
      <div class="card-top">
        <span class="trail-icon">
          ${getTrailIcon(trail.difficulty)}
        </span>

        <span class="difficulty ${trail.difficulty.toLowerCase()}">
          ${trail.difficulty}
        </span>
      </div>

      <h3>${trail.name}</h3>

      <p class="park-name"> ${trail.park}</p>

      <div class="card-details">
        <span class="distance">
           ${trail.miles} miles
        </span>

        <button
          class="save-btn ${isSaved ? "saved" : ""}"
          type="button"
          aria-pressed="${isSaved}"
        >
          ${isSaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </article>
  `;
}

//renders the entire page from the saved array
function renderPage() {

  //display all trails
  trailList.innerHTML = trails
    .map(createTrailCard)
    .join("");

  //filters trails using saved IDs
  const savedTrails = trails.filter(trail =>
    savedTrailIds.includes(trail.id)
  );

  //update saved count
  savedCount.textContent = `Saved: ${savedTrailIds.length}`;

  //displays the saved trails or empty message
  if (savedTrails.length === 0) {
    savedList.innerHTML = `
      <p class="empty-message">
        No saved trails yet. Find a trail you love!
      </p>
    `;
  } else {
    savedList.innerHTML = savedTrails
      .map(createTrailCard)
      .join("");
  }

  //update total trail count
  trailCount.textContent = `${trails.length} Trails`;
}

//event delegation: one listener for the entire trail list
trailList.addEventListener("click", function(event) {

  const button = event.target.closest(".save-btn");

  if (!button) return;

  const card = button.closest(".trail-card");

  if (!card) return;

  const trailId = Number(card.dataset.id);

  if (savedTrailIds.includes(trailId)) {

    //remove the trail from saved array
    savedTrailIds = savedTrailIds.filter(
      id => id !== trailId
    );

  } else {

    //add the trail to saved array
    savedTrailIds.push(trailId);

  }

  //save changes to localStorage
  localStorage.setItem(
    "savedTrails",
    JSON.stringify(savedTrailIds)
  );

  renderPage();
});

//load trails
loadTrails();
