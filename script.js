document.addEventListener("DOMContentLoaded", async () => {
    // Elementos do DOM
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const listButton = document.getElementById("list-button");
    const productGrid = document.getElementById("product-grid");
    const container = document.querySelector(".container");
    const modal = document.getElementById("product-modal");
    const heroSection = document.querySelector(".hero");

    // Configurações
    const apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json";
    const popularBrands = ["maybelline", "l'oreal", "revlon", "nyx", "covergirl", "mac"];
    let allProducts = [];
    let isLoading = false;

    // Função para carregar produtos com cache
    async function loadProducts() {
        if (allProducts.length > 0) return allProducts;
        if (isLoading) return;

        isLoading = true;
        showLoading();

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Erro na requisição");
            const products = await response.json();
            
            allProducts = processProducts(products);
            return allProducts;
        } catch (error) {
            showError("Erro ao carregar produtos. Tente recarregar a página.");
            console.error("Erro:", error);
            return [];
        } finally {
            isLoading = false;
        }
    }

    // Processa os produtos recebidos da API
    function processProducts(products) {
        return products
            .filter(product => product && product.name)
            .map(product => ({
                ...product,
                image_link: getSafeImageLink(product.image_link),
                brand: formatBrandName(product.brand || "Outras marcas"),
                price: formatProductPrice(product.price),
                description: product.description || "Descrição não disponível",
                product_link: product.product_link || "#",
                searchText: `${product.name} ${product.brand} ${product.product_type || ""}`.toLowerCase()
            }));
    }

    // Formata nomes de marca
    function formatBrandName(brand) {
        const brandFormats = {
            "sally b's skin yummies": "Sally B's",
            "colourpop": "ColourPop",
            "l'oreal": "L'Oréal"
        };
        return brandFormats[brand.toLowerCase()] || brand;
    }

    // Formata preços dos produtos
    function formatProductPrice(price) {
        if (!price || price === "0.00" || price === "0") {
            return "Preço sob consulta";
        }
        
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) {
            return "Preço indisponível";
        }
        
        return numericPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    // Função segura para imagens
    function getSafeImageLink(image_link) {
        const blockedDomains = ['purpicks.com', 'example.com'];
        const isBlocked = blockedDomains.some(domain => image_link?.includes(domain));
        
        const svgPlaceholder = encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">' +
            '<rect width="150" height="150" fill="#dfcdbf"/>' +
            '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" ' +
            'fill="#5a3e2b" font-family="Arial" font-size="12">Produto</text></svg>'
        );
        
        const placeholder = `data:image/svg+xml;utf8,${svgPlaceholder}`;
        
        if (!image_link || isBlocked || image_link.trim() === '') {
            return placeholder;
        }
        
        return image_link;
    }

    // Mostra estado de carregamento
    function showLoading() {
        productGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        `;
    }

    // Mostra mensagem de erro
    function showError(message) {
        productGrid.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button onclick="window.location.reload()">Recarregar Página</button>
            </div>
        `;
    }

    // Filtra produtos
    function filterProducts(products, query) {
        if (!products || !Array.isArray(products)) return [];
        if (!query) return products;
        
        return products.filter(product => 
            product.searchText.includes(query.toLowerCase())
        );
    }

    // Renderiza os produtos
    function renderProducts(products) {
        if (!products || products.length === 0) {
            productGrid.innerHTML = "<p class='no-results'>Nenhum produto encontrado.</p>";
            showContainer();
            return;
        }

        const fragment = document.createDocumentFragment();
        
        products.slice(0, 100).forEach(product => {
            const card = createProductCard(product);
            fragment.appendChild(card);
        });

        productGrid.innerHTML = "";
        productGrid.appendChild(fragment);
        showContainer();
    }

    // Na função createProductCard, substitua o conteúdo por:
function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "card";
    
    card.innerHTML = `
        <img src="${product.image_link}" 
             alt="${product.name}" 
             class="product-image"
             loading="lazy"
             onerror="this.onerror=null;this.src='${getSafeImageLink()}'">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-brand">${product.brand}</p>
            <p class="product-price">${product.price}</p>
        </div>
    `;
    
    // Abre modal ao clicar no card
    card.addEventListener("click", () => {
        showProductModal(product);
    });
    
    return card;
}

    // Mostra o container principal
    function showContainer() {
        container.style.display = "block";
        heroSection.style.display = "none";
    }

    // Modal de produto
    function showProductModal(product) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-image">
                    <img src="${product.image_link}" 
                         alt="${product.name}"
                         onerror="this.onerror=null;this.src='${getSafeImageLink()}'">
                </div>
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <p><strong>Marca:</strong> ${product.brand}</p>
                    <p><strong>Preço:</strong> ${product.price}</p>
                    <p><strong>Descrição:</strong> ${product.description}</p>
                    <div class="modal-actions">
                        <a href="${product.product_link}" target="_blank" class="modal-link">Ver no site oficial</a>
                        <button class="back-button">Voltar</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = "block";
        document.querySelector(".close-modal").addEventListener("click", closeModal);
        document.querySelector(".back-button").addEventListener("click", closeModal);
    }

    // Fecha o modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Event Listeners
    searchBar.addEventListener("focus", () => {
        searchBar.placeholder = `Ex: ${popularBrands.join(", ")}...`;
    });

    listButton.addEventListener("click", async () => {
        const products = await loadProducts();
        renderProducts(products);
    });

    searchButton.addEventListener("click", async () => {
        const query = searchBar.value.trim();
        if (!query) return;
        
        const products = await loadProducts();
        const filtered = filterProducts(products, query);
        renderProducts(filtered);
    });

    searchBar.addEventListener("keyup", (e) => {
        if (e.key === "Enter") searchButton.click();
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
});