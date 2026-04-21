// Configuração de Estratégias para o Person Search
const PERSON_SEARCH_STRATEGIES = [
    { 
        id: 'age', 
        name: 'Idade & Nascimento', 
        icon: 'calendar',
        query: '"{}" "nascimento" OR "idade" OR "born" OR "data de nascimento"',
        description: 'Busca em registros civis, editais e perfis por datas.'
    },
    { 
        id: 'instagram', 
        name: 'Instagram', 
        icon: 'instagram',
        query: 'site:instagram.com "{}"',
        description: 'Localiza perfis diretos no Instagram via Google.'
    },
    { 
        id: 'tiktok', 
        name: 'TikTok', 
        icon: 'video',
        query: 'site:tiktok.com "{}"',
        description: 'Localiza perfis diretos no TikTok via Google.'
    },
    { 
        id: 'email', 
        name: 'Email Discovery', 
        icon: 'mail',
        query: '"{}" "@gmail.com" OR "@hotmail.com" OR "@outlook.com" OR "@yahoo.com"',
        description: 'Tenta identificar emails públicos associados ao nome.'
    }
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
            case 'person': return 'person';
            case 'infra': return 'infra';
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
        } else if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(val) || /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(val)) {
            targetModule = 'infra';
            targetName = 'Infra & IP';
        } else if (val.startsWith('@') || val.includes(' ')) {
            targetModule = 'person';
            targetName = 'Person Search';
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
        } else if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(val) || /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(val)) {
            window.location.hash = 'infra';
            fillAndTriggerSearch(val, 'infra');
        } else {
            const cleanTerm = val.startsWith('@') ? val.substring(1) : val;
            window.location.hash = 'person';
            fillAndTriggerSearch(cleanTerm, 'person');
        }
    });
}

function fillAndTriggerSearch(term, type) {
    setTimeout(() => {
        if (type === 'person') {
            const input = document.getElementById('person-input');
            input.value = term;
            document.getElementById('person-form').dispatchEvent(new Event('submit'));
        } else if (type === 'infra') {
            const input = document.getElementById('infra-input');
            input.value = term;
            document.getElementById('infra-form').dispatchEvent(new Event('submit'));
        } else if (type === 'email') {
            const input = document.getElementById('email-input');
            input.value = term;
            document.getElementById('email-form').dispatchEvent(new Event('submit'));
        }
    }, 100); // Wait for hash change animation/render
}

// Person Search Module
function initPersonSearch() {
    const form = document.getElementById('person-form');
    const input = document.getElementById('person-input');
    const resultsContainer = document.getElementById('person-results');
    const targetDisplay = document.getElementById('person-target');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = input.value.trim();
        if (!fullName) return;

        targetDisplay.textContent = fullName;
        resultsContainer.innerHTML = '';
        HistoryManager.add(fullName, 'person');

        PERSON_SEARCH_STRATEGIES.forEach(strategy => {
            const searchQuery = strategy.query.replace('{}', fullName);
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            
            const card = document.createElement('div');
            card.className = 'bg-osint-panel border border-osint-border rounded-lg p-5 hover:border-osint-neon transition-all group';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-osint-neon/10 rounded-md">
                            <i data-lucide="${strategy.icon}" class="w-5 h-5 text-osint-neon"></i>
                        </div>
                        <h4 class="font-bold text-osint-text">${strategy.name}</h4>
                    </div>
                    <a href="${googleUrl}" target="_blank" class="text-osint-muted hover:text-osint-neon transition-colors">
                        <i data-lucide="external-link" class="w-4 h-4"></i>
                    </a>
                </div>
                <p class="text-xs text-osint-muted mb-4">${strategy.description}</p>
                <a href="${googleUrl}" target="_blank" class="block w-full text-center bg-osint-bg border border-osint-border group-hover:border-osint-neon text-osint-text py-2 rounded text-sm font-bold hover:bg-osint-neon hover:text-black transition-all">
                    EXECUTAR BUSCA
                </a>
            `;
            resultsContainer.appendChild(card);
        });
        
        lucide.createIcons();
    });
}

// Infra & IP Module
function initInfraLookup() {
    const form = document.getElementById('infra-form');
    const input = document.getElementById('infra-input');
    const loader = document.getElementById('infra-loader');
    const results = document.getElementById('infra-results');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ip = input.value.trim();
        
        results.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            // Utilizando ipwho.is que tem melhor suporte a CORS e rate-limits para free-tier
            const apiUrl = ip ? `https://ipwho.is/${ip}` : 'https://ipwho.is/';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data.success) {
                alert(`Erro: ${data.message || 'IP inválido ou não encontrado'}`);
                loader.classList.add('hidden');
                return;
            }

            HistoryManager.add(data.ip, 'infra');

            document.getElementById('infra-res-ip').textContent = data.ip;
            document.getElementById('infra-res-version').textContent = data.type || 'IPv4';
            document.getElementById('infra-res-org').textContent = data.connection?.isp || data.connection?.org || 'N/A';
            document.getElementById('infra-res-asn').textContent = data.connection?.asn ? `AS${data.connection.asn}` : 'N/A';
            
            document.getElementById('infra-res-city').textContent = `${data.city}, ${data.region}`;
            document.getElementById('infra-res-country').textContent = data.country;
            document.getElementById('infra-res-lat').textContent = data.latitude;
            document.getElementById('infra-res-lon').textContent = data.longitude;
            
            document.getElementById('infra-res-map').href = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;

            loader.classList.add('hidden');
            results.classList.remove('hidden');

        } catch (error) {
            alert("Erro ao buscar dados de IP. Verifique a conexão ou se foi bloqueado pelo navegador.");
            loader.classList.add('hidden');
        }
    });
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
    initRouter();
    initGlobalSearch();
    initPersonSearch();
    initInfraLookup();
    initDorksGenerator();
    initEmailLeaks();
});
