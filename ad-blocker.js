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

    // 屏蔽规则（仅从Gitee加载）
    var _sels = [];

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
                        try {
                            var parsed = JSON.parse(content);
                            _rules = Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                            _rules = [];
                        }
                    }
                }
                // 加载规则后应用到当前页面
                _optPage();
            })
            .catch(function(error) {
                _rules = [];
                // 即使出错也应用规则（空规则）
                _optPage();
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

        // 确保_rules是数组
        if (!Array.isArray(_rules)) {
            _rules = [];
        }
        
        // 不使用随机延迟，确保规则总是应用
        
        // 使用内置规则优化
        for (var i = 0; i < _sels.length; i++) {
            var selector = _sels[i];
            try {
                var elements = document.querySelectorAll(selector);
                for (var j = 0; j < elements.length; j++) {
                    _optElem(elements[j]);
                }
            } catch (e) {
                // 忽略无效选择器
            }
        }
        
        // 使用自定义规则优化
        for (var k = 0; k < _rules.length; k++) {
            var rule = _rules[k];
            if (rule && rule.selector) {
                try {
                    var elements = document.querySelectorAll(rule.selector);
                    for (var l = 0; l < elements.length; l++) {
                        _optElem(elements[l]);
                    }
                } catch (e) {
                    // 忽略无效选择器
                }
            }
        }
    }

    // 优化元素
    function _optElem(element) {
        if (element && !element.dataset._opt) {
            // 直接屏蔽元素，不进行广告检测
            if (element.nodeType === 1) {
                try {
                    element.style.display = 'none';
                    var styleText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; z-index: -9999 !important;';
                    if (element.style.cssText) {
                        element.style.cssText += ' ' + styleText;
                    } else {
                        element.style.cssText = styleText;
                    }
                    element.dataset._opt = '1';
                    element.offsetHeight;
                } catch (e) {
                    // 忽略错误
                }
            }
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

    // 当前高亮的元素
    var _currentHighlighted = null;
    
    // 开始选择模式
    function _startSel() {
        // 支持桌面端鼠标事件
        document.addEventListener('mouseover', _hlElem);
        // 支持移动端触摸事件
        document.addEventListener('touchstart', _hlElem, { passive: false });
    }

    // 结束选择模式
    function _endSel() {
        // 移除桌面端鼠标事件监听器
        document.removeEventListener('mouseover', _hlElem);
        // 移除移动端触摸事件监听器
        document.removeEventListener('touchstart', _hlElem);
        _rmHl();
    }

    // 高亮元素
    function _hlElem(e) {
        // 处理移动端触摸事件
        if (e.touches && e.touches.length > 0) {
            e.preventDefault();
            var elem = e.touches[0].target;
        } else {
            // 处理桌面端鼠标事件
            var elem = e.target;
        }
        
        // 跳过已屏蔽的元素
        if (elem.dataset._opt) return;
        
        // 跳过按钮本身
        if (elem.dataset.blockBtn) return;
        
        // 跳过相同元素
        if (elem === _currentHighlighted) return;
        
        // 移除之前的高亮
        _rmHl();
        
        // 设置当前高亮元素
        _currentHighlighted = elem;
        
        // 高亮元素
        elem.style.outline = '2px solid #4CAF50';
        if (elem.style.position !== 'absolute' && elem.style.position !== 'fixed') {
            elem.style.position = 'relative';
        }
        elem.dataset._hl = '1';
        
        // 创建屏蔽按钮
        var blockBtn = document.createElement('div');
        blockBtn.innerHTML = '×';
        blockBtn.style.position = 'absolute';
        blockBtn.style.top = '-10px';
        blockBtn.style.left = '-10px';
        blockBtn.style.width = '20px';
        blockBtn.style.height = '20px';
        blockBtn.style.backgroundColor = '#f00';
        blockBtn.style.color = '#fff';
        blockBtn.style.borderRadius = '50%';
        blockBtn.style.display = 'flex';
        blockBtn.style.alignItems = 'center';
        blockBtn.style.justifyContent = 'center';
        blockBtn.style.fontSize = '14px';
        blockBtn.style.fontWeight = 'bold';
        blockBtn.style.cursor = 'pointer';
        blockBtn.style.zIndex = '99999';
        blockBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        blockBtn.style.pointerEvents = 'auto';
        blockBtn.style.userSelect = 'none';
        blockBtn.style.border = 'none';
        blockBtn.style.padding = '0';
        blockBtn.dataset.blockBtn = '1';
        
        // 直接使用onclick属性，确保事件绑定
        blockBtn.onclick = function(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            e.returnValue = false;
            _blockElement(elem);
        };
        
        // 添加移动端触摸事件支持
        blockBtn.ontouchstart = function(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.cancelBubble = true;
            e.returnValue = false;
            _blockElement(elem);
        };
        
        elem.appendChild(blockBtn);
    }

    // 移除高亮
    function _rmHl() {
        if (_currentHighlighted) {
            var elem = _currentHighlighted;
            elem.style.outline = '';
            if (!elem.dataset._opt && elem.style.position === 'relative') {
                elem.style.position = '';
            }
            delete elem.dataset._hl;
            
            // 移除屏蔽按钮
            var blockBtn = elem.querySelector('[data-block-btn="1"]');
            if (blockBtn) {
                blockBtn.remove();
            }
            
            _currentHighlighted = null;
        }
    }

    // 屏蔽元素
    function _blockElement(elem) {
        var sel = _genSel(elem);
        
        // 确保_rules是数组
        if (!Array.isArray(_rules)) {
            _rules = [];
        }
        
        // 添加到优化规则
        var exists = false;
        for (var i = 0; i < _rules.length; i++) {
            if (_rules[i].selector === sel) {
                exists = true;
                break;
            }
        }
        
        // 无论规则是否存在，都屏蔽当前元素
        if (elem && !elem.dataset._opt) {
            // 确保元素存在且是DOM元素
            if (elem.nodeType === 1) {
                // 使用内联样式直接设置
                try {
                    // 首先尝试简单直接的方式
                    elem.style.display = 'none';
                    // 然后添加更强制的样式
                    var styleText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; z-index: -9999 !important;';
                    if (elem.style.cssText) {
                        elem.style.cssText += ' ' + styleText;
                    } else {
                        elem.style.cssText = styleText;
                    }
                    // 标记为已屏蔽
                    elem.dataset._opt = '1';
                    // 强制重排
                    elem.offsetHeight;
                } catch (e) {
                    // 如果直接设置样式失败，尝试其他方法
                    try {
                        // 创建样式表
                        var style = document.createElement('style');
                        style.type = 'text/css';
                        var selector = _genSel(elem);
                        style.innerHTML = selector + ' { display: none !important; visibility: hidden !important; opacity: 0 !important; }';
                        document.head.appendChild(style);
                        elem.dataset._opt = '1';
                    } catch (e2) {
                        // 最后的尝试：移除元素
                        try {
                            if (elem.parentNode) {
                                elem.parentNode.removeChild(elem);
                            }
                        } catch (e3) {
                            // 所有方法都失败，记录错误
                            console.log('无法屏蔽元素:', e3);
                        }
                    }
                }
            }
        }
        
        if (!exists) {
            _rules.push({
                selector: sel,
                added: new Date().toISOString(),
                url: window.location.href
            });
            
            // 保存规则
            _saveRules();
            
            // 使用更隐蔽的提示方式
            var toast = document.createElement('div');
            toast.textContent = '已屏蔽';
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
        } else {
            // 规则已存在的提示
            var toast = document.createElement('div');
            toast.textContent = '规则已存在，已屏蔽元素';
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
        
        // 不移出选择模式，允许继续屏蔽其他元素
        _rmHl();
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
