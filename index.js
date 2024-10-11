// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

setFavoriteCallback(favouriteFetch);

const API_KEY =
  "live_gipO1O04xaeRbG8Sw5ID3Ylge8pdLBsvOIULoZ5jGIEdoRlA2NfkdkEudoYCsgKX";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

async function initialLoadFetch() {
  // Catch any errors by putting it in a try/catch block
  try {
    // Fetch breed data
    const breedApiResponse = await fetch(
      `https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}`
    );

    // If we got an immediate error fetching the breed data . . .
    if (!breedApiResponse || !breedApiResponse.ok) {
      // ... throw an error!
      throw new Error(`HTTP error! status: ${breedApiResponse?.status}`);
    }

    // Otherwise wait for the data to load
    const breedData = await breedApiResponse.json();

    // If we got an error loading the data . . .
    if (!Array.isArray(breedData)) {
      // ... throw an error!
      throw new Error("Invalid API response");
    }

    // loop through the data and create new <option> elements
    breedData.forEach((breed) => {
      // if we don't have an id or name . . .
      if (!breed?.id || !breed?.name) {
        console.warn("Invalid breed data:", breed);
        return;
      }

      // create a new <option> element
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Populate the carousel
    populateCarouselFetch();

    // Add an event listener to the select element
    breedSelect.addEventListener("change", async () => {
      populateCarouselFetch();
    });
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

////////////////////////////////////////////////////////////////////////
// Axios version
////////////////////////////////////////////////////////////////////////

// const axiosInstance = axios.create({
//     baseURL: 'https://api.thecatapi.com/v1/',
//     params: {
//         api_key: API_KEY
//         // "x-api-key": API_KEY
//     }
// });

// async function initialLoadAxios() {

//     // Catch any errors by putting it in a try/catch block
//     try {

//         // Fetch breed data
//         const breedResponse = await axiosInstance.get(`breeds`, {
//             params: {
//                 api_key: API_KEY
//             }
//         });

//         // If we got an error loading the data . . .
//         if (!Array.isArray(breedResponse.data)) {

//             // ... throw an error!
//             throw new Error('Invalid API response');
//         }

//         // loop through the data and create new <option> elements
//         breedResponse.data.forEach(breed => {

//             // if we don't have an id or name . . .
//             if (!breed?.id || !breed?.name) {
//                 console.warn('Invalid breed data:', breed);
//                 return;
//             }

//             // create a new <option> element
//             const option = document.createElement("option");
//             option.value = breed.id;
//             option.textContent = breed.name;
//             breedSelect.appendChild(option);
//         });

//         // Populate the carousel
//         populateCarouselAxios();

//         // Add an event listener to the select element
//         breedSelect.addEventListener("change", async () => {
//             populateCarouselAxios();
//         });
//     }

//     catch (error) {
//         console.error('Error loading breeds:', error);
//     }
// }

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

async function populateCarouselFetch() {
  // Clear the carousel
  clearCarousel();

  try {
    // Retrieve information on the selected breed from the cat API using fetch()
    const breedApiResponse = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_id=${breedSelect.value}&limit=10&api_key=${API_KEY}`
    );

    // If we got an immediate error fetching the breed data . . .
    if (!breedApiResponse || !breedApiResponse.ok) {
      const error = new Error(
        `HTTP error! status: ${breedApiResponse?.status}`
      );
      console.error("Error loading breed info:", error);
      return;
    }

    // Otherwise wait for the data to load
    const breedData = await breedApiResponse.json();

    // If we got an error loading the data . . .
    if (!Array.isArray(breedData)) {
      console.error("Invalid API response");
      return;
    }

    // Handle the Malayan breed
    if (breedData.length === 0) {
      console.warn("Invalid breed data:", breed);
      return;
    }

    // loop through the data and create new <div> elements
    breedData.forEach((breed) => {
      if (
        !breed?.id ||
        !breed?.url ||
        !breed?.breeds ||
        !breed?.breeds[0]?.description
      ) {
        console.warn("Invalid breed data:", breed);
        return;
      }

      console.log(`adding picture (${breed.id}) from (${breed.url})`);

      // Create a div for the picture
      let item = createCarouselItem(
        breed.url,
        breed.breeds[0].description,
        breed.id
      );
      appendCarousel(item);
    });

    // Populate the information section.  Sorry I'm not writing 15 lines of code when I can use 3.
    infoDump.innerHTML = `<h4>Origin:</h4>${breedData[0].breeds[0].origin}`;
    infoDump.innerHTML += `<br><h4>Temperament:</h4> ${breedData[0].breeds[0].temperament}`;
    infoDump.innerHTML += `<br><h4>Description:</h4> ${breedData[0].breeds[0].description}`;

    // Restart the carousel
    startCarousel();
  } catch (error) {
    console.error("Error loading breed info:", error);
  }
}

////////////////////////////////////////////////////////////////////////
// New school Axios version
////////////////////////////////////////////////////////////////////////

// async function populateCarouselAxios() {

//     // Get the DOM element for the progress bar
//     let progressBarElement = document.getElementById('progressBar');

//     // Axios progress indicator callback function
//     function axiosProgressEventListener(event) {

//         // If it's a valid event
//         if (event && event.loaded && event.total) {

//             // Calculate the percentage of the download event
//             const percent = (event.loaded / event.total) * 100;

//             // Update the progress bar
//             if (progressBarElement) {
//                 progressBarElement.style.width = `${percent}%`;
//             }
//         }
//     }

//     try {

//         // Clear the carousel
//         clearCarousel();

//         // Reset progress bar to 0%
//         if (progressBarElement) {
//             progressBarElement.style.width = `0%`;
//         }

//         // Retrieve information on the selected breed from the cat API using Axios
//         const breedResponse = await axiosInstance.get(`images/search`, {
//             params: {
//                 breed_id: breedSelect.value,
//                 limit: 10,
//             },
//             onDownloadProgress: axiosProgressEventListener,
//         });

//         if (!breedResponse || !breedResponse.data) {
//             console.error('No response from the server');
//             return;
//         }

//         if (!Array.isArray(breedResponse.data)) {
//             console.error('Invalid API response');
//             return;
//         }

//         if (progressBarElement) {
//             progressBarElement.style.width = `100%`;
//         }

//         // Handle the Malayan breed
//         if (breedResponse.data.length === 0) {
//             console.warn('Invalid breed data:', breed);
//             return;
//         }

//         // loop through the data and create new <div> elements
//         breedResponse.data.forEach(breed => {
//             if (!breed || !breed.id || !breed.url || !breed.breeds || !breed.breeds[0] || !breed.breeds[0].description) {
//                 console.warn('Invalid breed data:', breed);
//                 return;
//             }

//             console.log(`adding picture (${breed.id}) from (${breed.url})`)

//             // Create a div for the picture
//             let item = createCarouselItem(breed.url, breed.breeds[0].description, breed.id)

//             // Append the div to the carousel
//             appendCarousel(item);
//         });

//         if (progressBarElement) {
//             progressBarElement.style.width = `100%`;
//         }

//         // Put the breed description into the infoDump element
//         infoDump.innerHTML = breedResponse.data[0].breeds[0].description;

//         // Restart the carousel
//         startCarousel();

//     } catch (error) {
//         console.error('Error loading breed info:', error);
//     }
// }

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */

// Fetch version
initialLoadFetch();

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

// Axios version
// initialLoadAxios();

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

// // create an axios interceptor that makes a timestamp of when the request was started
// axiosInstance.interceptors.request.use((config) => {

//     // In your request interceptor, set the body element's cursor style to "progress."
//     document.body.style.cursor = "progress";

//     // Console log the current date/time
//     console.log(`Request started at: ${new Date()}`);``

//     // Display http request to the console
//     console.log(config);

//     config.params.timestamp = Date.now();
//     return config;
// });

// // create an axios inerceptor that logs the response time
// axiosInstance.interceptors.response.use((response) => {
//     console.log(`Response time: ${Date.now() - response.config.params.timestamp} ms`);

//     // In your response interceptor, remove the progress cursor style from the body element.
//     document.body.style.cursor = "default";
//     return response;
// });

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

async function favouriteFetch(imgId) {
  try {
    // Get list of favourites
    const response = await fetch(
      `https://api.thecatapi.com/v1/favourites?api_key=${API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response || !response.ok) {
      throw new Error(`HTTP error! status: ${response?.status}`);
    }

    const favouritesResponse = await response.json();

    // Check if image is already favourited
    if (favouritesResponse && Array.isArray(favouritesResponse)) {
      const favourite = favouritesResponse.find((f) => f?.image_id === imgId);
      if (favourite) {
        const { id, image_id: imageId, user_id: userId } = favourite;
        console.log(
          `favourite: ID=${id} ImageId=${imageId} for UserId=${userId} already favourited, trying to delete it`
        );
        try {
          const deleteResponse = await fetch(
            `https://api.thecatapi.com/v1/favourites/${id}?api_key=${API_KEY}`,
            { method: "DELETE" }
          );
          if (!deleteResponse || !deleteResponse.ok) {
            throw new Error(`HTTP error! status: ${deleteResponse?.status}`);
          }
          console.log(`Delete favourited ${imgId}`);
        } catch (error) {
          console.error(`Error deleting favourite ${imgId}`, error);
        }
        return;
      }
    }

    // Add favourite
    try {
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
      if (!addResponse || !addResponse.ok) {
        throw new Error(`HTTP error! status: ${addResponse?.status}`);
      }
      console.log(`Add favourited cat picture ${imgId}`);
    } catch (error) {
      console.error(`Error favouriting ${imgId}`, error);
    }
  } catch (error) {
    console.error(`Error in favouriteFetch`, error);
  }
}

// async function favouriteAxios(imgId) {

//     // your code here
//     try {
//         // Get list of favourites
//         const favouritesResponse = await axiosInstance.get('favourites');

//         // Check if image is already favourited
//         if (favouritesResponse.data.some(favourite => favourite.image_id === imgId)) {

//             let id = favouritesResponse.data.find(favourite => favourite.image_id === imgId).id;
//             let imageId = favouritesResponse.data.find(favourite => favourite.image_id === imgId).image_id;
//             let userId = favouritesResponse.data.find(favourite => favourite.image_id === imgId).user_id;

//             console.log(`favourite: ID=${id} ImageId=${imageId} for UserId=${userId} already favourited, trying to delete it`);
//             await axiosInstance.delete(`favourites/${id}`);
//             console.log(`Delete favourited ${imgId}`);
//             return;
//         }

//         // Add favourite
//         await axiosInstance.post(`favourites`, {image_id: imgId});
//         console.log(`Add favourited cat picture ${imgId}`);
//     } catch (error) {
//         console.error(`Error favouriting ${imgId}`, error);
//     }
// }

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

async function getFavouritesFetch() {
  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/favourites?api_key=${API_KEY}`
    );
    const favouritesResponse = await response.json();

    if (!response || !favouritesResponse) {
      console.error("No response from the server");
      return;
    }

    if (!Array.isArray(favouritesResponse)) {
      console.error("Invalid API response");
      return;
    }

    clearCarousel();
    favouritesResponse.forEach((favourite) => {
      // if we don't have an id or name . . .
      if (!favourite?.id || !favourite?.image.url) {
        console.warn("Invalid favourite data:", favourite);
        return;
      }

      const item = createCarouselItem(
        favourite.image.url,
        "",
        favourite.image.id
      );
      appendCarousel(item);
    });

    // Clear the description area
    infoDump.innerHTML = `<h4>These are your favorites.</h4>`;

    startCarousel();
  } catch (error) {
    console.error("Error loading breed info:", error);
  }
}
// async function getFavouritesAxios() {
//     try {
//         const favouritesResponse = await axiosInstance.get('favourites');
//         if (!favouritesResponse || !favouritesResponse.data) {
//             console.error('No response from the server');
//             return;
//         }

//         if (!Array.isArray(favouritesResponse.data)) {
//             console.error('Invalid API response');
//             return;
//         }

//         clearCarousel();
//         favouritesResponse.data.forEach(favourite => {

//             // if we don't have an id or name . . .
//             if (!favourite?.id ||
//                 !favourite?.image.url) {
//                 console.warn('Invalid favourite data:', favourite);
//                 return;
//             }

//             const item = createCarouselItem(favourite.image.url, "", favourite.image.id);
//             appendCarousel(item);
//         });

//         startCarousel();

//     } catch (error) {
//         console.error('Error loading breed info:', error);
//     }
// }

// getFavouritesBtn.addEventListener("click", getFavouritesAxios);

getFavouritesBtn.addEventListener("click", getFavouritesFetch);

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
