/**
 * 网页二维码 - 主逻辑文件
 * 功能: 生成带有favicon的二维码
 */

// ==================== 工具函数 ====================

/**
 * 获取当前活动标签页的信息
 * @returns {Promise<chrome.tabs.Tab>} 标签页对象
 */
async function getCurrentTab() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab;
    } catch (error) {
        console.error('获取标签页信息失败:', error);
        throw error;
    }
}

/**
 * 从URL中提取简洁的域名
 * @param {string} url - 完整的URL
 * @returns {string} 格式化后的域名
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        let domain = urlObj.hostname;
        // 移除www前缀
        domain = domain.replace(/^www\./, '');
        return domain;
    } catch (error) {
        console.error('URL解析失败:', error);
        return 'invalid-url';
    }
}

/**
 * 获取网站的favicon URL
 * @param {string} url - 网站URL
 * @returns {string} Favicon的URL
 */
function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url);
        // 使用Google的favicon服务作为备选
        return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
    } catch (error) {
        console.error('获取favicon失败:', error);
        return null;
    }
}

// ==================== 二维码生成 ====================

/**
 * 生成带有favicon的二维码
 * @param {string} url - 要编码的URL
 * @param {string} faviconUrl - 网站的favicon URL
 */
async function generateQRCode(url, faviconUrl) {
    const canvasElement = document.getElementById('qrcode');
    const loading = document.getElementById('loading');
    
    try {
        // 清空canvas
        const ctx = canvasElement.getContext('2d');
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        // 设置canvas尺寸
        canvasElement.width = 300;
        canvasElement.height = 300;
        
        // 直接在canvas上生成二维码
        // 由于davidshimjs的qrcode.js库会自动创建canvas,我们需要先创建一个临时容器
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.pointerEvents = 'none';
        tempContainer.style.zIndex = '-1';
        document.body.appendChild(tempContainer);
        
        // 使用QRCode库生成二维码
        const qrcode = new QRCode(tempContainer, {
            text: url,
            width: 300,
            height: 300,
            colorDark: '#1d1d1f',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H  // 高容错率,便于叠加logo
        });
        
        // 等待二维码渲染完成
        setTimeout(async () => {
            try {
                // 查找生成的canvas或img元素
                const generatedCanvas = tempContainer.querySelector('canvas');
                const generatedImg = tempContainer.querySelector('img');
                
                if (generatedCanvas) {
                    // 如果生成了canvas,直接复制到我们的canvas
                    ctx.drawImage(generatedCanvas, 0, 0, 300, 300);
                    
                    // 在二维码中央叠加favicon
                    await addFaviconToQRCode(canvasElement, faviconUrl);
                    
                    // 清理临时容器
                    document.body.removeChild(tempContainer);
                    
                    // 隐藏加载动画
                    loading.classList.add('hidden');
                    
                } else if (generatedImg) {
                    // 如果生成了图片,等待加载完成
                    generatedImg.onload = async function() {
                        ctx.drawImage(generatedImg, 0, 0, 300, 300);
                        
                        // 在二维码中央叠加favicon
                        await addFaviconToQRCode(canvasElement, faviconUrl);
                        
                        // 清理临时容器
                        document.body.removeChild(tempContainer);
                        
                        // 隐藏加载动画
                        loading.classList.add('hidden');
                    };
                    
                    generatedImg.onerror = function() {
                        console.error('二维码图片加载失败');
                        document.body.removeChild(tempContainer);
                        loading.classList.add('hidden');
                        loading.innerHTML = '<p>⚠️ 生成失败</p>';
                    };
                } else {
                    console.error('未找到生成的二维码元素');
                    document.body.removeChild(tempContainer);
                    loading.classList.add('hidden');
                    loading.innerHTML = '<p>⚠️ 生成失败</p>';
                }
                
            } catch (error) {
                console.error('处理二维码时出错:', error);
                if (document.body.contains(tempContainer)) {
                    document.body.removeChild(tempContainer);
                }
                loading.classList.add('hidden');
                loading.innerHTML = '<p>⚠️ 生成失败</p>';
            }
        }, 300);  // 增加等待时间,确保二维码完全生成
        
    } catch (error) {
        console.error('生成二维码时出错:', error);
        loading.classList.add('hidden');
        loading.innerHTML = '<p>⚠️ 生成失败</p>';
    }
}

