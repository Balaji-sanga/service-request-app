import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateRequest() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', address: '', preferred_time: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/requests/', form);
      const requestId = res.data.id;

      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        await api.post(`/requests/${requestId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create request');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20 }}>
      <h2>New Service Request</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label><br />
          <input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label><br />
          <textarea name="description" value={form.description} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Category</label><br />
          <input name="category" value={form.category} onChange={handleChange} required style={{ width: '100%', padding: 8 }} placeholder="e.g. Plumbing, Electrical" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Address</label><br />
          <input name="address" value={form.address} onChange={handleChange} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Preferred time</label><br />
          <input name="preferred_time" value={form.preferred_time} onChange={handleChange} required style={{ width: '100%', padding: 8 }} placeholder="e.g. Tomorrow 10 AM" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Reference photo (optional)</label><br />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10 }}>Create Request</button>
      </form>
    </div>
  );
}
