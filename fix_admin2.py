import re

with open('src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# The issue is that activeTab === 'spaces' is checked twice:
# 1) Before the space form
# 2) Before the space list
# They should just work, but maybe the <> </> fragments were messed up. Let's ensure the structure is:

# <div className="lg:col-span-12">
#   <div style={{display: activeTab === 'spaces' ? 'block' : 'none'}}>
#      ... form ...
#      ... list ...
#   </div>
#   <div style={{display: activeTab === 'metadata' ? 'block' : 'none'}}>
#      ... metadata ...
#   </div>
# </div>

# This CSS approach avoids React rendering issues entirely and solves state resets.

content = content.replace(
    '''                        {activeTab === 'spaces' && (
                            <>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">''',
    '''                        <div style={{ display: activeTab === 'spaces' ? 'block' : 'none' }}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">'''
)

content = content.replace(
    '''                        {activeTab === 'spaces' && (
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">''',
    '''                        <div style={{ display: activeTab === 'spaces' ? 'block' : 'none' }}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">'''
)

content = content.replace(
    '''                            </>
                        )}
                        
                        {activeTab === 'metadata' && (
                        /* Metadata Management */
                        <section className="border-slate-100">''',
    '''                        <br />
                        
                        {activeTab === 'metadata' && (
                        /* Metadata Management */
                        <section className="border-slate-100">'''
)

content = content.replace(
    '''                        {activeTab === 'spaces' && (
                        /* CMS Management List */
                        <section className="mt-32 pt-20 border-t border-slate-100">''',
    '''                        /* CMS Management List */
                        <section className="mt-32 pt-20 border-t border-slate-100">'''
)

content = content.replace(
    '''                                )}
                            </div>
                        </section>
                        )}
                    </div>''',
    '''                                )}
                            </div>
                        </section>
                        </div>
                    </div>'''
)

with open('src/pages/Admin.jsx', 'w') as f:
    f.write(content)
print("done2")
