let allProducts = [];

// 加载产品数据
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        allProducts = data.products;
        renderProducts(allProducts);
    } catch (error) {
        console.error('加载产品失败:', error);
    }
}

// 渲染产品列表
function renderProducts(products) {
    const container = document.getElementById('productList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center">暂无产品</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">¥${product.price}</p>
            <a href="product-detail.html?id=${product.id}" class="btn">查看详情</a>
        </div>
    `).join('');
}

// 筛选产品
function filterProducts() {
    const category = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const keyword = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    let filtered = allProducts;
    
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (keyword) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            p.model?.toLowerCase().includes(keyword)
        );
    }
    
    renderProducts(filtered);
}

// 绑定筛选事件
function bindFilterEvents() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts();
        });
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

// 获取推荐产品（智能推荐）
function getRecommendations(currentProductId, category, limit = 4) {
    const sameCategory = allProducts.filter(p => 
        p.category === category && p.id !== currentProductId
    );
    // 按访问量排序，没有访问量的随机
    const sorted = sameCategory.sort((a, b) => (b.views || 0) - (a.views || 0));
    return sorted.slice(0, limit);
}

// 页面初始化
if (document.getElementById('productList')) {
    loadProducts();
    bindFilterEvents();
}