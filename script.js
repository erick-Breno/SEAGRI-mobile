// Global variables
let currentUser = null
let products = []
let users = []

// Dados simulados que serão compartilhados entre todos os usuários
const sharedData = {
  users: [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(99) 98765-4321",
      password: "123456",
      isAdmin: false,
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(99) 98765-1234",
      password: "123456",
      isAdmin: false,
    },
  ],
  products: [
    {
      id: "1",
      name: "Tomate Orgânico",
      category: "hortalicas",
      price: "R$ 8,50/kg",
      phone: "(99) 98765-4321",
      description: "Tomates orgânicos frescos, cultivados sem agrotóxicos",
      image:
        "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      userId: "1",
      userName: "João Silva",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Banana Prata",
      category: "frutas",
      price: "R$ 4,00/kg",
      phone: "(99) 98765-1234",
      description: "Bananas doces e maduras, direto do pé",
      image:
        "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      userId: "2",
      userName: "Maria Santos",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Leite Fresco",
      category: "laticinios",
      price: "R$ 6,00/litro",
      phone: "(99) 98765-4321",
      description: "Leite fresco de vacas criadas no pasto",
      image:
        "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      userId: "1",
      userName: "João Silva",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Feijão Preto",
      category: "graos",
      price: "R$ 12,00/kg",
      phone: "(99) 98765-1234",
      description: "Feijão preto de primeira qualidade",
      image:
        "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      userId: "2",
      userName: "Maria Santos",
      createdAt: new Date().toISOString(),
    },
  ],
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  loadSharedData()

  // Check if user is logged in (ainda usando localStorage para sessão do usuário)
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showMainApp()
  }

  // Setup event listeners
  setupEventListeners()
}

function loadSharedData() {
  users = [...sharedData.users]
  products = [...sharedData.products]
}

function getFeaturedProducts() {
  if (products.length === 0) return []

  // Embaralha os produtos e pega até 4 para destaque
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(4, products.length))
}

function loadFeaturedProducts() {
  const container = document.getElementById("featured-products")
  const noFeatured = document.getElementById("no-featured-products")

  const featuredProducts = getFeaturedProducts()

  if (featuredProducts.length === 0) {
    container.innerHTML = ""
    noFeatured.classList.remove("hidden")
    return
  }

  noFeatured.classList.add("hidden")

  container.innerHTML = featuredProducts
    .map(
      (product) => `
        <div class="featured-card product-card" data-category="${product.category}">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-price">${product.price}</p>
                <p class="product-seller">Por: ${product.userName}</p>
                <div class="product-actions">
                    <button onclick="contactSeller('${product.phone}')" class="btn btn-primary">
                        <i class="ri-phone-line"></i>Contatar
                    </button>
                    ${
                      currentUser && currentUser.isAdmin
                        ? `
                        <button onclick="deleteProduct('${product.id}')" class="btn btn-danger">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function setupEventListeners() {
  // Auth forms
  document.getElementById("loginForm").addEventListener("submit", handleLogin)
  document.getElementById("registerForm").addEventListener("submit", handleRegister)
  document.getElementById("showRegister").addEventListener("click", () => toggleAuthForm("register"))
  document.getElementById("showLogin").addEventListener("click", () => toggleAuthForm("login"))

  // Logout buttons
  document.getElementById("logoutBtn").addEventListener("click", handleLogout)
  document.getElementById("mobileLogoutBtn").addEventListener("click", handleLogout)

  // Navigation
  setupNavigation()

  // Forms
  document.getElementById("publishForm").addEventListener("submit", handlePublishProduct)
  document.getElementById("contactForm").addEventListener("submit", handleContactForm)

  // Product filters
  setupProductFilters()
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-item")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      showSection(targetId)
    })
  })
}

function setupProductFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      filterBtns.forEach((b) => b.classList.remove("filter-active"))
      this.classList.add("filter-active")

      filterProducts(filter)
    })
  })
}

