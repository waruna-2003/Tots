# Tots

Tots is a private, instant, anonymous one-to-one chat application. It connects two active users through Socket.IO without requiring accounts, usernames, or permanent chat history.

The current version includes a responsive WhatsApp-inspired interface, reliable room lifecycle management, temporary behavioral profiles, and in-memory conversation-event tracking.

## Features

- Anonymous one-to-one matchmaking
- Real-time Socket.IO messaging
- Responsive home, matching, and chat screens
- Live online-user count
- Cancel search and next-person controls
- Partner departure and connection-loss notifications
- Automatic reconnection handling
- Room-membership validation
- Message length limits and rate limiting
- Basic partner reporting
- Temporary user profiles with neutral behavior scores
- Temporary conversation and interaction tracking
- Automatic deletion of profiles on disconnect
- Automatic deletion of raw conversation data when a chat ends

## Technology

### Frontend

- React 19
- Vite 8
- Socket.IO Client
- CSS with responsive mobile, tablet, and desktop layouts

### Backend

- Node.js
- Express 5
- Socket.IO
- In-memory `Map` and queue state
- Node's built-in test runner

## Project structure

```text
tots/
├── backend/
│   ├── factories/
│   │   ├── createTemporaryChat.js
│   │   └── createTemporaryUser.js
│   ├── services/
│   │   └── conversationTracker.js
│   ├── state/
│   │   ├── activeChats.js
│   │   └── activeUsers.js
│   ├── test/
│   │   ├── activeUsers.test.js
│   │   ├── chat.test.js
│   │   └── conversationTracker.test.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Matching.jsx
│   │   ├── services/
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Local development

### Requirements

- Node.js 20 or newer
- npm

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 3. Start the backend

From the `backend` directory:

```bash
npm run dev
```

The backend listens on `http://localhost:5000` by default.

### 4. Start the frontend

From the `frontend` directory:

```bash
npm run dev
```

Open the local URL displayed by Vite, normally `http://localhost:5173`.

## Configuration

### Frontend

The frontend automatically uses `http://localhost:5000` when opened on localhost. In other environments it uses the configured production backend.

Override the Socket.IO server with:

```env
VITE_SOCKET_URL=https://your-backend.example.com
```

### Backend

Set the listening port with:

```env
PORT=5000
```

Configure allowed frontend origins as a comma-separated list:

```env
CLIENT_ORIGINS=http://localhost:5173,https://your-frontend.example.com
```

## Application lifecycle

```text
Connect
  ↓
Create temporary neutral user profile
  ↓
Enter matchmaking queue
  ↓
Create a room and temporary chat record
  ↓
Exchange validated real-time messages
  ↓
Track temporary interaction events
  ↓
Produce an anonymous conversation summary
  ↓
Delete raw chat data
  ↓
Return to matchmaking or disconnect
```

## Temporary user profiles

Every active socket receives a temporary profile containing:

- A random session ID
- Current status: `idle`, `waiting`, or `chatting`
- Current room ID
- Neutral behavior scores
- Temporary interests
- Chat, skip, message, duration, and response-time statistics
- Creation and last-activity timestamps

Profiles are keyed by the technical Socket.IO connection ID and deleted when the connection ends.

## Conversation tracking

Each active room temporarily records:

- Participants and start time
- Valid message events
- Character and word counts
- Question usage
- Response times between different senders
- First and last message timestamps
- Conversation duration
- Who ended the chat and why

When the conversation finishes, Tots creates an aggregate summary, updates the temporary user statistics, and removes the chat record and raw message text from memory.

## Socket.IO events

### Client to server

- `find_match`
- `cancel_match`
- `leave_chat`
- `send_message`
- `report_partner`

Development-only inspection events are disabled in production:

- `get_my_profile`
- `get_current_chat`

### Server to client

- `match_waiting`
- `match_found`
- `chat_left`
- `receive_message`
- `partner_left`
- `presence`
- `chat_error`
- `server_error`

## Testing

Run backend unit and integration tests:

```bash
cd backend
npm test
```

Run frontend linting and create a production build:

```bash
cd frontend
npm run lint
npm run build
```

The integration suite uses real Socket.IO clients against an ephemeral local server. It covers matchmaking, queue cleanup, authorization, message tracking, room finalization, and disconnect behavior.

## Privacy model

Tots currently follows these principles:

- No accounts or permanent user identity
- No permanent chat history
- No database required
- Behavioral profiles exist only for the active connection
- Raw tracked messages are deleted when the conversation ends
- Development inspection events are unavailable in production

The current report handler records only temporary session metadata. Production moderation will require explicit privacy documentation and durable, access-controlled storage.

## Deployment

The frontend and backend are deployed separately:

- Build the frontend with `npm run build` and publish the generated `frontend/dist` directory.
- Run the backend with `npm start` on a host that supports persistent WebSocket connections.
- Set `VITE_SOCKET_URL` to the deployed backend URL.
- Set `CLIENT_ORIGINS` to the deployed frontend origins.

The current in-memory queue and state require a single backend instance. Horizontal scaling will require shared matchmaking and Socket.IO infrastructure such as Redis.

## Roadmap

- Convert conversation summaries into explainable behavior scores
- Add rule-based sentiment and topic extraction
- Introduce compatibility-aware matchmaking
- Compare smart matching against random matching through anonymous aggregate metrics
- Add stronger reporting, blocking, and moderation workflows
- Add shared state for multiple backend instances
- Expand accessibility and end-to-end browser coverage

## License

The backend package currently declares the ISC license. Add a root `LICENSE` file before distributing the complete project under that license.
