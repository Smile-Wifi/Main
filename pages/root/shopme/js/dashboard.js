/* --------------  init  -------------- */
let sellerProducts = [];
let editingProduct  = null;          // holds product being edited

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) { window.location.href = 'login.html'; return; }

  loadSellerAvatar();
  initAvatarUpload();
  initAddModal();
  initEditModal();
  loadSellerProducts();
  updateDashboardStats();
  initSampleProducts();
});

/* --------------  seller avatar  -------------- */
function loadSellerAvatar() {
  const user     = JSON.parse(localStorage.getItem('currentUser'));
  const savedSrc = localStorage.getItem(`avatar_${user.id}`);
  if (savedSrc) document.getElementById('avatarImg').src = savedSrc;
}
function initAvatarUpload() {
  const box  = document.getElementById('avatarBox');
  const file = document.getElementById('avatarInput');
  box.onclick = () => file.click();
  file.onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = ev => {
      const src = ev.target.result;
      document.getElementById('avatarImg').src = src;
      const user = JSON.parse(localStorage.getItem('currentUser'));
      localStorage.setItem(`avatar_${user.id}`, src);
    };
    rd.readAsDataURL(f);
  };
}

/* --------------  add product modal  -------------- */
function initAddModal() {
  const modal = document.getElementById('addProductModal');
  document.getElementById('addProductBtn').onclick = () => modal.classList.add('active');
  document.getElementById('closeAddModal').onclick = () => closeAddModal();
  modal.onclick = e => { if (e.target === modal) closeAddModal(); };

  initImageHandlers('addImage', 'addPreview', 'addDemoImg');
  document.getElementById('addProductForm').onsubmit = e => {
    e.preventDefault();
    handleAddProduct();
  };
}
function closeAddModal() {
  document.getElementById('addProductModal').classList.remove('active');
  document.getElementById('addProductForm').reset();
  document.getElementById('addPreview').innerHTML = '';
}

/* --------------  edit product modal  -------------- */
function initEditModal() {
  const modal = document.getElementById('editProductModal');
  document.getElementById('closeEditModal').onclick = () => closeEditModal();
  modal.onclick = e => { if (e.target === modal) closeEditModal(); };

  initImageHandlers('editImage', 'editPreview', 'editDemoImg');
  document.getElementById('editProductForm').onsubmit = e => {
    e.preventDefault();
    handleEditProduct();
  };
}
function closeEditModal() {
  document.getElementById('editProductModal').classList.remove('active');
  document.getElementById('editProductForm').reset();
  document.getElementById('editPreview').innerHTML = '';
}

/* --------------  reusable image preview + demo  -------------- */
function initImageHandlers(fileId, prevId, demoBtnId) {
  const fileIn = document.getElementById(fileId);
  const prev   = document.getElementById(prevId);
  const demoB  = document.getElementById(demoBtnId);

  fileIn.onchange = () => {
    const f = fileIn.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = e => prev.innerHTML = `<img src="${e.target.result}" style="max-width:100%;max-height:200px;border-radius:8px">`;
    rd.readAsDataURL(f);
  };
  demoB.onclick = () => {
    const url = 'data:image/jpeg;base64,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';
    prev.innerHTML = `<img src="${url}" style="max-width:100%;max-height:200px;border-radius:8px">`;
    fileIn.dataset.demo = url;                       // store fallback
  };
}

/* --------------  add product logic  -------------- */
function handleAddProduct() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const name  = document.getElementById('addName').value;
  const price = parseFloat(document.getElementById('addPrice').value);
  const cat   = document.getElementById('addCategory').value;
  const desc  = document.getElementById('addDesc').value;
  const stock = parseInt(document.getElementById('addStock').value);

  let imageSrc = '';
  const fileIn = document.getElementById('addImage');
  if (fileIn.files[0]) imageSrc = document.getElementById('addPreview').querySelector('img')?.src;
  else if (fileIn.dataset.demo) imageSrc = fileIn.dataset.demo;

  if (!imageSrc) { alert('Please add an image (upload or demo).'); return; }

  const newProd = {
    id: Date.now(),
    sellerId: user.id,
    name, price, category: cat, description: desc, stock,
    image: imageSrc, rating: 0, sold: 0,
    createdAt: new Date().toISOString()
  };

  const all = JSON.parse(localStorage.getItem('products')) || [];
  all.push(newProd);
  localStorage.setItem('products', JSON.stringify(all));

  sellerProducts.push(newProd);
  displaySellerProducts();
  updateDashboardStats();
  closeAddModal();
  alert('Product added!');
}

