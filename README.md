# LuxeCars - Sito Web Automobili Premium

Un sito web moderno e accattivante per la vendita di automobili di lusso, con design responsive e animazioni fluide.

## Caratteristiche

- **Design Moderno**: Interfaccia elegante con gradienti e animazioni
- **Responsive**: Ottimizzato per desktop, tablet e mobile
- **Animazioni Fluide**: Effetti scroll, hover e transizioni smooth
- **Sezioni Complete**:
  - Hero section con call-to-action
  - Collezione di auto premium con card dettagliate
  - Sezione "Chi Siamo" con statistiche animate
  - Form di contatto funzionale
  - Footer informativo

## Tecnologie Utilizzate

- HTML5
- CSS3 (con variabili CSS, Grid, Flexbox, animazioni)
- JavaScript (Vanilla JS)
- Google Fonts (Playfair Display, Poppins)

## Come Visualizzare il Sito

### Metodo 1: Apertura Diretta
1. Apri il file `index.html` nel tuo browser web preferito

### Metodo 2: Server Locale (Consigliato)
```bash
# Se hai Python installato:
python -m http.server 8000

# Oppure con Node.js:
npx http-server

# Poi apri: http://localhost:8000
```

## Struttura dei File

```
/
├── index.html      # Pagina principale
├── styles.css      # Stili e animazioni
├── script.js       # Interattività e animazioni JS
└── README.md       # Documentazione
```

## Funzionalità JavaScript

- **Menu Mobile**: Hamburger menu responsive
- **Smooth Scroll**: Navigazione fluida tra sezioni
- **Active Navigation**: Evidenziazione automatica link attivi
- **Counter Animation**: Animazione numerica per statistiche
- **Intersection Observer**: Animazioni on-scroll
- **Form Handling**: Gestione invio form con notifiche
- **Ripple Effect**: Effetto ripple sui pulsanti
- **Parallax Effect**: Effetto parallasse nell'hero section
- **Lazy Loading**: Pronto per immagini lazy-loaded

## Personalizzazione

### Colori
Modifica le variabili CSS in `styles.css`:
```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #d4af37;
    --accent-color: #ff6b6b;
    /* ... */
}
```

### Contenuti
- Modifica il testo in `index.html`
- Aggiungi nuove auto duplicando le card esistenti
- Sostituisci i placeholder SVG con immagini reali

### Immagini Reali
Per aggiungere immagini reali delle auto:
1. Sostituisci i `div.car-placeholder` con tag `<img>`
2. Aggiungi `data-src` per lazy loading
3. Il JavaScript gestirà automaticamente il caricamento

## Sezioni del Sito

1. **Home/Hero**: Introduzione accattivante con CTA
2. **Collezione**: Grid di 6 auto premium con dettagli
3. **Chi Siamo**: Informazioni aziendali con statistiche
4. **Contatti**: Form funzionale e informazioni di contatto

## Browser Supportati

- Chrome (ultima versione)
- Firefox (ultima versione)
- Safari (ultima versione)
- Edge (ultima versione)

## Possibili Miglioramenti Futuri

- [ ] Aggiungere immagini reali delle auto
- [ ] Implementare backend per form di contatto
- [ ] Aggiungere filtri per la collezione auto
- [ ] Implementare sistema di ricerca
- [ ] Aggiungere pagine dettaglio per ogni auto
- [ ] Integrare Google Maps per localizzazione showroom
- [ ] Aggiungere galleria immagini per ogni auto
- [ ] Implementare sistema di prenotazione test drive

## Licenza

Questo progetto è stato creato per scopi dimostrativi.

## Crediti

Design e sviluppo: LuxeCars Team
Font: Google Fonts (Playfair Display, Poppins)

---

Buona navigazione! Per qualsiasi domanda o supporto, contattaci a info@luxecars.it
