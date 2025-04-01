# Freddy Farmer - Organic Produce Marketplace

A modern web application that connects local farmers with customers, enabling the purchase of fresh organic produce directly from farmers.

## 🌟 Features

### For Customers
- User authentication (signup/login)
- Browse organic products
- Add products to cart
- Real-time cart updates
- Order tracking
- Profile management with profile picture upload
- Responsive design for all devices

### For Farmers
- Farmer-specific dashboard
- Product management (add/edit/delete products)
- Sales tracking
- Order management

## 🛠️ Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with Bootstrap 5)
  - JavaScript (Vanilla)
  - EJS (Embedded JavaScript)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JWT Authentication
  - Multer (for file uploads)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/freddy-farmer.git
cd freddy-farmer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8080
```

4. Create required directories:
```bash
mkdir -p public/uploads/profiles
```

5. Start the server:
```bash
npm start
```

## 🚀 Usage

1. Access the application at `http://localhost:8080`
2. Create a new account or login
3. Browse products and add them to cart
4. Complete the checkout process
5. Track your orders in the profile section

## 📁 Project Structure

```
freddy-farmer/
├── frontend/
│   ├── dashboard/
│   │   ├── imgs/
│   │   └── products/
│   └── loginPage/
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── middleware/
│   └── auth.js
├── views/
│   ├── dashboard.ejs
│   ├── ordernow.ejs
│   ├── profile.ejs
│   ├── cart.ejs
│   ├── login.ejs
│   └── signUp.ejs
├── public/
│   └── uploads/
│       └── profiles/
├── server.js
├── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Secure file upload handling
- Input validation
- XSS protection

## 🎨 UI/UX Features

- Modern and responsive design
- Smooth animations and transitions
- Interactive product cards
- Real-time cart updates
- Toast notifications
- Loading states
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Bootstrap for the UI components
- Font Awesome for icons
- MongoDB Atlas for database hosting
- All contributors who have helped shape this project

## 📞 Support

For support, email support@freddyfarmer.com or create an issue in the repository. 