# Pizzeria da Gianni - Mockup Completo

## 📋 Descrizione Progetto

Questo è un mockup completo per il sito web di **Pizzeria da Gianni**, una pizzeria napoletana autentica.

## 📁 Struttura File

```
pizzeria-mockup/
├── index.html           # Pagina principale del sito
├── styles.css          # Tutti gli stili CSS
└── app.js              # JavaScript per l'interattività
```

## 🎨 Caratteristiche

### Pagine e Sezioni

1. **Home/Hero** - Introduzione con immagine di sfondo
2. **Menu** - Catalogo pizze con filtri per categoria
3. **Chi Siamo** - Storia della pizzeria
4. **Prenotazioni** - Form per prenotare un tavolo
5. **Zone di Consegna** - Verifica disponibilità consegna
6. **Contatti** - Informazioni e mappa

### Funzionalità Interattive

- ✅ **Carrello Shopping** - Aggiungi pizze al carrello
- ✅ **Sistema di Filtri** - Filtra per categoria (Classiche, Speciali, Bianche, Vegetariane)
- ✅ **Modal Prodotto** - Dettagli pizza con selezione dimensione
- ✅ **Modal Carrello** - Visualizza e modifica ordine
- ✅ **Login/Registrazione** - Sistema autenticazione (mockup)
- ✅ **Form Prenotazioni** - Prenota un tavolo
- ✅ **Verifica Consegna** - Controlla se consegnano nella tua zona
- ✅ **Ricerca Prodotti** - Cerca pizze nel menu
- ✅ **Responsive Design** - Funziona su mobile, tablet e desktop

### Design