function toggleAuthForm(form) {
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  if (form === "register") {
    loginForm.classList.add("hidden")
    registerForm.classList.remove("hidden")
  } else {
    registerForm.classList.add("hidden")
    loginForm.classList.remove("hidden")
  }
}

function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Check admin credentials
  if (email === "admin@agroconnect.com" && password === "admin123") {
    currentUser = {
      id: "admin",
      name: "Administrador",
      email: email,
      phone: "",
      isAdmin: true,
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    showMainApp()
    return
  }

  // Check regular user credentials
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    showMainApp()
  } else {
    showModal("Erro", "Email ou senha incorretos!")
  }
}

function handleRegister(e) {
  e.preventDefault()

  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const phone = document.getElementById("registerPhone").value
  const password = document.getElementById("registerPassword").value

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    showModal("Erro", "Este email já está cadastrado!")
    return
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    phone,
    password,
    isAdmin: false,
  }

  users.push(newUser)
  // Removendo saveUsers() pois não usamos mais localStorage

  currentUser = newUser
  localStorage.setItem("currentUser", JSON.stringify(currentUser))

  showModal("Cadastro realizado!", "Bem-vindo ao AgroConnect!")
  setTimeout(() => {
    closeModal()
    showMainApp()
  }, 2000)
}

function handleLogout() {
  currentUser = null
  localStorage.removeItem("currentUser")

  document.getElementById("auth-screen").classList.remove("hidden")
  document.getElementById("main-app").classList.add("hidden")
  document.getElementById("admin-panel").classList.add("hidden")

  // Reset forms
  document.getElementById("loginForm").reset()
  document.getElementById("registerForm").reset()
  toggleAuthForm("login")
}

function showMainApp() {
  document.getElementById("auth-screen").classList.add("hidden")
  document.getElementById("main-app").classList.remove("hidden")

  // Show admin panel if admin
  if (currentUser.isAdmin) {
    document.getElementById("admin-panel").classList.remove("hidden")
  }

  // Update profile info
  updateProfileInfo()

  loadProductsDisplay()
  loadUserProducts()
  loadFeaturedProducts()

  // Show home section by default
  showSection("home")
}

function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll(".section-content")
  sections.forEach((section) => section.classList.add("hidden"))

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.remove("hidden")
  }

  // Update navigation active state
  updateNavigation(sectionId)

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function updateNavigation(activeId) {
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-item")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === "#" + activeId) {
      link.classList.add("nav-active")
    } else {
      link.classList.remove("nav-active")
    }
  })
}

function handlePublishProduct(e) {
  e.preventDefault()

  const name = document.getElementById("productName").value
  const category = document.getElementById("productCategory").value
  const price = document.getElementById("productPrice").value
  const phone = document.getElementById("productPhone").value
  const description = document.getElementById("productDescription").value
  const image = document.getElementById("productImage").value

  const newProduct = {
    id: Date.now().toString(),
    name,
    category,
    price,
    phone,
    description,
    image: image || getDefaultImage(category),
    userId: currentUser.id,
    userName: currentUser.name,
    createdAt: new Date().toISOString(),
  }

  products.push(newProduct)

  // Reset form
  document.getElementById("publishForm").reset()

  showModal("Produto Publicado!", "Seu produto foi publicado com sucesso!")

  loadProductsDisplay()
  loadUserProducts()
  loadFeaturedProducts()
}

function handleContactForm(e) {
  e.preventDefault()

  const subject = document.getElementById("contactSubject").value
  const message = document.getElementById("contactMessage").value

  // Simulate sending email
  const emailData = {
    to: "erickbreno128@gmail.com",
    from: currentUser.email,
    subject: `[AgroConnect] ${subject}`,
    message: `
            Usuário: ${currentUser.name}
            Email: ${currentUser.email}
            Telefone: ${currentUser.phone}
            
            Sugestão:
            ${message}
        `,
  }

  console.log("Email enviado:", emailData)

  // Reset form
  document.getElementById("contactForm").reset()

  showModal("Sugestão Enviada!", "Sua sugestão foi enviada com sucesso! Obrigado pelo feedback.")
}

