const BASE_URL = "https://cs-steam-game-api.herokuapp.com";

// function to get all games from api
const getAllGames = async () => {
  try {
    const response = await fetch(`${BASE_URL}/games`);
    if (response.ok) {
      const result = await response.json();
      const data = result["data"];
      return data;
    }
  } catch (error) {
    console.log(`Error message: ${error}`);
    return [];
  }
};

// getAllGames().then((result) => console.log(result));

// function to get genres list
const getGenresList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genres`);
    if (response.ok) {
      const result = await response.json();
      const data = result["data"];
      return data;
    }
  } catch (error) {
    console.log(`Error message: ${error.message}`);
    return [];
  }
};

// getGenresList().then((result) => console.log(result));

const gamesSectionDiv = document.querySelector(".games-section");
const ulCategoryGroup = document.querySelector(".category-group");

let allGamesArray = [];
const renderAllGames = async () => {
  try {
    allGamesArray = await getAllGames();

    if (!allGamesArray.length) {
      console.log("No games found.");
      return;
    }
    // console.log(allGamesArray);

    // clear all content inside of games-section
    gamesSectionDiv.innerHTML = "";

    allGamesArray.forEach((game) => {
      divElement = document.createElement("div");
      divElement.innerHTML = `
      <div class="game-container">
          <div class="cover" onclick="appDetail(${game.appid})">
            <img
              src="${game.header_image}"
              data-id="${game.appid}"
            />
            <div class="game-info">
              <p>${game.name}</p>
              <p>$${game.price}</p>
            </div>
          </div>
        </div>
      `;
      gamesSectionDiv.appendChild(divElement);
    });
  } catch (error) {
    console.log(`Error message: ${error}`);
  }
};

let genresListArray = [];
const renderGenresList = async () => {
  try {
    genresListArray = await getGenresList();

    if (!genresListArray.length) {
      console.log("No genre found.");
      return;
    }

    // console.log(genresListArray);

    // clear all content inside category group
    ulCategoryGroup.innerHTML = "";

    genresListArray.forEach((category) => {
      liElement = document.createElement("li");
      liElement.textContent = category.name;
      ulCategoryGroup.appendChild(liElement);
    });
  } catch (error) {
    console.log(`Error message: ${error}`);
  }
};

renderAllGames();
renderGenresList();
