# Pizzeria da Gianni - API Documentation

## Base URL
```
Production: https://api.pizzeriadagianni.it/v1
Development: http://localhost:3000/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 1. Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "mario.rossi@email.com",
  "password": "SecurePass123!",
  "first_name": "Mario",
  "last_name": "Rossi",
  "phone": "+39 333 1234567"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "mario.rossi@email.com",
    "first_name": "Mario",
    "last_name": "Rossi",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "mario.rossi@email.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "mario.rossi@email.com",
    "first_name": "Mario",
    "last_name": "Rossi",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "last_login": "2025-10-31T10:30:00Z"
  }
}
```

#### POST /auth/logout
Logout current user (invalidate token).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 2. Products (Menu)

#### GET /products
Get all products with filtering and pagination.

**Query Parameters:**
- `category_id` (optional): Filter by category
- `vegetarian` (optional): Filter vegetarian items (true/false)
- `vegan` (optional): Filter vegan items (true/false)
- `available` (optional): Filter available items (true/false)
- `search` (optional): Search in name and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example:** `GET /products?category_id=1&vegetarian=true&page=1&limit=10`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "product_id": 1,
        "product_name": "Margherita",
        "description": "Pomodoro, mozzarella, basilico fresco",
        "base_price": 7.50,
        "image_url": "/images/pizzas/margherita.jpg",
        "category_name": "Pizze Classiche",
        "is_available": true,
        "is_vegetarian": true,
        "is_vegan": false,
        "is_gluten_free": false,
        "calories": 800,
        "preparation_time": 15,
        "avg_rating": 4.8,
        "review_count": 156,
        "sizes": [
          {
            "size_id": 1,
            "size_name": "Piccola (25cm)",
            "size_code": "S",
            "price": 7.50
          },
          {
            "size_id": 2,
            "size_name": "Media (30cm)",
            "size_code": "M",
            "price": 10.50
          },
          {
            "size_id": 3,
            "size_name": "Grande (35cm)",
            "size_code": "L",
            "price": 12.50
          }
        ],
        "ingredients": [
          {
            "ingredient_id": 1,
            "ingredient_name": "Mozzarella",
            "is_removable": true
          },
          {
            "ingredient_id": 2,
            "ingredient_name": "Pomodoro",
            "is_removable": false
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 47,
      "items_per_page": 10
    }
  }
}
```

#### GET /products/:id
Get detailed information about a specific product.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "product_id": 1,
    "product_name": "Margherita",
    "description": "Pomodoro, mozzarella, basilico fresco",
    "base_price": 7.50,
    "image_url": "/images/pizzas/margherita.jpg",
    "category_id": 1,
    "category_name": "Pizze Classiche",
    "is_available": true,
    "is_vegetarian": true,
    "is_vegan": false,
    "is_gluten_free": false,
    "is_spicy": false,
    "calories": 800,
    "preparation_time": 15,
    "avg_rating": 4.8,
    "review_count": 156,
    "sizes": [...],
    "ingredients": [...],
    "reviews": [...]
  }
}
```

#### GET /categories
Get all product categories.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category_id": 1,
        "category_name": "Pizze Classiche",
        "description": "Le nostre pizze tradizionali napoletane",
        "image_url": "/images/categories/classiche.jpg",
        "product_count": 10
      }
    ]
  }
}
```

---

### 3. Cart Management

#### GET /cart
Get current user's cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "cart_items": [
      {
        "cart_id": 1,
        "product_id": 1,
        "product_name": "Margherita",
        "size_id": 2,
        "size_name": "Media (30cm)",
        "quantity": 2,
        "unit_price": 10.50,
        "total_price": 21.00,
        "image_url": "/images/pizzas/margherita.jpg",
        "customizations": [
          {
            "ingredient_id": 5,
            "ingredient_name": "Funghi",
            "customization_type": "add",
            "price_adjustment": 1.50
          }
        ]
      }
    ],
    "summary": {
      "subtotal": 21.00,
      "item_count": 2
    }
  }
}
```

