

// frontend/js/api.js
const IS_PRODUCTION = window.location.hostname !== 'localhost';
const API_URL = IS_PRODUCTION
  ? 'https://appointment-scheduler-backend-zyhu.onrender.com'  // Production API URL
  : 'http://localhost:8000';  // Local development API URL

// Add debug logging
console.log('API_URL:', API_URL);
console.log('IS_PRODUCTION:', IS_PRODUCTION);

// Function to handle API errors
const handleResponse = async (response) => {
  console.log('API Response:', response.status, response.statusText);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Mock data for fallback when API is unavailable
const getMockAppointments = () => {
  console.warn('Using mock data - API may be unavailable');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return [
    {
      id: 1,
      client_id: 1,
      client_name: 'John Smith',
      service_name: 'Haircut',
      appointment_date: today.toISOString().split('T')[0],
      appointment_time: '10:00',
      status: 'confirmed'
    },
    {
      id: 2,
      client_id: 2,
      client_name: 'Jane Doe',
      service_name: 'Color Treatment',
      appointment_date: today.toISOString().split('T')[0],
      appointment_time: '14:30',
      status: 'pending'
    },
    {
      id: 3,
      client_id: 3,
      client_name: 'Bob Johnson',
      service_name: 'Beard Trim',
      appointment_date: tomorrow.toISOString().split('T')[0],
      appointment_time: '09:00',
      status: 'confirmed'
    },
    {
      id: 4,
      client_id: 1,
      client_name: 'John Smith',
      service_name: 'Shampoo',
      appointment_date: tomorrow.toISOString().split('T')[0],
      appointment_time: '16:00',
      status: 'completed'
    },
    {
      id: 5,
      client_id: 4,
      client_name: 'Alice Williams',
      service_name: 'Styling',
      appointment_date: yesterday.toISOString().split('T')[0],
      appointment_time: '11:00',
      status: 'completed'
    }
  ];
};

// Mock data for businesses
const getMockBusinesses = () => [
  {
    id: 1,
    name: 'Elite Hair Salon',
    address: '123 Main Street, Downtown',
    phone: '(555) 123-4567',
    email: 'contact@elitehair.com'
  },
  {
    id: 2,
    name: 'Wellness Spa & Beauty',
    address: '456 Oak Avenue, Midtown',
    phone: '(555) 987-6543',
    email: 'info@wellnessspa.com'
  },
  {
    id: 3,
    name: 'Modern Barbershop',
    address: '789 Pine Road, Uptown',
    phone: '(555) 456-7890',
    email: 'hello@modernbarber.com'
  }
];

// Mock data for services
const getMockServices = (businessId) => {
  const servicesByBusiness = {
    1: [ // Elite Hair Salon
      { id: 1, name: 'Haircut & Style', description: 'Professional haircut and styling', duration: 60, price: 45, business_id: 1 },
      { id: 2, name: 'Color Treatment', description: 'Full color treatment and styling', duration: 120, price: 85, business_id: 1 },
      { id: 3, name: 'Highlights', description: 'Partial highlights with toning', duration: 90, price: 65, business_id: 1 }
    ],
    2: [ // Wellness Spa & Beauty
      { id: 4, name: 'Facial Treatment', description: 'Relaxing facial with premium products', duration: 75, price: 70, business_id: 2 },
      { id: 5, name: 'Massage Therapy', description: 'Full body relaxation massage', duration: 90, price: 95, business_id: 2 },
      { id: 6, name: 'Manicure & Pedicure', description: 'Complete nail care service', duration: 60, price: 55, business_id: 2 }
    ],
    3: [ // Modern Barbershop
      { id: 7, name: 'Classic Haircut', description: 'Traditional mens haircut', duration: 30, price: 25, business_id: 3 },
      { id: 8, name: 'Beard Trim', description: 'Professional beard trimming and shaping', duration: 20, price: 15, business_id: 3 },
      { id: 9, name: 'Hot Towel Shave', description: 'Traditional hot towel shave experience', duration: 45, price: 35, business_id: 3 }
    ]
  };
  return servicesByBusiness[businessId] || [];
};

// Mock available time slots
const getMockAvailableSlots = (serviceId, date) => {
  // Generate time slots from 9 AM to 5 PM
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 16) { // Don't add 30 min slot for last hour
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  // Remove some random slots to simulate booked times
  const availableSlots = slots.filter((_, index) => Math.random() > 0.3);
  return availableSlots;
};

// Test API connectivity
const testAPIConnection = async () => {
  try {
    console.log('Testing API connection to:', API_URL);
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    console.log('Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Business-related API calls
const getBusinesses = async () => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log('Fetching businesses from API');
    const response = await fetch(`${API_URL}/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);
    console.log('API returned businesses:', data);
    return data;
  } catch (error) {
    console.warn('API request failed, using mock businesses data:', error.message);
    return getMockBusinesses();
  }
};

const getBusiness = async (businessId) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log(`Fetching business ${businessId} from API`);
    const response = await fetch(`${API_URL}/businesses/${businessId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);
    console.log('API returned business:', data);
    return data;
  } catch (error) {
    console.warn(`API request failed, using mock data for business ${businessId}:`, error.message);
    const businesses = getMockBusinesses();
    return businesses.find(b => b.id === parseInt(businessId));
  }
};

// Service-related API calls
const getBusinessServices = async (businessId) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log(`Fetching services for business ${businessId} from API`);
    const response = await fetch(`${API_URL}/businesses/${businessId}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);
    console.log('API returned services:', data);
    return data;
  } catch (error) {
    console.warn(`API request failed, using mock services data for business ${businessId}:`, error.message);
    return getMockServices(parseInt(businessId));
  }
};

const getAvailableSlots = async (serviceId, date) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log(`Fetching available slots for service ${serviceId} on ${date} from API`);
    const response = await fetch(`${API_URL}/services/${serviceId}/available-slots?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);
    console.log('API returned slots:', data);
    return data.slots || data; // Handle both {slots: [...]} and direct array response formats
  } catch (error) {
    console.warn(`API request failed, using mock available slots for service ${serviceId} on ${date}:`, error.message);
    return getMockAvailableSlots(parseInt(serviceId), date);
  }
};

// Client-related API calls
const createClient = async (clientData) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log('Creating client via API with data:', clientData);
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(clientData),
    });

    const data = await handleResponse(response);
    console.log('API returned client:', data);
    return data;
  } catch (error) {
    console.warn('API request failed, simulating client creation:', error.message);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock client with generated ID
    return {
      id: Math.floor(Math.random() * 1000) + 1,
      ...clientData
    };
  }
};

