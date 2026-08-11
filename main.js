/*
 * main.js — Southridge Farm Walking Tour
 * Handles: interactive SVG map, quiz, and walk planner tool
 * Author: Angus Forbes
 */

/* ════════════════════════════════════════════════════════
   SHARED DATA
   Stop details used by both the map and the walk planner
   ════════════════════════════════════════════════════════ */

// Array of objects — each representing one tour stop
const STOPS = [
  {
    id: 1,
    name: "The Studio",
    page: "stops-1-2.html#stop-1",
    tagline: "A comfortable and secluded creative space nestled in the treeline.",
    blurb:
      "Perched on the north-eastern ridge with a double window facing the trees and ocean, the Studio started as a simple storage shed and has been transformed into a private creative retreat — now featuring power, a large work table, and running water.",
    distanceFromHouse: 0.4, // km (approximate, from house)
  },
  {
    id: 2,
    name: "The Fire Pit",
    page: "stops-1-2.html#stop-2",
    tagline: "The sun descends beneath the horizon. Come gather around the flame.",
    blurb:
      "Just below the ridge on the ocean side, the Fire Pit sits on a stone-slab platform with circular seating carved from natural stone. It becomes the social heart of the farm by evening, when the brazier takes over from the ocean view.",
    distanceFromHouse: 0.5,
  },
  {
    id: 3,
    name: "The Orchard",
    page: "stops-3-4.html#stop-3",
    tagline: "Fresh grass, fruit trees, patience is a virtue.",
    blurb:
      "At the foot of the north-western slope, the newly planted Orchard is a still and open space with young saplings in supportive frames and a wide wooden bench for sitting in quietness. A red rabbit cutout peeks from the treeline opposite.",
    distanceFromHouse: 0.35,
  },
  {
    id: 4,
    name: "The Shed",
    page: "stops-3-4.html#stop-4",
    tagline: "The spirit of the farm.",
    blurb:
      "The largest structure after the house, the Shed houses a full home gym (squat racks, dumbbells, cable machine), a social space with couch and fridge, and storage for motorbikes, surfboards, and camping gear — a genuine community asset.",
    distanceFromHouse: 0.15,
  },
];

/* ════════════════════════════════════════════════════════
   1. INTERACTIVE MAP (index.html)
   ════════════════════════════════════════════════════════ */

// Only runs if the map panel exists on this page
function initMap() {
  const panel    = document.getElementById("stop-info-panel");
  const markers  = document.querySelectorAll(".map-stop");

  if (!panel || markers.length === 0) return; // Not on index.html

  // Pre-cache panel elements
  const panelEyebrow  = document.getElementById("panel-eyebrow");
  const panelTitle    = document.getElementById("panel-title");
  const panelTagline  = document.getElementById("panel-tagline");
  const panelBody     = document.getElementById("panel-body");
  const panelLink     = document.getElementById("panel-link");

  // Helper: populate and show the panel for a given stop id
  function showStop(stopId) {
    // Find the stop data object whose id matches
    const stop = STOPS.find(function(s) { return s.id === stopId; });
    if (!stop) return;

    panelEyebrow.textContent = "Stop " + stop.id + " of " + STOPS.length;
    panelTitle.textContent   = stop.name;
    panelTagline.textContent = stop.tagline;
    panelBody.textContent    = stop.blurb;
    panelLink.href           = stop.page;
    panelLink.textContent    = "Read more about " + stop.name + " →";

    panel.classList.add("is-visible");

    // Smooth scroll map wrapper into view on small screens
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Attach click and keyboard handlers to every marker
  markers.forEach(function(marker) {
    marker.addEventListener("click", function() {
      var stopId = parseInt(marker.getAttribute("data-stop"), 10);
      showStop(stopId);
    });

    // Allow keyboard activation (Enter or Space)
    marker.addEventListener("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        var stopId = parseInt(marker.getAttribute("data-stop"), 10);
        showStop(stopId);
      }
    });
  });
}