#### POST /cart
Add item to cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "product_id": 1,
  "size_id": 2,
  "quantity": 1,
  "customizations": [
    {
      "ingredient_id": 5,
      "customization_type": "add"
    },
    {
      "ingredient_id": 3,
      "customization_type": "remove"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart_id": 1,
    "product_id": 1,
    "quantity": 1
  }
}
```

#### PUT /cart/:cart_id
Update cart item quantity.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

#### DELETE /cart/:cart_id
Remove item from cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

#### DELETE /cart
Clear entire cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### 4. Orders

#### POST /orders
Create a new order from cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "order_type": "delivery",
  "payment_method": "card",
  "delivery_address_id": 1,
  "special_instructions": "Suonare il campanello due volte",
  "promo_code": "BENVENUTO10"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "order_number": "GIO-20251031-0123",
    "order_type": "delivery",
    "order_status": "pending",
    "payment_status": "pending",
    "subtotal": 21.00,
    "delivery_fee": 2.50,
    "tax_amount": 5.17,
    "discount_amount": 2.10,
    "total_amount": 26.57,
    "estimated_delivery_time": "2025-10-31T12:30:00Z",
    "created_at": "2025-10-31T11:15:00Z"
  }
}
```

#### GET /orders
Get user's order history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 123,
        "order_number": "GIO-20251031-0123",
        "order_type": "delivery",
        "order_status": "completed",
        "total_amount": 26.57,
        "created_at": "2025-10-31T11:15:00Z",
        "item_count": 3
      }
    ],
    "pagination": {...}
  }
}
```

#### GET /orders/:order_id
Get detailed order information.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "order_number": "GIO-20251031-0123",
    "order_type": "delivery",
    "order_status": "out-for-delivery",
    "payment_status": "paid",
    "payment_method": "card",
    "subtotal": 21.00,
    "delivery_fee": 2.50,
    "tax_amount": 5.17,
    "discount_amount": 2.10,
    "total_amount": 26.57,
    "delivery_address": {
      "street_address": "Via Roma 123",
      "city": "Verona",
      "postal_code": "37100"
    },
    "estimated_delivery_time": "2025-10-31T12:30:00Z",
    "special_instructions": "Suonare il campanello due volte",
    "items": [
      {
        "product_name": "Margherita",
        "size_name": "Media",
        "quantity": 2,
        "unit_price": 10.50,
        "total_price": 21.00,
        "customizations": [...]
      }
    ],
    "created_at": "2025-10-31T11:15:00Z"
  }
}
```

#### POST /orders/:order_id/cancel
Cancel an order (only if status is 'pending' or 'confirmed').

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### 5. Reviews

#### POST /reviews
Submit a product review.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "product_id": 1,
  "order_id": 123,
  "rating": 5,
  "review_title": "Ottima pizza!",
  "review_text": "La migliore Margherita di Verona. Ingredienti freschi e impasto perfetto."
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Review submitted successfully. Awaiting approval.",
  "data": {
    "review_id": 45
  }
}
```

#### GET /products/:product_id/reviews
Get reviews for a specific product.

**Query Parameters:**
- `page` (optional)
- `limit` (optional)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "review_id": 45,
        "user_name": "Mario R.",
        "rating": 5,
        "review_title": "Ottima pizza!",
        "review_text": "La migliore Margherita di Verona...",
        "created_at": "2025-10-30T15:20:00Z",
        "admin_response": null
      }
    ],
    "summary": {
      "avg_rating": 4.8,
      "total_reviews": 156,
      "rating_distribution": {
        "5": 120,
        "4": 25,
        "3": 8,
        "2": 2,
        "1": 1
      }
    }
  }
}
```

---

### 6. Reservations

#### POST /reservations
Create a table reservation.

**Headers:** `Authorization: Bearer <token>` (optional for guest reservations)

**Request Body:**
```json
{
  "reservation_date": "2025-11-05",
  "reservation_time": "20:00",
  "party_size": 4,
  "customer_name": "Mario Rossi",
  "customer_phone": "+39 333 1234567",
  "customer_email": "mario@email.com",
  "special_requests": "Tavolo vicino alla finestra"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "reservation_id": 78,
    "reservation_date": "2025-11-05",
    "reservation_time": "20:00",
    "party_size": 4,
    "status": "pending"
  }
}
```

#### GET /reservations
Get user's reservations.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### GET /reservations/:id
Get reservation details.

**Response:** `200 OK`

#### DELETE /reservations/:id
Cancel a reservation.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### 7. Addresses

#### GET /addresses
Get user's saved addresses.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "address_id": 1,
        "address_type": "home",
        "street_address": "Via Roma 123",
        "city": "Verona",
        "postal_code": "37100",
        "province": "VR",
        "is_default": true,
        "delivery_notes": "Citofono: Rossi"
      }
    ]
  }
}
```

#### POST /addresses
Add a new address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "address_type": "work",
  "street_address": "Via Mazzini 45",
  "city": "Verona",
  "postal_code": "37121",
  "province": "VR",
  "is_default": false,
  "delivery_notes": "Ufficio al secondo piano"
}
```

**Response:** `201 Created`