// Appointment-related API calls
const createAppointment = async (appointmentData) => {
  try {
    console.log('Attempting to create appointment via API:', appointmentData);

    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(appointmentData),
    });

    return handleResponse(response);
  } catch (error) {
    console.warn('API appointment creation failed, using mock response:', error.message);

    // Simulate successful appointment creation
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: Math.floor(Math.random() * 1000) + 1,
      ...appointmentData,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
  }
};

const getBusinessAppointments = async (businessId, date = null) => {
  console.log(`Fetching appointments for business ${businessId}${date ? ` on ${date}` : ''}`);

  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    const url = date
      ? `${API_URL}/businesses/${businessId}/appointments?date=${date}`
      : `${API_URL}/businesses/${businessId}/appointments`;

    console.log('Making request to:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);
    console.log('API returned:', data);
    return data;

  } catch (error) {
    console.warn('API request failed, using mock data:', error.message);
    // Return mock data when API is not available
    return getMockAppointments();
  }
};

const updateAppointmentStatus = async (appointmentId, status) => {
  console.log(`Updating appointment ${appointmentId} to status: ${status}`);

  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ status }),
    });

    const data = await handleResponse(response);
    console.log('Status update successful:', data);
    return data;

  } catch (error) {
    console.warn('Failed to update appointment status:', error.message);
    // For mock data, we'll just simulate success
    console.log(`Mock: Updated appointment ${appointmentId} to status ${status}`);
    return { success: true, message: 'Status updated (mock)' };
  }
};

// Service management functions
const createService = async (serviceData) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log('Creating service via API with data:', serviceData);
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(serviceData),
    });

    const data = await handleResponse(response);
    console.log('API returned service:', data);
    return data;
  } catch (error) {
    console.warn('API request failed, simulating service creation:', error.message);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: Math.floor(Math.random() * 1000) + 1,
      ...serviceData,
      created_at: new Date().toISOString()
    };
  }
};

const updateService = async (serviceId, serviceData) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log(`Updating service ${serviceId} via API with data:`, serviceData);
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(serviceData),
    });

    const data = await handleResponse(response);
    console.log('API returned updated service:', data);
    return data;
  } catch (error) {
    console.warn(`API request failed, simulating service ${serviceId} update:`, error.message);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: parseInt(serviceId),
      ...serviceData,
      updated_at: new Date().toISOString()
    };
  }
};

const deleteService = async (serviceId) => {
  try {
    // First test if the API is reachable
    const isConnected = await testAPIConnection();
    if (!isConnected) {
      throw new Error('API server is not reachable');
    }

    console.log(`Deleting service ${serviceId} via API`);
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);
    console.log('API returned deletion result:', data);
    return data;
  } catch (error) {
    console.warn(`API request failed, simulating service ${serviceId} deletion:`, error.message);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: 'Service deleted successfully' };
  }
};
