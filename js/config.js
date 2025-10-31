// API Configuration for US Stock Analyzer

const API_CONFIG = {
    // Stock data API endpoint
    // In production, replace this with your actual API endpoint
    // Example: 'https://api.example.com/stocks'
    STOCK_DATA_API: './data/stocks.json',
    
    // API settings
    TIMEOUT: 10000, // 10 seconds timeout
    
    // Fallback to mock data if API fails
    USE_FALLBACK: true
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
