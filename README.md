# US Stock Analyzer (美股分析系統)

A web-based application for analyzing US stock market data with real-time information from API sources.

## Features

- **API-Driven Data**: Stock information is loaded from API endpoints, not hardcoded
- **Multiple Categories**: Supports various stock categories including:
  - Technology (科技)
  - E-commerce (電商)
  - Automotive (汽車)
  - Financial (金融)
  - Healthcare (醫療)
  - Retail (零售)
  - Entertainment (娛樂)
  - Aviation (航空)
  - **Energy (能源)** - New!
- **Price Level Filtering**: Filter stocks by price levels (low, medium, high)
- **Daily Recommendations**: Automatically shows recommended stocks for buying
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
us-stock-analyzer/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Styling
├── js/
│   ├── config.js       # API configuration
│   └── app.js          # Main application logic
└── data/
    └── stocks.json     # Stock data (API endpoint)
```

## API Configuration

The application uses a configuration file (`js/config.js`) to define API endpoints:

```javascript
const API_CONFIG = {
    STOCK_DATA_API: './data/stocks.json',  // API endpoint for stock data
    CACHE_DURATION: 5 * 60 * 1000,         // Cache duration (5 minutes)
    TIMEOUT: 10000,                         // Request timeout (10 seconds)
    USE_FALLBACK: true                      // Use fallback data if API fails
};
```

### Configuring Your Own API

To use your own API endpoint:

1. Open `js/config.js`
2. Change `STOCK_DATA_API` to your API URL:
   ```javascript
   STOCK_DATA_API: 'https://your-api.example.com/stocks'
   ```

### Data Format

The API should return a JSON array of stock objects with the following structure:

```json
[
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "price": 268.81,
        "category": "科技",
        "priceLevel": "medium",
        "reason": "分析原因...",
        "recommended": false
    }
]
```

**Required Fields:**
- `symbol`: Stock ticker symbol (string)
- `name`: Company name (string)
- `price`: Current stock price (number)
- `category`: Stock category (string)
- `priceLevel`: Price level - "low", "medium", or "high" (string)
- `reason`: Analysis reason (string)
- `recommended`: Whether stock is recommended (boolean)

## Getting Started

### Local Development

1. Clone the repository
2. Open a terminal in the project directory
3. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and navigate to `http://localhost:8000`

### Deployment

Simply deploy the files to any static web hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- etc.

## Adding New Stock Categories

To add new stock categories:

1. Add stocks with the new category to your data source (`data/stocks.json`)
2. The application will automatically detect and add the category to the filter dropdown

## Error Handling

The application includes:
- Loading states while fetching data
- Error messages if API calls fail
- Fallback to cached/default data when configured

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- Fetch API support required

## License

MIT License
