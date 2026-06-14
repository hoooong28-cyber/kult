import re

with open('src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Let's fix the stray `)}`
content = content.replace(
    '''                            </button>
                        </form>

                        )}
                        
                        {activeTab === 'metadata' && (''',
    '''                            </button>
                        </form>

                        </div>
                        
                        <div style={{ display: activeTab === 'metadata' ? 'block' : 'none' }}>'''
)

content = content.replace(
    '''                                </div>
                            </div>
                        </section>
                        )}

                        <div style={{ display: activeTab === 'spaces' ? 'block' : 'none' }}>
                        /* CMS Management List */''',
    '''                                </div>
                            </div>
                        </section>
                        </div>

                        <div style={{ display: activeTab === 'spaces' ? 'block' : 'none' }}>
                        {/* CMS Management List */}'''
)

content = content.replace(
    '''                                )}
                            </div>
                        </section>
                        </div>
                    </div>
                </div>
            </main>''',
    '''                                )}
                            </div>
                        </section>
                        </div>
                    </div>
                </div>
            </main>'''
)


with open('src/pages/Admin.jsx', 'w') as f:
    f.write(content)
print("done3")
