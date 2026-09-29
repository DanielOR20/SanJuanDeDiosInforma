import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Admin.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
imports = """import AdminMarketplaceTab from './adminTabs/AdminMarketplaceTab';
import AdminFiscalizationTab from './adminTabs/AdminFiscalizationTab';
import AdminJobsTab from './adminTabs/AdminJobsTab';
import AdminReelsTab from './adminTabs/AdminReelsTab';
import AdminActasTab from './adminTabs/AdminActasTab';
"""
if "AdminMarketplaceTab" not in content:
    content = content.replace("export const Admin = () => {", imports + "\nexport const Admin = () => {")

# 2. Add to tabs array. Let's find the array.
tabs_array_end = """{ id: 'audit', label: 'Bitácora de Auditoría', icon: History, count: auditLogs.length, badgeColor: '#64748B' }"""
tabs_array_new = """{ id: 'audit', label: 'Bitácora de Auditoría', icon: History, count: auditLogs.length, badgeColor: '#64748B' },
                    { id: 'marketplaceAdmin', label: 'Mercadito Comunal', icon: Store, count: null, badgeColor: '#002B7F' },
                    { id: 'fiscalizationAdmin', label: 'Fiscalización & Denuncias', icon: ShieldCheck, count: null, badgeColor: '#002B7F' },
                    { id: 'jobsAdmin', label: 'Bolsa de Empleo', icon: Users, count: null, badgeColor: '#002B7F' },
                    { id: 'reelsAdmin', label: 'Moderación Reels', icon: CheckCircle2, count: null, badgeColor: '#002B7F' },
                    { id: 'actasAdmin', label: 'Presupuesto y Actas', icon: FileSpreadsheet, count: null, badgeColor: '#002B7F' }"""

content = content.replace(tabs_array_end, tabs_array_new)

# 3. Add to rendering block, right before </main>
render_blocks = """
            {activeTab === 'marketplaceAdmin' && <AdminMarketplaceTab />}
            {activeTab === 'fiscalizationAdmin' && <AdminFiscalizationTab />}
            {activeTab === 'jobsAdmin' && <AdminJobsTab />}
            {activeTab === 'reelsAdmin' && <AdminReelsTab />}
            {activeTab === 'actasAdmin' && <AdminActasTab />}
"""

if "activeTab === 'marketplaceAdmin'" not in content:
    content = content.replace("</main>", render_blocks + "\n        </main>")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
