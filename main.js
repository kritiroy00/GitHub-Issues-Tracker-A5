

const issuesContainer = document.getElementById("issuesContainer");
const issueCount = document.getElementById("issueCount");

const searchInput = document.getElementById("searchInput");

const allTab = document.getElementById("allTab");
const openTab = document.getElementById("openTab");
const closedTab = document.getElementById("closedTab");

const tabs = document.querySelectorAll(".tabBtn");

let allIssues = [];
let currentTab = "all";



async function loadIssues() {

  try {

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");

    const data = await res.json();

    allIssues = data?.data || [];

    applyFilters();

  } catch (error) {

    issuesContainer.innerHTML =
      `<p class="text-red-500 text-center">Failed to load issues</p>`;

  }

}

function displayIssues(list) {

  issuesContainer.innerHTML = "";

  if (!list.length) {
    issuesContainer.innerHTML =
      `<p class="text-gray-400 text-center py-10">No issues found</p>`;
    return;
  }

  list.forEach(issue => {

    const card = document.createElement("div");


    const priority = issue.priority?.toUpperCase();

    const priorityClass =
      priority === "HIGH"
        ? "bg-red-500 text-white"
        : priority === "MEDIUM"
        ? "bg-yellow-500 text-white"
        : "bg-blue-500 text-white";


    const statusImage =
      issue.status === "open"
        ? "./assets/open-status.png"
        : "./assets/closed-status.png";

    const borderColor =
      issue.status === "open"
        ? "border-green-500"
        : "border-purple-500";

    card.className =
      `bg-white rounded-xl shadow border-t-4 ${borderColor} 
       overflow-hidden cursor-pointer hover:shadow-xl 
       hover:scale-[1.02] transition duration-300`;

    card.innerHTML = `

      <div class="p-4">

        <div class="flex justify-between items-center mb-2">

          <img src="${statusImage}" alt="${issue.status}" class="w-5 h-5"/>

          <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityClass}">
            ${priority || "LOW"}
          </span>

        </div>

        <h3 class="font-semibold text-gray-800 mb-2">
          ${issue.title || "Untitled Issue"}
        </h3>

        <p class="text-sm text-gray-500 mb-3">
          ${issue.description ? issue.description.slice(0,80) + "..." : ""}
        </p>

        <div class="flex gap-2 mb-3 flex-wrap">

          ${(issue.labels || []).map(label => `
            <span class="px-2 py-1 rounded-full text-xs font-semibold ${
              label === "BUG"
                ? "bg-red-100 text-red-600"
                : label === "HELP WANTED"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-blue-100 text-blue-600"
            }">
              ${label}
            </span>
          `).join("")}

        </div>

      </div>

      <!-- Footer -->
      <div class="border-t bg-gray-50 p-3 text-xs text-gray-500">

        #${issue.id} by ${issue.author || "unknown"} • 
        ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : ""}

      </div>

    `;

    card.addEventListener("click", () => openModal(issue));

    issuesContainer.appendChild(card);

  });

}


function updateCount(list) {

  issueCount.innerText = `${list.length} Issues`;

}


function applyFilters() {

  let filtered = [...allIssues];


  if (currentTab === "open") {
    filtered = filtered.filter(issue => issue.status === "open");
  }

  if (currentTab === "closed") {
    filtered = filtered.filter(issue => issue.status === "closed");
  }


  const searchText = searchInput.value.toLowerCase();

  if (searchText) {

    filtered = filtered.filter(issue =>
      issue.title.toLowerCase().includes(searchText)
    );

  }

  displayIssues(filtered);

  updateCount(filtered);

}


searchInput.addEventListener("input", applyFilters);


function setActiveTab(activeBtn) {

  tabs.forEach(btn => {

    btn.classList.remove("bg-purple-600", "text-white");
    btn.classList.add("bg-gray-200");

  });

  activeBtn.classList.add("bg-purple-600", "text-white");

}


allTab.addEventListener("click", () => {

  currentTab = "all";

  setActiveTab(allTab);

  applyFilters();

});

openTab.addEventListener("click", () => {

  currentTab = "open";

  setActiveTab(openTab);

  applyFilters();

});

closedTab.addEventListener("click", () => {

  currentTab = "closed";

  setActiveTab(closedTab);

  applyFilters();

});


function openModal(issue) {

  const modalContent = document.getElementById("modalContent");

  const priorityColor =
    issue.priority === "HIGH"
      ? "bg-red-500"
      : issue.priority === "MEDIUM"
      ? "bg-yellow-500"
      : "bg-gray-400";

  modalContent.innerHTML = `

  <h2 class="text-3xl font-bold text-gray-800 mb-3">
    ${issue.title}
  </h2>

  <div class="flex items-center gap-3 text-sm text-gray-600 mb-4">

    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
      Opened
    </span>

    <span>•</span>

    <span>Opened by ${issue.author || "Unknown"}</span>

    <span>•</span>

    <span>${issue.createdAt || "Unknown date"}</span>

  </div>

  <div class="flex gap-2 mb-5">

    ${(issue.labels || [])
      .map(
        label =>
          `<span class="border border-orange-400 text-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
            ${label}
          </span>`
      )
      .join("")}

  </div>

  <p class="text-gray-700 leading-relaxed mb-6">
    ${issue.description || "No description provided"}
  </p>

  <div class="bg-gray-200 rounded-lg p-5 grid grid-cols-2 gap-4">

    <div>
      <p class="text-sm text-gray-500">Assignee:</p>
      <p class="font-semibold">${issue.author || "Unknown"}</p>
    </div>

    <div>
      <p class="text-sm text-gray-500">Priority:</p>
      <span class="text-white text-xs px-3 py-1 rounded-full ${priorityColor}">
        ${issue.priority || "LOW"}
      </span>
    </div>

  </div>

  `;

  document.getElementById("issueModal").showModal();
}



loadIssues();