# Student Dashboard Backend

This is a Node.js + Express backend for the student dashboard application with JWT-based authentication and role-based access control.

## Features

- JWT-based authentication
- Role-based access control (admin and student roles)
- CRUD operations for semester cards, notices, and quick links
- SQLite database for data storage
- Password hashing with bcrypt
- Error handling middleware
- CORS support

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_in_production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   DB_PATH=./data/dashboard.db
   ```

3. Start the server:
   ```
   npm start
   ```

4. For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register a new user (admin only)
- `GET /api/auth/me` - Get current user info

### Dashboard

- `GET /api/dashboard` - Get all dashboard data

### Semester Cards

- `GET /api/dashboard/semester-cards` - Get all semester cards
- `GET /api/dashboard/semester-cards/:id` - Get semester card by ID
- `POST /api/dashboard/semester-cards` - Create a new semester card (admin only)
- `PUT /api/dashboard/semester-cards/:id` - Update a semester card (admin only)
- `DELETE /api/dashboard/semester-cards/:id` - Delete a semester card (admin only)

### Notices

- `GET /api/dashboard/notices` - Get all notices
- `GET /api/dashboard/notices/:id` - Get notice by ID
- `POST /api/dashboard/notices` - Create a new notice (admin only)
- `PUT /api/dashboard/notices/:id` - Update a notice (admin only)
- `DELETE /api/dashboard/notices/:id` - Delete a notice (admin only)

### Quick Links

- `GET /api/dashboard/quick-links` - Get all quick links
- `GET /api/dashboard/quick-links/:id` - Get quick link by ID
- `POST /api/dashboard/quick-links` - Create a new quick link (admin only)
- `PUT /api/dashboard/quick-links/:id` - Update a quick link (admin only)
- `DELETE /api/dashboard/quick-links/:id` - Delete a quick link (admin only)

## Frontend Integration Examples

### Login

```javascript
async function login(username, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### Get Dashboard Data

```javascript
async function getDashboardData() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('http://localhost:5000/api/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
```

### Create Semester Card (Admin Only)

```javascript
async function createSemesterCard(title, description, link) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('http://localhost:5000/api/dashboard/semester-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description, link })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create semester card');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating semester card:', error);
    throw error;
  }
}
```