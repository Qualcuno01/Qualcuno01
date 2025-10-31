class Libro {
  constructor(isbn, copie, proprietario) {
    this.isbn = isbn;
    this.copie = parseInt(copie);
    this.proprietario = proprietario;
    this.prezzo = 10; // Prezzo fisso per copia
  }
}

let listaLibriAggiunti = [];
let listaLibriComprati = [];

function aggiungiLibro() {
  const isbn = document.getElementById('isbn').value;
  const copie = document.getElementById('copie').value;
  const proprietario = document.getElementById('nome').value;

  if (!isbn || !copie || !proprietario) {
    alert("Per favore, inserisci tutti i campi.");
    return;
  }

  const libro = new Libro(isbn, copie, proprietario);
  listaLibriAggiunti.push(libro);
  aggiornaListaLibri();

  document.getElementById('isbn').value = '';
  document.getElementById('copie').value = '';
  document.getElementById('nome').value = '';
}

function aggiornaListaLibri() {
  const listaElement = document.getElementById('itemList');
  listaElement.innerHTML = '';

  listaLibriAggiunti.forEach((libro) => {
    const li = document.createElement('li');
    li.textContent = `ISBN: ${libro.isbn}, Copie: ${libro.copie}, Prezzo: €${libro.prezzo}, Proprietario: ${libro.proprietario}`;
    listaElement.appendChild(li);
  });
}

function rimuovi() {
  const isbn = prompt("Inserisci ISBN del libro che vuoi comprare:");
  let libroTrovato = listaLibriAggiunti.find(libro => libro.isbn === isbn);

  if (libroTrovato) {
    listaLibriAggiunti = listaLibriAggiunti.filter(libro => libro.isbn !== isbn);
    listaLibriComprati.push(libroTrovato);
    aggiornaListaLibri();
    aggiornaCarrello();
    alert("Libro aggiunto al carrello!");
  } else {
    alert("Libro non trovato!");
  }
}

function aggiornaCarrello() {
  const cartItemsDiv = document.getElementById("cartItems");
  cartItemsDiv.innerHTML = "";

  let totale = 0;
  listaLibriComprati.forEach(libro => {
    const itemDiv = document.createElement("div");
    const prezzoTotale = libro.prezzo * libro.copie;
    itemDiv.textContent = `ISBN: ${libro.isbn}, Copie: ${libro.copie}, Proprietario: ${libro.proprietario}, Totale: €${prezzoTotale.toFixed(2)}`;
    cartItemsDiv.appendChild(itemDiv);
    totale += prezzoTotale;
  });

  document.getElementById("totalPrice").textContent = totale.toFixed(2);
}

document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const items = document.querySelectorAll('#itemList li');

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.classList.toggle('hidden', !text.includes(searchTerm));
  });
});

function logout() {
  window.location.href = "login.html";
}

function apriCarrello() {
  document.getElementById("popupCarrello").style.display = "block";
}

function chiudiCarrello() {
  document.getElementById("popupCarrello").style.display = "none";
}
function CreaBarCode(){
  const isbn = document.getElementById('isbn').value;
  if (!isbn) {
    alert("Per favore, inserisci un ISBN valido.");
    return;
  }

  const barcodeContainer = document.getElementById('barcodeContainer');
  barcodeContainer.innerHTML = ''; // Pulisce il contenitore precedente

  const barcode = document.createElement('img');
  barcode.src = `https://api.barcodes4.me/barcode/c128/${isbn}.png`;
  barcode.alt = 'Barcode';
  barcodeContainer.appendChild(barcode);
}