function showInstructions() {
  const modal = document.getElementById("instructions-modal");
  modal.style.display = "flex"; 
}

function closeInstructions() {
  const modal = document.getElementById("instructions-modal");
  modal.style.display = "none"; 
}


window.addEventListener("click", function (event) {
  const modal = document.getElementById("instructions-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


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

const currentIndex = {
  top: 0,
  bottom: 0,
  shoes: 0,
};

function uploadImage(event, section) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      images[section].push(e.target.result); 
      localStorage.setItem(`${section}Images`, JSON.stringify(images[section])); 
      currentIndex[section] = images[section].length - 1; 
      displayImage(section); 
    };
    reader.readAsDataURL(file); 
  }
}

function displayImage(section) {
  const imgElement = document.getElementById(`${section}-item`);
  console.log(`Section: ${section}, imgElement:`, imgElement);
  if (images[section].length > 0) {
    imgElement.src = images[section][currentIndex[section]]; 
    imgElement.style.display = "block";
  } else {
    imgElement.style.display = "none"; 
  }
}

function prevImage(section) {
  if (images[section].length > 0) {
    currentIndex[section] =
      (currentIndex[section] - 1 + images[section].length) %
      images[section].length;
    displayImage(section);
  }
}

function nextImage(section) {
  if (images[section].length > 0) {
    currentIndex[section] =
      (currentIndex[section] + 1) % images[section].length;
    displayImage(section);
  }
}

function initializeImages() {
  Object.keys(images).forEach((section) => displayImage(section)); 
}

document.addEventListener("DOMContentLoaded", initializeImages);

function deleteCurrentImage(section) {
  if (images[section].length > 0) {
    images[section].splice(currentIndex[section], 1);

    localStorage.setItem(`${section}Images`, JSON.stringify(images[section]));

    if (currentIndex[section] >= images[section].length) {
      currentIndex[section] = images[section].length - 1;
    }

    displayImage(section);
  } else {
    console.log(`No images to delete in section: ${section}`);
  }
}

function dressMe() {
  Object.keys(images).forEach((section) => {
    if (images[section].length > 0) {
  
      currentIndex[section] = Math.floor(
        Math.random() * images[section].length
      );
      displayImage(section); 
    } else {
      console.log(`No images available for section: ${section}`);
    }
  });
}

let savedOutfits = JSON.parse(localStorage.getItem("savedOutfits")) || []; 
let isOutfitsContainerVisible = false; 

function toggleOutfits() {
  const container = document.getElementById("saved-outfits-container");

  isOutfitsContainerVisible = !isOutfitsContainerVisible;
  container.style.display = isOutfitsContainerVisible ? "block" : "none";

  updateOutfitContainerVisibility(); 
}

function updateOutfitContainerVisibility() {
  const savedOutfitsContainer = document.getElementById("saved-outfits-container");
  const noOutfitsMessage = document.getElementById("no-outfits-message");

  const hasOutfits = savedOutfits.length > 0; 

  noOutfitsMessage.style.display = hasOutfits ? "none" : "block";

  if (isOutfitsContainerVisible) {
    savedOutfitsContainer.style.display = "block";
  } else {
    savedOutfitsContainer.style.display = "none";
  }
}

function saveOutfit() {
  if (savedOutfits.length >= 10) {
    alert("You can only save up to 10 outfits! Please delete an outfit before saving a new one.");
    return; 
  }

  const outfit = {
    top: images.top[currentIndex.top],
    bottom: images.bottom[currentIndex.bottom],
    shoes: images.shoes[currentIndex.shoes],
  };

  savedOutfits.push(outfit);
  localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));

  refreshOutfits(); 
  updateOutfitContainerVisibility(); 
}

function loadOutfit(index) {
  const outfit = savedOutfits[index];
  if (outfit) {
    images.top[currentIndex.top] = outfit.top;
    images.bottom[currentIndex.bottom] = outfit.bottom;
    images.shoes[currentIndex.shoes] = outfit.shoes;
    displayImage("top");
    displayImage("bottom");
    displayImage("shoes");
  }
}

function deleteOutfit(index) {
  savedOutfits.splice(index, 1); 
  localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits)); 

  refreshOutfits(); 
  updateOutfitContainerVisibility(); 
}

function refreshOutfits() {
  const container = document.getElementById("saved-outfits-container");
  container.innerHTML = ""; 

  savedOutfits.forEach((outfit, index) => {
    const outfitWrapper = document.createElement("div");
    outfitWrapper.className = "outfit-wrapper";

    const outfitButton = document.createElement("button");
    outfitButton.className = "outfit-button";
    outfitButton.textContent = `Outfit ${index + 1}`;
    outfitButton.onclick = () => loadOutfit(index); // Load outfit on click
    outfitWrapper.appendChild(outfitButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteOutfit(index); // Delete outfit on click
    outfitWrapper.appendChild(deleteButton);

    container.appendChild(outfitWrapper);
  });
}

function initializeSavedOutfits() {
  refreshOutfits();
  updateOutfitContainerVisibility();
}

document.addEventListener("DOMContentLoaded", initializeSavedOutfits);