/* --------------  edit product logic  -------------- */
window.editProduct = function (id) {
  const prod = sellerProducts.find(p => p.id === id);
  if (!prod) return;

  editingProduct = prod;

  /* fill form */
  document.getElementById('editId').value      = prod.id;
  document.getElementById('editName').value    = prod.name;
  document.getElementById('editPrice').value   = prod.price;
  document.getElementById('editCategory').value= prod.category;
  document.getElementById('editDesc').value    = prod.description;
  document.getElementById('editStock').value   = prod.stock;
  document.getElementById('editPreview').innerHTML = `<img src="${prod.image}" style="max-width:100%;max-height:200px;border-radius:8px">`;

  document.getElementById('editProductModal').classList.add('active');
};

function handleEditProduct() {
  if (!editingProduct) return;

  /* grab form values */
  editingProduct.name        = document.getElementById('editName').value;
  editingProduct.price       = parseFloat(document.getElementById('editPrice').value);
  editingProduct.category    = document.getElementById('editCategory').value;
  editingProduct.description = document.getElementById('editDesc').value;
  editingProduct.stock       = parseInt(document.getElementById('editStock').value);

  /* image : new file or demo or keep old */
  const fileIn = document.getElementById('editImage');
  if (fileIn.files[0]) editingProduct.image = document.getElementById('editPreview').querySelector('img').src;
  else if (fileIn.dataset.demo) editingProduct.image = fileIn.dataset.demo;

  /* save to localStorage */
  const all = JSON.parse(localStorage.getItem('products')) || [];
  const idx = all.findIndex(p => p.id === editingProduct.id);
  if (idx !== -1) all[idx] = editingProduct;
  localStorage.setItem('products', JSON.stringify(all));

  /* refresh ui */
  displaySellerProducts();
  updateDashboardStats();
  closeEditModal();
  alert('Product updated!');
}

/* --------------  delete  -------------- */
window.deleteProduct = function (id) {
  if (!confirm('Delete this product?')) return;
  sellerProducts = sellerProducts.filter(p => p.id !== id);
  const all = JSON.parse(localStorage.getItem('products')) || [];
  localStorage.setItem('products', JSON.stringify(all.filter(p => p.id !== id)));
  displaySellerProducts();
  updateDashboardStats();
};

/* --------------  load & display  -------------- */
function loadSellerProducts() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const all = JSON.parse(localStorage.getItem('products')) || [];
  sellerProducts = all.filter(p => p.sellerId === user.id);
  displaySellerProducts();
}
function displaySellerProducts() {
  const box = document.getElementById('sellerProducts');
  if (sellerProducts.length === 0) {
    box.innerHTML = `<div style="text-align:center;padding:40px;color:#666"><i class="fas fa-box" style="font-size:48px;margin-bottom:16px"></i><p>You haven't added any products yet.</p><p>Click "Add Product" to get started!</p></div>`;
    return;
  }
  box.innerHTML = '';
  sellerProducts.forEach(p => box.appendChild(createSellerCard(p)));
}
function createSellerCard(p) {
  const div = document.createElement('div');
  div.className = 'seller-product-card';
  div.innerHTML = `
    <img src="${p.image}" alt="${p.name}" class="seller-product-image">
    <div class="seller-product-info">
      <h3 class="seller-product-name">${p.name}</h3>
      <p class="seller-product-price">$${p.price.toFixed(2)}</p>
      <p class="seller-product-stock">Stock: ${p.stock} units</p>
    </div>
    <div class="seller-product-actions">
      <button class="action-btn edit-btn" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
      <button class="action-btn delete-btn" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
    </div>`;
  return div;
}

/* --------------  stats  -------------- */
function updateDashboardStats() {
  const total = sellerProducts.length;
  const orders = sellerProducts.reduce((s, p) => s + p.sold, 0);
  const revenue = sellerProducts.reduce((s, p) => s + (p.price * p.sold), 0);
  document.getElementById('totalProducts').textContent = total;
  document.getElementById('totalOrders').textContent = orders;
  document.getElementById('totalRevenue').textContent = `$${revenue.toFixed(2)}`;
}

/* --------------  seed sample  -------------- */
function initSampleProducts() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const all = JSON.parse(localStorage.getItem('products')) || [];
  const has = all.some(p => p.sellerId === user.id);
  if (has) return;
  const sample = [
    { id: Date.now() + 1, sellerId: user.id, name: 'Wireless Earbuds Pro', price: 79.99, category: 'electronics', description: 'Noise-cancelling earbuds.', stock: 50, image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Earbuds', rating: 4.5, sold: 25, createdAt: new Date().toISOString() },
    { id: Date.now() + 2, sellerId: user.id, name: 'Smart Fitness Watch', price: 199.99, category: 'electronics', description: 'Track your workouts.', stock: 30, image: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Watch', rating: 4.3, sold: 15, createdAt: new Date().toISOString() }
  ];
  localStorage.setItem('products', JSON.stringify([...all, ...sample]));
  loadSellerProducts();
  updateDashboardStats();
}