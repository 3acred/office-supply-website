async function loadDashboardData() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        const products = data.products;
        
        const views = getFromLocal('productViews') || {};
        
        // 更新产品访问量
        products.forEach(p => {
            p.views = views[p.id] || 0;
        });
        
        renderStatsCards(products);
        renderProductChart(products);
        renderCategoryChart(products);
        
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

function renderStatsCards(products) {
    const container = document.getElementById('statsCards');
    const totalProducts = products.length;
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    const topProduct = products.reduce((max, p) => (p.views || 0) > (max.views || 0) ? p : max, { views: 0 });
    
    container.innerHTML = `
        <div class="stat-card">
            <h3>${totalProducts}</h3>
            <p>产品总数</p>
        </div>
        <div class="stat-card">
            <h3>${totalViews}</h3>
            <p>总访问量</p>
        </div>
        <div class="stat-card">
            <h3>${topProduct.name || '-'}</h3>
            <p>最热门产品</p>
        </div>
    `;
}

function renderProductChart(products) {
    const chartDom = document.getElementById('productChart');
    if (!chartDom) return;
    
    const topProducts = [...products]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8);
    
    const chart = echarts.init(chartDom);
    chart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: topProducts.map(p => p.name), axisLabel: { rotate: 30, interval: 0 } },
        yAxis: { type: 'value', name: '访问量' },
        series: [{
            name: '访问量',
            type: 'bar',
            data: topProducts.map(p => p.views || 0),
            itemStyle: { borderRadius: [5,5,0,0], color: '#ff6b35' }
        }]
    });
}

function renderCategoryChart(products) {
    const chartDom = document.getElementById('categoryChart');
    if (!chartDom) return;
    
    const categoryViews = {};
    products.forEach(p => {
        const cat = p.category;
        categoryViews[cat] = (categoryViews[cat] || 0) + (p.views || 0);
    });
    
    const chart = echarts.init(chartDom);
    chart.setOption({
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
            name: '访问占比',
            type: 'pie',
            radius: ['40%', '70%'],
            data: Object.entries(categoryViews).map(([name, value]) => ({ name, value })),
            emphasis: { scale: true },
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }
        }]
    });
}

loadDashboardData();