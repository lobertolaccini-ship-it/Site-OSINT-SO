// Configuração de Plataformas para o Social Analyzer
const SOCIAL_PLATFORMS = [
    { name: 'GitHub', url: 'https://github.com/{}', type: 'tech' },
    { name: 'Twitter', url: 'https://twitter.com/{}', type: 'social' },
    { name: 'Instagram', url: 'https://instagram.com/{}', type: 'social' },
    { name: 'Reddit', url: 'https://reddit.com/user/{}', type: 'social' },
    { name: 'GitLab', url: 'https://gitlab.com/{}', type: 'tech' },
    { name: 'Medium', url: 'https://medium.com/@{}', type: 'blog' },
    { name: 'TikTok', url: 'https://tiktok.com/@{}', type: 'social' },
    { name: 'Twitch', url: 'https://twitch.tv/{}', type: 'stream' },
    { name: 'Steam', url: 'https://steamcommunity.com/id/{}', type: 'gaming' },
];

// Utilitários de Histórico
const HistoryManager = {
    key: 'osint_search_history',
    
    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    },
    
    add(term, type) {
        let history = this.get();
        // Remove duplicates
        history = history.filter(item => item.term !== term);
        // Add to beginning
        history.unshift({ term, type, date: new Date().toISOString() });
        // Keep only last 5
        if (history.length > 5) history.pop();
        
        localStorage.setItem(this.key, JSON.stringify(history));
        this.render();
    },
    
    clear() {
        localStorage.removeItem(this.key);
        this.render();
    },
    
    render() {
        const list = document.getElementById('history-list');
        const history = this.get();
        
        if (history.length === 0) {
            list.innerHTML = '<li class="text-osint-muted italic text-xs">Nenhum histórico recente</li>';
            return;
        }

        list.innerHTML = history.map(item => `
            <li>
                <a href="#${this.getHashFromType(item.type)}" class="history-item flex items-center justify-between hover:text-osint-neon group cursor-pointer" data-term="${item.term}" data-type="${item.type}">
                    <span class="truncate pr-2">${item.term}</span>
                    <span class="text-[10px] bg-[#1f1f1f] px-1.5 py-0.5 rounded text-osint-muted group-hover:text-osint-neon border border-osint-border group-hover:border-osint-neon transition-colors">${item.type}</span>
                </a>
            </li>
        `).join('');

        // Re-attach listeners to new elements
        document.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const term = el.dataset.term;
                const type = el.dataset.type;
                fillAndTriggerSearch(term, type);
            });
        });
    },

    getHashFromType(type) {
        switch(type) {
            case 'social': return 'social';

            case 'email': return 'email';
            default: return 'dashboard';
        }
    }
};

// Funções de Roteamento SPA
function initRouter() {
    const handleHashChange = () => {
        let hash = window.location.hash.replace('#', '') || 'dashboard';
        
        // Hide all modules
        document.querySelectorAll('.module').forEach(el => {
            el.classList.remove('active');
        });
        
        // Show target module
        const targetModule = document.getElementById(hash);
        if (targetModule) {
            targetModule.classList.add('active');
        } else {
            document.getElementById('dashboard').classList.add('active');
            hash = 'dashboard';
        }

        // Update active states on nav links
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            if (link.dataset.target === hash) {
                link.classList.add('bg-osint-neon/10', 'text-osint-neon', 'border-osint-neon');
                link.classList.remove('border-osint-border');
            } else {
                link.classList.remove('bg-osint-neon/10', 'text-osint-neon', 'border-osint-neon');
                if(link.classList.contains('mobile-nav-link')) link.classList.add('border-osint-border');
            }
        });

        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.add('hidden');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Trigger on load
}

