function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex"; 
    } else {
        menu.style.display = "none";
    }
}

const images = {
  top: JSON.parse(localStorage.getItem("topImages")) || [],
  bottom: JSON.parse(localStorage.getItem("bottomImages")) || [],
  shoes: JSON.parse(localStorage.getItem("shoesImages")) || [],
};

// Keep track of the current index for each section
const currentIndex = {
  top: 0,
  bottom: 0,
  shoes: 0,
};

// Function to handle image uploads
function uploadImage(event, section) {
  const file = event.target.files[0]; // Get the uploaded file
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      images[section].push(e.target.result); // Add the uploaded image to the array
      localStorage.setItem(`${section}Images`, JSON.stringify(images[section])); // Save to localStorage
      currentIndex[section] = images[section].length - 1; // Set the current index to the new image
      displayImage(section); // Update the displayed image
    };
    reader.readAsDataURL(file); // Convert file to Base64
  }
}

// Function to display the current image for a section
function displayImage(section) {
  const imgElement = document.getElementById(`${section}-item`);
  console.log(`Section: ${section}, imgElement:`, imgElement);
  if (images[section].length > 0) {
    imgElement.src = images[section][currentIndex[section]]; // Display the current image
    imgElement.style.display = "block";
  } else {
    imgElement.style.display = "none"; // Hide the image if there are no images
  }
}

// Function to navigate to the previous image
function prevImage(section) {
  if (images[section].length > 0) {
    currentIndex[section] =
      (currentIndex[section] - 1 + images[section].length) %
      images[section].length;
    displayImage(section);
  }
}

// Function to navigate to the next image
function nextImage(section) {
  if (images[section].length > 0) {
    currentIndex[section] =
      (currentIndex[section] + 1) % images[section].length;
    displayImage(section);
  }
}

// Initialize images on page load
function initializeImages() {
  Object.keys(images).forEach((section) => displayImage(section)); // Display images for all sections
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initializeImages);

function deleteCurrentImage(section) {
  if (images[section].length > 0) {
    // Remove the current image
    images[section].splice(currentIndex[section], 1);

    // Update localStorage
    localStorage.setItem(`${section}Images`, JSON.stringify(images[section]));

    // Adjust the current index to avoid out-of-bounds issues
    if (currentIndex[section] >= images[section].length) {
      currentIndex[section] = images[section].length - 1;
    }

    // Refresh the displayed image
    displayImage(section);
  } else {
    console.log(`No images to delete in section: ${section}`);
  }
}

function dressMe() {
  // Iterate through each section
  Object.keys(images).forEach((section) => {
    if (images[section].length > 0) {
      // Randomly select an index within the range of the images array
      currentIndex[section] = Math.floor(
        Math.random() * images[section].length
      );
      displayImage(section); // Update the displayed image for the section
    } else {
      console.log(`No images available for section: ${section}`);
    }
  });
}
