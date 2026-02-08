**Library Management System – Frontend**
This is React + TypeScript frontend for the Library Management System that allows librarians to manage books, members, and borrowing operations through a simple dashboard UI.
This project communicates with a FastAPI backend and provides full CRUD functionality with a clean user experience.

**Features**
View all books and members
Add new books and members
Update existing records
Delete books and members
Borrow books for members
View borrowed books with status
Modal-based forms for better UX
Generic update handler for reusable API logic

**Tech Stack**
React
TypeScript
Fetch API
CSS (inline styling)
Node.js v25.6.0



**Node Version**
This project was built using:
Node v25.6.0

If you use nvm, you can run:
nvm install 25
nvm use 25


**Using a different Node version may cause dependency or build issues.**


**Setup Instructions**
**Clone the Repository**
git clone https://github.com/naveengoyal2493/library-frontend.git
cd library-frontend


**Install Dependencies**
npm install


**Run the App**
npm run dev

Vite will start the app typically at:
http://localhost:5173


**Backend Configuration**
The frontend expects the backend to run at:
http://localhost:8000

Defined inside:
const BASE_URL = "http://localhost:8000";
├── pages/
│     └── HomePage.tsx
│
└── main.tsx
