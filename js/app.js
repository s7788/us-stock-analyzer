// US Stock Analyzer - Main Application

// Stock data with price levels and reasons
const stockData = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 178.50,
        category: '科技',
        priceLevel: 'medium',
        reason: '當前股價處於中位階，技術面顯示MACD金叉，但RSI接近70，顯示有些過熱。基本面支撐強勁，建議等待回調後買入。',
        recommended: false
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.25,
        category: '科技',
        priceLevel: 'low',
        reason: '股價處於低位階，相對歷史高點回調約15%。雲端業務持續增長，AI投資有望帶來長期收益。技術面顯示超賣，適合中長期投資者進場。',
        recommended: true
    },
    {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.50,
        category: '科技',
        priceLevel: 'low',
        reason: '目前處於低位階，PE比率相對科技股偏低。搜尋引擎主導地位穩固，雲端業務快速成長。技術面出現築底訊號，適合分批進場。',
        recommended: true
    },
    {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 156.80,
        category: '電商',
        priceLevel: 'medium',
        reason: '股價處於中位階，電商業務穩定，AWS雲端服務持續貢獻利潤。近期財報表現符合預期，但市場對消費支出有所顧慮。',
        recommended: false
    },
    {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.50,
        category: '汽車',
        priceLevel: 'high',
        reason: '股價處於高位階，本益比超過60倍。雖然電動車交付量增長，但競爭加劇。技術面顯示超買，短期獲利了結壓力大，建議觀望。',
        recommended: false
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 485.50,
        category: '科技',
        priceLevel: 'high',
        reason: '股價處於高位階，受惠AI熱潮大漲。雖然基本面強勁，但估值偏高，短期存在回調風險。適合已持有者分批獲利了結。',
        recommended: false
    },
    {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        price: 158.75,
        category: '金融',
        priceLevel: 'low',
        reason: '銀行股處於低位階，利率環境有利於淨利息收入。資產品質良好，股息收益率吸引人。技術面顯示支撐強勁，適合價值投資者。',
        recommended: true
    },
    {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        price: 162.30,
        category: '醫療',
        priceLevel: 'low',
        reason: '防禦型股票處於低位階，股息穩定且持續增長。受藥品專利到期影響，但新藥研發管線充足。適合尋求穩定收益的投資者。',
        recommended: true
    },
    {
        symbol: 'V',
        name: 'Visa Inc.',
        price: 265.40,
        category: '金融',
        priceLevel: 'medium',
        reason: '股價處於中位階，全球支付業務穩健增長。數位支付趨勢持續，但面臨競爭加劇。基本面良好，可等待更好的買點。',
        recommended: false
    },
    {
        symbol: 'WMT',
        name: 'Walmart Inc.',
        price: 168.90,
        category: '零售',
        priceLevel: 'medium',
        reason: '零售龍頭股價處於中位階，受惠消費韌性。電商業務快速成長，但利潤率面臨壓力。適合保守投資者配置的防禦性股票。',
        recommended: false
    },
    {
        symbol: 'DIS',
        name: 'The Walt Disney Company',
        price: 95.80,
        category: '娛樂',
        priceLevel: 'low',
        reason: '股價處於低位階，Disney+串流業務轉虧為盈。主題樂園營收強勁恢復，內容創作能力無可比擬。估值吸引，適合長期布局。',
        recommended: true
    },
    {
        symbol: 'BA',
        name: 'The Boeing Company',
        price: 185.60,
        category: '航空',
        priceLevel: 'high',
        reason: '股價處於高位階，雖然訂單回升但生產問題頻傳。財務壓力較大，不確定性高。建議觀望等待更明確的轉機訊號。',
        recommended: false
    }
];

// Global state
let filteredStocks = [...stockData];

// Price level text mapping
const PRICE_LEVEL_TEXT = {
    'low': '低位階',
    'medium': '中位階',
    'high': '高位階'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    displayStocks(stockData);
    displayRecommendations();
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