/**
 * 在二维码中央叠加favicon
 * @param {HTMLCanvasElement} canvas - 二维码canvas
 * @param {string} faviconUrl - Favicon URL
 */
async function addFaviconToQRCode(canvas, faviconUrl) {
    if (!faviconUrl) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // 允许跨域图片
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
        img.onload = function() {
            const canvasSize = canvas.width;
            // Logo尺寸约为二维码的20%
            const logoSize = canvasSize * 0.2;
            const x = (canvasSize - logoSize) / 2;
            const y = (canvasSize - logoSize) / 2;
            
            // 绘制白色背景(带圆角)
            const padding = 8;
            const bgSize = logoSize + padding * 2;
            const bgX = x - padding;
            const bgY = y - padding;
            const radius = 12;
            
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            
            // 绘制圆角矩形背景
            ctx.beginPath();
            ctx.moveTo(bgX + radius, bgY);
            ctx.lineTo(bgX + bgSize - radius, bgY);
            ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + radius);
            ctx.lineTo(bgX + bgSize, bgY + bgSize - radius);
            ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - radius, bgY + bgSize);
            ctx.lineTo(bgX + radius, bgY + bgSize);
            ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - radius);
            ctx.lineTo(bgX, bgY + radius);
            ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
            ctx.closePath();
            ctx.fill();
            
            // 重置阴影
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // 绘制favicon(带圆角)
            ctx.save();
            ctx.beginPath();
            const imgRadius = 8;
            ctx.moveTo(x + imgRadius, y);
            ctx.lineTo(x + logoSize - imgRadius, y);
            ctx.quadraticCurveTo(x + logoSize, y, x + logoSize, y + imgRadius);
            ctx.lineTo(x + logoSize, y + logoSize - imgRadius);
            ctx.quadraticCurveTo(x + logoSize, y + logoSize, x + logoSize - imgRadius, y + logoSize);
            ctx.lineTo(x + imgRadius, y + logoSize);
            ctx.quadraticCurveTo(x, y + logoSize, x, y + logoSize - imgRadius);
            ctx.lineTo(x, y + imgRadius);
            ctx.quadraticCurveTo(x, y, x + imgRadius, y);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(img, x, y, logoSize, logoSize);
            ctx.restore();
            
            resolve();
        };
        
        img.onerror = function() {
            console.warn('Favicon加载失败,显示纯二维码');
            resolve();
        };
        
        img.src = faviconUrl;
    });
}

// ==================== UI更新 ====================

/**
 * 显示网站信息
 * @param {string} title - 网站标题
 * @param {string} url - 网站URL
 */
function displayWebsiteInfo(title, url) {
    const titleElement = document.getElementById('website-title');
    const urlElement = document.getElementById('website-url');
    
    // 显示标题(如果标题为空,使用域名)
    const displayTitle = title || extractDomain(url);
    titleElement.textContent = displayTitle;
    titleElement.title = displayTitle; // 悬停时显示完整标题
    
    // 显示域名
    const domain = extractDomain(url);
    urlElement.textContent = domain;
    urlElement.title = url; // 悬停时显示完整URL
}

// ==================== 下载功能 ====================

/**
 * 下载二维码图片
 */
function downloadQRCode() {
    const canvas = document.getElementById('qrcode');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    
    // 使用网站域名作为文件名
    const tab = getCurrentTab();
    tab.then(tabInfo => {
        const domain = extractDomain(tabInfo.url);
        link.download = `qrcode-${domain}.png`;
        link.href = url;
        link.click();
    });
}

// ==================== 初始化 ====================

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 获取当前标签页信息
        const tab = await getCurrentTab();
        
        // 检查URL是否有效
        if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
            document.getElementById('loading').innerHTML = '<p>⚠️ 无法为浏览器内部页面生成二维码</p>';
            return;
        }
        
        // 显示网站信息
        displayWebsiteInfo(tab.title, tab.url);
        
        // 获取favicon并生成二维码
        const faviconUrl = getFaviconUrl(tab.url);
        await generateQRCode(tab.url, faviconUrl);
        
        // 绑定下载按钮事件
        document.getElementById('download-btn').addEventListener('click', downloadQRCode);
        
    } catch (error) {
        console.error('初始化失败:', error);
        document.getElementById('loading').innerHTML = '<p>⚠️ 加载失败</p>';
    }
});