- **Font**: Playfair Display (titoli) + Poppins (corpo)
- **Colori**: Arancione (#e67e22), Rosso (#c0392b), Crema (#fff8f0)
- **Animazioni**: Smooth scroll, fade-in, hover effects
- **Layout**: CSS Grid e Flexbox moderni

## 🚀 Come Usare

### Metodo 1: Apri Direttamente
```bash
cd pizzeria-mockup
# Apri index.html nel browser
```

### Metodo 2: Con Server HTTP
```bash
cd pizzeria-mockup
# Usando Python
python3 -m http.server 8080

# Oppure usando Node.js (se hai http-server installato)
npx http-server -p 8080

# Poi apri: http://localhost:8080
```

## 📱 Menu Prodotti (Dati Mock)

Il mockup include 6 pizze di esempio:

1. **Margherita** - €7.50
   - Pomodoro, mozzarella, basilico fresco
   - Vegetariana ⭐ 4.8

2. **Diavola** - €9.50
   - Pomodoro, mozzarella, salame piccante
   - Piccante 🌶️ ⭐ 4.7

3. **Quattro Formaggi** - €11.00
   - Mozzarella, gorgonzola, parmigiano, fontina
   - Vegetariana ⭐ 4.9

4. **Vegetariana** - €9.50
   - Pomodoro, mozzarella, melanzane, zucchine, peperoni
   - Vegetariana ⭐ 4.6

5. **Capricciosa** - €10.50
   - Pomodoro, mozzarella, prosciutto, funghi, carciofi, olive
   - ⭐ 4.8

6. **Bianca Bufala** - €12.50
   - Mozzarella di bufala, pomodorini, rucola, grana
   - Vegetariana ⭐ 5.0

Ogni pizza è disponibile in 3 dimensioni:
- **Piccola** (25cm) - Prezzo base
- **Media** (30cm) - +€3.00
- **Grande** (35cm) - +€5.00

## 🔧 Personalizzazione

### Modificare i Colori
Apri `styles.css` e modifica le variabili CSS all'inizio:
```css
:root {
  --primary-color: #e67e22;    /* Colore principale */
  --primary-dark: #d35400;     /* Colore scuro */
  --secondary-color: #c0392b;  /* Colore secondario */
}
```

### Aggiungere Pizze
Apri `app.js` e aggiungi prodotti nell'array `AppState.products`:
```javascript
{
  product_id: 7,
  product_name: 'Nuova Pizza',
  description: 'Descrizione ingredienti',
  base_price: 10.00,
  category_id: 1,
  is_vegetarian: true,
  avg_rating: 4.5,
  review_count: 100,
  sizes: [...]
}
```

### Modificare le Zone di Consegna
Apri `app.js` e modifica l'array `validZones` nella funzione `checkDelivery()`:
```javascript
const validZones = ['37100', '37121', '37122', ...];
```

## 📖 Documentazione Completa

Per informazioni dettagliate su database, API backend, e deployment:
- **API_DOCUMENTATION.md** - Documentazione API complete
- **PIZZERIA_PROJECT_DOCUMENTATION.md** - Guida completa progetto

## 🎯 Funzionalità Mockup vs Reali

### Attualmente Funzionante (Mockup)
✅ Navigazione e scroll smooth
✅ Visualizzazione menu con filtri
✅ Apertura dettagli prodotto
✅ Aggiunta al carrello (localStorage)
✅ Calcolo totale carrello
✅ Form prenotazioni (solo frontend)
✅ Verifica zona consegna (CAP hardcoded)
✅ Responsive design

### Da Implementare (Backend Richiesto)
⏳ Autenticazione utenti vera
⏳ Salvataggio ordini nel database
⏳ Processamento pagamenti
⏳ Email conferma ordini
⏳ Admin dashboard
⏳ Tracking ordini real-time
⏳ Sistema recensioni persistente

## 🌐 Zone di Consegna Mockup

Il sistema riconosce questi CAP come validi:

- **Centro Città**: 37100, 37121, 37122
  - Consegna: €2.50 | Tempo: 30 min

- **Zona Nord**: 37123, 37124, 37125
  - Consegna: €4.00 | Tempo: 45 min

- **Zona Sud**: 37126, 37127, 37128
  - Consegna: €4.00 | Tempo: 45 min

- **Periferia**: 37129, 37130, 37131
  - Consegna: €5.50 | Tempo: 60 min

## 💡 Note Tecniche

### LocalStorage
Il carrello per utenti non loggati viene salvato in localStorage:
```javascript
localStorage.setItem('guest_cart', JSON.stringify(cart));
```

### Dati Mockup
Tutti i dati sono hardcoded in `app.js`. Per usare dati reali:
1. Implementa backend (Node.js/Express)
2. Crea database MySQL
3. Modifica `API_BASE_URL` in `app.js`
4. Sostituisci le chiamate mock con chiamate API reali

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Screenshot Sezioni

### Hero Section
- Background immagine pizzeria
- Titolo principale
- Bottoni CTA (Esplora Menu, Prenota Tavolo)
- Badge caratteristiche (100% Italiano, Forno a Legna, Consegna Veloce)

### Menu Section
- Grid responsive
- Card prodotti con immagini
- Badge (Vegetariano, Piccante, Popolare)
- Rating stelle
- Prezzo da...
- Bottone "Aggiungi"

### Modal Carrello
- Lista prodotti nel carrello
- Controlli quantità (+/-)
- Subtotale, consegna, IVA
- Totale finale
- Campo codice promozionale
- Bottone checkout

### Form Prenotazioni
- Nome e telefono
- Email e numero persone
- Data e ora
- Note speciali
- Bottone "Prenota Ora"

## 📞 Informazioni Contatto (Mockup)

**Indirizzo**: Via Roma 123, 37100 Verona (VR)
**Telefono**: +39 045 123456
**Email**: info@pizzeriadagianni.it

**Orari di Apertura**:
- Lunedì: 18:00 - 23:00
- Mar-Gio: 12:00-15:00, 18:00-23:00
- Ven-Sab: 12:00-15:00, 18:00-00:00
- Domenica: 12:00-15:00, 18:00-23:00

## 🔐 Credenziali Test (Non Reali)

Per testare il sistema di login (mockup):
- Email: `test@pizzeria.it`
- Password: `qualsiasi`

**Nota**: Il login è solo mockup, non salva realmente dati.

## 🚧 Sviluppi Futuri

### Fase 1 - Backend Base
- [ ] Setup server Node.js/Express
- [ ] Database MySQL
- [ ] API REST per prodotti
- [ ] API autenticazione JWT
- [ ] API ordini e carrello

### Fase 2 - Funzionalità Avanzate
- [ ] Sistema pagamenti (Stripe/PayPal)
- [ ] Email automatiche
- [ ] SMS notifiche
- [ ] Tracking ordini real-time
- [ ] Admin dashboard

### Fase 3 - Mobile & PWA
- [ ] Progressive Web App
- [ ] Push notifications
- [ ] App mobile React Native
- [ ] Geolocalizzazione

## 👨‍💻 Crediti

**Mockup Creato da**: Terry - Terragon Labs
**Data**: Ottobre 2025
**Versione**: 1.0.0

---

## 📄 Licenza

Progetto educativo per ITIS MARCONI VERONA

---

**Buon divertimento con il mockup! 🍕**
