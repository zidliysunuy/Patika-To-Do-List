// ******* Select Items **********

const input = document.querySelector("#task");
const list = document.querySelector("#list");
let form = document.querySelector("form");
let submitBtn = document.querySelector(".button");

//********** Event Listeners ***********/

// Display Items Onload
window.addEventListener("DOMContentLoaded", setupItems);

//Submit Form
form.addEventListener("submit", addItem);
form.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
    }
});

// Edit Option
let editElement;
let editFlag = false;
let editID = "";

// *********** Functions *************

// Add Item
function addItem(event) {
    const value = input.value;
    const id = new Date().getTime().toString();
    event.preventDefault();

    if (value != "" && value.trim() !== "" && !editFlag) {
        const elemenet = document.createElement("li");
        let attr = document.createAttribute("data-id");
        attr.value = id;
        elemenet.setAttributeNode(attr);
        elemenet.innerHTML += `<!-- edit btn -->
    <p class="title">${value}</p>
        <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
        </button>    
        <button type="button" id="deleteButton"  class="close">&times</button>`;

        // Append Child
        list.appendChild(elemenet);
        // set local storage
        addToLocalStorage(id, value);
        // Set Back to Default
        setBackToDefault();
        // Display Alert
        toastSucces();
    } else if (value !== "" && editFlag) {
        editElement.innerHTML = value;

        // Edit Local Storage
        editLocalStorage(editID, value);
        toastSucces();
        setBackToDefault();
    } else {
        toastDanger();
    }
}

list.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    } else if (e.target.classList.contains("close")) {
        const element = e.target.parentElement;
        const id = element.dataset.id;
        list.removeChild(element);

        // Remove From Local Storage
        removeFromLocalStorage(id);
        setBackToDefault();
    } else {
        const element = e.target.parentElement;

        // Set Edit Item
        editElement = e.target.parentElement.previousElementSibling;
        // console.log(e.target.parentElement.previousElementSibling)

        // Set Form Value
        input.value = editElement.innerHTML;
        editFlag = true;
        editID = element.parentElement.dataset.id;
        submitBtn.textContent = "Edit Text";
    }
});

//******** Set Back to Defaults *********
function setBackToDefault() {
    input.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "ADD";
}

// ******************* Set Alert ************
function toastSucces() {
    let toastsuccesful = document.querySelector(".toast");
    let toastAlertsuccesful = new bootstrap.Toast(toastsuccesful);
    toastAlertsuccesful.show();
}
function toastDanger() {
    let toastfailed = document.querySelector(".error");
    let toastAlertfailed = new bootstrap.Toast(toastfailed);
    toastAlertfailed.show();
}

// ********* local storage ************

// add to local storage
function addToLocalStorage(id, value) {
    const temp = { id, value };
    let items = getLocalStorage();
    items.push(temp);
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}
//   SETUP LOCALSTORAGES.REMOVEITEM("LIST")

//  *********** Setup Items **********

function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });
    }
}

function createListItem(id, value) {
    const elemenet = document.createElement("li");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    elemenet.setAttributeNode(attr);
    elemenet.innerHTML += `<!-- edit btn -->
    <p class="title">${value}</p>
        <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
        </button>    
        <button type="button" id="deleteButton"  class="close">&times</button>`;

    // Append Child
    list.appendChild(elemenet);
}