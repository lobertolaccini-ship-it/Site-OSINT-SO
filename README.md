# OSINT Web Dashboard

Uma ferramenta centralizada de Open Source Intelligence (OSINT) desenvolvida inteiramente com Vanilla JavaScript e Tailwind CSS, idealizada para ser rápida, responsiva e rodar 100% no client-side (no navegador).

## 🚀 Funcionalidades

- **Dashboard Global**: Campo de busca inteligente que infere o tipo de alvo (IP, E-mail, Username).
- **Social Analyzer**: Busca automatizada por `@usernames` em múltiplas plataformas, com links diretos como *fallback* caso a política de CORS bloqueie o script local.
- **Infra & IP Lookup**: Resolução de IP para identificação de provedor (ISP), ASN, e localização geográfica através da integração com `ipapi.co`.
- **Dorks Generator**: Construtor visual de queries complexas (Google Dorks) para facilitar buscas avançadas.
- **Email Leaks**: Geração rápida de links para checagem em plataformas conhecidas de vazamentos de dados (Have I Been Pwned, LeakCheck).
- **Histórico Local**: O sistema memoriza suas últimas pesquisas através do `localStorage` do navegador.

## 💻 Tecnologias e Estética

A interface foi projetada utilizando a estética "Hacker/Terminal", utilizando fundo dark, detalhes em verde neon, e fontes monospace.

Tecnologias utilizadas:
- **HTML5 e Vanilla JavaScript**: Nenhuma dependência com Node.js no runtime.
- **Tailwind CSS**: via CDN para estilização rápida e design responsivo.
- **Lucide Icons**: via CDN para os ícones modernos.
- **API Fetch**: Para consultas HTTP client-side.

## 🛠️ Como usar localmente

Como o projeto é construído apenas em HTML e JavaScript padrão sem dependências de build, você só precisa de um servidor local simples:

1. Clone o repositório ou baixe os arquivos.
2. Abra a pasta `osint-dashboard` no seu editor ou abra diretamente o arquivo `index.html` em seu navegador.
3. Recomendação: utilize a extensão **Live Server** (do VSCode) ou um servidor HTTP de linha de comando (ex: `python -m http.server`) para uma melhor experiência e evitar bloqueios severos de diretório local.

## 🌐 Como fazer o Deploy no GitHub Pages

Este projeto foi desenhado especificamente para funcionar perfeitamente na hospedagem gratuita do **GitHub Pages**.

1. Crie um repositório vazio no GitHub.
2. Suba os arquivos da pasta `osint-dashboard` para a branch `main` do seu repositório.
3. No repositório, vá até **Settings > Pages** (Configurações > Páginas).
4. Em "Build and deployment", selecione a opção de fazer deploy a partir de uma branch ("Deploy from a branch").
5. Selecione a branch `main` (ou a que você subiu os arquivos) e a pasta `/root` e clique em **Save**.
6. Aguarde 1-2 minutos. Seu OSINT Dashboard estará disponível na URL indicada (ex: `https://seunome.github.io/seu-repositorio/`).

## ⚠️ Limitações de CORS e API

Por ser uma aplicação **Single Page Application (SPA)** sem backend (Node.js/Python), as requisições (Fetch) são feitas diretamente do seu navegador. 

Muitas plataformas (como Instagram, GitHub) bloqueiam esse tipo de requisição direta (*Cross-Origin Resource Sharing* - CORS). Nestes cenários, a ferramenta tentará a verificação e, caso bloqueada, disponibilizará um botão de ação rápida ("Abrir") para que você faça a verificação instantaneamente na mesma aba do seu navegador, poupando o trabalho manual de copiar/colar.
