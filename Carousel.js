// index.js

// DOM Elements
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Set the favorite callback function
setFavoriteCallback(favouriteFetch);

// Your API key
const API_KEY =
  "live_6NRMc8rVRMNztOn45OAL6zHC7ijqLnmDNdxg1pH4zAeIfbj0mle1YWXaH941nZgf";

/**
 * 1. Initial Load Function
 * - Retrieves a list of breeds from the Cat API using fetch().
 * - Creates new <option> elements for each breed and appends them to breedSelect.
 * - Each option has a value attribute equal to the breed's id and displays the breed's name.
 * - Executes immediately.
 */
async function initialLoadFetch() {
  try {
    // Fetch breed data
    const response = await fetch(
      `https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}`
    );

    // Check for response errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const breedData = await response.json();

    // Validate response data
    if (!Array.isArray(breedData)) {
      throw new Error("Invalid API response");
    }

    // Populate breedSelect with options
    breedData.forEach((breed) => {
      if (!breed.id || !breed.name) {
        console.warn("Invalid breed data:", breed);
        return;
      }

      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Load initial breed images into the carousel
    await populateCarouselFetch();

    // Add event listener for breed selection changes
    breedSelect.addEventListener("change", populateCarouselFetch);
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

// Execute initial load function
initialLoadFetch();

/**
 * 2. Populate Carousel Function
 * - Retrieves images for the selected breed using fetch().
 * - Creates new carousel items for each image and appends them to the carousel.
 * - Updates the infoDump element with breed information.
 * - Clears and restarts the carousel with new data.
 */
async function populateCarouselFetch() {
  try {
    // Clear the existing carousel
    clearCarousel();

    const breedId = breedSelect.value;

    // Fetch images for the selected breed
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}&limit=10&api_key=${API_KEY}`
    );

    // Check for response errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const breedImages = await response.json();

    // Validate response data
    if (!Array.isArray(breedImages) || breedImages.length === 0) {
      console.warn("No images found for this breed.");
      infoDump.innerHTML = "<p>No images available for this breed.</p>";
      return;
    }

    // Create carousel items for each image
    breedImages.forEach((imageData) => {
      if (!imageData.id || !imageData.url) {
        console.warn("Invalid image data:", imageData);
        return;
      }

      const description = imageData.breeds[0]?.description || "";
      const carouselItem = createCarouselItem(
        imageData.url,
        description,
        imageData.id
      );
      appendCarousel(carouselItem);
    });

    // Update breed information in infoDump
    const breedInfo = breedImages[0]?.breeds[0];
    if (breedInfo) {
      infoDump.innerHTML = `
        <h4>Origin:</h4> ${breedInfo.origin}
        <br><h4>Temperament:</h4> ${breedInfo.temperament}
        <br><h4>Description:</h4> ${breedInfo.description}
      `;
    } else {
      infoDump.innerHTML =
        "<p>No additional information available for this breed.</p>";
    }

    // Restart the carousel
    startCarousel();
  } catch (error) {
    console.error("Error loading breed images:", error);
  }
}

/**
 * 8. Favourite Function
 * - Toggles the favourite status of an image.
 * - Adds or removes the image from favourites using fetch().
 * - Called when the favourite button is clicked on an image.
 */
async function favouriteFetch(imgId) {
  try {
    // Fetch current favourites
    const response = await fetch(
      `https://api.thecatapi.com/v1/favourites?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const favourites = await response.json();

    // Check if the image is already favourited
    const existingFavourite = favourites.find((fav) => fav.image_id === imgId);

    if (existingFavourite) {
      // Delete the favourite (toggle off)
      const deleteResponse = await fetch(
        `https://api.thecatapi.com/v1/favourites/${existingFavourite.id}?api_key=${API_KEY}`,
        { method: "DELETE" }
      );

      if (!deleteResponse.ok) {
        throw new Error(`HTTP error! status: ${deleteResponse.status}`);
      }

      console.log(`Favourite removed: ${imgId}`);
    } else {
      // Add the favourite (toggle on)
      const addResponse = await fetch(
        `https://api.thecatapi.com/v1/favourites?api_key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_id: imgId }),
        }
      );

      if (!addResponse.ok) {
        throw new Error(`HTTP error! status: ${addResponse.status}`);
      }

      console.log(`Favourite added: ${imgId}`);
    }
  } catch (error) {
    console.error("Error in favouriteFetch:", error);
  }
}

/**
 * 9. Get Favourites Function
 * - Retrieves all favourites from the Cat API using fetch().
 * - Clears the carousel and displays favourite images when the button is clicked.
 */
async function getFavouritesFetch() {
  try {
    // Fetch favourites
    const response = await fetch(
      `https://api.thecatapi.com/v1/favourites?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const favourites = await response.json();

    // Validate response data
    if (!Array.isArray(favourites) || favourites.length === 0) {
      console.warn("No favourites found.");
      infoDump.innerHTML = "<p>You have no favourite images.</p>";
      return;
    }

    // Clear the existing carousel
    clearCarousel();

    // Create carousel items for each favourite image
    favourites.forEach((favourite) => {
      if (!favourite.image?.url) {
        console.warn("Invalid favourite data:", favourite);
        return;
      }

      const carouselItem = createCarouselItem(
        favourite.image.url,
        "",
        favourite.image.id
      );
      appendCarousel(carouselItem);
    });

    // Update infoDump
    infoDump.innerHTML = "<h4>These are your favourites.</h4>";

    // Restart the carousel
    startCarousel();
  } catch (error) {
    console.error("Error loading favourites:", error);
  }
}

// Bind the getFavouritesFetch function to the button click event
getFavouritesBtn.addEventListener("click", getFavouritesFetch);

/**
 * Note:
 * - Ensure that functions like createCarouselItem, appendCarousel, clearCarousel, and startCarousel are defined elsewhere in your code.
 * - If you're using a separate module for the carousel, make sure to import the necessary functions.
 */

// The code should now be clean, organized, and ready for testing!
