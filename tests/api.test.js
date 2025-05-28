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
// Note: In a real project, you would use ES modules or CommonJS to import the actual functions
// For this example, we'll recreate simplified versions of the functions

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

async function getBusiness(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/businesses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch business');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching business ${id}:`, error);
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

  test('getBusiness should fetch a specific business from the API', async () => {
    const businessId = 123;
    const data = await getBusiness(businessId);
    
    // Check that fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/businesses/${businessId}`);
    
    // Check that the function returns the expected data
    expect(data).toEqual({ data: 'mocked data' });
  });

  test('getBusinesses should throw an error when the API request fails', async () => {
    // Mock a failed response
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    // Check that the function throws an error
    await expect(getBusinesses()).rejects.toThrow('Failed to fetch businesses');
  });
});