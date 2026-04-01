// ==UserScript==
// @name         广告屏蔽脚本
// @namespace    https://viayoo.com/yh65gn
// @version      0.1
// @description  自动检测和屏蔽网页广告，支持手动选择广告元素
// @author       You
// @run-at       document-end
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Gitee配置
    var GITEE_TOKEN = '6f21f333c897cd27407fbb9b2395a62b';
    var GITEE_GIST_ID = 'cfw2zxdthe4my73ansg5p31';

    // 广告检测规则
    var adSelectors = [
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
    var blockRules = [];

    // 初始化函数
    function init() {
        console.log('广告屏蔽脚本初始化');
        loadBlockRules();
        startAdDetection();
        setupManualSelection();
    }

    // 从Gitee加载屏蔽规则
    function loadBlockRules() {
        var url = 'https://gitee.com/api/v5/gists/' + GITEE_GIST_ID;
        fetch(url, {
            headers: {
                'Authorization': 'token ' + GITEE_TOKEN
            }
        })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.error('加载屏蔽规则失败:', response.status);
                return null;
            }
        })
        .then(function(gist) {
            if (gist) {
                var file = null;
                for (var key in gist.files) {
                    if (gist.files.hasOwnProperty(key)) {
                        file = gist.files[key];
                        break;
                    }
                }
                if (file) {
                    var content = file.content;
                    blockRules = JSON.parse(content) || [];
                    console.log('成功加载屏蔽规则:', blockRules.length, '条');
                }
            }
        })
        .catch(function(error) {
            console.error('加载屏蔽规则出错:', error);
        });
    }

    // 保存屏蔽规则到Gitee
    function saveBlockRules() {
        var url = 'https://gitee.com/api/v5/gists/' + GITEE_GIST_ID;
        fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': 'token ' + GITEE_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'block-rules.json': {
                        content: JSON.stringify(blockRules, null, 2)
                    }
                }
            })
        })
        .then(function(response) {
            if (response.ok) {
                console.log('屏蔽规则保存成功');
            } else {
                console.error('保存屏蔽规则失败:', response.status);
            }
        })
        .catch(function(error) {
            console.error('保存屏蔽规则出错:', error);
        });
    }

    // 开始广告检测
    function startAdDetection() {
        // 初始检测
        detectAndBlockAds();
        
        // 监听DOM变化，检测动态加载的广告
        var observer = new MutationObserver(detectAndBlockAds);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('广告检测已启动');
    }

    // 检测并屏蔽广告
    function detectAndBlockAds() {
        // 使用内置规则检测
        for (var i = 0; i < adSelectors.length; i++) {
            var selector = adSelectors[i];
            var elements = document.querySelectorAll(selector);
            for (var j = 0; j < elements.length; j++) {
                blockElement(elements[j], '内置规则');
            }
        }
        
        // 使用自定义规则检测
        for (var k = 0; k < blockRules.length; k++) {
            var rule = blockRules[k];
            if (rule.selector) {
                var elements = document.querySelectorAll(rule.selector);
                for (var l = 0; l < elements.length; l++) {
                    blockElement(elements[l], '自定义规则');
                }
            }
        }
    }

    // 屏蔽元素
    function blockElement(element, reason) {
        if (element && !element.dataset.blocked) {
            element.style.display = 'none';
            element.dataset.blocked = 'true';
            console.log('屏蔽广告元素:', element, '原因:', reason);
        }
    }

    // 设置手动选择功能
    function setupManualSelection() {
        // 添加选择模式切换
        var toggleButton = document.createElement('button');
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
        
        var isSelecting = false;
        
        toggleButton.addEventListener('click', function() {
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
        var element = e.target;
        element.style.outline = '2px solid red';
        element.dataset.highlighted = 'true';
    }

    // 移除高亮
    function removeHighlight() {
        var elements = document.querySelectorAll('[data-highlighted="true"]');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.outline = '';
            delete elements[i].dataset.highlighted;
        }
    }

    // 选择元素
    function selectElement(e) {
        e.preventDefault();
        var element = e.target;
        
        if (element.dataset.highlighted) {
            var selector = generateSelector(element);
            
            // 添加到屏蔽规则
            var exists = false;
            for (var i = 0; i < blockRules.length; i++) {
                if (blockRules[i].selector === selector) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
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
            return '#' + element.id;
        }
        
        if (element.className && element.className.trim()) {
            var classes = element.className.trim().split(/\s+/);
            return '.' + classes.join('.');
        }
        
        var selector = element.tagName.toLowerCase();
        var parent = element.parentElement;
        
        while (parent && parent !== document.body) {
            var siblings = [];
            for (var i = 0; i < parent.children.length; i++) {
                siblings.push(parent.children[i]);
            }
            var index = siblings.indexOf(element);
            
            if (index > 0) {
                selector = parent.tagName.toLowerCase() + ':nth-child(' + (index + 1) + ') > ' + selector;
            } else {
                selector = parent.tagName.toLowerCase() + ' > ' + selector;
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

})();
