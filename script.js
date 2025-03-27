document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const searchButton = document.getElementById("search-button");
    const listButton = document.getElementById("list-button");
    const productGrid = document.getElementById("product-grid");
    const container = document.querySelector(".container");

    const apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json";

    // Mostrar container dos produtos
    function showProductContainer() {
        container.style.display = "block";
        // Rolagem suave até os produtos
        container.scrollIntoView({ behavior: 'smooth' });
    }

    // Função para buscar produtos na API
    async function fetchProducts(query = "", listAll = false) {
        showProductContainer();
        productGrid.innerHTML = "<p class='loading'>Carregando produtos...</p>";
        
        let url = apiUrl;
        let loadingMessage = "";
        
        if (!listAll && query) {
            const words = query.split(" ");
            if (words.length > 1) {
                // Busca por marca + tipo de produto (ex: "maybelline lipstick")
                const brand = words[0].toLowerCase();
                const productType = words.slice(1).join(" ").toLowerCase();
                url = `${apiUrl}?brand=${brand}&product_type=${productType}`;
                loadingMessage = `Buscando ${productType} da marca ${brand}...`;
            } else {
                // Busca genérica - tenta primeiro por marca, depois por tipo
                url = `${apiUrl}?brand=${query}`;
                loadingMessage = `Buscando produtos da marca ${query}...`;
                
                // Verifica se encontrou produtos pela marca
                try {
                    const response = await fetch(url);
                    const products = await response.json();
                    if (products.length === 0) {
                        url = `${apiUrl}?product_type=${query}`;
                        loadingMessage = `Buscando produtos do tipo ${query}...`;
                    }
                } catch (error) {
                    console.error("Erro na verificação:", error);
                }
            }
            document.querySelector('.loading').textContent = loadingMessage;
        } else if (listAll) {
            document.querySelector('.loading').textContent = "Carregando todos os produtos...";
        }

        try {
            const response = await fetch(url);
            const products = await response.json();
            
            if (!products || products.length === 0) {
                productGrid.innerHTML = `
                    <p class="no-products">Nenhum produto encontrado para "${query}".</p>
                    <p class="suggestion">Tente buscar por marcas (como "maybelline") ou tipos de produtos (como "lipstick")</p>
                `;
                return;
            }
            
            renderProducts(products);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            productGrid.innerHTML = `
                <p class="error">Erro ao carregar os produtos.</p>
                <p class="suggestion">Verifique sua conexão e tente novamente.</p>
            `;
        }
    }

    // Função para renderizar produtos
    function renderProducts(products) {
        productGrid.innerHTML = "";
        
        // Limita a exibir 50 produtos para não sobrecarregar
        const displayedProducts = products.slice(0, 50);
        
        displayedProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("card");
            
            // Verifica se tem imagem, senão usa um placeholder
            const imageUrl = product.image_link || 'https://via.placeholder.com/300x300?text=Produto+sem+imagem';
            const price = product.price ? `$${product.price}` : "Preço indisponível";
            
            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" class="product-image">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${price}</p>
                <a href="${product.product_link}" class="product-link" target="_blank">Ver detalhes</a>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Event Listeners
    listButton.addEventListener("click", () => {
        fetchProducts("", true);
    });

    searchButton.addEventListener("click", () => {
        const query = searchBar.value.trim();
        if (query) {
            fetchProducts(query);
        } else {
            showProductContainer();
            productGrid.innerHTML = `
                <p class="no-query">Digite algo para pesquisar.</p>
                <p class="suggestion">Exemplos: "maybelline", "lipstick", "loreal foundation"</p>
            `;
        }
    });

    searchBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });
});