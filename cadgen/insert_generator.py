"""
Parametric CAD Generator for Cutting Tool Inserts
Generates STEP files based on ISO 1832 standard parameters
"""

import cadquery as cq
import math
import re
import os

# ISO 1832 Insert Shape Definitions
SHAPES = {
    'C': {'angle': 80, 'sides': 4, 'name': 'Rhombus 80°'},
    'D': {'angle': 55, 'sides': 4, 'name': 'Rhombus 55°'},
    'E': {'angle': 75, 'sides': 4, 'name': 'Rhombus 75°'},
    'H': {'angle': 0, 'sides': 6, 'name': 'Hexagon'},
    'K': {'angle': 55, 'sides': 4, 'name': 'Parallelogram 55°'},
    'L': {'angle': 90, 'sides': 4, 'name': 'Rectangle'},
    'M': {'angle': 86, 'sides': 4, 'name': 'Rhombus 86°'},
    'O': {'angle': 0, 'sides': 8, 'name': 'Octagon'},
    'P': {'angle': 0, 'sides': 5, 'name': 'Pentagon'},
    'R': {'angle': 0, 'sides': 0, 'name': 'Round'},
    'S': {'angle': 90, 'sides': 4, 'name': 'Square'},
    'T': {'angle': 60, 'sides': 3, 'name': 'Triangle'},
    'V': {'angle': 35, 'sides': 4, 'name': 'Rhombus 35°'},
    'W': {'angle': 80, 'sides': 3, 'name': 'Trigon'},
}

# Clearance angles
CLEARANCE = {
    'A': 3,
    'B': 5,
    'C': 7,
    'D': 15,
    'E': 20,
    'F': 25,
    'G': 30,
    'N': 0,
    'O': 0,  # Other
    'P': 11,
}

def parse_insert_code(code):
    """
    Parse ISO insert designation code
    Example: CNMG 120408-PM

    Returns dict with:
    - shape: letter code
    - clearance: letter code
    - tolerance: letter code
    - type: letter code (hole/chipbreaker)
    - ic_size: inscribed circle diameter in mm
    - thickness: in mm
    - nose_radius: in mm
    """
    # Clean the code
    code = code.upper().replace(' ', '').replace('-', '')

    # Extract base designation (first 4 letters)
    match = re.match(r'^([A-Z])([A-Z])([A-Z])([A-Z])(\d{6})(.*)$', code)

    if not match:
        # Try alternative format
        match = re.match(r'^([A-Z])([A-Z])([A-Z])([A-Z])(\d{3,4})(.*)$', code)

    if not match:
        raise ValueError(f"Cannot parse insert code: {code}")

    shape = match.group(1)
    clearance = match.group(2)
    tolerance = match.group(3)
    insert_type = match.group(4)
    size_code = match.group(5)

    # Parse size code (LLTTCC format: L=inscribed circle, T=thickness, C=corner radius)
    if len(size_code) == 6:
        ic_size = int(size_code[0:2])  # mm
        thickness = int(size_code[2:4]) / 10  # Convert to mm (04 = 4.0mm)
        nose_radius = int(size_code[4:6]) / 10  # Convert to mm (08 = 0.8mm)
    elif len(size_code) == 3:
        # ANSI format (e.g., 432)
        ic_size = int(size_code[0]) * 3.175  # Convert to mm
        thickness = int(size_code[1]) * 1.5875  # Convert to mm
        nose_radius = int(size_code[2]) * 0.4  # Approximate
    else:
        ic_size = 12
        thickness = 4
        nose_radius = 0.8

    return {
        'shape': shape,
        'clearance': clearance,
        'tolerance': tolerance,
        'type': insert_type,
        'ic_size': ic_size,
        'thickness': thickness,
        'nose_radius': nose_radius,
        'shape_info': SHAPES.get(shape, SHAPES['C']),
        'clearance_angle': CLEARANCE.get(clearance, 0),
    }


def create_rhombus_insert(ic_size, thickness, nose_radius, angle):
    """Create a rhombus-shaped insert (C, D, V, etc.)"""

    # Calculate vertices based on inscribed circle and angle
    half_angle = math.radians(angle / 2)

    # Distance from center to vertex
    r = ic_size / 2 / math.sin(half_angle)

    # Create the rhombus points
    points = [
        (r * math.cos(math.radians(0)), r * math.sin(math.radians(0))),
        (r * math.cos(math.radians(angle)), r * math.sin(math.radians(angle))),
        (r * math.cos(math.radians(180)), r * math.sin(math.radians(180))),
        (r * math.cos(math.radians(180 + angle)), r * math.sin(math.radians(180 + angle))),
    ]

    # Create the base shape
    insert = (
        cq.Workplane("XY")
        .polyline(points)
        .close()
        .extrude(thickness)
    )

    # Add nose radius (fillet the corners)
    if nose_radius > 0:
        try:
            insert = insert.edges("|Z").fillet(nose_radius)
        except:
            pass  # Skip if fillet fails

    # Add center hole (typical 40% of IC)
    hole_diameter = ic_size * 0.4
    insert = insert.faces(">Z").workplane().hole(hole_diameter)

    return insert


