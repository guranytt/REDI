import re

def html_to_jsx(html):
    # Extract body content if present
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if body_match:
        html = body_match.group(1)
        
    # Replace class= with className=
    html = html.replace('class="', 'className="')
    html = html.replace("class='", "className='")
    
    # Close void tags (e.g. <img ... > to <img ... />)
    void_tags = ['img', 'input', 'br', 'hr', 'meta', 'link']
    for tag in void_tags:
        # Match <tag ... > but avoid closing tags that already have />
        pattern = re.compile(r'(<'+tag+r'\b[^>]*?)(?<!/)>', re.IGNORECASE)
        html = pattern.sub(r'\1 />', html)
        
    # SVG attributes (kebab-case to camelCase)
    svg_attrs = [
        'stroke-width', 'stroke-linecap', 'stroke-linejoin',
        'fill-rule', 'clip-rule', 'stroke-miterlimit'
    ]
    for attr in svg_attrs:
        camel = "".join(word.title() if i > 0 else word for i, word in enumerate(attr.split("-")))
        html = html.replace(f'{attr}="', f'{camel}="')
        
    # Remove inline style strings if any (very complex to parse correctly via regex, we'll just remove them or assume they are clean)
    # Stitch uses Tailwind, so inline styles are rare.
    
    # Wrap in a functional component
    jsx = f"""import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {{
  return (
    <div className="w-full min-h-screen">
      {html}
    </div>
  );
}}
"""
    return jsx

if __name__ == "__main__":
    with open('landing.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    jsx_content = html_to_jsx(html_content)
    
    with open('src/app/landing/page.tsx', 'w', encoding='utf-8') as f:
        f.write(jsx_content)
    print("Successfully converted landing.html to src/app/landing/page.tsx")
