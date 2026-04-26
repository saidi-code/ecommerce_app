# E-Commerce Mobile App

A full-featured e-commerce mobile application built with **React Native**, **Expo**, and **TypeScript**. This app provides a complete shopping experience with product browsing, cart management, wishlist, checkout, order tracking, and an admin dashboard.

---

## Features

### Customer Features

- **Authentication** - Secure sign-in/sign-up powered by [Clerk](https://clerk.dev/)
- **Home Screen** - Banner carousel, product categories, and popular products
- **Product Browsing** - Browse products with pagination, search, and category filtering
- **Product Details** - Image carousel, size selection, ratings, and add to cart
- **Shopping Cart** - Add/remove items, update quantities, and view cart total
- **Wishlist** - Save favorite products for later
- **Checkout** - Select shipping address and payment method (Cash on Delivery / Card)
- **Order Management** - View order history and track order status
- **Address Management** - Manage multiple shipping addresses

### Admin Features

- **Admin Dashboard** - Overview stats (revenue, orders, products, users)
- **Product Management** - Add, edit, and delete products
- **Order Management** - View and manage customer orders

---

## Tech Stack

| Technology                                                                             | Purpose                            |
| -------------------------------------------------------------------------------------- | ---------------------------------- |
| [React Native](https://reactnative.dev/)                                               | Cross-platform mobile framework    |
| [Expo](https://expo.dev/)                                                              | Development platform and tooling   |
| [Expo Router](https://docs.expo.dev/router/introduction/)                              | File-based routing                 |
| [TypeScript](https://www.typescriptlang.org/)                                          | Type safety                        |
| [NativeWind](https://www.nativewind.dev/)                                              | Tailwind CSS for React Native      |
| [Clerk](https://clerk.dev/)                                                            | Authentication and user management |
| [Axios](https://axios-http.com/)                                                       | HTTP client for API requests       |
| [React Native Toast Message](https://github.com/calintamas/react-native-toast-message) | In-app notifications               |

---

## Project Structure

```
ecommerce_app/
├── app/                          # Expo Router file-based routes
│   ├── (auth)/                   # Authentication routes (sign-in, sign-up)
│   ├── (tabs)/                   # Bottom tab navigation screens
│   │   ├── index.tsx             # Home screen
│   │   ├── cart.tsx              # Shopping cart
│   │   ├── favorites.tsx         # Wishlist screen
│   │   └── profile.tsx           # User profile
│   ├── admin/                    # Admin dashboard routes
│   │   ├── index.tsx             # Admin overview
│   │   ├── orders.tsx            # Admin orders management
│   │   └── products/             # Admin product management
│   ├── addresses/                # Shipping addresses
│   ├── orders/                   # Order history & details
│   ├── product/[id].tsx          # Product detail page
│   ├── shop.tsx                  # Product listing page
│   ├── checkout.tsx              # Checkout flow
│   └── _layout.tsx               # Root layout with providers
├── components/                   # Reusable UI components
│   ├── ProductCard.tsx           # Product card component
│   ├── CartItem.tsx              # Cart item component
│   ├── CategoryItem.tsx          # Category button component
│   └── Header.tsx                # Screen header component
├── context/                      # React Context providers
│   ├── CartContext.tsx           # Cart state management
│   └── WishListContext.tsx       # Wishlist state management
├── constants/                    # App constants
│   ├── api.ts                    # Axios API configuration
│   ├── types.ts                  # TypeScript interfaces
│   └── index.ts                  # Colors, categories, menu items
├── assets/                       # Images, fonts, and static data
│   ├── images/                   # App icons and logos
│   └── assets.ts                 # Dummy data and utilities
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── app.json                      # Expo app configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS only) or Android Emulator
- A running backend API server (see [API Configuration](#api-configuration))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce_app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   > Get your Clerk publishable key from [Clerk Dashboard](https://dashboard.clerk.dev/)

4. **Configure API base URL**

   Update `constants/api.ts` with your backend server IP:

   ```typescript
   const LOCAL_API_URL = Platform.select({
     android: "http://YOUR_IP:3000/api/v1",
     ios: "http://YOUR_IP:3000/api/v1",
     default: "http://localhost:3000/api/v1",
   });
   ```

5. **Start the development server**

   ```bash
   npx expo start
   ```

   Press:
   - `i` - Open iOS Simulator
   - `a` - Open Android Emulator
   - `w` - Open web browser

---

## Available Scripts

| Script                  | Description                       |
| ----------------------- | --------------------------------- |
| `npm start`             | Start the Expo development server |
| `npm run android`       | Start on Android emulator/device  |
| `npm run ios`           | Start on iOS simulator/device     |
| `npm run web`           | Start on web browser              |
| `npm run lint`          | Run ESLint for code quality       |
| `npm run reset-project` | Reset to a fresh Expo project     |

---

## API Configuration

This app connects to a REST API backend. The API endpoints used include:

| Endpoint         | Method          | Description                      |
| ---------------- | --------------- | -------------------------------- |
| `/products`      | GET             | Fetch products (with pagination) |
| `/products/:id`  | GET             | Fetch single product details     |
| `/cart`          | GET/POST/DELETE | Cart operations                  |
| `/cart/add`      | POST            | Add item to cart                 |
| `/cart/item/:id` | PUT/DELETE      | Update/remove cart item          |
| `/wishlist`      | GET/POST        | Wishlist operations              |
| `/wishlist/:id`  | DELETE          | Remove from wishlist             |
| `/orders`        | GET/POST        | Order operations                 |
| `/orders/:id`    | GET             | Order details                    |
| `/addresses`     | GET             | Fetch user addresses             |
| `/admin/stats`   | GET             | Admin dashboard statistics       |

---

## Authentication

This app uses [Clerk](https://clerk.dev/) for authentication. Clerk provides:

- Email/password authentication
- Secure session management
- Multi-factor authentication (MFA) support
- Token-based API authorization

Protected routes automatically redirect unauthenticated users to the sign-in screen.

---

## State Management

The app uses React Context for global state management:

- **CartContext** - Manages shopping cart items, quantities, and totals. Syncs with backend API.
- **WishlistContext** - Manages user's wishlist products. Syncs with backend API.

Both contexts integrate with Clerk authentication to ensure data is user-specific.

---

## Theming & Styling

- **NativeWind** provides Tailwind CSS utility classes for React Native
- Custom color palette defined in `constants/index.ts`:
  - Primary: `#111111`
  - Secondary: `#666666`
  - Accent: `#FF4C3B`
  - Surface: `#F7F7F7`
- Dark mode support via `userInterfaceStyle: "automatic"` in `app.json`

---

## Platform Support

| Platform | Status                       |
| -------- | ---------------------------- |
| iOS      | Supported                    |
| Android  | Supported                    |
| Web      | Supported (with limitations) |

---

## Key Dependencies

```json
{
  "expo": "~54.0.33",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "expo-router": "~6.0.23",
  "@clerk/expo": "^3.1.12",
  "nativewind": "^4.2.3",
  "tailwindcss": "^3.4.19",
  "axios": "^1.15.0",
  "react-native-toast-message": "^2.3.3"
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Expo Team](https://expo.dev/) for the amazing development platform
- [Clerk](https://clerk.dev/) for authentication infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
