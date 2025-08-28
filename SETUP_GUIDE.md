# Mock Interview Application - Complete Setup Guide

## 🚀 Features Implemented

✅ **Video Calling System**
- Real-time video calls using WebRTC
- Screen sharing capability
- Mute/unmute audio and video controls
- Call duration tracking
- Call cut/end functionality
- Automatic call history saving

✅ **Chat System**
- Real-time messaging during interviews
- Message notifications
- Chat history persistence
- Integration with video calls

✅ **Call History**
- Complete call logs with participants
- Duration tracking
- Features used tracking (screen share, chat)
- Admin and user access controls

✅ **Interview Management**
- Admin can create interviews with video links
- Automatic room ID generation
- Direct video call link activation
- Join call button in chat

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Modern web browser with WebRTC support

## 🛠️ Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Frontend Setup

```bash
cd mock-interview
npm install
```

### 3. Environment Configuration

The `.env` file is already configured in the backend with:
- MongoDB connection
- JWT secrets
- Email configuration
- CORS settings

## 🚀 Running the Application

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5002`

### 2. Start Frontend Application

```bash
cd mock-interview
npm run dev
```

The frontend will run on `http://localhost:5174`

## 🎯 How to Use

### For Admins:

1. **Login as Admin**
   - Use admin credentials to access the dashboard

2. **Create Interview**
   - Fill in interview details (title, candidate name, role, date, time, email)
   - System automatically generates a unique video call link
   - Video link format: `http://localhost:5174/call/{roomId}`

3. **Manage Interviews**
   - View all created interviews
   - Access call history
   - Monitor interview progress

### For Users/Candidates:

1. **Login as User**
   - Use candidate credentials to access assigned interviews

2. **Join Interview**
   - Click on the video call link from interview details
   - Or use the "Join Call" button in the chat

3. **During Interview**
   - Use video controls (mute, video on/off, screen share)
   - Chat with interviewer in real-time
   - End call when finished

## 🎥 Video Call Features

### Controls Available:
- **📞 Start/Join Call**: Begin the video interview
- **🔇 Mute/Unmute**: Toggle audio
- **📹 Video On/Off**: Toggle video
- **🖥️ Screen Share**: Share your screen
- **💬 Chat**: Open chat sidebar
- **📞 End Call**: Terminate the call

### Call Flow:
1. User clicks "Join Call" or visits video link
2. Browser requests camera/microphone permissions
3. WebRTC connection established via Socket.IO
4. Real-time video/audio streaming begins
5. Call details automatically saved to history

## 💬 Chat System

### Features:
- Real-time messaging during interviews
- Message notifications with sound
- Persistent chat history
- User identification (name and role)
- Timestamp for all messages

### Usage:
- Access chat via the chat button in video call
- Or use standalone chat in interview dashboard
- Messages sync in real-time between participants

## 📊 Call History

### Tracked Information:
- **Participants**: Who joined the call
- **Duration**: Total call time
- **Start/End Times**: When call began and ended
- **Features Used**: Screen share, chat usage
- **Interview Details**: Title, candidate, role

### Access:
- Admins: See all call history for their interviews
- Users: See their own call participation history

## 🔧 Technical Architecture

### Backend (Node.js + Express):
- **Socket.IO**: Real-time communication
- **MongoDB**: Data persistence
- **JWT**: Authentication
- **WebRTC Signaling**: Video call coordination

### Frontend (React + Vite):
- **React Router**: Navigation
- **Redux**: State management
- **Socket.IO Client**: Real-time features
- **WebRTC API**: Video/audio handling

### Database Models:
- **User**: Authentication and roles
- **Interview**: Interview scheduling
- **Chat**: Message storage
- **CallHistory**: Call tracking

## 🌐 API Endpoints

### Authentication:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Interviews:
- `POST /api/interviews/create` - Create interview (Admin)
- `GET /api/interviews` - Get interviews
- `GET /api/interviews/room/:roomId` - Get interview by room

### Chat:
- `POST /api/chat/:interviewId` - Send message
- `GET /api/chat/:interviewId` - Get messages

### Calls:
- `POST /api/calls/start` - Start call tracking
- `PATCH /api/calls/:callId/end` - End call
- `GET /api/calls/history` - Get call history

## 🔧 Troubleshooting

### Common Issues:

1. **Camera/Microphone Not Working**
   - Check browser permissions
   - Ensure HTTPS (or localhost) for WebRTC
   - Try refreshing the page

2. **Connection Issues**
   - Verify backend is running on port 5002
   - Check MongoDB connection
   - Ensure CORS settings are correct

3. **Video Call Not Connecting**
   - Check WebRTC support in browser
   - Verify Socket.IO connection
   - Check network/firewall settings

### Browser Compatibility:
- Chrome (recommended)
- Firefox
- Safari (latest versions)
- Edge

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- CORS protection
- Input validation
- Secure WebRTC connections

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices (with WebRTC support)

## 🎨 UI/UX Features

- Modern dark theme
- Intuitive controls
- Real-time status indicators
- Notification system
- Loading states
- Error handling

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**:
   - Update MongoDB URI for production
   - Set secure JWT secrets
   - Configure email service
   - Update CORS origins

2. **Build Frontend**:
   ```bash
   cd mock-interview
   npm run build
   ```

3. **Deploy Backend**:
   - Use PM2 or similar process manager
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates

4. **STUN/TURN Servers**:
   - For production, consider using dedicated TURN servers
   - Update ICE server configuration

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all dependencies are installed
- Verify environment configuration

---

**🎉 Your Mock Interview Application is now ready for production use!**

The application provides a complete interview experience with video calling, chat, and comprehensive tracking - just like real-world applications.
