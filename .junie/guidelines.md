# AppointEase Development Guidelines

This document provides essential information for developers working on the AppointEase project, a small business appointment scheduling application.

## Build/Configuration Instructions

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```
   This will start a live-server instance that serves the application and automatically reloads when files change.

3. **Environment Configuration**:
   - The API base URL is configured in `js/api.js`
   - For local development, you may need to update the API_BASE_URL to point to your local backend server

### Backend Integration

The frontend communicates with a FastAPI backend. If you're working on both frontend and backend:

1. **Python Environment Setup**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Backend Configuration**:
   - The backend is expected to be running at the URL specified in `js/api.js`
   - The backend repository is separate from this frontend repository

## Testing Information

### Frontend Testing

The project uses Jest for JavaScript testing.

1. **Running Tests**:
   ```bash
   npm test
   ```

2. **Test Structure**:
   - Test files are located in the `tests/` directory
   - Test files should be named with the pattern `*.test.js`

3. **Adding New Tests**:
   - Create a new test file in the `tests/` directory
   - Import the functions/components you want to test
   - Use Jest's testing functions (`describe`, `test`, `expect`, etc.) to write your tests
   - Mock external dependencies (like API calls) using Jest's mocking capabilities

### Example Test

Here's a simple example of testing API functions:

```javascript
// tests/api.test.js
const API_BASE_URL = 'https://ulem-grant-tracker-backend-0h6j.onrender.com/';

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked data' }),
  })
);

// Import functions to test
// In a real project, you would import from the actual module
async function getBusinesses() {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    return await response.json();
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
}

// Tests
describe('API Functions', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('getBusinesses should fetch businesses from the API', async () => {
    const data = await getBusinesses();
    
    // Check that fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/businesses`);
    
    // Check that the function returns the expected data
    expect(data).toEqual({ data: 'mocked data' });
  });
});
```

## Additional Development Information

### Code Structure

- **HTML Files**: Main pages of the application
  - `index.html`: Landing page
  - `booking.html`: Appointment booking flow
  - `business-dashboard.html`: Dashboard for business owners
  - `services-availability.html`: Service and availability management
  - `appointment-management.html`: Appointment management for businesses

- **JavaScript**:
  - `js/api.js`: API interaction functions

### Frontend Technologies

- **Alpine.js**: Used for reactive data binding and component behavior
- **Tailwind CSS**: Used for styling
- **Fetch API**: Used for making HTTP requests to the backend

### Coding Standards

1. **HTML**:
   - Use semantic HTML elements
   - Include appropriate ARIA attributes for accessibility

2. **JavaScript**:
   - Follow modern ES6+ syntax
   - Use async/await for asynchronous operations
   - Handle errors appropriately

3. **CSS/Tailwind**:
   - Use Tailwind utility classes for styling
   - Custom styles should be added through Tailwind's configuration when possible

### Development Workflow

1. **Feature Development**:
   - Create a new branch for each feature
   - Write tests for new functionality
   - Implement the feature
   - Ensure tests pass
   - Submit a pull request

2. **Bug Fixes**:
   - Create a test that reproduces the bug
   - Fix the bug
   - Verify the test passes
   - Submit a pull request

### Debugging Tips

- Use browser developer tools for frontend debugging
- Check the Network tab to inspect API requests and responses
- Use `console.log()` for quick debugging, but remove before committing
- For API issues, verify the backend is running and accessible