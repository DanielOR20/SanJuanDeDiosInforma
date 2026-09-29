import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Reels.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

fallback_data = """const FALLBACK_REELS = [
  {
    "id": "1",
    "title": "Perro comunal cobrando peaje en la Plaza",
    "author": "Vecino del Centro",
    "category": "graciosos",
    "sector": "San Juan Centro",
    "description": "Firu no deja pasar a las bicis si no le tiran una galleta jajaja",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "likes": 84,
    "date": "2026-09-26"
  },
  {
    "id": "2",
    "title": "Camión de descarrichización pasando por Itaipú",
    "author": "Comité Ambiental ADI",
    "category": "informativos",
    "sector": "Sector Itaipú",
    "description": "¡A sacar llantas y chatarra hoy antes de las 2:00 PM!",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "likes": 56,
    "date": "2026-09-25"
  },
  {
    "id": "3",
    "title": "El ventolero de la tarde se llevó el toldo del bingo",
    "author": "Doña Mayra",
    "category": "locos",
    "sector": "Salón Comunal",
    "description": "¡Casi sale volando el animador con la tómbola pegada!",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "likes": 128,
    "date": "2026-09-22"
  },
  {
    "id": "4",
    "title": "Don Chepe recordando San Juan en los años 70",
    "author": "Archivo Histórico Distrital",
    "category": "nostalgia",
    "sector": "Pedrito Monge",
    "description": "'Antes todo esto de aquí hasta Aserrí eran puros cafetales...'",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    "likes": 95,
    "date": "2026-09-18"
  }
];

export default function Reels() {
  const [reels, setReels] = useState(FALLBACK_REELS);"""

content = re.sub(r'export default function Reels\(\) \{\n\s*const \[reels, setReels\] = useState\(\[\]\);', fallback_data, content)

# update container styles
container_style_old = """    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', width: '100%' }}>"""
container_style_new = """    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'flex-start',
      width: '100%', 
      height: 'calc(100vh - 80px)',
      overflow: 'hidden',
      padding: '1rem'
    }}>"""
content = content.replace(container_style_old, container_style_new)

# update video tags
video_old = """      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer'
        }}
      />"""

video_new = """      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        playsInline
        muted={isMuted}
        autoPlay
        preload="auto"
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: 'pointer'
        }}
      />"""
content = content.replace(video_old, video_new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
