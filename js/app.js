// US Stock Analyzer - Main Application

// Global stock data - will be loaded from API
let stockData = [];

// Global state
let filteredStocks = [];

// Price level text mapping
const PRICE_LEVEL_TEXT = {
    'low': '低位階',
    'medium': '中位階',
    'high': '高位階'
};

// Load stock data from API
async function loadStockData() {
    try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(API_CONFIG.STOCK_DATA_API, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected an array');
        }
        
        stockData = data;
        console.log(`Loaded ${stockData.length} stocks from API`);
    } catch (error) {
        console.error('Error loading stock data:', error);
        
        if (API_CONFIG.USE_FALLBACK) {
            console.log('Using fallback data...');
            stockData = getFallbackData();
        } else {
            throw error;
        }
    }
}

// Fallback data in case API fails
function getFallbackData() {
    return [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 268.81,
            category: '科技',
            priceLevel: 'medium',
            reason: '無法載入最新資料，顯示快取資料。',
            recommended: false
        }
    ];
}

// Show loading state
function showLoadingState() {
    const stockDisplay = document.getElementById('stock-display');
    stockDisplay.innerHTML = '<div class="loading-state">載入股票資料中...</div>';
}

// Show error state
function showErrorState(message) {
    const stockDisplay = document.getElementById('stock-display');
    stockDisplay.innerHTML = `<div class="error-state">載入失敗：${message}</div>`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    showLoadingState();
    try {
        await loadStockData();
        filteredStocks = [...stockData];
        initializeFilters();
        displayStocks(stockData);
        displayRecommendations();
    } catch (error) {
        showErrorState(error.message);
    }
});

// Initialize filter controls
function initializeFilters() {
    const filtersDiv = document.getElementById('filters');
    
    // Get unique categories
    const categories = ['全部', ...new Set(stockData.map(stock => stock.category))];
    
    // Create category filter
    const categoryFilter = createFilterGroup('類別', 'category-filter', categories);
    
    // Create price level filter
    const priceLevels = [
        { value: '全部', text: '全部' },
        { value: 'low', text: '低位階' },
        { value: 'medium', text: '中位階' },
        { value: 'high', text: '高位階' }
    ];
    const levelFilter = createFilterGroup('價位階段', 'level-filter', 
        priceLevels.map(pl => pl.text), priceLevels.map(pl => pl.value));
    
    filtersDiv.appendChild(categoryFilter);
    filtersDiv.appendChild(levelFilter);
    
    // Add event listeners
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('level-filter').addEventListener('change', applyFilters);
}

// Create a filter group
function createFilterGroup(label, id, options, values = null) {
    const group = document.createElement('div');
    group.className = 'filter-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', id);
    
    const select = document.createElement('select');
    select.id = id;
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        optionElement.value = values ? values[index] : option;
        select.appendChild(optionElement);
    });
    
    group.appendChild(labelElement);
    group.appendChild(select);
    
    return group;
}

// Apply filters to stock data
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const levelFilter = document.getElementById('level-filter').value;
    
    filteredStocks = stockData.filter(stock => {
        const categoryMatch = categoryFilter === '全部' || stock.category === categoryFilter;
        const levelMatch = levelFilter === '全部' || stock.priceLevel === levelFilter;
        return categoryMatch && levelMatch;
    });
    
    displayStocks(filteredStocks);
}

// Display stocks in the grid
function displayStocks(stocks) {
    const stockDisplay = document.getElementById('stock-display');
    stockDisplay.innerHTML = '';
    
    if (stocks.length === 0) {
        stockDisplay.innerHTML = '<div class="empty-state">沒有符合條件的股票</div>';
        return;
    }
    
    stocks.forEach(stock => {
        const card = createStockCard(stock);
        stockDisplay.appendChild(card);
    });
}

// Create a stock card element
function createStockCard(stock) {
    const card = document.createElement('div');
    card.className = 'stock-card';
    
    card.innerHTML = `
        <div class="stock-header">
            <div class="stock-symbol">${stock.symbol}</div>
            <div class="stock-category">${stock.category}</div>
        </div>
        <div class="stock-price">$${stock.price.toFixed(2)}</div>
        <div class="price-level level-${stock.priceLevel}">
            ${PRICE_LEVEL_TEXT[stock.priceLevel]}
        </div>
        <div class="stock-reason">
            <strong>分析：</strong> ${stock.reason}
        </div>
    `;
    
    return card;
}

// Display daily recommendations
function displayRecommendations() {
    const recommendationsSection = document.getElementById('daily-recommendations');
    
    const recommendedStocks = stockData.filter(stock => stock.recommended);
    
    let html = '<h2>📈 今日推薦買入</h2>';
    
    if (recommendedStocks.length === 0) {
        html += '<div class="empty-state">今日無推薦標的</div>';
    } else {
        html += '<div class="recommendations-grid">';
        
        recommendedStocks.forEach(stock => {
            html += `
                <div class="recommendation-card">
                    <h3>${stock.symbol} - ${stock.name}</h3>
                    <div class="rec-price">目前價格：$${stock.price.toFixed(2)}</div>
                    <div class="rec-reason">${stock.reason}</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    recommendationsSection.innerHTML = html;
}
