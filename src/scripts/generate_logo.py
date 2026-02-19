
import math

def generate_logo_svg(filename="logo.svg"):
    """
    Generates an SVG logo based on the user's description:
    - Abstract 'U' shape
    - Dot
    - Teal and Purple colors
    - "Super visual" (clean, modern curves)
    """
    
    # Colors from the project palette
    color_teal = "#2A9D8F"
    color_purple = "#8E44AD" # A vibrant purple
    color_purple_light = "#D2B4DE"

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{color_teal};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{color_purple};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Abstract 'U' shape formed by two curves -->
  <path d="M 60 60 
           Q 60 150 100 150 
           Q 140 150 140 60" 
        fill="none" 
        stroke="url(#grad1)" 
        stroke-width="25" 
        stroke-linecap="round"
        filter="url(#shadow)" />
        
  <!-- Second inner curve for detail -->
  <path d="M 80 80 
           Q 80 130 100 130 
           Q 120 130 120 80" 
        fill="none" 
        stroke="{color_purple_light}" 
        stroke-width="8" 
        stroke-linecap="round"
        opacity="0.6" />

  <!-- The 'Dot' floating above or near the U -->
  <circle cx="100" cy="40" r="15" fill="{color_teal}" filter="url(#shadow)">
    <animate attributeName="cy" values="40;35;40" dur="2s" repeatCount="indefinite" />
  </circle>
  
</svg>
"""
    
    with open(filename, "w") as f:
        f.write(svg_content)
    print(f"Logo generated at {filename}")

if __name__ == "__main__":
    # Ensure directory exists or save to a known location
    import os
    output_dir = "src/assets"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    generate_logo_svg(os.path.join(output_dir, "logo.svg"))
