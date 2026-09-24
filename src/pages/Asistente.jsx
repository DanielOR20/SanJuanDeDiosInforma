import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  Trash2, 
  Bus, 
  PhoneCall 
} from 'lucide-react';

export const Asistente = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola, vecino! 👋 Soy el Guía Vecinal inteligente de San Juan de Dios. ¿En qué te puedo ayudar hoy? Puedes preguntarme por horarios de buses, días de reciclaje, emergencias o comercios locales.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Base de conocimiento local / heurística para responder con precisión de San Juan de Dios
  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    if (q.includes('bus') || q.includes('transporte') || q.includes('horario') || q.includes('poas')) {
      return '🚌 **Transporte en San Juan de Dios:**\n- **San Juan ⇄ San José Centro:** Servicio cada 10-15 min. Primera salida: 4:45 AM, última: 10:45 PM. Pasaje aprox: ₡340.\n- **Poás ⇄ San Juan:** Frecuencia cada 25 min desde las 5:15 AM.\n- **Interlínea:** Opera de lunes a viernes en horas pico conectando con Desamparados Centro y Moravia.';
    }

    if (q.includes('basura') || q.includes('reciclaje') || q.includes('recoleccion') || q.includes('desechos')) {
      return '♻️ **Cronograma de Aseo y Residuos:**\n- **San Juan Centro:** Basura ordinaria los martes y viernes (6:00 AM). Reciclaje el 2do y 4to jueves del mes.\n- **Calle Fallas:** Basura lunes y jueves. Reciclaje 1er y 3er miércoles.\n- Recuerda sacar tus bolsas bien cerradas la mañana del servicio.';
    }

    if (q.includes('emergencia') || q.includes('policia') || q.includes('bomberos') || q.includes('ebais') || q.includes('cruz roja')) {
      return '🚨 **Contactos de Emergencia Inmediata:**\n- **Fuerza Pública (San Juan):** 2259-0111\n- **Bomberos Desamparados:** 2259-2020\n- **EBAIS San Juan de Dios:** 2250-4560\n- **Cruz Roja Desamparados:** 2259-8080\n- Para riesgo inminente de vida, marca siempre al **9-1-1**.';
    }

    if (q.includes('panaderia') || q.includes('taller') || q.includes('comercio') || q.includes('negocio') || q.includes('comida')) {
      return '🏪 **Comercios destacados en el Directorio:**\n- **Panadería Doña Rosa:** 100m Este del Parque Central (Tel: 2259-3344).\n- **Taller Mecánico Central:** Calle Fallas, 250m Sur (Tel: 2250-9988).\nConsulta la sección de **Comercios** para chatear directamente por WhatsApp con ellos.';
    }

    if (q.includes('zumba') || q.includes('banda') || q.includes('evento') || q.includes('actividad')) {
      return '🎉 **Actividades Comunitarias Próximas:**\n- **Clases de Zumba:** Lunes y Miércoles 6:00 PM en el Salón Comunal (₡2.000 por clase).\n- **Banda Municipal:** Ensayo abierto este viernes a las 7:00 PM en la Plaza de Deportes.\n¡Puedes agregarlos a tu Google Calendar desde la pestaña de **Agenda**!';
    }

    if (q.includes('reportar') || q.includes('averia') || q.includes('agua') || q.includes('hueco') || q.includes('luz')) {
      return '🚧 **¿Quieres reportar un problema comunal?**\nPuedes ingresar a la pestaña **Avisos** y presionar el botón azul **"Publicar Reporte / Aviso"** para que los vecinos y la ADI estén enterados del incidente en tu sector.';
    }

    return 'Entendido, vecino. Para esa consulta específica te sugiero revisar las pestañas de **Comercios**, **Agenda & Servicios** o el tablón de **Avisos**. También puedes comunicarte directamente con la Asociación de Desarrollo Integral (ADI). ¿Deseas consultar sobre buses, reciclaje, emergencias o eventos?';
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulamos respuesta con procesamiento fluido
    setTimeout(() => {
      const replyText = generateBotReply(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    { label: '🚌 Horarios de Buses a San José', query: '¿Cuáles son los horarios de buses a San José?' },
    { label: '♻️ Días de Reciclaje', query: '¿Qué días pasa el reciclaje y la basura en San Juan?' },
    { label: '🚨 Teléfonos de Emergencia', query: 'Dame los números de emergencia de la policía y bomberos' },
    { label: '🕺 Clases de Zumba y Banda', query: '¿Cuándo son las clases de Zumba y los ensayos de la banda?' }
  ];

  return (
    <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>
      
      {/* Encabezado */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          <Sparkles size={16} /> Asistencia Cívica Inteligente
        </div>
        <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
          Guía Vecinal San Juan de Dios
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Consulte al instante horarios de transporte, cronogramas de servicios comunales, comercios de barrio y rutas de atención.
        </p>
      </div>

      {/* Tarjeta del Chat */}
      <div className="stitch-card" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        height: '620px', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Cabecera del chat */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={22} color="#FCD34D" />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>Asistente Virtual ADI</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>En línea • Distrito 03 Desamparados</div>
            </div>
          </div>
          <span className="badge badge-success" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}>
            IA Activa
          </span>
        </div>

        {/* Zona de Mensajes */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: 'var(--bg)'
        }}>
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={msg.id} 
                style={{
                  display: 'flex',
                  justifyContent: isBot ? 'flex-start' : 'flex-end',
                  gap: '0.5rem'
                }}
              >
                {isBot && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                    marginTop: '0.2rem'
                  }}>
                    <Bot size={18} />
                  </div>
                )}

                <div style={{
                  maxWidth: '78%',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '14px',
                  fontSize: '0.92rem',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-line',
                  backgroundColor: isBot ? 'var(--surface)' : 'var(--primary)',
                  color: isBot ? 'var(--text-main)' : '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)',
                  border: isBot ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.text}
                </div>

                {!isBot && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.2rem'
                  }}>
                    <User size={16} color="var(--text-muted)" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Bot size={16} /> Consultando base comunal...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Sugerencias Rápidas */}
        <div style={{
          padding: '0.65rem 1rem',
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              style={{
                fontSize: '0.78rem',
                fontWeight: '600',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-subtle)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input de Envío */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '1rem',
            backgroundColor: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.75rem'
          }}
        >
          <input 
            type="text"
            placeholder="Pregunte algo sobre San Juan de Dios (ej: ¿A qué hora pasa el bus a Poás?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: '0.95rem'
            }}
          />
          <button 
            type="submit"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Send size={18} />
          </button>
        </form>

      </div>

    </div>
  );
};