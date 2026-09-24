import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getPublicComplaints, createPublicComplaint, addComplaintComment } from '../services/api';
import { 
  MessageSquareWarning, 
  Send, 
  Lock, 
  Image as ImageIcon, 
  EyeOff, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Filter,
  Clock
} from 'lucide-react';

export const Foro = () => {
  const { user } = useApp();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('Todas');

  // Estado para crear denuncia
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Medio Ambiente');
  const [sector, setSector] = useState('San Juan Centro');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Comentarios en redacción por publicación
  const [commentInputs, setCommentInputs] = useState({});

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await getPublicComplaints();
      // Solo mostramos en el foro público las aprobadas por la ADI
      const approved = (data || []).filter(c => c.status === 'Aprobada');
      setComplaints(approved.reverse());
    } catch (err) {
      console.error('Error al cargar el foro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await createPublicComplaint({
        title: title.trim(),
        category,
        sector,
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        isAnonymous,
        authorName: isAnonymous ? 'Vecino Anónimo' : (user?.name || 'Vecino de San Juan'),
        authorEmail: isAnonymous ? null : (user?.email || null),
        status: 'Pendiente' // Queda en moderación previa
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowModal(false);
        setTitle('');
        setDescription('');
        setImageUrl('');
        setIsAnonymous(false);
      }, 2500);
    } catch (err) {
      alert('Error al enviar la denuncia');
    }
  };

  const handleCommentSubmit = async (complaint) => {
    const text = commentInputs[complaint.id]?.trim();
    if (!text || !user) return;

    const newComment = {
      id: 'c_' + Date.now(),
      authorName: user.name,
      date: new Date().toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' }),
      text
    };

    const updatedComments = [...(complaint.comments || []), newComment];

    try {
      await addComplaintComment(complaint.id, updatedComments);
      setCommentInputs(prev => ({ ...prev, [complaint.id]: '' }));
      loadComplaints();
    } catch (e) {
      alert('Error al publicar el comentario');
    }
  };

  const filteredComplaints = filterCategory === 'Todas'
    ? complaints
    : complaints.filter(c => c.category === filterCategory);

  return (
    <div className="stitch-container" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      
      {/* Cabecera del Cabildo / Foro */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '2px solid var(--border)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <MessageSquareWarning size={18} />
            Cabildo Ciudadano y Denuncias Públicas
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
            Tribuna Comunal San Juan de Dios
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
            Espacio de fiscalización ciudadana, denuncias vecinales y debate comunitario moderado por la ADI.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.7rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <MessageSquareWarning size={18} /> Publicar Nueva Denuncia
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {['Todas', 'Medio Ambiente', 'Seguridad y Convivencia', 'Vialidad y Obras', 'Servicios Públicos'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              border: filterCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: filterCategory === cat ? 'var(--primary-light)' : 'var(--surface)',
              color: filterCategory === cat ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listado de Denuncias Aprobadas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando tribuna comunal...</div>
        ) : filteredComplaints.length === 0 ? (
          <div className="stitch-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay denuncias activas en esta categoría.
          </div>
        ) : (
          filteredComplaints.map(item => (
            <div key={item.id} className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              
              {/* Header de la tarjeta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      • Sector: <strong>{item.sector}</strong>
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.35rem 0', color: 'var(--text-main)' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {item.isAnonymous ? <EyeOff size={14} color="#D97706" /> : <UserCheck size={14} color="#059669" />}
                    <span>Por: <strong>{item.authorName}</strong></span>
                    <span>• {item.date}</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                {item.description}
              </p>

              {/* Imagen adjunta si existe */}
              {item.imageUrl && (
                <div style={{ marginBottom: '1.25rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', maxHeight: '350px' }}>
                  <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>
              )}

              {/* Hilo de Comentarios */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Comentarios Vecinales ({item.comments ? item.comments.length : 0})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem' }}>
                  {(item.comments || []).map(comm => (
                    <div key={comm.id} style={{ backgroundColor: 'var(--surface-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                        <span>{comm.authorName}</span>
                        <span style={{ color: 'var(--text-subtle)', fontWeight: 'normal' }}>{comm.date}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Formulario de comentario / Restricción de lectura */}
                {user ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder={`Comentar como ${user.name.split(' ')[0]}...`}
                      value={commentInputs[item.id] || ''}
                      onChange={e => setCommentInputs({ ...commentInputs, [item.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') handleCommentSubmit(item); }}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-strong)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text-main)'
                      }}
                    />
                    <button
                      onClick={() => handleCommentSubmit(item)}
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                ) : (
                  <div style={{
                    padding: '0.65rem 1rem',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed var(--border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Lock size={15} color="var(--tertiary)" />
                      <span>Modo solo lectura. Inicie sesión con su credencial ciudadana para opinar.</span>
                    </div>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>
                      Ingresar aquí
                    </Link>
                  </div>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL PARA NUEVA DENUNCIA */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 3000
        }}>
          <div className="stitch-card" style={{ width: '100%', maxWidth: '540px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>
              Formular Denuncia Ciudadana
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
              Las denuncias pasan por moderación de la Junta Directiva de la ADI antes de su publicación comunal para garantizar veracidad y respeto.
            </p>

            {submitSuccess ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                Denuncia registrada correctamente. Pasó a la mesa de revisión de la ADI.
              </div>
            ) : (
              <form onSubmit={handleCreateComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Título de la Situación</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Quema clandestina de basura cerca de escuela"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.88rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Categoría</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                    >
                      <option value="Medio Ambiente">Medio Ambiente</option>
                      <option value="Seguridad y Convivencia">Seguridad y Convivencia</option>
                      <option value="Vialidad y Obras">Vialidad y Obras</option>
                      <option value="Servicios Públicos">Servicios Públicos</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Sector Afectado</label>
                    <select
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                    >
                      <option value="San Juan Centro">San Juan Centro</option>
                      <option value="Calle Fallas">Calle Fallas</option>
                      <option value="Sector Quebrada / Límite Poás">Sector Quebrada / Límite Poás</option>
                      <option value="Plaza de Deportes / Salón">Plaza de Deportes / Salón</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Descripción de los Hechos</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describa la afectación, horarios recurrentes o detalles importantes..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Enlace de Fotografía o Evidencia (Opcional)</label>
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/foto_evidencia.jpg"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  />
                </div>

                {/* Opción Anónima */}
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}>
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    style={{ cursor: 'pointer', width: '17px', height: '17px' }}
                  />
                  <label htmlFor="anonCheck" style={{ fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>
                    Publicar de forma Anónima (Su nombre y correo quedarán reservados)
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Enviar a Moderación ADI
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};