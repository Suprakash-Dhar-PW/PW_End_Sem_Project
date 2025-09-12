/**
 * Frontend Integration Examples for Student Dashboard Backend
 * 
 * This file contains example functions for integrating the backend API
 * with your frontend application.
 */

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Authentication Functions
 */

// Login user and get token
async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    
    // Store token and user info in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get current user info
async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Logout user
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page or update UI as needed
}

/**
 * Dashboard Data Functions
 */

// Get all dashboard data
async function getDashboardData() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
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

/**
 * Semester Cards Functions
 */

// Get all semester cards
async function getSemesterCards() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/semester-cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch semester cards');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching semester cards:', error);
    throw error;
  }
}

// Create a new semester card (admin only)
async function createSemesterCard(title, description, link) {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin privileges required');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/semester-cards`, {
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

// Update a semester card (admin only)
async function updateSemesterCard(id, title, description, link) {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin privileges required');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/semester-cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description, link })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update semester card');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating semester card:', error);
    throw error;
  }
}

// Delete a semester card (admin only)
async function deleteSemesterCard(id) {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin privileges required');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/semester-cards/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete semester card');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting semester card:', error);
    throw error;
  }
}

/**
 * Notices Functions
 */

// Get all notices
async function getNotices() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/notices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch notices');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching notices:', error);
    throw error;
  }
}

// Create a new notice (admin only)
async function createNotice(title, message) {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin privileges required');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, message })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create notice');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
}

/**
 * Quick Links Functions
 */

// Get all quick links
async function getQuickLinks() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/quick-links`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch quick links');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching quick links:', error);
    throw error;
  }
}

// Create a new quick link (admin only)
async function createQuickLink(title, url, icon = null) {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!user || user.role !== 'admin') {
      throw new Error('Admin privileges required');
    }
    
    const response = await fetch(`${API_BASE_URL}/dashboard/quick-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, url, icon })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create quick link');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating quick link:', error);
    throw error;
  }
}

// Export all functions
module.exports = {
  // Auth
  login,
  getCurrentUser,
  logout,
  
  // Dashboard
  getDashboardData,
  
  // Semester Cards
  getSemesterCards,
  createSemesterCard,
  updateSemesterCard,
  deleteSemesterCard,
  
  // Notices
  getNotices,
  createNotice,
  
  // Quick Links
  getQuickLinks,
  createQuickLink
};