import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Heart, Share2, MapPin, MessageCircle, Play, Pause, Send, X, Copy, Link as LinkIcon, CheckCircle, UserPlus, LogIn, Plus, Video } from 'lucide-react';
import { getCommunityReels, updateReelLikes, updateReelComments, createReel } from '../services/api';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: '📱' },
  { id: 'graciosos', label: 'Graciosos', icon: '😂' },
  { id: 'informativos', label: 'Informativos', icon: '📢' },
  { id: 'locos', label: 'Locos', icon: '🌪️' },
  { id: 'nostalgia', label: 'Nostalgia', icon: '❤️' }
];

const FALLBACK_REELS = [
  {
    "id": "1",
    "title": "Perro comunal cobrando peaje en la Plaza",
    "author": "Vecino del Centro",
    "category": "graciosos",
    "sector": "San Juan Centro",
    "description": "Firu no deja pasar a las bicis si no le tiran una galleta jajaja",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "likes": 84,
    "date": "2026-09-26",
    "comments": []
  }
];

export default function Reels() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [reels, setReels] = useState(FALLBACK_REELS);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState(new Set());
  const reelsContainerRef = useRef(null);
  
  // Auth Prompt Modal State
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', category: 'graciosos', sector: '', videoUrl: '', description: '' });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    const fetchReels = async () => {
      try {
        const data = await getCommunityReels();
        setReels(data.length > 0 ? data : FALLBACK_REELS);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReels();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // FILTRADO PÚBLICO: Solo mostrar aprobados o los que no tengan status (legado)
  const approvedReels = reels.filter(r => r.status === 'approved' || !r.status);

  const filteredReels = activeCategory === 'todos' 
    ? approvedReels 
    : approvedReels.filter(r => r.category === activeCategory);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (reelsContainerRef.current) {
      reelsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLike = async (id, currentLikes, hasLiked) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    const newLikes = hasLiked ? currentLikes - 1 : currentLikes + 1;
    
    setLikedReels(prev => {
      const next = new Set(prev);
      hasLiked ? next.delete(id) : next.add(id);
      return next;
    });
    setReels(prev => prev.map(r => r.id === id ? { ...r, likes: newLikes } : r));
    
    try {
      await updateReelLikes(id, newLikes);
    } catch (err) {
      console.error(err);
      setReels(prev => prev.map(r => r.id === id ? { ...r, likes: currentLikes } : r));
      setLikedReels(prev => {
        const next = new Set(prev);
        hasLiked ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  const handleAddComment = async (id, newComment) => {
    const reel = reels.find(r => r.id === id);
    if (!reel) return;
    const updatedComments = [...(reel.comments || []), newComment];
    
    setReels(prev => prev.map(r => r.id === id ? { ...r, comments: updatedComments } : r));
    
    try {
      await updateReelComments(id, updatedComments);
    } catch (err) {
      console.error(err);
      setReels(prev => prev.map(r => r.id === id ? { ...r, comments: reel.comments } : r));
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      setShowAuthPrompt(true);
    } else {
      setShowUploadModal(true);
    }
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!user) return;

    const newReel = {
      ...uploadData,
      id: Date.now().toString(),
      author: user.name,
      likes: 0,
      comments: [],
      date: new Date().toISOString().split('T')[0],
      status: 'pending' // ADI Moderation
    };

    try {
      const saved = await createReel(newReel);
      // Actualizamos el estado local (no se mostrará hasta aprobarse por el filtro)
      setReels(prev => [...prev, saved]);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setUploadData({ title: '', category: 'graciosos', sector: '', videoUrl: '', description: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al subir el reel.");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%', 
      height: 'calc(100vh - 105px)',
      overflow: 'hidden',
      padding: '0',
      margin: '0',
      backgroundColor: 'var(--surface-subtle)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
        
        {/* Reels Container */}
        <div 
          ref={reelsContainerRef}
          style={{
            position: 'relative',
            width: '380px',
            height: 'calc(100vh - 120px)',
            maxHeight: '680px',
            borderRadius: '16px',
            backgroundColor: '#000000',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {filteredReels.map(reel => (
            <ReelCard 
              key={reel.id} 
              reel={reel} 
              isMuted={isMuted} 
              setIsMuted={setIsMuted}
              handleLike={handleLike}
              hasLiked={likedReels.has(reel.id)}
              handleAddComment={handleAddComment}
              user={user}
              setShowAuthPrompt={setShowAuthPrompt}
            />
          ))}
          {filteredReels.length === 0 && (
            <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem' }}>
              No hay reels visibles en esta categoría.
            </div>
          )}
        </div>

        {/* Categories Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <button
            onClick={handleUploadClick}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#059669', // Verde institucional/positivo
              color: 'white',
              fontWeight: '900',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              marginBottom: '1rem'
            }}
          >
            <span style={{ fontSize: '1.2rem', display: 'flex' }}><Plus size={20} /></span> Subir Reel
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? '#002B7F' : 'var(--border)',
                backgroundColor: activeCategory === cat.id ? '#002B7F' : 'white',
                color: activeCategory === cat.id ? '#FFFFFF' : '#334155',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: activeCategory === cat.id ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="stitch-card" style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', position: 'relative' }}>
            <button 
              onClick={() => setShowAuthPrompt(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#EEF2FF', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <UserPlus size={32} color="#002B7F" />
              </div>
              <h2 style={{ color: '#0F172A', fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Únete a la comunidad de San Juan de Dios</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>Para interactuar y subir Reels comunitarios necesitas tener una cuenta activa de vecino.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#002B7F', color: 'white', padding: '0.85rem', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <LogIn size={18} /> Iniciar Sesión
              </button>
              <button 
                onClick={() => navigate('/login')} 
                style={{ backgroundColor: '#F8FAFC', color: '#334155', padding: '0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Registrarme como Vecino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Reel Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="stitch-card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setShowUploadModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            {uploadSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="#059669" style={{ margin: '0 auto 1rem auto' }} />
                <h2 style={{ color: '#0F172A', fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>¡Tu Reel ha sido enviado!</h2>
                <p style={{ color: '#475569', fontSize: '0.95rem' }}>Será visible para todos una vez aprobado por la administración de la ADI.</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#EEF2FF', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                    <Video size={24} color="#002B7F" />
                  </div>
                  <h2 style={{ color: '#0F172A', fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Subir Reel Comunal</h2>
                </div>
                
                <form onSubmit={submitUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>Título del Reel</label>
                    <input type="text" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }} placeholder="Ej: Atardecer desde Pedrito Monge" />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>Categoría</label>
                      <select required value={uploadData.category} onChange={e => setUploadData({...uploadData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: 'white' }}>
                        <option value="graciosos">😂 Graciosos</option>
                        <option value="informativos">📢 Informativos</option>
                        <option value="locos">🌪️ Locos</option>
                        <option value="nostalgia">❤️ Nostalgia</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>Sector</label>
                      <input type="text" required value={uploadData.sector} onChange={e => setUploadData({...uploadData, sector: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }} placeholder="Ej: San Juan Centro" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>URL del Video (MP4)</label>
                    <input type="url" required value={uploadData.videoUrl} onChange={e => setUploadData({...uploadData, videoUrl: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }} placeholder="https://ejemplo.com/video.mp4" />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>Descripción</label>
                    <textarea required rows="3" value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', resize: 'none' }} placeholder="Cuenta un poco sobre el video..."></textarea>
                  </div>

                  <button type="submit" style={{ backgroundColor: '#002B7F', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                    Enviar para Aprobación
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function ReelCard({ reel, isMuted, setIsMuted, handleLike, hasLiked, handleAddComment, user, setShowAuthPrompt }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Comments state
  const [commentText, setCommentText] = useState('');
  const comments = reel.comments || [];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.log('Autoplay prevented', e));
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
          setShowComments(false);
          setShowShare(false);
        }
      });
    }, { threshold: 0.6 });
    
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 800);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`¡Vea este video en San Juan de Dios Informa! 📹 ${reel.title} - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShare(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/reels`);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
      setShowShare(false);
    }, 2000);
  };

  const handleCommentsClick = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setShowComments(true);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    
    const newComment = {
      id: Date.now().toString(),
      author: user.name,
      text: commentText,
      date: new Date().toISOString()
    };
    
    handleAddComment(reel.id, newComment);
    setCommentText('');
  };

  return (
    <div style={{
      position: 'relative',
      height: '100%',
      width: '100%',
      scrollSnapAlign: 'start',
      overflow: 'hidden'
    }}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        playsInline
        muted={isMuted}
        autoPlay
        preload="auto"
        onClick={togglePlay}
        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
      />
      
      {showPlayIcon && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
        }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeOut 0.8s forwards'
          }}>
            {isPlaying ? <Play size={48} color="white" fill="white" /> : <Pause size={48} color="white" fill="white" />}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsMuted(!isMuted)}
        style={{
          position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%',
          width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 10
        }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <div style={{
        position: 'absolute', right: '15px', bottom: '100px', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', zIndex: 10
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <button 
            onClick={() => handleLike(reel.id, reel.likes, hasLiked)}
            style={{
              background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: hasLiked ? '#EF4444' : 'white', backdropFilter: 'blur(4px)',
              transition: 'transform 0.2s',
              transform: hasLiked ? 'scale(1.15)' : 'scale(1)'
            }}
          >
            <Heart size={24} fill={hasLiked ? '#EF4444' : 'none'} />
          </button>
          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {reel.likes}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <button 
            onClick={handleCommentsClick}
            style={{
              background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)'
            }}
          >
            <MessageCircle size={24} />
          </button>
          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {comments.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', position: 'relative' }}>
          <button 
            onClick={() => setShowShare(!showShare)}
            style={{
              background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)'
            }}
          >
            <Share2 size={24} />
          </button>
          <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            Share
          </span>
          
          {showShare && (
            <div style={{
              position: 'absolute', right: '60px', top: '0', backgroundColor: 'white', borderRadius: '8px', padding: '0.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '200px'
            }}>
              <button onClick={handleShareWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', textAlign: 'left', borderRadius: '4px', color: '#0F172A', fontWeight: '600' }}>
                <div style={{ backgroundColor: '#25D366', color: 'white', padding: '0.25rem', borderRadius: '50%', display: 'flex' }}><Share2 size={14} /></div> WhatsApp
              </button>
              <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', textAlign: 'left', borderRadius: '4px', color: '#0F172A', fontWeight: '600' }}>
                <div style={{ backgroundColor: '#E2E8F0', color: '#334155', padding: '0.25rem', borderRadius: '50%', display: 'flex' }}>{copySuccess ? <CheckCircle size={14} color="#059669" /> : <LinkIcon size={14} />}</div> 
                {copySuccess ? '¡Copiado!' : 'Copiar Enlace'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)',
        padding: '2rem 5rem 1.5rem 1.5rem', color: 'white', pointerEvents: 'none'
      }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,255,255,0.25)', 
          padding: '0.25rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', backdropFilter: 'blur(4px)'
        }}>
          <MapPin size={12} /> {reel.sector}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.25rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          @{reel.author}
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 0 0.25rem 0', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          {reel.title}
        </h3>
        <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9, lineHeight: '1.3', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          {reel.description}
        </p>
      </div>

      {showComments && user && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', backgroundColor: 'white',
          borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', flexDirection: 'column',
          zIndex: 20, boxShadow: '0 -4px 10px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F172A' }}>Comentarios ({comments.length})</h3>
            <button onClick={() => setShowComments(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: '2rem' }}>Aún no hay comentarios. ¡Sé el primero!</div>
            ) : (
              comments.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#475569', flexShrink: 0 }}>
                    {c.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155' }}>{c.author}</div>
                    <div style={{ fontSize: '0.9rem', color: '#0F172A', marginTop: '0.1rem' }}>{c.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <form onSubmit={submitComment} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Escribe un comentario comunitario..." 
                value={commentText} 
                onChange={e => setCommentText(e.target.value)} 
                required
                style={{ flex: 1, padding: '0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
              <button type="submit" style={{ backgroundColor: '#002B7F', color: 'white', border: 'none', borderRadius: '6px', padding: '0 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