#### PUT /addresses/:id
Update an address.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### DELETE /addresses/:id
Delete an address.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### 8. Promo Codes

#### POST /promo-codes/validate
Validate a promo code.

**Request Body:**
```json
{
  "code": "BENVENUTO10",
  "order_amount": 25.00
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "code": "BENVENUTO10",
    "discount_type": "percentage",
    "discount_value": 10.00,
    "discount_amount": 2.50,
    "min_order_amount": 15.00,
    "message": "Codice valido! Risparmia €2.50"
  }
}
```

---

### 9. Delivery Zones

#### GET /delivery-zones/check
Check if delivery is available for a postal code.

**Query Parameters:**
- `postal_code`: The postal code to check

**Example:** `GET /delivery-zones/check?postal_code=37100`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "available": true,
    "zone_name": "Centro Città",
    "delivery_fee": 2.50,
    "min_order_amount": 10.00,
    "estimated_delivery_time": 30
  }
}
```

---

### 10. Restaurant Info

#### GET /info/opening-hours
Get restaurant opening hours.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "opening_hours": [
      {
        "day_of_week": "Monday",
        "open_time": "18:00",
        "close_time": "23:00",
        "is_closed": false
      }
    ],
    "is_currently_open": true,
    "next_opening": null
  }
}
```

#### GET /info/contact
Get contact information.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "name": "Pizzeria da Gianni",
    "address": "Via Roma 123, 37100 Verona (VR)",
    "phone": "+39 045 123456",
    "email": "info@pizzeriadagianni.it",
    "social": {
      "facebook": "https://facebook.com/pizzeriadagianni",
      "instagram": "https://instagram.com/pizzeriadagianni"
    }
  }
}
```

---

### 11. User Profile

#### GET /users/profile
Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "mario.rossi@email.com",
    "first_name": "Mario",
    "last_name": "Rossi",
    "phone": "+39 333 1234567",
    "created_at": "2025-01-15T10:00:00Z",
    "total_orders": 15,
    "favorite_products": [...]
  }
}
```

#### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "first_name": "Mario",
  "last_name": "Rossi",
  "phone": "+39 333 9876543"
}
```

**Response:** `200 OK`

#### PUT /users/password
Change password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

**Response:** `200 OK`

---

### 12. Notifications

#### GET /notifications
Get user notifications.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unread` (optional): Filter unread notifications (true/false)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": 1,
        "notification_type": "order_update",
        "title": "Il tuo ordine è in consegna!",
        "message": "L'ordine #GIO-20251031-0123 è in arrivo",
        "is_read": false,
        "related_order_id": 123,
        "created_at": "2025-10-31T12:00:00Z"
      }
    ],
    "unread_count": 3
  }
}
```

#### PUT /notifications/:id/read
Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_REQUEST` | Invalid request parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication token |
| 403 | `FORBIDDEN` | User doesn't have permission |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Conflict with existing resource |
| 422 | `VALIDATION_ERROR` | Request validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

- **Anonymous users**: 100 requests per 15 minutes
- **Authenticated users**: 1000 requests per 15 minutes

Rate limit info is included in response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1635692400
```

---

## Pagination

List endpoints support pagination with these parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 98,
    "items_per_page": 20,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Webhooks

For order status updates, configure webhooks in the admin panel:

**Event Types:**
- `order.created`
- `order.confirmed`
- `order.preparing`
- `order.out_for_delivery`
- `order.completed`
- `order.cancelled`

**Webhook Payload:**
```json
{
  "event": "order.confirmed",
  "timestamp": "2025-10-31T11:20:00Z",
  "data": {
    "order_id": 123,
    "order_number": "GIO-20251031-0123",
    "status": "confirmed"
  }
}
```

---

## WebSocket API

For real-time order tracking, connect to:
```
wss://api.pizzeriadagianni.it/ws
```

**Authentication:**
```json
{
  "type": "auth",
  "token": "your_jwt_token"
}
```

**Subscribe to order updates:**
```json
{
  "type": "subscribe",
  "channel": "order.123"
}
```

**Receive updates:**
```json
{
  "type": "order_update",
  "order_id": 123,
  "status": "preparing",
  "timestamp": "2025-10-31T11:25:00Z"
}
```

---

## SDK & Libraries

Official SDKs available:
- JavaScript/Node.js: `npm install @pizzeriadagianni/sdk`
- PHP: `composer require pizzeriadagianni/sdk`
- Python: `pip install pizzeriadagianni`

---

## Support

For API support:
- Email: dev@pizzeriadagianni.it
- Documentation: https://docs.pizzeriadagianni.it
- Status Page: https://status.pizzeriadagianni.it
