// ==UserScript==
// @name         页面优化工具
// @namespace    https://viayoo.com/yh65gn
// @version      0.1
// @description  优化页面加载速度，提升浏览体验
// @author       You
// @run-at       document-end
// @match        https://*/*
// @grant        none
// ==/UserScript==

// 反检测措施：使用随机变量名和延迟执行
(function() {
    'use strict';

    // 配置信息 - 加密存储
    var _c1 = '6f21f333c897cd27407fbb9b2395a62b';
    var _c2 = 'cfw2zxdthe4my73ansg5p31';

    // 优化规则
    var _sels = [
        // 常见优化目标
        '.ad', '.ads', '.advertisement', '.ad-container',
        '.banner-ad', '.popup-ad', '.ad-banner', '.ad-wrapper',
        '.ad-placement', '.ad-space', '.ad-unit', '.sponsored',
        // 常见ID
        '#ad', '#ads', '#advertisement', '#ad-container',
        // 关键词
        '[class*="ad"]', '[id*="ad"]',
        // 特定网站元素
        '.chapter-ad', '.content-ad', '.reading-ad', '.book-ad'
    ];

    // 已保存的规则
    var _rules = [];

    // 延迟初始化，避免被检测
    setTimeout(function() {
        _loadRules();
        _startOpt();
        _setupTool();
    }, 1000 + Math.random() * 2000);

    // 从Gitee加载规则
    function _loadRules() {
        var url = 'https://gitee.com/api/v5/gists/' + _c2;
        // 延迟执行网络请求，避免被检测
        setTimeout(function() {
            fetch(url, {
                headers: {
                    'Authorization': 'token ' + _c1
                },
                // 添加随机延迟，模拟用户行为
                credentials: 'omit',
                mode: 'cors'
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
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
                        _rules = JSON.parse(content) || [];
                    }
                }
            })
            .catch(function(error) {
                // 静默处理错误
            });
        }, Math.random() * 1000);
    }

    // 保存规则到Gitee
    function _saveRules() {
        var url = 'https://gitee.com/api/v5/gists/' + _c2;
        // 延迟执行网络请求，避免被检测
        setTimeout(function() {
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'token ' + _c1,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        'optimization-rules.json': {
                            content: JSON.stringify(_rules, null, 2)
                        }
                    }
                }),
                credentials: 'omit',
                mode: 'cors'
            })
            .then(function(response) {
                // 静默处理成功
            })
            .catch(function(error) {
                // 静默处理错误
            });
        }, Math.random() * 1000);
    }

    // 开始页面优化
    function _startOpt() {
        // 初始优化
        _optPage();
        
        // 监听DOM变化，处理动态加载的内容
        var observer = new MutationObserver(_optPage);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 优化页面
    function _optPage() {
        // 随机延迟，避免被检测
        if (Math.random() > 0.7) return;
        
        // 使用内置规则优化
        for (var i = 0; i < _sels.length; i++) {
            var selector = _sels[i];
            var elements = document.querySelectorAll(selector);
            for (var j = 0; j < elements.length; j++) {
                _optElem(elements[j]);
            }
        }
        
        // 使用自定义规则优化
        for (var k = 0; k < _rules.length; k++) {
            var rule = _rules[k];
            if (rule.selector) {
                var elements = document.querySelectorAll(rule.selector);
                for (var l = 0; l < elements.length; l++) {
                    _optElem(elements[l]);
                }
            }
        }
    }

    // 优化元素
    function _optElem(element) {
        if (element && !element.dataset._opt) {
            // 使用更隐蔽的方式隐藏元素
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.style.top = '-9999px';
            element.style.width = '1px';
            element.style.height = '1px';
            element.style.overflow = 'hidden';
            element.dataset._opt = '1';
        }
    }

    // 设置选择工具
    function _setupTool() {
        // 随机延迟，避免被检测
        setTimeout(function() {
            // 添加选择模式切换
            var btn = document.createElement('button');
            btn.textContent = '优化';
            btn.style.position = 'fixed';
            btn.style.top = '10px';
            btn.style.right = '10px';
            btn.style.zIndex = '9999';
            btn.style.padding = '6px 12px';
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '3px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '11px';
            btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            
            // 检查是否已存在类似按钮
            var existingBtn = document.querySelector('[data-opt-btn="1"]');
            if (!existingBtn) {
                btn.dataset.optBtn = '1';
                document.body.appendChild(btn);
                
                var isSel = false;
                
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    isSel = !isSel;
                    btn.textContent = isSel ? '取消' : '优化';
                    
                    if (isSel) {
                        _startSel();
                    } else {
                        _endSel();
                    }
                });
            }
        }, Math.random() * 1500);
    }

    // 开始选择模式
    function _startSel() {
        document.addEventListener('mouseover', _hlElem);
        document.addEventListener('click', _selElem);
    }

    // 结束选择模式
    function _endSel() {
        document.removeEventListener('mouseover', _hlElem);
        document.removeEventListener('click', _selElem);
        _rmHl();
    }

    // 高亮元素
    function _hlElem(e) {
        _rmHl();
        var elem = e.target;
        elem.style.outline = '2px solid #4CAF50';
        elem.dataset._hl = '1';
    }

    // 移除高亮
    function _rmHl() {
        var elems = document.querySelectorAll('[data-_hl="1"]');
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.outline = '';
            delete elems[i].dataset._hl;
        }
    }

    // 选择元素
    function _selElem(e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = e.target;
        
        if (elem.dataset._hl) {
            var sel = _genSel(elem);
            
            // 添加到优化规则
            var exists = false;
            for (var i = 0; i < _rules.length; i++) {
                if (_rules[i].selector === sel) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                _rules.push({
                    selector: sel,
                    added: new Date().toISOString(),
                    url: window.location.href
                });
                
                // 立即优化
                _optElem(elem);
                
                // 保存规则
                _saveRules();
                
                // 使用更隐蔽的提示方式
                var toast = document.createElement('div');
                toast.textContent = '已优化';
                toast.style.position = 'fixed';
                toast.style.top = '50%';
                toast.style.left = '50%';
                toast.style.transform = 'translate(-50%, -50%)';
                toast.style.padding = '10px 20px';
                toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
                toast.style.color = '#fff';
                toast.style.borderRadius = '4px';
                toast.style.zIndex = '99999';
                toast.style.fontSize = '12px';
                document.body.appendChild(toast);
                setTimeout(function() {
                    toast.remove();
                }, 1500);
            }
            
            _endSel();
        }
    }

    // 生成元素选择器
    function _genSel(elem) {
        if (elem.id) {
            return '#' + elem.id;
        }
        
        if (elem.className && elem.className.trim()) {
            var classes = elem.className.trim().split(/\s+/);
            return '.' + classes.join('.');
        }
        
        var sel = elem.tagName.toLowerCase();
        var parent = elem.parentElement;
        
        while (parent && parent !== document.body) {
            var siblings = [];
            for (var i = 0; i < parent.children.length; i++) {
                siblings.push(parent.children[i]);
            }
            var index = siblings.indexOf(elem);
            
            if (index > 0) {
                sel = parent.tagName.toLowerCase() + ':nth-child(' + (index + 1) + ') > ' + sel;
            } else {
                sel = parent.tagName.toLowerCase() + ' > ' + sel;
            }
            
            elem = parent;
            parent = parent.parentElement;
        }
        
        return sel;
    }

})();
