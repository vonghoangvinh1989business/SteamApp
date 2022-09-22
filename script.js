const BASE_URL = "https://cs-steam-game-api.herokuapp.com";

// Spinner
const spinner = document.getElementById("spinner");

const h3DisplayTitle = document.querySelector("#display-title");
const storeSearchLink = document.querySelector("#store-search-link");
const inputSearch = document.querySelector("#input-search");

const gamesSectionDiv = document.querySelector(".games-section");
const ulCategoryGroup = document.querySelector(".category-group");

// select game section main
const gameSectionDiv = document.querySelector(".games-section");

// function to check an object is empty or not
const isEmptyObject = (someValue) => {
  return (
    someValue &&
    Object.keys(someValue).length === 0 &&
    someValue.constructor === Object
  );
};

// function to show game is free to play
const showFreeToPlay = (price) => {
  price = parseFloat(price);
  return price === 0 ? "Free to Play" : `$${price}`;
};

// function is used to format date
const showDate = (inputDate) => {
  inputDate = inputDate.toString().trim();
  const newDate = new Date(inputDate);
  return newDate.toDateString();
};

// function to get all features games from api
const getFeaturedGames = async () => {
  try {
    const response = await fetch(`${BASE_URL}/features`);
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

// getFeaturedGames().then((result) => console.log(result));

// function to get all games from api
const getAllGames = async (search = "", genres = "", tag = "") => {
  try {
    let queryParameters = "";

    if (search) {
      queryParameters += `&q=${search}`;
    }

    if (genres) {
      queryParameters += `&genres=${genres}`;
    }

    if (tag) {
      queryParameters += `&steamspy_tags=${tag}`;
    }
    const url = `${BASE_URL}/games?${queryParameters}`;
    console.log(`Url request is: ${url}`);
    const response = await fetch(url);
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

// function to get game intial info
const getGameInfos = async (gameId) => {
  try {
    const response = await fetch(`${BASE_URL}/single-game/${gameId}`);
    if (response.ok) {
      const result = await response.json();
      const gameData = result["data"];
      return gameData;
    }
  } catch (error) {
    console.log(`Error message: ${error}`);
    return {};
  }
};

// getGameInfos("72850").then((result) => console.log(result));

// getGenresList().then((result) => console.log(result));
let allGamesArray = [];
const renderAllGames = async (search, genres, tag) => {
  try {
    // loading spinner
    spinner.removeAttribute("hidden");

    allGamesArray = await getAllGames(search, genres, tag);

    // remove spinner
    spinner.setAttribute("hidden", "");

    if (!allGamesArray.length) {
      console.log("No games found.");
      return;
    }
    console.log(allGamesArray);

    // clear all content inside of games-section
    gamesSectionDiv.innerHTML = "";

    allGamesArray.forEach((game) => {
      let divElement = document.createElement("div");
      divElement.innerHTML = `
      <div class="game-container">
          <div class="cover" onclick="appDetail(${game.appid})">
            <img
              src="${game.header_image}"
              data-id="${game.appid}"
            />
            <div class="game-info">
              <p>${game.name}</p>
              <p>${showFreeToPlay(game.price)}</p>
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

let featuredGamesArray = [];
const renderFeaturedGames = async () => {
  try {
    // loading spinner
    spinner.removeAttribute("hidden");

    featuredGamesArray = await getFeaturedGames();

    // remove spinner
    spinner.setAttribute("hidden", "");

    if (!featuredGamesArray.length) {
      console.log("No featured games found.");
      return;
    }

    console.log(featuredGamesArray);

    // set h3 display title
    h3DisplayTitle.textContent = "Featured Games";

    // clear all content inside of games-section
    gamesSectionDiv.innerHTML = "";

    featuredGamesArray.forEach((game) => {
      let divElement = document.createElement("div");
      divElement.innerHTML = `
        <div class="game-container">
            <div class="cover" onclick="appDetail(${game.appid})">
              <img
                src="${game.header_image}"
                data-id="${game.appid}"
              />
              <div class="game-info">
                <p>${game.name}</p>
                <p>${showFreeToPlay(game.price)}</p>
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
    // loading spinner
    spinner.removeAttribute("hidden");

    genresListArray = await getGenresList();

    // remove spinner
    spinner.setAttribute("hidden", "");

    if (!genresListArray.length) {
      console.log("No genre found.");
      return;
    }

    // console.log(genresListArray);

    // clear all content inside category group
    ulCategoryGroup.innerHTML = "";

    genresListArray.forEach((category) => {
      let liElement = document.createElement("li");
      liElement.textContent = category.name;

      liElement.addEventListener("click", () => {
        renderAllGames("", category.name.toString().trim(), "");
        h3DisplayTitle.textContent = `${category.name.toUpperCase()} GAMES`;
      });
      ulCategoryGroup.appendChild(liElement);
    });
  } catch (error) {
    console.log(`Error message: ${error}`);
  }
};

let gameInfosData = {};
const renderGameInfo = async (gameId) => {
  gameId = gameId.toString().trim();

  try {
    // loading spinner
    spinner.removeAttribute("hidden");

    gameInfosData = await getGameInfos(gameId);

    // remove spinner
    spinner.setAttribute("hidden", "");

    if (isEmptyObject(gameInfosData)) {
      console.log("No game infos found.");
      return;
    }

    // console.log(gameInfosData);

    // set h3 display title
    h3DisplayTitle.textContent = gameInfosData.name;

    // Title Section
    let divTitleContainer = document.createElement("div");
    divTitleContainer.classList.add("title-container");
    divTitleContainer.innerHTML = `
      <div class="title">${gameInfosData.name}</div>
      <div class="price">${showFreeToPlay(gameInfosData.price)}</div>
    `;

    // Infos Section
    let gameDevelopers =
      gameInfosData.developer.length > 1
        ? gameInfosData.developer.join(", ")
        : gameInfosData.developer.join();
    console.log(gameDevelopers);
    let divInfosContainer = document.createElement("div");
    divInfosContainer.classList.add("infos-container");
    divInfosContainer.innerHTML = `
      <img class="responsive"
        src="${gameInfosData.header_image}"
        alt="${gameInfosData.name}"
      />
      <div class="game-details">
        <div class="game-description">
          ${gameInfosData.description}
        </div>
        <div class="game-informations">
          <p>Recent Reviews: <span class="positive">${
            gameInfosData.positive_ratings
          }  👍</span> - <span class="negative">${
      gameInfosData.negative_ratings
    }  👎</span></p>
          <p>Release Date: <span class="tiny-info">${showDate(
            gameInfosData.release_date
          )}</span></p>
          <p>Developer: <span class="tiny-info">${gameDevelopers}</span></p>
          <p>Publisher: <span class="tiny-info">${gameDevelopers}</span></p>
        </div>
      </div>
    `;
    console.log(divInfosContainer);

    // Tag sections
    let divTagsContainer = document.createElement("div");
    divTagsContainer.classList.add("tags-container");

    let divTags = document.createElement("div");
    divTags.classList.add("tags");

    gameInfosData.steamspy_tags.forEach((tag) => {
      let divTagElement = document.createElement("div");
      divTagElement.classList.add("tag");
      divTagElement.textContent = tag;
      divTagElement.addEventListener("click", () => {
        renderAllGames("", "", tag.toString().trim());
        h3DisplayTitle.textContent = `${tag.toUpperCase()} GAMES`;
      });
      divTags.appendChild(divTagElement);
    });

    divTagsContainer.textContent =
      "Popular user-defined tags for this product:";
    divTagsContainer.appendChild(divTags);
    console.log(divTagsContainer);

    // Div contains all above
    let divShowingGameDetails = document.createElement("div");
    divShowingGameDetails.classList.add("show-detail");
    divShowingGameDetails.appendChild(divTitleContainer);
    divShowingGameDetails.appendChild(divInfosContainer);
    divShowingGameDetails.appendChild(divTagsContainer);

    return divShowingGameDetails;
  } catch (error) {
    console.log(`Error message: ${error}`);
  }
};

// renderGameInfo(730).then((result) => console.log(result));

// function appDetail to handle click on specific game
const appDetail = async (gameId) => {
  try {
    gameSectionDiv.innerHTML = "";
    let divElementContainer = await renderGameInfo(gameId);
    gameSectionDiv.appendChild(divElementContainer);
  } catch (error) {
    console.log("Cannot render game details information.");
  }
};

// add event listener for search button
storeSearchLink.addEventListener("click", () => {
  let inputSearchValue = inputSearch.value.toString().trim();

  if (inputSearchValue) {
    renderAllGames(inputSearchValue, "", "");
    h3DisplayTitle.textContent = `Result with keyword: ${inputSearchValue}`;
  }
});

// add event listener for input when press enter key
inputSearch.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    let inputSearchValue = inputSearch.value.toString().trim();
    if (inputSearchValue) {
      renderAllGames(inputSearchValue, "", "");
      h3DisplayTitle.textContent = `Result with keyword: ${inputSearchValue}`;
    }
  }
});

const initialize = () => {
  renderGenresList();
  renderAllGames("", "", "");
};

// loading page at the first time
initialize();
