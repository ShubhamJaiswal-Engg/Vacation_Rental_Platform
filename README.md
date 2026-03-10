
# 🏨 Hotel Management Platform

A fully functional Airbnb-inspired web application built using the MERN stack. This project demonstrates RESTful API integration, user authentication, CRUD operations, and responsive UI design.

<!--- ![Project Banner](https://via.placeholder.com/1200x400/1a1a1a/ef4444?text=Hotel+Management+Platform) --->


## 🌟 Features

- **User Authentication** - Secure login and registration system
- **Property Listings** - Create, read, update, and delete hotel listings
- **Image Upload** - Cloudinary integration for seamless image management
- **Responsive Design** - Mobile-first approach with beautiful UI
- **RESTful API** - Clean and organized API architecture
- **MVC Architecture** - Structured codebase following best practices
- **Search & Filter** - Find properties based on location and preferences
- **Reviews & Ratings** - Users can leave reviews for properties

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **EJS** - Templating engine

### Frontend
- **CSS** - Custom styling
- **EJS** - Server-side rendering

### Tools & Services
- **Cloudinary** - Cloud-based image management
- **REST API** - API architecture
- **MVC** - Design pattern

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ShubhamJaiswal-Engg/Airbnb_clone.git
cd Airbnb_clone
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SESSION_SECRET=your_session_secret
```

4. Start the development server
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 📂 Project Structure

```
├── models/           # Database models
├── routes/           # API routes
├── controllers/      # Request handlers
├── views/            # EJS templates
├── public/           # Static files (CSS, images, JS)
├── middleware/       # Custom middleware
├── utils/            # Helper functions
└── app.js            # Application entry point
```

## 🔑 Key Functionalities

### CRUD Operations
- **Create** - Add new property listings
- **Read** - View all listings and individual property details
- **Update** - Edit existing property information
- **Delete** - Remove properties from the database

### Authentication
- User registration with validation
- Secure login with session management
- Password hashing for security
- Protected routes for authenticated users

### Image Management
- Upload multiple images per listing
- Cloudinary integration for cloud storage
- Image optimization and transformation
- Secure image URLs

## 📸 Screenshots

<img width="1440" height="900" alt="s1" src="https://github.com/user-attachments/assets/05e74dc2-f0bb-45f5-9a1a-cec5fb807489" />
<img width="1440" height="900" alt="s2" src="https://github.com/user-attachments/assets/5453c62a-7d0e-4e79-b0b8-bdbaf9065b84" />

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings` | Get all listings |
| GET | `/listings/:id` | Get single listing |
| POST | `/listings` | Create new listing |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |
| POST | `/register` | Register new user |
| POST | `/login` | Login user |

## 👤 Author

**Shubham Jaiswal**

- GitHub: [@ShubhamJaiswal-Engg](https://github.com/ShubhamJaiswal-Engg)
- LinkedIn: [shubhamjaiswalengg](https://linkedin.com/in/shubhamjaiswalengg)
- Email: shubhamjai8662@gmail.com

## 🙏 Acknowledgments

- Inspired by Airbnb's design and functionality
- Thanks to the open-source community for amazing tools and libraries
- Special thanks to all contributors
