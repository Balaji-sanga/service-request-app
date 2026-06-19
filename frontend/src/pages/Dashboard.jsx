import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  Pending: '#f0ad4e',
  'In Progress': '#5bc0de',
  Completed: '#5cb85c',
  Cancelled: '#d9534f',
};

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests/', { params: { search } });
      setRequests(res.data);
    } catch (err) {
      setError('Failed to load requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/requests/${id}/status`, { status: newStatus });
      fetchRequests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await api.delete(`/requests/${id}`);
      fetchRequests();
    } catch (err) {
      alert('Failed to delete request');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Service Requests</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={fetchRequests}>Search</button>
        <Link to="/create">
          <button>+ New Request</button>
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {requests.length === 0 && <p>No service requests yet.</p>}

      {requests.map((req) => (
        <div key={req.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{req.title}</h3>
            <span style={{ background: statusColors[req.status], color: 'white', padding: '2px 10px', borderRadius: 12, fontSize: 12 }}>
              {req.status}
            </span>
          </div>
          <p style={{ color: '#555' }}>{req.description}</p>
          <p><strong>Category:</strong> {req.category}</p>
          <p><strong>Address:</strong> {req.address}</p>
          <p><strong>Preferred time:</strong> {req.preferred_time}</p>
          {req.image_path && (
            <img src={`http://127.0.0.1:8000${req.image_path}`} alt="request" style={{ maxWidth: 200, borderRadius: 8 }} />
          )}
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <select value={req.status} onChange={(e) => handleStatusChange(req.id, e.target.value)}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <button onClick={() => handleDelete(req.id)} style={{ color: 'red' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
