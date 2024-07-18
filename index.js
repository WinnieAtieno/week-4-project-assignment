const apiKey = 'live_yjmQnpAglT1aK2aMzDb7zeWx1SNLCrKDBHe6JuCsA0YTOXekeaAqJDsYX3kAEtS0';
const apiUrl = 'https://api.thedogapi.com/v1/breeds'; // API endpoint for breed data
const showContainer = document.getElementById('showdogs'); // Container to display breed data

const allButton = document.getElementById('all');
const breedButton = document.getElementById('breed');
const galleryButton = document.getElementById('gallery');
const favoriteButton = document.getElementById('favorite');

let breedData = []; // Array to store breed data
let itemsPerPage = 5; // Number of items to display per page
let currentIndex = 0; // Index to keep track of which items are currently displayed
let currentCategory = 'all'; // Current category filter

const favoriteArr = []; // Array to store favorite breeds

// Fetch the breed data from the API
function fetchBreeds() {
    showContainer.innerHTML = ''; // Clear previous content

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        }
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        breedData = data; // Store fetched data
        displayBreeds(); // Display breeds based on current category
    })
    .catch(error => console.error('Error fetching breeds:', error));
}

// Display breeds with pagination and filter
function displayBreeds() {
    showContainer.innerHTML = ''; // Clear previous content

    let filteredData = [];
    
    // Filter data based on category
    if (currentCategory === 'all') {
        filteredData = breedData; // Show all breeds
    } else if (currentCategory === 'gallery') {
        filteredData = breedData; // Show all breeds (for gallery view)
    } else if (currentCategory === 'breed') {
        filteredData = breedData; // Show all breeds (for breed view)
    } else if (currentCategory === 'favorite') {
        filteredData = favoriteArr; // Show only favorite breeds
    }

    // Display filtered breeds with pagination
    const breedsToDisplay = filteredData.slice(currentIndex, currentIndex + itemsPerPage);
    breedsToDisplay.forEach(breed => {
        showContainer.innerHTML += `
            <div class="card">
                <img src="${breed.image ? breed.image.url : 'https://via.placeholder.com/150'}" alt="${breed.name}" class="card-image">
                <p class="card-origin">Origin: ${breed.origin || 'Unknown'}</p>
                <p class="card-temperament">Temperament: ${breed.temperament || 'Unknown'}</p>
                <p class="card-description">${breed.description || 'No description available'}</p>
                ${currentCategory === 'gallery' ? `
                    <button class="card-button fav" style="margin-top:50px">Add to favorites</button>
                    <div>
                        <p>Like!</p>
                        <div class='icons'>
                            <i class="fa-regular fa-heart"></i>
                            <i class="fa-solid fa-heart" style="color:red"></i>
                        </div>                
                    </div>` : ''}
            </div>
        `;
    });

    // Manage "See More" button 
    if (currentIndex + itemsPerPage < filteredData.length) {
        if (!document.getElementById('seeMoreButton')) {
            showContainer.innerHTML += `
                <button id="seeMoreButton" class="card-button">See More</button>
            `;
            document.getElementById('seeMoreButton').addEventListener('click', () => {
                currentIndex += itemsPerPage; // Update index to show next set of breeds
                displayBreeds(); // Display next set of breeds
            });
        }
    } else {
        if (document.getElementById('seeMoreButton')) {
            document.getElementById('seeMoreButton').remove(); // Remove "See More" button if no more items to show
        }
    }

    // Add event listeners for favorite buttons if in 'gallery' view
    if (currentCategory === 'gallery') {
        addToFavorite();
    }
}

// Function to add event listeners to favorite buttons
function addToFavorite() {
    // Select buttons with the class 'fav'
    const buttons = document.getElementsByClassName('fav');

    // Convert HTMLCollection to array
    const btnsArr = Array.from(buttons);

    // Add click event listener to each button
    btnsArr.forEach(el => {
        el.addEventListener('click', (e) => {
            // Get the parent card
            const card = e.target.closest('.card');
            const imgSrc = card.querySelector('.card-image').src;
            const name = card.querySelector('.card-description').textContent;
            const description = card.querySelector('.card-description').textContent;
            const origin = card.querySelector('.card-origin') ? card.querySelector('.card-origin').textContent.replace('Origin: ', '') : 'Unknown';
            const temperament = card.querySelector('.card-temperament') ? card.querySelector('.card-temperament').textContent.replace('Temperament: ', '') : 'Unknown';

            // Toggle favorite status
            const isActive = e.target.classList.toggle('active');

            if (isActive) {
                // Add item to the favorite array
                favoriteArr.push({
                    image: { url: imgSrc },
                    name: name,
                    description: description,
                    origin: origin,
                    temperament: temperament
                });
                e.target.textContent = 'Added to Favorites';
                e.target.style.backgroundColor = 'pink'; // Change button color to red
            } else {
                // Remove item from the favorite array
                const index = favoriteArr.findIndex(fav => fav.name === name);
                if (index !== -1) {
                    favoriteArr.splice(index, 1);
                }
                e.target.textContent = 'Add to Favorites';
                e.target.style.backgroundColor = ''; // Reset button color
            }

            // Update favorite view if we are in the favorites category
            if (currentCategory === 'favorite') {
                displayBreeds();
            }
        });
    });
}

// Event listeners for filter buttons
allButton.addEventListener('click', () => {
    currentCategory = 'all';
    currentIndex = 0; // Reset index for new category
    displayBreeds();
});

breedButton.addEventListener('click', () => {
    currentCategory = 'breed';
    currentIndex = 0; // Reset index for new category
    displayBreeds();
});

galleryButton.addEventListener('click', () => {
    currentCategory = 'gallery';
    currentIndex = 0; // Reset index for new category
    displayBreeds();
});

favoriteButton.addEventListener('click', () => {
    currentCategory = 'favorite';
    currentIndex = 0; // Reset index for new category
    displayBreeds();
});

// Fetch and display breed data on page load
fetchBreeds();

// Add user to our database
const form = document.getElementById('form');

// Add an event listener for the form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addUser();
});

function addUser() {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const userStory = document.getElementById('story').value;

    const userObj = {
        name: fullname,
        email: email,
        story: userStory
    };

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObj)
    });
}
