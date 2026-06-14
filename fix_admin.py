import re

with open('src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Make sure the block for spaces tab is properly closed. 
# We need to wrap both the form and the list inside the 'spaces' condition, OR just render them sequentially under the same condition.
# It seems we wrapped the form with `<> ... </>` and then we conditionally tried to render the list under another `{activeTab === 'spaces' && (...)` which was also wrapped incorrectly or prematurely closed.

content = content.replace(
    '''                            </>
                        )}
                        
                        {activeTab === 'metadata' && (
                        /* Metadata Management */
                        <section className="border-slate-100">''',
    '''                        )}
                        
                        {activeTab === 'metadata' && (
                        /* Metadata Management */
                        <section className="border-slate-100">'''
)

# Replace the start of the form section to just conditionally render
content = content.replace(
    '''                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        {activeTab === 'spaces' && (
                            <>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">''',
    '''                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        {activeTab === 'spaces' && (
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-12 mb-12">'''
)

# Ensure the list is also rendered when spaces is active, inside the same div
content = content.replace(
    '''                        {activeTab === 'spaces' && (
                        /* CMS Management List */
                        <section className="mt-32 pt-20 border-t border-slate-100">''',
    '''                        {activeTab === 'spaces' && (
                        /* CMS Management List */
                        <section className="mt-32 pt-20 border-t border-slate-100">'''
)


with open('src/pages/Admin.jsx', 'w') as f:
    f.write(content)
print("done")
