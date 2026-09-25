import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createSupportTicket } from '../services/api';
import { 
  Bot, 
  Send, 
  User, 
  LifeBuoy, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Asistente = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy la Guía Virtual del Distrito 03 San Juan de Dios. Puedo orientarle sobre horarios de buses, recolección de basura, requisitos de trámites para el Salón Comunal o registrar un reporte formal para la Junta Directiva de la ADI. ¿En qué le colaboro hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal para elevar a Ticket
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketSector, setTicketSector] = useState('San Juan Centro');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    const userMsg = { sender: 'user', text: query };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput('');
    setLoading(true);

    try {
      const [businesses, notices, landmarks, bulletins] = await Promise.all([
        import('../services/api').then(m => m.getBusinesses()),
        import('../services/api').then(m => m.getNotices()),
        import('../services/api').then(m => m.getLandmarks()),
        import('../services/api').then(m => m.getBulletins())
      ]);

      const businessContext = businesses.map(b => `${b.name} (${b.category}): ${b.address}, Tel: ${b.phone}`).join('. ');
      const noticesContext = notices.map(n => `${n.title} - ${n.description} (${n.date})`).join('. ');
      const landmarksContext = landmarks.map(l => `${l.name}: ${l.description}`).join('. ');
      
      const systemContext = `Eres la Guía Virtual del Distrito 03 San Juan de Dios. Eres costarricense, educado, servicial y mantienes un tono natural ("Con gusto le colaboro", "Le comento"). 
NUNCA digas que no cuentas con directorio comercial o de servicios. Usa obligatoriamente esta información local verificada para responder:
- Directorio de Comercios: ${businessContext}.
- Avisos de la Comunidad (AyA/CNFL, etc): ${noticesContext}.
- Sitios de Interés: ${landmarksContext}.
- Transporte: El pasaje de bus oficial cuesta ₡385.
- Basura: Recolección ordinaria los Lunes y Jueves, reciclaje 2do y 4to miércoles del mes.

Responde basándote en estos datos si te preguntan por panaderías, talleres, pulperías, u otras consultas locales.`;

      const apiMessages = [
        { role: "system", content: systemContext },
        ...currentMessages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": window.location.href,
          "X-Title": "Guia San Juan de Dios",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "openrouter/auto",
          "messages": apiMessages
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error("Error al conectar con OpenRouter:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, en este momento no puedo conectarme al servicio de inteligencia artificial. Intente de nuevo más tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    try {
      const newTicket = await createSupportTicket({
        residentName: user?.name || 'Vecino de San Juan',
        email: user?.email || 'vecino@sanjuan.cr',
        sector: ticketSector,
        subject: ticketSubject.trim(),
        message: ticketMessage.trim()
      });

      setTicketSuccess(newTicket.ticketNumber);
      setTimeout(() => {
        setTicketSuccess(null);
        setShowTicketModal(false);
        setTicketSubject('');
        setTicketMessage('');
      }, 3000);
    } catch (err) {
      alert('Error al enviar el ticket');
    }
  };

  return (
    <div className="stitch-container" style={{ padding: '2rem 1rem 4rem 1rem', maxWidth: '850px' }}>
      
      {/* Encabezado */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid var(--border)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#002B7F', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <Sparkles size={16} /> Asistente Cívico Inteligente
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
            Guía Virtual San Juan de Dios
          </h1>
        </div>

        <button
          onClick={() => setShowTicketModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#002B7F',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.1rem',
            borderRadius: '4px',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <LifeBuoy size={16} /> Elevar a Ticket ADI
        </button>
      </div>

      {/* Ventana de Conversación */}
      <div className="stitch-card" style={{
        minHeight: '480px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem'
      }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {m.sender === 'bot' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#002B7F', flexShrink: 0 }}>
                  <Bot size={20} />
                </div>
              )}
              <div style={{
                backgroundColor: m.sender === 'user' ? '#002B7F' : '#F1F5F9',
                color: m.sender === 'user' ? '#FFFFFF' : '#0F172A',
                padding: '0.85rem 1.15rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                lineHeight: 1.5
              }}>
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#002B7F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: '#64748B', fontSize: '0.85rem', fontStyle: 'italic', paddingLeft: '3rem' }}>
              Consultando base distrital...
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Pregunte sobre horarios de buses, recolección o trámites..."
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.7rem 1rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              fontSize: '0.9rem'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#002B7F',
              color: 'white',
              border: 'none',
              padding: '0.7rem 1.25rem',
              borderRadius: '4px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* MODAL DE TICKET FORMAL */}
      {showTicketModal && (
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
          <div className="stitch-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: '#002B7F' }}>
              Elevar Solicitud a la Junta Directiva
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 1.25rem 0' }}>
              Genera una boleta con número de caso para ser conocida en sesión ordinaria de la ADI.
            </p>

            {ticketSuccess ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '4px', fontWeight: '700' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                Ticket registrado con éxito: <strong>{ticketSuccess}</strong>. Se le notificará al correo registrado.
              </div>
            ) : (
              <form onSubmit={handleCreateTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Asunto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Petición de bacheo o limpieza comunal"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Sector Distrital</label>
                  <select
                    value={ticketSector}
                    onChange={e => setTicketSector(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="San Juan Centro">San Juan Centro</option>
                    <option value="Calle Fallas">Calle Fallas</option>
                    <option value="Sector Poás">Sector Poás</option>
                    <option value="Plaza de Deportes / Salón">Plaza de Deportes / Salón</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Mensaje o Detalle</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Escriba su consulta o petición formal..."
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    style={{ padding: '0.55rem 1rem', borderRadius: '4px', border: '1px solid #CBD5E1', background: 'none', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.55rem 1.25rem', borderRadius: '4px', border: 'none', backgroundColor: '#002B7F', color: 'white', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Emitir Ticket
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