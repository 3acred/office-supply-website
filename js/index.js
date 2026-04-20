async function loadHotProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        const hotProducts = data.products.slice(0, 4);
        
        const container = document.getElementById('hotProducts');
        if (container) {
            container.innerHTML = hotProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">¥${product.price}</p>
                    <a href="product-detail.html?id=${product.id}" class="btn">查看详情</a>
                </div>
            `).join('');
        }
        
        loadGuessYouLike(data.products);
        
    } catch (error) {
        console.error('加载失败:', error);
    }
}

function loadGuessYouLike(products) {
    const history = getFromLocal('viewHistory') || [];
    if (history.length === 0) return;
    
    const lastViewedId = history[0];
    const lastProduct = products.find(p => p.id === lastViewedId);
    if (!lastProduct) return;
    
    const recommendations = getRecommendations(lastViewedId, lastProduct.category, 4);
    if (recommendations.length === 0) return;
    
    const section = document.getElementById('recommendSection');
    const container = document.getElementById('guessYouLike');
    
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

loadHotProducts();