def create_triangle_insert(ic_size, thickness, nose_radius):
    """Create a triangular insert (T)"""

    # Equilateral triangle
    r = ic_size / math.sqrt(3)

    insert = (
        cq.Workplane("XY")
        .polygon(3, r * 2)
        .extrude(thickness)
    )

    if nose_radius > 0:
        try:
            insert = insert.edges("|Z").fillet(nose_radius)
        except:
            pass

    # Add center hole
    hole_diameter = ic_size * 0.35
    insert = insert.faces(">Z").workplane().hole(hole_diameter)

    return insert


def create_square_insert(ic_size, thickness, nose_radius):
    """Create a square insert (S)"""

    side = ic_size / math.sqrt(2) * 2

    insert = (
        cq.Workplane("XY")
        .rect(side, side)
        .extrude(thickness)
    )

    if nose_radius > 0:
        try:
            insert = insert.edges("|Z").fillet(nose_radius)
        except:
            pass

    # Add center hole
    hole_diameter = ic_size * 0.4
    insert = insert.faces(">Z").workplane().hole(hole_diameter)

    return insert


def create_round_insert(ic_size, thickness):
    """Create a round insert (R)"""

    insert = (
        cq.Workplane("XY")
        .circle(ic_size / 2)
        .extrude(thickness)
    )

    # Add center hole
    hole_diameter = ic_size * 0.35
    insert = insert.faces(">Z").workplane().hole(hole_diameter)

    return insert


def add_toolsfinder_branding(insert, ic_size, thickness):
    """Add ToolsFinder branding engraved on the insert top surface"""
    try:
        # Calculate text size based on insert size (max 2mm)
        text_size = min(ic_size * 0.12, 1.8)

        # Position text offset from center to avoid hole
        offset_y = ic_size * 0.25

        # Add engraved "TF" logo on top surface
        branded = (
            insert
            .faces(">Z")
            .workplane()
            .center(0, offset_y)
            .text("TF", text_size, -0.15, combine=True)  # Engraved 0.15mm deep
        )
        return branded
    except Exception as e:
        # If text engraving fails, return original insert
        print(f"Branding failed: {e}")
        return insert


def generate_insert_step(code, output_path=None, branding=True):
    """
    Generate a STEP file for the given insert code

    Args:
        code: ISO insert designation (e.g., 'CNMG120408')
        output_path: Path to save STEP file (optional)
        branding: Add ToolsFinder branding (default True)

    Returns:
        Path to generated STEP file
    """

    params = parse_insert_code(code)

    shape = params['shape']
    ic_size = params['ic_size']
    thickness = params['thickness']
    nose_radius = params['nose_radius']
    shape_info = params['shape_info']

    # Generate based on shape type
    if shape == 'R':
        insert = create_round_insert(ic_size, thickness)
    elif shape in ['T', 'W']:
        insert = create_triangle_insert(ic_size, thickness, nose_radius)
    elif shape == 'S':
        insert = create_square_insert(ic_size, thickness, nose_radius)
    elif shape in ['C', 'D', 'V', 'E', 'M', 'K']:
        angle = shape_info['angle']
        insert = create_rhombus_insert(ic_size, thickness, nose_radius, angle)
    else:
        # Default to 80° rhombus
        insert = create_rhombus_insert(ic_size, thickness, nose_radius, 80)

    # Add ToolsFinder branding
    if branding:
        insert = add_toolsfinder_branding(insert, ic_size, thickness)

    # Generate output path if not provided
    if output_path is None:
        clean_code = code.replace(' ', '_').replace('-', '_')
        output_path = f"ToolsFinder_{clean_code}.step"

    # Export to STEP
    cq.exporters.export(insert, output_path)

    return output_path


def generate_insert_stl(code, output_path=None, branding=True):
    """Generate STL file for 3D printing or preview"""

    params = parse_insert_code(code)

    shape = params['shape']
    ic_size = params['ic_size']
    thickness = params['thickness']
    nose_radius = params['nose_radius']
    shape_info = params['shape_info']

    # Generate based on shape type
    if shape == 'R':
        insert = create_round_insert(ic_size, thickness)
    elif shape in ['T', 'W']:
        insert = create_triangle_insert(ic_size, thickness, nose_radius)
    elif shape == 'S':
        insert = create_square_insert(ic_size, thickness, nose_radius)
    elif shape in ['C', 'D', 'V', 'E', 'M', 'K']:
        angle = shape_info['angle']
        insert = create_rhombus_insert(ic_size, thickness, nose_radius, angle)
    else:
        insert = create_rhombus_insert(ic_size, thickness, nose_radius, 80)

    # Add ToolsFinder branding
    if branding:
        insert = add_toolsfinder_branding(insert, ic_size, thickness)

    if output_path is None:
        clean_code = code.replace(' ', '_').replace('-', '_')
        output_path = f"ToolsFinder_{clean_code}.stl"

    cq.exporters.export(insert, output_path)

    return output_path


# CLI usage
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python insert_generator.py <insert_code> [output_path]")
        print("Example: python insert_generator.py CNMG120408")
        sys.exit(1)

    code = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        result = generate_insert_step(code, output)
        print(f"Generated: {result}")

        # Also show parsed parameters
        params = parse_insert_code(code)
        print(f"\nParsed parameters:")
        print(f"  Shape: {params['shape']} ({params['shape_info']['name']})")
        print(f"  IC Size: {params['ic_size']}mm")
        print(f"  Thickness: {params['thickness']}mm")
        print(f"  Nose Radius: {params['nose_radius']}mm")
        print(f"  Clearance: {params['clearance_angle']}°")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
