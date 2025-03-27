document.addEventListener("DOMContentLoaded", async () => {
    // Elementos do DOM
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const listButton = document.getElementById("list-button");
    const productGrid = document.getElementById("product-grid");
    const container = document.querySelector(".container");
    const modal = document.getElementById("product-modal");
    const heroSection = document.querySelector(".hero");

    const apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json";
    let allProducts = [];
    let isLoading = false;

    // Função para carregar produtos da API
    async function loadProducts() {
        if (allProducts.length > 0) return allProducts;
        if (isLoading) return;

        isLoading = true;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Erro na requisição");
            allProducts = await response.json();
            return allProducts;
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            productGrid.innerHTML = `
                <div class="error-message">
                    <p>Erro ao carregar produtos. Tente recarregar a página.</p>
                    <button onclick="window.location.reload()">Recarregar</button>
                </div>
            `;
            return [];
        } finally {
            isLoading = false;
        }
    }

    // Função para filtrar produtos
    function filterProducts(products, query) {
        if (!query) return products;
        
        const searchQuery = query.toLowerCase();
        return products.filter(product => {
            const searchFields = [
                product.brand?.toLowerCase() || "",
                product.name?.toLowerCase() || "",
                product.product_type?.toLowerCase() || "",
                product.category?.toLowerCase() || ""
            ];
            return searchFields.some(field => field.includes(searchQuery));
        });
    }

    // Função para renderizar produtos
    function renderProducts(products) {
        productGrid.innerHTML = "";
        
        if (!products || products.length === 0) {
            productGrid.innerHTML = "<p class='no-results'>Nenhum produto encontrado.</p>";
            return;
        }

        const fragment = document.createDocumentFragment();
        
        products.slice(0, 50).forEach(product => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${product.image_link || 'https://via.placeholder.com/150'}" 
                     alt="${product.name}" 
                     class="product-image"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/150'">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price ? `R$ ${product.price}` : "Preço indisponível"}</p>
                <button class="product-link">Ver detalhes</button>
            `;
            
            card.addEventListener("click", () => showProductModal(product));
            fragment.appendChild(card);
        });

        productGrid.appendChild(fragment);
        container.style.display = "block";
        heroSection.style.display = "none";
    }

    // Função para mostrar o modal
    function showProductModal(product) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-image">
                    <img src="${product.image_link || 'https://via.placeholder.com/150'}" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="modal-info">
                    <h2 id="modal-product-name">${product.name}</h2>
                    <p id="modal-product-brand"><strong>Marca:</strong> ${product.brand || "Não informado"}</p>
                    <p id="modal-product-price"><strong>Preço:</strong> ${product.price ? `R$ ${product.price}` : "Preço indisponível"}</p>
                    <p id="modal-product-description"><strong>Descrição:</strong> ${product.description || "Descrição não disponível"}</p>
                    <div class="modal-actions">
                        <a href="${product.product_link || '#'}" target="_blank" class="modal-link">Ver no site oficial</a>
                        <button class="back-button">Voltar</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = "block";
        
        // Event listeners do modal
        document.querySelector(".close-modal").addEventListener("click", closeModal);
        document.querySelector(".back-button").addEventListener("click", closeModal);
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Evento para fechar modal ao clicar fora
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Evento do botão Listar Produtos
    listButton.addEventListener("click", async () => {
        const products = await loadProducts();
        renderProducts(products);
        searchBar.value = "";
    });

    // Evento do botão Pesquisar
    searchButton.addEventListener("click", async () => {
        const products = await loadProducts();
        const filtered = filterProducts(products, searchBar.value.trim());
        renderProducts(filtered);
    });

    // Evento de pesquisa com Enter
    searchBar.addEventListener("keyup", (e) => {
        if (e.key === "Enter") searchButton.click();
    });

    // Carrega produtos iniciais
    loadProducts().then(products => {
        if (products && products.length > 0) {
            renderProducts(products.slice(0, 60)); // Mostra apenas 20 inicialmente
        }
    });
});