/* ════════════════════════════════════════════════════════
   2. QUIZ (quiz.html)
   ════════════════════════════════════════════════════════ */

// Quiz questions — multidimensional array of objects
// Each question has: text, options array, correctIndex, feedback strings
var QUESTIONS = [
  {
    text: "Which stop sits on the north-eastern side of the property on the edge of the ridge?",
    options: ["The Shed", "The Fire Pit", "The Studio", "The Orchard"],
    correctIndex: 2,
    correctFeedback: "Correct! The Studio occupies the north-eastern ridge.",
    wrongFeedback: "Not quite — it's The Studio, perched on the north-eastern ridge with ocean views.",
  },
  {
    text: "The Fire Pit seating is built from what material?",
    options: ["Timber sleepers", "Poured concrete", "Natural stone", "Recycled bricks"],
    correctIndex: 2,
    correctFeedback: "Right — natural stone, complementary to the surrounding colours.",
    wrongFeedback: "It's natural stone, which blends with the colours of the flora and fauna around it.",
  },
  {
    text: "What was the Orchard used as before it became a grassy open space?",
    options: [
      "A vegetable garden",
      "The hairpin turn of a gravel road",
      "A chicken coop area",
      "An overflow car park",
    ],
    correctIndex: 1,
    correctFeedback: "Spot on — it was the hairpin turn of a gravel road around the farm.",
    wrongFeedback: "Previously it was the hairpin turn of a gravel road, decorated with plant matter and hard rubbish.",
  },
  {
    text: "What notable creature can be found nestled in the treeline opposite the Orchard?",
    options: [
      "A bronze kookaburra statue",
      "A carved timber owl",
      "A metallic cutout of a rabbit",
      "A ceramic garden gnome",
    ],
    correctIndex: 2,
    correctFeedback: "Yes! A charming red metallic rabbit silhouette peeks from the treeline.",
    wrongFeedback: "It's a red metallic rabbit silhouette — a charming surprise in the treeline.",
  },
  {
    text: "Which two stops share a page on this website?",
    options: [
      "The Studio and The Shed",
      "The Studio and The Fire Pit",
      "The Orchard and The Fire Pit",
      "The Shed and The Orchard",
    ],
    correctIndex: 1,
    correctFeedback: "Correct — The Studio and The Fire Pit are both on the Stops 1 & 2 page.",
    wrongFeedback: "The Studio and The Fire Pit share the Stops 1 & 2 page.",
  },
  {
    text: "What piece of gym equipment in The Shed is bolted into the concrete floor?",
    options: ["The cable machine", "The bench press", "The squat racks", "The dumbbells rack"],
    correctIndex: 2,
    correctFeedback: "Correct — the squat racks are bolted into the concrete beneath the mats.",
    wrongFeedback: "It's the squat racks — bolted into the concrete floor beneath the mats for safety.",
  },
  {
    text: "What is the theme of the Southridge Farm Walking Tour?",
    options: [
      "Historic rural architecture",
      "Human living spaces in the natural landscape",
      "Sustainable farming practices",
      "The ecology of coastal properties",
    ],
    correctIndex: 1,
    correctFeedback: "Exactly — the tour explores human living spaces within the natural landscape.",
    wrongFeedback: "The theme is how contemporary humans find meaning through living spaces in the natural environment.",
  },
  {
    text: "Which direction does the Studio's large double window face?",
    options: [
      "South toward the paddock",
      "West toward the sunset",
      "Away from the farm toward the trees and ocean",
      "Back toward the house",
    ],
    correctIndex: 2,
    correctFeedback: "Right — it faces away from the farm, out toward the trees and ocean.",
    wrongFeedback: "The Studio window faces away from the rest of the farm, toward the trees and ocean — ensuring complete privacy.",
  },
  {
    text: "The Orchard's bench is described as wide and deep. What is the practical benefit of this?",
    options: [
      "It doubles as a picnic table",
      "It fits a good number of people and is surprisingly comfortable",
      "It has storage underneath",
      "It can be converted into a sun lounger",
    ],
    correctIndex: 1,
    correctFeedback: "Correct — wide and deep means it fits a good amount of people and is surprisingly comfortable.",
    wrongFeedback: "Being wide and deep means it accommodates a good number of people and is surprisingly comfortable.",
  },
  {
    text: "How are the Shed's rolling garage doors described?",
    options: [
      "Lightweight aluminium, easy to operate",
      "Remote-controlled electric",
      "Old and requiring considerable physical effort to move",
      "Sliding timber panels",
    ],
    correctIndex: 2,
    correctFeedback: "Yes — old, and requiring considerable physical effort to lower or raise.",
    wrongFeedback: "They're described as old and only operable through considerable physical effort.",
  },
];

