# Site Mockup Documentation

## Overview
This repository contains two main web applications with a shared authentication system:

1. **Book Management System** (Gestionale Prova)
2. **Pizzeria da Gianni Website**
3. **Login Authentication**

## Viewing the Mockup

Open `SITE_MOCKUP.html` in any modern web browser to see the complete visual design overview of all systems.

---

## 1. Book Management System (Sito.html)

### Purpose
A complete inventory management system for books with ISBN tracking, shopping cart, and barcode generation.

### Key Features
- ISBN-based book tracking
- Copy quantity management
- Owner/proprietor tracking
- Shopping cart with price calculation
- Barcode generation via API
- Real-time search filtering
- User logout functionality

### Color Palette
- Background: `#ECECEC` (Light Gray)
- Primary Action: `#F44336` (Red)
- Secondary Action: `#2196F3` (Blue)
- Success Action: `#4CAF50` (Green)
- List Items: `#F4F4F4` (Off-white)
- Footer: `#161515` (Dark Gray)

### Typography
- Font Family: Arial, sans-serif
- Heading Size: 1.8rem
- Body Text: 14-16px
- Button Font: Georgia with fallback

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ [Logout] [Carrello] [Barcode]     (Fixed) │
├─────────────────────────────────────────────┤
│         Benvenuto nel Gestionale            │
├─────────────────────────────────────────────┤
│  ISBN Input | Copie Input | Nome Input     │
│  [Aggiungi Libro] [Compra Libro]           │
├─────────────────────────────────────────────┤
│  Search: [____________]                     │
├─────────────────────────────────────────────┤
│  Libri Aggiunti:                            │
│  • ISBN: 123, Copie: 3, €10, Owner: Mario  │
│  • ISBN: 456, Copie: 2, €10, Owner: Luigi  │
└─────────────────────────────────────────────┘
│         Footer: Project Info      (Fixed)  │
└─────────────────────────────────────────────┘
```

### Technical Implementation
- **Class-based OOP**: `Libro` class for book objects
- **State Management**: Arrays for added and purchased books
- **DOM Manipulation**: Dynamic list updates
- **Event Handling**: Search filtering, button clicks
- **Modal System**: Popup for shopping cart
- **External API**: Barcode generation (barcodes4.me)

---

## 2. Pizzeria Website (Pizzeria_site.html)

### Purpose
A modern restaurant website for "Pizzeria da Gianni" with menu search and navigation.

### Key Features
- Restaurant branding and identity
- Search functionality for menu items
- Dropdown navigation menu
- Sustainable menu popup window
- Contact information display
- Modern gradient design

### Color Palette
- Background Gradient: `#FFF8F0` to `#F7C873`
- Navbar: `rgba(207, 180, 89, 0.95)`
- Primary Accent: `#E67E22` (Orange)
- Dark Accent: `#D35400` (Dark Orange)
- Hover State: `#FFE5D0` (Light Peach)

### Typography
- Font Family: Segoe UI, Arial, sans-serif
- Brand Name: 1.7rem, bold, letter-spacing: 1px
- Welcome Heading: 2rem
- Body Text: Standard 1rem

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ Pizzeria da Gianni  [Search] [Menu ▼]      │
├─────────────────────────────────────────────┤
│                                             │
│             ┌─────────────────┐             │
│             │   Welcome Box   │             │
│             │  Benvenuto!     │             │
│             │  Scopri menu... │             │
│             └─────────────────┘             │
│                                             │
├─────────────────────────────────────────────┤
│  © 2025 Pizzeria da Gianni - Via Roma...   │
└─────────────────────────────────────────────┘
```

### Navigation Menu
- Menù (opens menu_sostenibile.html in popup)
- Gestionale (link to management system)
- Contattaci (contact information)

### Design Features
- Gradient backgrounds (linear-gradient 135deg)
- Box shadows for depth (`0 2px 8px`)
- Rounded corners (8-18px)
- Dropdown on hover
- Fixed footer
- Centered content cards with transparency

---

## 3. Login System (Login.html)

### Purpose
Secure authentication gateway for the book management system.

### Key Features
- Username and password validation
- Error message display
- Clean minimal interface
- Password field masking
- Redirect on successful login

### Credentials
- **Username**: `admin`
- **Password**: `libresco`
- **Redirect**: `Sito.html`

### Color Palette
- Background: `#ECECEC` (Light Gray)
- Card Background: `#FFFFFF` (White)
- Button Primary: `#4CAF50` (Green)
- Button Hover: `#45A049` (Dark Green)
- Error Text: Red

