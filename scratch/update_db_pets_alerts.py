import json
import os

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\db.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'communityPets' not in data:
    data['communityPets'] = [
      {
        "id": "1",
        "name": "Rocky",
        "type": "perro",
        "status": "perdido",
        "breed": "Zaguatico cruce con Pastor",
        "sector": "Sector Itaipú",
        "date": "2026-09-27",
        "description": "Lleva collar azul sin placa. Es asustadizo pero manso. Se extravió cerca de la pulpería.",
        "contactName": "Familia Vargas",
        "phone": "50688889999",
        "imageUrl": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60"
      },
      {
        "id": "2",
        "name": "Mina",
        "type": "gato",
        "status": "adopcion",
        "breed": "Carey / Criolla",
        "sector": "San Juan Centro",
        "date": "2026-09-25",
        "description": "Gatita rescatada de 3 meses, desparasitada y con primera vacuna. Convive con otros animales.",
        "contactName": "Asociación Bienestar Animal SJD",
        "phone": "50687771122",
        "imageUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60"
      }
    ]

if 'emergencyAlerts' not in data:
    data['emergencyAlerts'] = [
      {
        "id": "1",
        "active": True,
        "level": "warning",
        "title": "Crecida preventiva de la Quebrada Rivera",
        "message": "Comité Municipal de Emergencias en vigilancia activa por fuertes lluvias de la tarde en Calle Máquinas.",
        "date": "2026-09-28 14:00"
      }
    ]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