function loadProductsDisplay() {
  const grid = document.getElementById("products-grid")
  const noProducts = document.getElementById("no-products")

  if (products.length === 0) {
    grid.innerHTML = ""
    noProducts.classList.remove("hidden")
    return
  }

  noProducts.classList.add("hidden")

  grid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-price">${product.price}</p>
                <p class="product-seller">Por: ${product.userName}</p>
                <div class="product-actions">
                    <button onclick="contactSeller('${product.phone}')" class="btn btn-primary">
                        <i class="ri-phone-line"></i>Contatar
                    </button>
                    ${
                      currentUser && currentUser.isAdmin
                        ? `
                        <button onclick="deleteProduct('${product.id}')" class="btn btn-danger">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function loadUserProducts() {
  const container = document.getElementById("user-products")
  const noProducts = document.getElementById("no-user-products")

  const userProducts = products.filter((p) => p.userId === currentUser.id)

  // Update product count
  document.getElementById("profileProductCount").textContent = userProducts.length

  if (userProducts.length === 0) {
    container.innerHTML = ""
    noProducts.classList.remove("hidden")
    return
  }

  noProducts.classList.add("hidden")

  container.innerHTML = userProducts
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-price">${product.price}</p>
                <div class="product-actions">
                    <button onclick="deleteUserProduct('${product.id}')" class="btn btn-danger full-width">
                        <i class="ri-delete-bin-line"></i>Excluir
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function filterProducts(filter) {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const category = card.getAttribute("data-category")
    if (filter === "todos" || category === filter) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

function contactSeller(phone) {
  const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, "")}?text=Olá! Vi seu produto no AgroConnect e gostaria de mais informações.`
  window.open(whatsappUrl, "_blank")
}

function deleteProduct(productId) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    products = products.filter((p) => p.id !== productId)
    loadProductsDisplay()
    loadFeaturedProducts() // Atualizando produtos em destaque
    showModal("Produto Excluído", "O produto foi removido com sucesso.")
  }
}

function deleteUserProduct(productId) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    products = products.filter((p) => p.id !== productId)
    loadProductsDisplay()
    loadUserProducts()
    loadFeaturedProducts() // Atualizando produtos em destaque
    showModal("Produto Excluído", "Seu produto foi removido com sucesso.")
  }
}

function updateProfileInfo() {
  document.getElementById("profileName").textContent = currentUser.name
  document.getElementById("profileEmail").textContent = currentUser.email
  document.getElementById("profilePhone").textContent = currentUser.phone
}

function getCategoryName(category) {
  const categories = {
    hortalicas: "Hortaliças",
    frutas: "Frutas",
    laticinios: "Laticínios",
    graos: "Grãos",
  }
  return categories[category] || category
}

function getDefaultImage(category) {
  const defaultImages = {
    hortalicas:
      "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    frutas:
      "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    laticinios:
      "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    graos:
      "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  }
  return (
    defaultImages[category] ||
    "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
  )
}

function showModal(title, message) {
  document.getElementById("modalTitle").textContent = title
  document.getElementById("modalMessage").textContent = message
  document.getElementById("successModal").classList.remove("hidden")
}

function closeModal() {
  document.getElementById("successModal").classList.add("hidden")
}

// Data persistence functions - apenas para usuários (sessão)
function saveUsers() {
  // Mantendo apenas para compatibilidade, mas não salvando dados compartilhados
}

function loadUsers() {
  // Dados já carregados em loadSharedData()
}

function saveProducts() {
  // Removido - produtos não são mais salvos no localStorage
}

function loadProducts() {
  // Dados já carregados em loadSharedData()
}