### Layout Structure
```
┌─────────────────────────────────────────────┐
│                                             │
│         ┌───────────────────┐               │
│         │ Login al Gestio.  │               │
│         │ [_____________]   │               │
│         │ [_____________]   │               │
│         │ [    Accedi    ]  │               │
│         └───────────────────┘               │
│                                             │
└─────────────────────────────────────────────┘
```

### Design Features
- Flexbox centering (vertical & horizontal)
- Card-based container
- Box shadow elevation (`0 4px 8px`)
- Responsive width (max-width: 400px)
- Rounded corners (8px)
- Hover states on button

---

## Shared Style System (style.css)

### Common Components

#### Buttons
```css
padding: 10-15px
border-radius: 4-5px
font-size: 14-16px
cursor: pointer
transition on hover
```

#### Inputs
```css
padding: 10-12px
border: 1-2px solid
border-radius: 4px
width: 100% or max-width
margin: 10-20px
```

#### Modals
```css
position: fixed
full viewport overlay
centered content
rgba background
z-index: 1
```

#### Footer
```css
position: fixed
bottom: 0
full width
dark background
white text
centered content
```

---

## File Structure

```
/root/repo/
├── Sito/
│   ├── Sito.html              # Main book management app
│   ├── Pizzeria_site.html     # Pizzeria website
│   ├── Login.html             # Authentication page
│   ├── menu_sostenibile.html  # Popup menu
│   ├── style.css              # Shared styles
│   ├── script.js              # Main JavaScript logic
│   ├── img.png                # General image
│   └── favicon.png            # Site icon
├── SITE_MOCKUP.html           # Visual design mockup
├── MOCKUP_README.md           # This file
└── README.md                  # Project readme
```

---

## Technical Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Gradients, Transitions
- **JavaScript ES6**: Classes, Arrow functions, Array methods

### JavaScript Features
- Object-Oriented Programming (OOP)
- DOM Manipulation
- Event Listeners
- Array manipulation (push, filter, find)
- Modal management
- Client-side validation
- Window navigation

### No Dependencies
All code is vanilla JavaScript with no external libraries or frameworks.

---

## Design Principles

### Visual Hierarchy
1. Fixed navigation/action buttons at top
2. Primary content in center with cards
3. Fixed footer at bottom

### Color Usage
- **Red (#F44336)**: Destructive/logout actions
- **Blue (#2196F3)**: Secondary actions
- **Green (#4CAF50)**: Success/submit actions
- **Orange (#E67E22)**: Restaurant/food theme

### Spacing
- Padding: 10-40px based on importance
- Margins: 5-50px for vertical rhythm
- Gap: 10-30px for flex/grid layouts

### Borders & Shadows
- Border radius: 4-20px (subtle to prominent)
- Box shadows: 0 2-20px for depth
- Border width: 1-4px for emphasis

---

## Browser Compatibility

Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- CSS Grid
- Flexbox
- ES6 JavaScript
- CSS Gradients
- Box Shadow
- Border Radius

---

## Future Enhancements

### Book Management System
- Backend database integration
- User authentication system
- PDF export of cart
- Email notifications
- Advanced search filters
- Multi-language support

### Pizzeria Website
- Online ordering system
- Payment integration
- Table reservation
- Menu photo gallery
- Customer reviews
- Social media integration

### Overall
- Responsive mobile design
- Progressive Web App (PWA)
- Accessibility improvements (ARIA)
- Performance optimization
- SEO optimization

---

## Credits

**Project Created By**: Popovschi Florin Antonio
**Institution**: ITIS MARCONI VERONA, Piazzale Guardini 1 VR
**Mockup Created By**: Terry - Terragon Labs
**Date**: 2025

---

## Usage Instructions

### Running Locally
1. Clone the repository
2. Open `Login.html` in a web browser
3. Login with credentials: admin / libresco
4. Navigate through the system

### Viewing Mockup
1. Open `SITE_MOCKUP.html` in any modern browser
2. Scroll through the design specifications
3. Review color schemes and layouts

### Development
1. Edit HTML files in `/Sito` directory
2. Modify styles in `style.css`
3. Update logic in `script.js`
4. Test in multiple browsers

---

## License

Educational project - ITIS MARCONI VERONA

---

## Contact

For questions or contributions, please contact through the GitHub repository.
