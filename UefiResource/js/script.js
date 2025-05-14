// 设置当前年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 主题切换
const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 保存到本地存储
    localStorage.setItem('theme', newTheme);
    
    // 更新图标
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
};

// 初始化主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// 从外部JSON文件加载工具数据
let toolsData = [];

// 加载数据并生成卡片
async function loadToolsData() {
    try {
        const response = await fetch('./data/tools-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        toolsData = await response.json();
        generateToolCards();
        setupEventListeners();
    } catch (error) {
        console.error('Error loading tools data:', error);
        // 显示错误信息给用户
        const errorMessage = document.createElement('div');
        errorMessage.style.color = 'red';
        errorMessage.style.padding = '20px';
        errorMessage.style.textAlign = 'center';
        errorMessage.innerHTML = '加载工具数据失败，请稍后再试或联系管理员。<br>错误详情：' + error.message;
        document.querySelector('.container').appendChild(errorMessage);
    }
}

// 动态生成卡片
function generateToolCards() {
    // 获取所有不同的分类
    const categories = [...new Set(toolsData.map(tool => tool.category))];
    
    // 动态添加过滤按钮
    const filterContainer = document.getElementById('filter-container');
    // 已经添加了"全部"按钮，所以不需要再添加
    
    categories.forEach(category => {
        // 根据类别设置按钮文本
        let buttonText;
        switch (category) {
            case 'data': buttonText = '数据处理'; break;
            case 'converter': buttonText = '格式转换'; break;
            case 'generator': buttonText = '生成工具'; break;
            case 'developer': buttonText = '开发工具'; break;
            case 'website': buttonText = '官方网站'; break;
            case 'blog': buttonText = '博客文章'; break;
            default: buttonText = category;
        }
        
        // 创建过滤按钮
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-btn';
        filterBtn.setAttribute('data-category', category);
        filterBtn.textContent = buttonText;
        filterContainer.appendChild(filterBtn);
    });
    
    // 工具卡片
    const toolsGrid = document.getElementById('tools-grid');
    const websitesGrid = document.getElementById('websites-grid');
    const blogsGrid = document.getElementById('blogs-grid');
    
    toolsData.forEach(tool => {
        // 创建工具卡片
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.setAttribute('data-category', tool.category);
        
        // 工具图标
        const toolIcon = document.createElement('div');
        toolIcon.className = 'tool-icon';
        const icon = document.createElement('i');
        icon.className = tool.icon;
        toolIcon.appendChild(icon);
        
        // 工具名称
        const toolName = document.createElement('h3');
        toolName.className = 'tool-name';
        toolName.textContent = tool.name;
        
        // 工具描述
        const toolDesc = document.createElement('p');
        toolDesc.className = 'tool-description';
        toolDesc.textContent = tool.description;
        
        // 工具链接
        const toolLink = document.createElement('a');
        toolLink.className = 'tool-link';
        toolLink.href = tool.url;
        toolLink.target = '_blank';
        toolLink.textContent = tool.linkText;
        
        // 添加链接图标
        const linkIcon = document.createElement('i');
        linkIcon.className = 'fas fa-arrow-right';
        toolLink.appendChild(linkIcon);
        
        // 标签容器
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'tags';
        
        // 添加标签
        tool.tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = tagText;
            tagsDiv.appendChild(tag);
        });
        
        // 组装卡片
        toolCard.appendChild(toolIcon);
        toolCard.appendChild(toolName);
        toolCard.appendChild(toolDesc);
        toolCard.appendChild(toolLink);
        toolCard.appendChild(tagsDiv);
        
        // 添加到对应的网格
        if (tool.section === 'tools') {
            toolsGrid.appendChild(toolCard);
        } else if (tool.section === 'websites') {
            websitesGrid.appendChild(toolCard);
        } else if (tool.section === 'blogs') {
            blogsGrid.appendChild(toolCard);
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const allCards = document.querySelectorAll('.tool-card');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        Array.from(allCards).forEach(card => {
            const toolName = card.querySelector('.tool-name').textContent.toLowerCase();
            const toolDesc = card.querySelector('.tool-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = toolName.includes(searchTerm) || 
                            toolDesc.includes(searchTerm) || 
                            tags.some(tag => tag.includes(searchTerm));
            
            card.style.display = matches ? 'block' : 'none';
        });
    });
    
    // 分类过滤
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活动状态
            filterBtns.forEach(b => b.classList.remove('active'));
            // 设置当前按钮为活动状态
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            Array.from(allCards).forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    card.style.display = cardCategory === category ? 'block' : 'none';
                }
            });
        });
    });
}

// 页面加载完成后加载数据
window.addEventListener('DOMContentLoaded', loadToolsData);
