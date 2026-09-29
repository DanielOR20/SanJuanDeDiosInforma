import json

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\db.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data["communityReels"] = [
  {
    "id": "1",
    "title": "Perro comunal cobrando peaje en la Plaza",
    "author": "Vecino del Centro",
    "category": "graciosos",
    "sector": "San Juan Centro",
    "description": "Firu no deja pasar a las bicis si no le tiran una galleta jajaja",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-playful-dog-enjoying-the-outdoors-42289-large.mp4",
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
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-garbage-truck-moving-in-a-suburban-street-41712-large.mp4",
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
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-wind-blowing-trees-in-a-storm-41484-large.mp4",
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
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-elderly-man-talking-outdoors-42861-large.mp4",
    "likes": 95,
    "date": "2026-09-18"
  }
]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
