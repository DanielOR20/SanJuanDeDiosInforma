import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Admin.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

append_code = """
            {/* ========================================== */}
            {/* 5 NUEVAS PESTAÑAS (MODULOS ADI)            */}
            {/* ========================================== */}
            {activeTab === 'marketplaceAdmin' && <AdminMarketplaceTab />}
            {activeTab === 'fiscalizationAdmin' && <AdminFiscalizationTab />}
            {activeTab === 'jobsAdmin' && <AdminJobsTab />}
            {activeTab === 'reelsAdmin' && <AdminReelsTab />}
            {activeTab === 'actasAdmin' && <AdminActasTab />}
"""

# replace 
content = content.replace("        </div>\n    );\n};", append_code + "\n        </div>\n    );\n};")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
