import React, { useState, useEffect } from "react";
import './App.css'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [addedId, setAddedId] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginMsg, setLoginMsg] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const slides = [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1600&auto=format&fit=crop",
  ]

  const [products, setProducts] = useState([]);
  const categories = ['All', ...new Set(products.map(p => p.tag))]
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.tag === activeCategory)

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
  fetch("http://localhost:5000/products")
    .then((res) => res.json())
    .then((data) => {
      const formattedProducts = data.map((item) => ({
        id: item._id,
        name: item.name,
        image: item.image,
        tag: item.tag,
        priceNum: Number(item.price),
        price: `₹${item.price}`,
        originalPrice: `₹${Math.round(item.price * 1.2)}`
      }));

      setProducts(formattedProducts);
    })
    .catch((err) => console.error("Error fetching products:", err));
}, []);

  // Lock body scroll when modals open
  useEffect(() => {
    if (cartOpen || loginOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [cartOpen, loginOpen])

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1)
    setAddedId(product.id)
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setTimeout(() => setAddedId(null), 1500)
  }

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item.qty === 1) {
        setCartCount(c => c - 1)
        return prev.filter(i => i.id !== id)
      }
      setCartCount(c => c - 1)
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
    })
  }

  const cartTotal = cartItems.reduce((sum, i) => sum + i.priceNum * i.qty, 0)

  const scrollToProducts = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) {
      setLoginMsg('Please fill in all fields.')
      return
    }
    setLoginMsg('✓ Login successful! Welcome back.')
    setTimeout(() => {
      setLoginOpen(false)
      setLoginMsg('')
      setLoginForm({ email: '', password: '' })
    }, 1200)
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">📚</span>
          StationeryHub
        </div>
        <ul className="nav-links">
          <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</li>
          <li onClick={scrollToProducts}>Products</li>
          <li className="nav-cart" onClick={() => setCartOpen(true)}>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </li>
          <li className="nav-login" onClick={() => setLoginOpen(true)}>Login</li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="slider">
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              className={`slide ${i === currentSlide ? 'active' : ''}`}
              alt="stationery"
            />
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge">New Collection 2026</div>
          <h1>Premium <em>Stationery</em><br />for Every Story</h1>
          <p>Curated pens, notebooks & office essentials<br />for creators and professionals</p>
          <div className="hero-btns">
            <button className="hero-btn" onClick={scrollToProducts}>Shop Now</button>
            <button className="hero-btn-outline" onClick={scrollToProducts}>View Collection</button>
          </div>
        </div>

        Slide dots
        <div className="slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ── ANNOUNCEMENT STRIP ── */}
      <div className="strip">
        <span>✦ Free shipping above ₹999</span>
        <span>✦ Premium quality guaranteed</span>
        <span>✦ Easy 7-day returns</span>
        <span>✦ Trusted by 50,000+ customers</span>
      </div>

      <section className="products" id="products">
        <div className="section-header">
          <div>
            <p className="section-label">Handpicked for you</p>
            <h2>Popular Products</h2>
          </div>
          <a className="view-all" onClick={() => setActiveCategory('All')}>View all →</a>
        </div>

        {/* ── CATEGORY FILTER BUTTONS ── */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>


        <div className="product-container">
          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found in this category.</div>
          ) : (
            filteredProducts.map((product) => (
              <div className="card" key={product.id}>
                <div className="card-img-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="card-tag">{product.tag}</span>
                </div>
                <div className="card-content">
                  <h3>{product.name}</h3>
                  <div className="price-row">
                    <span className="price">{product.price}</span>
                    <span className="original-price">{product.originalPrice}</span>
                  </div>
                  <button
                    className={`cart-btn ${addedId === product.id ? 'added' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    {addedId === product.id ? '✓ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <div className="features-bar">
        {[
          { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
          { icon: '✅', title: 'Quality Promise', desc: 'Hand-picked & verified' },
          { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free policy' },
          { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' },
        ].map((f, i) => (
          <div className="feature" key={i}>
            <span className="feature-icon">{f.icon}</span>
            <div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">📚 StationeryHub</div>
        <p>© 2026 · Made with love in India 🇮🇳</p>
      </footer>

      {/* ══════════════════════════════
          CART SIDEBAR
      ══════════════════════════════ */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="sidebar-header">
              <h2>Your Cart {cartCount > 0 && <span className="cart-count-label">({cartCount})</span>}</h2>
              <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <span className="empty-icon">🛒</span>
                <p>Your cart is empty</p>
                <button className="hero-btn" style={{ marginTop: '1rem' }} onClick={() => { setCartOpen(false); scrollToProducts() }}>
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-price">{item.price}</p>
                        <div className="cart-item-qty">
                          <button onClick={() => handleRemoveFromCart(item.id)}>−</button>
                          <span>{item.qty}</span>
                          <button onClick={() => handleAddToCart(item)}>+</button>
                        </div>
                      </div>
                      <p className="cart-item-total">₹{item.priceNum * item.qty}</p>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total-row">
                    <span>Total</span>
                    <span className="cart-total-price">₹{cartTotal}</span>
                  </div>
                  {cartTotal < 999 && (
                    <p className="free-ship-note">Add ₹{999 - cartTotal} more for free shipping!</p>
                  )}
                  <button className="checkout-btn">Proceed to Checkout →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          LOGIN MODAL
      ══════════════════════════════ */}
      {loginOpen && (
        <div className="overlay overlay-center" onClick={() => setLoginOpen(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn modal-close" onClick={() => setLoginOpen(false)}>✕</button>
            <div className="login-logo">📚</div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-sub">Sign in to your StationeryHub account</p>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <span className="forgot">Forgot password?</span>
            </div>

            {loginMsg && (
              <p className={`login-msg ${loginMsg.startsWith('✓') ? 'success' : 'error'}`}>
                {loginMsg}
              </p>
            )}

            <button className="login-btn" onClick={handleLogin}>Login</button>

            <p className="signup-link">
              Don't have an account?{' '}
              <span onClick={() => setLoginOpen(false)}>Sign up free →</span>
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default App
