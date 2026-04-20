let currentProduct = null;

async function loadProductDetail() {
    const productId = getUrlParam('id');
    if (!productId) {
        document.getElementById('detailContainer').innerHTML = '<p>产品不存在</p>';
        return;
    }
    
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        allProducts = data.products;
        currentProduct = allProducts.find(p => p.id === productId);
        
        if (!currentProduct) {
            document.getElementById('detailContainer').innerHTML = '<p>产品不存在</p>';
            return;
        }
        
        // 记录浏览历史和访问量
        addToHistory(productId);
        incrementProductViews(productId);
        
        renderProductDetail();
        renderRecommendations();
        
    } catch (error) {
        console.error('加载失败:', error);
    }
}

function renderProductDetail() {
    const container = document.getElementById('detailContainer');
    container.innerHTML = `
        <div style="background:white; border-radius:10px; padding:30px; margin:30px 0">
            <img src="${currentProduct.image || 'images/placeholder.jpg'}" 
                 style="width:100%; max-width:400px; border-radius:10px; margin-bottom:20px">
            <h1>${currentProduct.name}</h1>
            <p><strong>型号：</strong>${currentProduct.model || '-'}</p>
            <p><strong>规格：</strong>${currentProduct.spec || '-'}</p>
            <p><strong>适用机型：</strong>${currentProduct.applicable || '-'}</p>
            <p><strong>价格：</strong><span style="color:#ff6b35; font-size:1.5rem">¥${currentProduct.price}</span></p>
            <a href="contact.html" class="btn" style="margin-top:20px">立即询价</a>
        </div>
    `;
}

function renderRecommendations() {
    const recommendations = getRecommendations(currentProduct.id, currentProduct.category, 4);
    if (recommendations.length === 0) return;
    
    const section = document.getElementById('recommendSection');
    const container = document.getElementById('recommendList');
    
    if (section && container) {
        section.style.display = 'block';
        container.innerHTML = recommendations.map(product => `
            <div class="product-card">
                <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">¥${product.price}</p>
                <a href="product-detail.html?id=${product.id}" class="btn">查看详情</a>
            </div>
        `).join('');
    }
}

loadProductDetail();