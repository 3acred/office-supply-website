// ========== 移动端汉堡菜单 ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ========== 轮播图 ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (!slides.length) return;
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

// 自动轮播
setInterval(() => {
    nextSlide();
}, 5000);

// ========== 工具函数：获取URL参数 ==========
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ========== 工具函数：localStorage操作 ==========
function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocal(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// ========== 记录浏览历史 ==========
function addToHistory(productId) {
    let history = getFromLocal('viewHistory') || [];
    history = [productId, ...history.filter(id => id !== productId)];
    if (history.length > 10) history = history.slice(0, 10);
    saveToLocal('viewHistory', history);
}

// ========== 记录产品访问量 ==========
function incrementProductViews(productId) {
    let views = getFromLocal('productViews') || {};
    views[productId] = (views[productId] || 0) + 1;
    saveToLocal('productViews', views);
}