// Global Search Inferring Logic
function initGlobalSearch() {
    const form = document.getElementById('global-search-form');
    const input = document.getElementById('global-search-input');
    const suggestion = document.getElementById('global-search-suggestion');
    const suggestionLink = document.getElementById('global-suggestion-link');

    input.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        suggestion.classList.add('hidden');
        
        if (!val) return;

        let targetModule = '';
        let targetName = '';

        if (val.includes('@') && val.includes('.')) {
            targetModule = 'email';
            targetName = 'Email Leaks';

        } else if (val.startsWith('@') || !val.includes(' ')) {
            targetModule = 'social';
            targetName = 'Social Analyzer';
        }

        if (targetModule) {
            suggestion.classList.remove('hidden');
            suggestion.innerHTML = `Sugestão detectada: Ir para <a href="#${targetModule}" class="text-osint-neon hover:underline global-suggestion-click" data-term="${val}" data-type="${targetModule}">${targetName}</a>`;
            
            document.querySelector('.global-suggestion-click').addEventListener('click', (ev) => {
                const cleanTerm = val.startsWith('@') ? val.substring(1) : val;
                fillAndTriggerSearch(cleanTerm, targetModule);
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if(!val) return;

        // Simple inference again on submit
        if (val.includes('@') && val.includes('.')) {
            window.location.hash = 'email';
            fillAndTriggerSearch(val, 'email');

        } else {
            const cleanTerm = val.startsWith('@') ? val.substring(1) : val;
            window.location.hash = 'social';
            fillAndTriggerSearch(cleanTerm, 'social');
        }
    });
}

function fillAndTriggerSearch(term, type) {
    setTimeout(() => {
        if (type === 'social') {
            const input = document.getElementById('social-input');
            input.value = term;
            document.getElementById('social-form').dispatchEvent(new Event('submit'));

        } else if (type === 'email') {
            const input = document.getElementById('email-input');
            input.value = term;
            document.getElementById('email-form').dispatchEvent(new Event('submit'));
        }
    }, 100); // Wait for hash change animation/render
}

// Social Analyzer Module
function initSocialAnalyzer() {
    const form = document.getElementById('social-form');
    const input = document.getElementById('social-input');
    const resultsContainer = document.getElementById('social-results');
    const targetDisplay = document.getElementById('social-target');
    const statsDisplay = document.getElementById('social-stats');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let username = input.value.trim();
        if (username.startsWith('@')) username = username.substring(1);
        if (!username) return;

        targetDisplay.textContent = `@${username}`;
        resultsContainer.innerHTML = '';
        HistoryManager.add(username, 'social');

        let completed = 0;
        
        SOCIAL_PLATFORMS.forEach(platform => {
            const url = platform.url.replace('{}', username);
            
            const cardId = `social-card-${platform.name.toLowerCase()}`;
            
            // Create loading card
            const card = document.createElement('div');
            card.id = cardId;
            card.className = 'bg-osint-panel border border-osint-border rounded-lg p-4 flex flex-col justify-between h-28';
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="font-bold text-osint-text">${platform.name}</div>
                    <i data-lucide="loader" class="w-4 h-4 text-osint-muted animate-spin"></i>
                </div>
                <div class="text-xs text-osint-muted truncate">${url}</div>
            `;
            resultsContainer.appendChild(card);
            lucide.createIcons();

            // Fetch attempt (will mostly fail due to CORS, but we handle it)
            fetch(url, { mode: 'no-cors' })
                .then(response => {
                    // Opaque response with no-cors doesn't tell us status code (200 or 404).
                    // So we must fallback to "Verificar Manualmente".
                    updateSocialCard(cardId, platform.name, url, 'cors_block');
                })
                .catch(err => {
                    updateSocialCard(cardId, platform.name, url, 'cors_block');
                })
                .finally(() => {
                    completed++;
                    statsDisplay.textContent = `${completed}/${SOCIAL_PLATFORMS.length} checados`;
                });
        });
    });
}

function updateSocialCard(cardId, name, url, status) {
    const card = document.getElementById(cardId);
    if (!card) return;

    if (status === 'cors_block') {
        card.classList.add('border-osint-muted');
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="font-bold text-osint-text">${name}</div>
                <i data-lucide="external-link" class="w-4 h-4 text-osint-muted"></i>
            </div>
            <div class="flex justify-between items-center mt-auto">
                <span class="text-xs text-osint-muted bg-[#1f1f1f] px-2 py-1 rounded">Protegido por CORS</span>
                <a href="${url}" target="_blank" class="text-xs font-bold text-osint-neon hover:underline border border-osint-neon px-2 py-1 rounded">Abrir</a>
            </div>
        `;
    }
    lucide.createIcons();
}



// Dorks Generator Module
function initDorksGenerator() {
    const btn = document.getElementById('dork-generate-btn');
    const output = document.getElementById('dork-output');
    const copyBtn = document.getElementById('dork-copy-btn');
    const openBtn = document.getElementById('dork-open-btn');

    btn.addEventListener('click', () => {
        const keyword = document.getElementById('dork-keyword').value.trim();
        const site = document.getElementById('dork-site').value.trim();
        const ext = document.getElementById('dork-ext').value;
        const title = document.getElementById('dork-title').value.trim();

        let queryParts = [];
        
        if (keyword) {
            if (keyword.includes(' ')) {
                queryParts.push(`"${keyword}"`);
            } else {
                queryParts.push(`intext:${keyword}`);
            }
        }
        
        if (site) queryParts.push(`site:${site}`);
        if (ext) queryParts.push(`ext:${ext}`);
        if (title) queryParts.push(`intitle:"${title}"`);

        if (queryParts.length === 0) {
            output.textContent = "// Por favor, preencha pelo menos um campo.";
            openBtn.classList.add('pointer-events-none', 'opacity-50');
            return;
        }

        const query = queryParts.join(' ');
        output.textContent = query;
        
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        openBtn.href = googleUrl;
        openBtn.classList.remove('pointer-events-none', 'opacity-50');
    });

    copyBtn.addEventListener('click', () => {
        const text = output.textContent;
        if (text && !text.startsWith('//')) {
            navigator.clipboard.writeText(text);
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Copiado`;
            lucide.createIcons();
            setTimeout(() => {
                copyBtn.innerHTML = originalHtml;
                lucide.createIcons();
            }, 2000);
        }
    });
}

// Email Leaks Module
function initEmailLeaks() {
    const form = document.getElementById('email-form');
    const input = document.getElementById('email-input');
    const actions = document.getElementById('email-actions');
    const targetDisplay = document.getElementById('email-target-display');
    const submitBtn = document.getElementById('email-submit-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!email) return;

        HistoryManager.add(email, 'email');

        targetDisplay.textContent = email;
        
        // Configurar os links diretos
        document.getElementById('link-hibp').href = `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`;
        document.getElementById('link-leakcheck').href = `https://leakcheck.io/search?type=email&query=${encodeURIComponent(email)}`;

        submitBtn.classList.add('hidden');
        actions.classList.remove('hidden');
    });

    // Ao digitar, reseta a view se estiver mostrando os links
    input.addEventListener('input', () => {
        if (!actions.classList.contains('hidden')) {
            actions.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        }
    });
}

// Mobile Menu
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Inicialização Principal
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    HistoryManager.render();
    
    document.getElementById('clear-history').addEventListener('click', () => {
        HistoryManager.clear();
    });
    
    initRouter();
    initGlobalSearch();
    initSocialAnalyzer();

    initDorksGenerator();
    initEmailLeaks();
});
