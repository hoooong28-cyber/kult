import re

with open('src/pages/Admin.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''                        </section>
                        )}

                        /* CMS Management List */''',
    '''                        </section>
                        </div>

                        {/* CMS Management List */}'''
)

content = content.replace(
    '''                                )}
                            </div>
                        </section>
                        </div>
                    </div>''',
    '''                                )}
                            </div>
                        </section>
                    </div>'''
)

with open('src/pages/Admin.jsx', 'w') as f:
    f.write(content)
print("done4")
