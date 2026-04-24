import { useEffect, useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    supplierName:'',
    expiryDate:''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/items`);

      if (!response.ok) {
        throw new Error('Failed to load items');
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        supplierName: formData.supplierName.trim(),
        expiryDate: Date(formData.expiryDate)
      };

      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add item');
      }

      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        supplierName:'',
        expiryDate:''
      });

      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');

      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setItems((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Practice Lab</p>
        <h1>MERN Item Manager</h1>
        <p className="hero-copy">
          This starter is intentionally simple so you can practice full-stack CRUD,
          MongoDB connection setup, and adding new fields before your lab test.
        </p>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading">
            <h2>Add New Item</h2>
            <p>Current starter fields: name, category, quantity, price.</p>
          </div>

          <form className="item-form" onSubmit={handleSubmit}>
            <label>
              Item Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Wireless Mouse"
                required
              />
            </label>

            <label>
              Category
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Electronics"
                required
              />
            </label>

            <label>
              Quantity
              <input
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="12"
                required
              />
            </label>

            <label>
              Price (LKR)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="2500"
                required
              />
            </label>

            <label>
              Supplier Name
              <input
                name="supplierName"
                type="text" 
                value={formData.supplierName}
                onChange={handleChange}
                placeholder="Apple"
                required
              />
            </label>

            
            <label>
              Expiry Date
              <input
                name="expiryDate"
                type="date" 
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Item'}
            </button>
          </form>

          {error && <p className="status error">{error}</p>}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Inventory List</h2>
            <p>Your practice feature task is described in `PRACTICE_TASK.md`.</p>
          </div>

          {loading ? (
            <p className="status">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="status">No items found. Add your first item.</p>
          ) : (
            <div className="item-list">
              {items.map((item) => (
                <article className="item-card" key={item._id}>
                  <div className="item-card__top">
                    <div>
                      <h3>{item.name}</h3>
                      <p>Category: {item.category}</p>
                      <p>Supplier Name: {item.supplierName}</p>
                      <p>Expiry Date: {item.expiryDate.slice(0,10)}</p>
                    </div>
                    <span className={item.quantity < 5 ? 'badge badge-alert' : 'badge'}>
                      {item.quantity < 5 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>

                  <div className="item-meta">
                    <span>Qty: {item.quantity}</span>
                    <span>LKR {Number(item.price).toFixed(2)}</span>
                  </div>

                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
