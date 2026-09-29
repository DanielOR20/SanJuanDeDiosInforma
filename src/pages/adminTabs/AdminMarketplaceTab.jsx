import React, { useState, useEffect } from 'react';
import { getMarketplaceItems, updateMarketplaceItemStatus, deleteMarketplaceItem } from '../../services/api';
import { Store, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminMarketplaceTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateMarketplaceItemStatus(id, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar artículo definitivamente?')) return;
    try {
      await deleteMarketplaceItem(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => filter === 'Todos' || item.status === filter);

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#002B7F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={24} /> Moderación de Mercadito
        </h2>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
          <option value="Todos">Todos los Estados</option>
          <option value="pending">Pendientes de Aprobación</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando artículos...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #CBD5E1', backgroundColor: '#F8FAFC' }}>
                <th style={{ padding: '1rem' }}>Artículo</th>
                <th style={{ padding: '1rem' }}>Vendedor</th>
                <th style={{ padding: '1rem' }}>Precio</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.category}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>{item.sellerName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>₡{item.price.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: item.status === 'approved' ? '#ECFDF5' : item.status === 'rejected' ? '#FEF2F2' : '#FEF3C7',
                      color: item.status === 'approved' ? '#059669' : item.status === 'rejected' ? '#DC2626' : '#D97706'
                    }}>
                      {item.status === 'approved' ? 'Aprobado' : item.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {item.status !== 'approved' && (
                        <button onClick={() => handleUpdate(item.id, 'approved')} title="Aprobar" style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer' }}>
                          <CheckCircle size={20} />
                        </button>
                      )}
                      {item.status !== 'rejected' && (
                        <button onClick={() => handleUpdate(item.id, 'rejected')} title="Rechazar" style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}>
                          <XCircle size={20} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(item.id)} title="Eliminar" style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    No hay artículos con este estado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
