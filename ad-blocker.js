// 广告屏蔽脚本 - 支持via浏览器
// 手动屏蔽规则保存在Gitee代码块中

// Gitee配置
const GITEE_TOKEN = '6f21f333c897cd27407fbb9b2395a62b';
const GITEE_GIST_ID = 'cfw2zxdthe4my73ansg5p31';

// 广告检测规则
const adSelectors = [
    // 常见广告类名
    '.ad', '.ads', '.advertisement', '.ad-container',
    '.banner-ad', '.popup-ad', '.ad-banner', '.ad-wrapper',
    '.ad-placement', '.ad-space', '.ad-unit', '.sponsored',
    // 常见广告ID
    '#ad', '#ads', '#advertisement', '#ad-container',
    // 常见广告关键词
    '[class*="ad"]', '[id*="ad"]',
    // 小说网站常见广告
    '.chapter-ad', '.content-ad', '.reading-ad', '.book-ad'
];

// 已保存的屏蔽规则
let blockRules = [];

// 初始化函数
function init() {
    console.log('广告屏蔽脚本初始化');
    loadBlockRules();
    startAdDetection();
    setupManualSelection();
}

// 从Gitee加载屏蔽规则
async function loadBlockRules() {
    try {
        const response = await fetch(`https://gitee.com/api/v5/gists/${GITEE_GIST_ID}`, {
            headers: {
                'Authorization': `token ${GITEE_TOKEN}`
            }
        });
        
        if (response.ok) {
            const gist = await response.json();
            const file = Object.values(gist.files)[0];
            if (file) {
                const content = file.content;
                blockRules = JSON.parse(content) || [];
                console.log('成功加载屏蔽规则:', blockRules.length, '条');
            }
        } else {
            console.error('加载屏蔽规则失败:', response.status);
        }
    } catch (error) {
        console.error('加载屏蔽规则出错:', error);
    }
}

// 保存屏蔽规则到Gitee
async function saveBlockRules() {
    try {
        const response = await fetch(`https://gitee.com/api/v5/gists/${GITEE_GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITEE_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'block-rules.json': {
                        content: JSON.stringify(blockRules, null, 2)
                    }
                }
            })
        });
        
        if (response.ok) {
            console.log('屏蔽规则保存成功');
        } else {
            console.error('保存屏蔽规则失败:', response.status);
        }
    } catch (error) {
        console.error('保存屏蔽规则出错:', error);
    }
}

// 开始广告检测
function startAdDetection() {
    // 初始检测
    detectAndBlockAds();
    
    // 监听DOM变化，检测动态加载的广告
    const observer = new MutationObserver(detectAndBlockAds);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('广告检测已启动');
}

// 检测并屏蔽广告
function detectAndBlockAds() {
    // 使用内置规则检测
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            blockElement(element, '内置规则');
        });
    });
    
    // 使用自定义规则检测
    blockRules.forEach(rule => {
        if (rule.selector) {
            document.querySelectorAll(rule.selector).forEach(element => {
                blockElement(element, '自定义规则');
            });
        }
    });
}

// 屏蔽元素
function blockElement(element, reason) {
    if (element && !element.dataset.blocked) {
        element.style.display = 'none';
        element.dataset.blocked = 'true';
        console.log(`屏蔽广告元素:`, element, `原因:`, reason);
    }
}

// 设置手动选择功能
function setupManualSelection() {
    // 添加选择模式切换
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '选择广告';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '8px 16px';
    toggleButton.style.backgroundColor = '#f00';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    
    document.body.appendChild(toggleButton);
    
    let isSelecting = false;
    
    toggleButton.addEventListener('click', () => {
        isSelecting = !isSelecting;
        toggleButton.textContent = isSelecting ? '取消选择' : '选择广告';
        
        if (isSelecting) {
            startSelectionMode();
        } else {
            endSelectionMode();
        }
    });
}

// 开始选择模式
function startSelectionMode() {
    document.addEventListener('mouseover', highlightElement);
    document.addEventListener('click', selectElement);
    console.log('进入广告选择模式');
}

// 结束选择模式
function endSelectionMode() {
    document.removeEventListener('mouseover', highlightElement);
    document.removeEventListener('click', selectElement);
    removeHighlight();
    console.log('退出广告选择模式');
}

// 高亮元素
function highlightElement(e) {
    removeHighlight();
    const element = e.target;
    element.style.outline = '2px solid red';
    element.dataset.highlighted = 'true';
}

// 移除高亮
function removeHighlight() {
    document.querySelectorAll('[data-highlighted="true"]').forEach(element => {
        element.style.outline = '';
        delete element.dataset.highlighted;
    });
}

// 选择元素
function selectElement(e) {
    e.preventDefault();
    const element = e.target;
    
    if (element.dataset.highlighted) {
        const selector = generateSelector(element);
        
        // 添加到屏蔽规则
        if (!blockRules.some(rule => rule.selector === selector)) {
            blockRules.push({
                selector: selector,
                added: new Date().toISOString(),
                url: window.location.href
            });
            
            // 立即屏蔽
            blockElement(element, '手动选择');
            
            // 保存规则
            saveBlockRules();
            
            console.log('已添加屏蔽规则:', selector);
            alert('广告元素已添加到屏蔽规则');
        }
        
        endSelectionMode();
    }
}

// 生成元素选择器
function generateSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }
    
    if (element.className && element.className.trim()) {
        const classes = element.className.trim().split(/\s+/);
        return `.${classes.join('.')}`;
    }
    
    let selector = element.tagName.toLowerCase();
    let parent = element.parentElement;
    
    while (parent && parent !== document.body) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(element);
        
        if (index > 0) {
            selector = `${parent.tagName.toLowerCase()}:nth-child(${index + 1}) > ${selector}`;
        } else {
            selector = `${parent.tagName.toLowerCase()} > ${selector}`;
        }
        
        element = parent;
        parent = parent.parentElement;
    }
    
    return selector;
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
