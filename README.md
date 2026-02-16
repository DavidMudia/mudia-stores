# Mudia Stores - Premium E-Commerce Platform

A modern, fully-featured e-commerce application built with React, TypeScript, and Tailwind CSS.

## Features

- **Product Catalog** - Browse products by category with detailed information
- **Shopping Cart** - Add/remove products and manage quantities
- **User Authentication** - Sign up and login functionality
- **Admin Dashboard** - Manage orders and view sales analytics
- **Responsive Design** - Mobile-friendly interface
- **Order Management** - Track and manage customer orders
- **Search Functionality** - Find products easily

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4, PostCSS
- **Build Tool**: Vite 7
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage for persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DavidMudia/mudia-stores.git
cd mudia-stores

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The application will be available at `http://localhost:5173`

## Admin Access

To access the admin dashboard, use these demo credentials:

- **Email**: admin@mudia.com
- **Password**: admin123

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── Auth.tsx
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Orders.tsx
│   ├── ProductDetail.tsx
│   └── AdminDashboard.tsx
├── context/            # React Context
│   └── AppContext.tsx
├── utils/              # Utility functions
│   └── cn.ts
├── data.ts            # Product and category data
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Features Detail

### Product Catalog
- Browse products across multiple categories
- View detailed product information
- See product ratings and reviews
- Filter by category

### Shopping Cart
- Add products to cart
- Adjust quantities
- Remove items
- View cart total

### Checkout
- Fill shipping information
- Select payment method
- Review order summary
- Place order

### Admin Dashboard
- View sales metrics
- Monitor pending orders
- Track total revenue
- Manage order status

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Contact

- **Author**: David Mudia
- **Email**: oyedohosemudiamen@gmail.com
- **GitHub**: [@DavidMudia](https://github.com/DavidMudia)

---

Made with ❤️ by David Mudia
