import json

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\db.json'
with open(path, 'r', encoding='utf-8') as f:
    db = json.load(f)

db["busRoutesLared"] = [
    {
      "id": "ruta-1",
      "code": "L-01",
      "name": "San Juan de Dios - San José (Por Centro)",
      "operator": "Autotransportes Lared Protur S.A.",
      "terminalSJ": "Terminal San José (Costado Este Parque Central / Calle 4)",
      "terminalLocal": "Terminal San Juan Centro (Frente a Plaza de Deportes)",
      "fare": "₡420",
      "peakFrequency": "Cada 8 - 10 min",
      "regularFrequency": "Cada 15 min",
      "firstBus": "04:30 AM",
      "lastBus": "10:30 PM",
      "stopsKey": ["Parque San Juan", "Super Comunal", "Cruce San Rafael", "La Y Griega", "San José"],
      "status": "Operativo normal",
      "phone": "+506 2259-2000"
    },
    {
      "id": "ruta-2",
      "code": "L-02",
      "name": "San Juan de Dios - Calle Máquinas / Itaipú",
      "operator": "Autotransportes Lared Protur S.A.",
      "terminalSJ": "San José Centro - Calle 4",
      "terminalLocal": "Sector Calle Máquinas / Entrada Itaipú",
      "fare": "₡420",
      "peakFrequency": "Cada 12 - 15 min",
      "regularFrequency": "Cada 20 min",
      "firstBus": "04:45 AM",
      "lastBus": "10:00 PM",
      "stopsKey": ["Sector Calle Máquinas", "Entrada Itaipú", "Cruce Principal", "Desamparados Centro", "San José"],
      "status": "Operativo normal",
      "phone": "+506 2259-2000"
    },
    {
      "id": "ruta-3",
      "code": "L-03",
      "name": "Intersectorial San Juan - Desamparados Centro",
      "operator": "Autotransportes Lared Protur S.A.",
      "terminalSJ": "Clínica Marcial Fallas / Parque Desamparados",
      "terminalLocal": "San Juan de Dios Centro",
      "fare": "₡380",
      "peakFrequency": "Cada 15 min",
      "regularFrequency": "Cada 30 min",
      "firstBus": "05:15 AM",
      "lastBus": "08:30 PM",
      "stopsKey": ["Plaza San Juan", "EBAIS", "San Rafael Abajo", "Mall Multicentro", "Clínica Marcial Fallas"],
      "status": "Operativo normal",
      "phone": "+506 2259-2000"
    }
  ]

db["districtSchedule"] = [
    {
      "id": "1",
      "title": "Sesión Ordinaria Abierta de la Junta ADI",
      "category": "Concejo & ADI",
      "date": "2026-10-05",
      "time": "06:30 PM",
      "location": "Salón Comunal de San Juan de Dios",
      "description": "Rendición de cuentas del tercer trimestre, revisión de mejoras en aceras y presupuesto de obra menor.",
      "status": "Abierto a Vecinos"
    },
    {
      "id": "2",
      "title": "Campaña de Recolección de No Tradicionales y Chatarra",
      "category": "Ambiental",
      "date": "2026-10-12",
      "time": "07:00 AM - 01:00 PM",
      "location": "Sectores Centro, Itaipú y Calle Máquinas",
      "description": "Paso de camión recolector para colchones, electrodomésticos en desuso y madera para prevención de dengue.",
      "status": "Confirmado"
    },
    {
      "id": "3",
      "title": "Jornada de Vacunación y Control de Presión EBAIS",
      "category": "Salud",
      "date": "2026-10-18",
      "time": "08:00 AM - 12:00 MD",
      "location": "EBAIS San Juan de Dios (Cancha de Deportes)",
      "description": "Prioridad para adultos mayores y personas con enfermedades crónicas adscritas al sector.",
      "status": "Cupo Limitado"
    }
  ]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)
