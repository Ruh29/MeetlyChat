# Mock Interview Application

A comprehensive mock interview platform with real-time video calling, built with React and Node.js.

## 🚀 Features

- **Real-time Video Calls** - WhatsApp-style instant calling
- **User Management** - Admin and candidate roles
- **Interview Scheduling** - Create and manage interviews
- **Call History** - Track all interview sessions
- **Email Notifications** - Automated interview invitations
- **Auto-deployment** - Push to deploy on Netlify

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Redux Toolkit for state management
- Socket.IO client for real-time communication
- WebRTC for video calling
- Tailwind CSS for styling

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT authentication
- Email integration

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/rahil_development.git
cd rahil_development
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and other configs
npm start
```

3. **Frontend Setup**
```bash
cd mock-interview
npm install
npm run dev
```

## 🌐 Deployment

### Auto-Deployment Setup

This project is configured for automatic deployment to Netlify:

1. **Push to GitHub** → **Auto-build** → **Auto-deploy to Netlify**
2. Every push to `main` branch triggers deployment
3. GitHub Actions handle the build process
4. Netlify serves the production build

### Manual Deployment

```bash
# Build the project
cd mock-interview
npm run build

# Deploy to Netlify (if CLI is installed)
netlify deploy --prod --dir=dist
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**Frontend (Netlify):**
```env
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

## 📱 Usage

1. **Admin Dashboard**
   - Create interviews
   - Manage candidates
   - View call history
   - Send email invitations

2. **User Dashboard**
   - View scheduled interviews
   - Join video calls
   - Update profile

3. **Video Calling**
   - Click green button to start call
   - Real-time notifications
   - WhatsApp-style call acceptance

## 🔄 CI/CD Pipeline

```
Push to GitHub → GitHub Actions → Build → Deploy to Netlify
```

- **Trigger:** Push to main branch
- **Build:** `npm run build` in mock-interview directory
- **Deploy:** Automatic deployment to Netlify
- **URL:** https://your-site-name.netlify.app

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:** Auto-port manager handles this
2. **CORS errors:** Update backend CORS settings
3. **Build failures:** Check build commands in netlify.toml
4. **Environment variables:** Ensure all required vars are set

### Development

```bash
# Start backend with auto-port management
cd backend
npm start

# Start frontend development server
cd mock-interview
npm run dev
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email rahilsheikh73308@gmail.com or create an issue on GitHub.

---

**Auto-deployed with ❤️ using GitHub Actions + Netlify**
