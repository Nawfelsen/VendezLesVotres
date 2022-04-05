// Setup the windows
const setup = () => {
  document.getElementById('logout').addEventListener('click', logout);
  document.getElementById('sellItem').addEventListener('click', askForItemCreation);
  document.getElementById('addMoney').addEventListener('click', addMoney);
  initUser();
  fillTable();
}
window.addEventListener('DOMContentLoaded', setup);

const initUser = async () => {
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch('/user/me', requestOptions)
  const user = await response.json();

  const name = document.getElementById('name');
  name.textContent = user.name;

  const money = document.getElementById('money');
  money.textContent = "Argent: " + user.money + "€";
  
}

// Add money to the user
const addMoney = async () => {
  const updateData = {
    moneyToAdd: parseFloat(moneyToAdd.value),
    userId: getCookie('user')
  };
  const bodyContent = JSON.stringify(updateData);
  const requestOptions = {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: bodyContent
  };
  const response = await fetch('/user/money', requestOptions);
  if(response.ok){
    initUser();
    fillTableOther();
  }

  
}



// fill all the table
const fillTable = async () => {
  fillTableMine();
  fillTableOther();
}

// fetch GET all item
const fillTableMine = async () => {
  const itemsTable = document.getElementById('itemToSell');
  itemsTable.textContent = '';
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch('/item/', requestOptions)
  const allItems = await response.json();
  if (allItems.length != 0) {
    const itemTitle = buildItemTitle();
    itemsTable.appendChild(itemTitle);
  }
  for (let item of allItems) {
    const itemElement = buildMineItemElement(item);
    itemsTable.appendChild(itemElement);
  }
}

// fetch GET other item
const fillTableOther = async () => {
  const itemsTable = document.getElementById('itemToBuy');
  itemsTable.textContent = '';
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch('/item/others', requestOptions)
  const otherItems = await response.json();

  if (otherItems.length != 0) {
    const itemTitle = buildItemTitle();
    itemsTable.appendChild(itemTitle);
  }

  for (let item of otherItems) {
    const itemElement = buildOtherItemElement(item);
    itemsTable.appendChild(itemElement);
  }
}

// Build the title for the table of item
const buildItemTitle = () => {
  const itemTitle = document.createElement('tr');
  const thDescription = document.createElement('th');
  const thPrice = document.createElement('th');

  thDescription.innerHTML = 'Description';
  thPrice.innerHTML = 'Prix';
  itemTitle.appendChild(thDescription);
  itemTitle.appendChild(thPrice);

  return itemTitle;
}

// Build the item element of the user
const buildMineItemElement = (item) => {
  const itemElement = document.createElement('tr');
  itemElement.appendChild(buildTD(item.description, 'Description'));
  itemElement.appendChild(buildTD(item.price + "€", 'prix'));
  const deleteButton = buildDeleteButton('Supprimer');
  deleteButton.addEventListener('click', () => deleteItem(item._id, deleteButton));
  itemElement.appendChild(deleteButton);
  return itemElement;
}

// Build the item element of the other user
const getUser = async () => {
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch(`/user/me`, requestOptions)
  const user = await response.json();
  return user;
}

// Build the item element of the other user
const buildOtherItemElement = (item) => {
  const itemElement = document.createElement('tr');
  itemElement.appendChild(buildTD(item.description, 'description'));
  itemElement.appendChild(buildTD(item.price + "€", 'price'));

  getUser().then(value => {
    if (value.money >= item.price) {
      const buyButton = buildBuyButton('Acheter');
      buyButton.addEventListener('click', () => buyItem(item._id, buyButton));
      itemElement.appendChild(buyButton);
    }
  });

  return itemElement;
}

// Build a row 
const buildTD = (content, className) => {
  const TDelement = document.createElement('td');
  TDelement.textContent = content;
  TDelement.className = className;
  return TDelement;
}

// Build delete button
const buildDeleteButton = label => {
  const button = document.createElement('input');
  button.type = 'button';
  button.value = label;
  button.className = 'btn btn-danger deleteItem';
  return button;
}

// Build buy button
const buildBuyButton = label => {
  const button = document.createElement('input');
  button.type = 'button';
  button.value = label;
  button.className = 'btn btn-success buyItem';
  return button;
}


// Extract the information from the cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Deconnexion
const logout = async () => {
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(`/access/logout`, requestOptions);
  if (response.ok) {
    window.location.href = "/";
  }
};

// Check if the item creation form is in good form
const checkCreation = () => {
  if (description.value == '' || price.value == '') {
    document.getElementById(
      "problem"
    ).textContent = `Description ou prix manquant`;
  }
  else if (isNaN(parseFloat(price.value))) {
    document.getElementById(
      "problem"
    ).textContent = `Le prix ne doit contenir que des nombres (si vous voulez insérer un nombre à virgule, veuillez le séparer par un point)`;
  }
  else if (price.value < 0) {
    document.getElementById(
      "problem"
    ).textContent = `Le prix ne peut pas être négatif`;
  }
  else {
    document.getElementById(
      "problem"
    ).textContent = ``;
  }
}


// item creation
const askForItemCreation =
  async () => {

    checkCreation();

    const newItemData = {
      description: description.value,
      price: price.value,
      userId: getCookie('user')
    };
    const bodyContent = JSON.stringify(newItemData);
    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: bodyContent
    };
    const response = await fetch('/item/create', requestOptions);

    if (response.ok) {
      fillTableMine();
      clearInputs();
    }
  }

// Clear the input
const clearInputs = function () {
  description.value = "";
  price.value = "";
}


// Delete item
const deleteItem =
  async (itemId) => {
    const requestOptions = {
      method: 'DELETE'
    };
    const response = await fetch(`/item/delete/${itemId}`, requestOptions);
    if (response.ok) {
      fillTableMine();
    }
  }

// User buy an item
const buyItem =
  async (itemId) => {

    const requestOptionsItem = {
      method: 'GET',
    };

    const responseItem = await fetch(`/item/${itemId}`, requestOptionsItem);

    if (responseItem.ok) {

      const item = await responseItem.json();
      const price = item.price;
      const sellerId = item.userId;

      const newItemData = {
        price: price,
        sellerId: sellerId,
        userId: getCookie('user')
      };
      const bodyContent = JSON.stringify(newItemData);

      const requestOptionsBuy = {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: bodyContent
      };
      const responseBuy = await fetch(`/user/buy/${itemId}`, requestOptionsBuy);
      if (responseBuy.ok) {
        const requestOptionsDelete = {
          method: 'DELETE'
        };
        const responseDelete = await fetch(`/item/delete/${itemId}`, requestOptionsDelete);
        if (responseDelete.ok) {
          fillTableOther();
          initUser();

          const last = document.getElementById("lastItem");
          last.innerHTML = "";

          const title = buildItemTitle();
          last.appendChild(title);

          const itemElement = document.createElement('tr');
          itemElement.appendChild(buildTD(item.description, 'Description'));
          itemElement.appendChild(buildTD(item.price + "€", 'prix'));
          last.appendChild(itemElement);
        }
      }
    }

  }