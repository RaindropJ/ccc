# -*- coding: utf-8 -*-
"""
Script to update index.html with Material Symbols font and Material Design 3 tokens,
and build the full Stitch redesign in src/js/hierarchy.js.
"""
import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Material Symbols Outlined link if not present
material_font_link = '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">'
if 'Material+Symbols+Outlined' not in html:
    html = html.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">',
        f'<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">\n    {material_font_link}'
    )

# Inject Stitch design tokens into tailwind.config
stitch_tokens_extend = '''                    colors: {
                        // Stitch Material Design 3 Color Tokens
                        "on-error":"#ffffff","surface-container-high":"#dce9ff","surface-container-lowest":"#ffffff","error-container":"#ffdad6","on-surface":"#0d1c2e","on-primary-fixed":"#00164e","on-primary":"#ffffff","surface":"#f8f9ff","outline-variant":"#c5c5d3","on-secondary":"#ffffff","tertiary":"#002d48","background":"#f8f9ff","secondary-fixed":"#85f8c4","surface-container-low":"#eff4ff","on-primary-container":"#90a8ff","primary-fixed":"#dce1ff","error":"#ba1a1a","on-error-container":"#93000a","inverse-primary":"#b6c4ff","primary":"#00236f","inverse-on-surface":"#eaf1ff","on-background":"#0d1c2e","on-tertiary-fixed":"#001d31","on-primary-fixed-variant":"#264191","tertiary-fixed-dim":"#93ccff","secondary-fixed-dim":"#68dba9","primary-fixed-dim":"#b6c4ff","tertiary-fixed":"#cce5ff","surface-variant":"#d5e3fc","on-tertiary":"#ffffff","tertiary-container":"#004469","on-secondary-container":"#00714e","on-secondary-fixed":"#002114","surface-bright":"#f8f9ff","surface-tint":"#4059aa","primary-container":"#1e3a8a","on-surface-variant":"#444651","surface-container-highest":"#d5e3fc","on-tertiary-container":"#56b3f9","on-tertiary-fixed-variant":"#004b73","secondary":"#006c4a","outline":"#757682","surface-dim":"#ccdbf3","on-secondary-fixed-variant":"#005137","inverse-surface":"#233144","surface-container":"#e6eeff","secondary-container":"#82f5c1",
                        brand: {'''

if '"surface-container-high"' not in html:
    html = html.replace('colors: {\n                        brand: {', stitch_tokens_extend)

spacing_extend = '''                    spacing:{"space-md":"1rem","space-lg":"1.5rem",gutter:"1.5rem",margin:"2rem","space-xs":"0.25rem","space-sm":"0.5rem","space-xl":"2.5rem"},'''
if '"space-md"' not in html:
    html = html.replace('fontFamily: {', f'{spacing_extend}\n                    fontFamily: {{')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("✓ Updated index.html with Material Symbols and Stitch design tokens")