function initQuiz() {
  var questionEl   = document.getElementById("quiz-question-text");
  var optionsEl    = document.getElementById("quiz-options");
  var feedbackEl   = document.getElementById("quiz-feedback");
  var counterEl    = document.getElementById("quiz-counter");
  var scoreEl      = document.getElementById("quiz-score-display");
  var progressEl   = document.getElementById("quiz-progress");
  var btnNext      = document.getElementById("btn-next");
  var activeView   = document.getElementById("quiz-active");
  var resultsView  = document.getElementById("quiz-results");
  var btnRestart   = document.getElementById("btn-restart");

  if (!questionEl) return; // Not on quiz.html

  var currentIndex = 0;
  var score        = 0;
  var answered     = false;

  // Shuffle questions array using Fisher-Yates so each attempt feels fresh
  function shuffle(array) {
    var arr = array.slice(); // copy
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  var questions = shuffle(QUESTIONS);

  // Render the current question
  function renderQuestion() {
    answered = false;
    var q = questions[currentIndex];

    counterEl.textContent = "Question " + (currentIndex + 1) + " of " + questions.length;
    scoreEl.textContent   = "Score: " + score;
    questionEl.textContent = q.text;

    // Update progress bar width as a percentage
    progressEl.style.width = ((currentIndex / questions.length) * 100) + "%";

    // Clear previous options and feedback
    optionsEl.innerHTML = "";
    feedbackEl.textContent = "";
    feedbackEl.className   = "quiz-feedback";
    btnNext.classList.remove("is-visible");

    // Create a button for each answer option
    q.options.forEach(function(optionText, index) {
      var btn = document.createElement("button");
      btn.className   = "quiz-option";
      btn.textContent = optionText;
      btn.type        = "button";

      btn.addEventListener("click", function() {
        if (answered) return; // Prevent double-answers
        handleAnswer(index);
      });

      optionsEl.appendChild(btn);
    });
  }

  // Handle a selected answer
  function handleAnswer(selectedIndex) {
    answered = true;
    var q = questions[currentIndex];
    var optionBtns = optionsEl.querySelectorAll(".quiz-option");

    // Disable all buttons
    optionBtns.forEach(function(btn) {
      btn.disabled = true;
    });

    if (selectedIndex === q.correctIndex) {
      score++;
      optionBtns[selectedIndex].classList.add("is-correct");
      feedbackEl.textContent = q.correctFeedback;
      feedbackEl.className   = "quiz-feedback is-visible correct";
    } else {
      optionBtns[selectedIndex].classList.add("is-wrong");
      optionBtns[q.correctIndex].classList.add("is-correct");
      feedbackEl.textContent = q.wrongFeedback;
      feedbackEl.className   = "quiz-feedback is-visible wrong";
    }

    scoreEl.textContent = "Score: " + score;

    // Show Next button (or trigger results on last question)
    if (currentIndex < questions.length - 1) {
      btnNext.classList.add("is-visible");
    } else {
      // Brief delay then show results
      setTimeout(showResults, 900);
    }
  }

  // Advance to next question
  btnNext.addEventListener("click", function() {
    currentIndex++;
    renderQuestion();
  });

  // Show final results screen
  function showResults() {
    activeView.style.display  = "none";
    resultsView.classList.add("is-visible");
    progressEl.style.width    = "100%";

    var pct    = Math.round((score / questions.length) * 100);
    var title  = "";
    var verdict = "";

    // Decision: pick a result message based on score percentage
    if (pct === 100) {
      title   = "Perfect score!";
      verdict = "You know this farm like the back of your hand.";
    } else if (pct >= 70) {
      title   = "Well done!";
      verdict = "Solid knowledge of the property — you've been paying attention.";
    } else if (pct >= 40) {
      title   = "Not bad.";
      verdict = "Worth another read of the stop descriptions before your visit.";
    } else {
      title   = "Keep exploring.";
      verdict = "Head back through the tour — there's plenty more to discover.";
    }

    document.getElementById("results-score-number").textContent = score + "/" + questions.length;
    document.getElementById("results-title").textContent        = title;
    document.getElementById("results-verdict").textContent      = verdict;
    document.getElementById("results-detail").textContent       =
      "You answered " + score + " out of " + questions.length + " questions correctly (" + pct + "%).";
  }

  // Restart — reshuffle and reset
  btnRestart.addEventListener("click", function() {
    currentIndex = 0;
    score        = 0;
    answered     = false;
    questions    = shuffle(QUESTIONS);

    resultsView.classList.remove("is-visible");
    activeView.style.display = "";
    renderQuestion();
  });

  // Kick off
  renderQuestion();
}

/* ════════════════════════════════════════════════════════
   3. WALK PLANNER TOOL (tool.html)
   ════════════════════════════════════════════════════════ */

// Pace data: speed in km/h and MET value for calorie calculation
var PACE_DATA = {
  leisurely: { label: "Leisurely", speed: 2.0, met: 2.5 },
  easy:      { label: "Easy",      speed: 3.0, met: 3.0 },
  moderate:  { label: "Moderate",  speed: 4.0, met: 3.5 },
  brisk:     { label: "Brisk",     speed: 5.0, met: 4.5 },
};

// Approximate distances between stops and the house (km), used to calculate route length
// Route: house → stops in visit order → house
// Distance from house to each stop (one-way estimate):
var HOUSE_TO_STOP = {
  1: 0.40, // Studio
  2: 0.50, // Fire Pit
  3: 0.35, // Orchard
  4: 0.15, // Shed
};

// Approximate inter-stop distances (km) for routing between consecutive stops
// Stored as a lookup table — symmetrical
var STOP_TO_STOP = {
  "1-2": 0.18, // Studio ↔ Fire Pit (nearby on same ridge)
  "1-3": 0.65, // Studio ↔ Orchard (cross the property)
  "1-4": 0.55, // Studio ↔ Shed
  "2-3": 0.70, // Fire Pit ↔ Orchard
  "2-4": 0.60, // Fire Pit ↔ Shed
  "3-4": 0.45, // Orchard ↔ Shed
};

function getStopDistance(a, b) {
  // Look up both orderings
  var key1 = a + "-" + b;
  var key2 = b + "-" + a;
  return STOP_TO_STOP[key1] || STOP_TO_STOP[key2] || 0.4; // fallback
}

function initTool() {
  var checkboxContainer = document.getElementById("stop-checkboxes");
  var paceSelect        = document.getElementById("pace-select");
  var weightInput       = document.getElementById("weight-input");
  var btnCalculate      = document.getElementById("btn-calculate");
  var resultsEmpty      = document.getElementById("results-empty");
  var resultsError      = document.getElementById("results-error");
  var resultStats       = document.getElementById("result-stats");
  var resultDistance    = document.getElementById("result-distance");
  var resultTime        = document.getElementById("result-time");
  var resultCalories    = document.getElementById("result-calories");
  var resultPace        = document.getElementById("result-pace");
  var resultStopCount   = document.getElementById("result-stop-count");
  var resultStopsList   = document.getElementById("result-stops-list");
  var toolFootnote      = document.getElementById("tool-footnote");

  if (!checkboxContainer) return; // Not on tool.html

  // Dynamically build the stop checkbox list from the STOPS array
  STOPS.forEach(function(stop) {
    var li    = document.createElement("li");
    li.className = "stop-checkbox-item";

    var checkbox = document.createElement("input");
    checkbox.type  = "checkbox";
    checkbox.id    = "stop-check-" + stop.id;
    checkbox.value = stop.id;

    var label = document.createElement("label");
    label.htmlFor   = "stop-check-" + stop.id;
    label.className = "stop-checkbox-item__label";
    label.textContent = stop.name;

    var dist = document.createElement("span");
    dist.className   = "stop-checkbox-item__dist";
    dist.textContent = "~" + HOUSE_TO_STOP[stop.id].toFixed(2) + " km from house";

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(dist);

    // Make the whole <li> clickable (toggle the checkbox)
    li.addEventListener("click", function(e) {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
    });

    checkboxContainer.appendChild(li);
  });

  btnCalculate.addEventListener("click", function() {
    // 1. Read selected stops
    var selectedIds = [];
    checkboxContainer.querySelectorAll("input[type='checkbox']").forEach(function(cb) {
      if (cb.checked) {
        selectedIds.push(parseInt(cb.value, 10));
      }
    });

    // Validation
    resultsError.classList.remove("is-visible");
    resultStats.classList.remove("is-visible");
    resultsEmpty.style.display = "none";
    toolFootnote.style.display = "none";

    if (selectedIds.length === 0) {
      resultsError.textContent = "Please select at least one stop before calculating.";
      resultsError.classList.add("is-visible");
      return;
    }

    var weight = parseFloat(weightInput.value);
    if (isNaN(weight) || weight < 30 || weight > 200) {
      resultsError.textContent = "Please enter a valid weight between 30 and 200 kg.";
      resultsError.classList.add("is-visible");
      return;
    }

    var paceKey  = paceSelect.value;
    var pace     = PACE_DATA[paceKey];

    // 2. Calculate total distance
    // Route: house → stop 1 → stop 2 → … → stop n → house
    var totalDist = 0;

    // House to first stop
    totalDist += HOUSE_TO_STOP[selectedIds[0]];

    // Between consecutive selected stops
    for (var i = 0; i < selectedIds.length - 1; i++) {
      totalDist += getStopDistance(selectedIds[i], selectedIds[i + 1]);
    }

    // Last stop back to house
    totalDist += HOUSE_TO_STOP[selectedIds[selectedIds.length - 1]];

    // 3. Calculate time in minutes
    // time (hours) = distance (km) / speed (km/h)
    var timeHours   = totalDist / pace.speed;
    var timeMinutes = Math.round(timeHours * 60);

    // 4. Calculate calories burned
    // Formula: MET × weight (kg) × time (hours)
    var calories = Math.round(pace.met * weight * timeHours);

    // 5. Render results
    resultDistance.innerHTML  = totalDist.toFixed(2) + " <small>km</small>";
    resultTime.innerHTML      = timeMinutes + " <small>min</small>";
    resultCalories.innerHTML  = calories + " <small>kcal</small>";
    resultPace.innerHTML      = pace.speed.toFixed(1) + " <small>km/h (" + pace.label + ")</small>";
    resultStopCount.textContent = selectedIds.length;

    // Build the list of selected stop names
    resultStopsList.innerHTML = "";
    selectedIds.forEach(function(id) {
      var stop = STOPS.find(function(s) { return s.id === id; });
      if (!stop) return;
      var li = document.createElement("li");
      li.textContent = stop.name;
      resultStopsList.appendChild(li);
    });

    resultStats.classList.add("is-visible");
    toolFootnote.style.display = "block";
  });
}

/* ════════════════════════════════════════════════════════
   INIT — run the relevant module based on what's on the page
   ════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function() {
  initMap();
  initQuiz();
  initTool();
});
