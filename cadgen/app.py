"""
Flask API for CAD Generation Service
Generates STEP files for cutting tool inserts
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import tempfile
import cadquery as cq
from insert_generator import generate_insert_step, generate_insert_stl, parse_insert_code

app = Flask(__name__)
CORS(app)

# Output directory for generated files
OUTPUT_DIR = tempfile.mkdtemp()


def add_toolsfinder_branding(insert, ic_size, thickness):
    """Add ToolsFinder branding text to the insert"""
    try:
        # Add engraved text on top surface
        text_size = min(ic_size * 0.15, 2)  # Max 2mm text height

        branded = (
            insert
            .faces(">Z")
            .workplane()
            .text("TF", text_size, -0.1, combine=True, font="Arial")  # Engraved 0.1mm deep
        )
        return branded
    except:
        # If text fails, return original
        return insert


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ToolsFinder CAD Generator'})


@app.route('/generate', methods=['POST'])
def generate():
    """
    Generate STEP file for an insert

    POST body:
    {
        "code": "CNMG120408",
        "format": "step" | "stl",
        "branding": true | false
    }
    """
    data = request.json

    if not data or 'code' not in data:
        return jsonify({'error': 'Insert code required'}), 400

    code = data['code']
    file_format = data.get('format', 'step').lower()
    add_branding = data.get('branding', True)

    try:
        # Parse and validate code
        params = parse_insert_code(code)

        # Generate filename
        clean_code = code.replace(' ', '_').replace('-', '_')
        extension = 'step' if file_format == 'step' else 'stl'
        filename = f"ToolsFinder_{clean_code}.{extension}"
        output_path = os.path.join(OUTPUT_DIR, filename)

        # Generate the insert with branding
        if file_format == 'step':
            generate_insert_step(code, output_path, branding=add_branding)
        else:
            generate_insert_stl(code, output_path, branding=add_branding)

        # Return the file
        return send_file(
            output_path,
            as_attachment=True,
            download_name=filename,
            mimetype='application/octet-stream'
        )

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Generation failed: {str(e)}'}), 500


@app.route('/parse', methods=['POST'])
def parse():
    """Parse insert code and return parameters"""
    data = request.json

    if not data or 'code' not in data:
        return jsonify({'error': 'Insert code required'}), 400

    try:
        params = parse_insert_code(data['code'])
        return jsonify({
            'code': data['code'],
            'parameters': {
                'shape': params['shape'],
                'shape_name': params['shape_info']['name'],
                'ic_size_mm': params['ic_size'],
                'thickness_mm': params['thickness'],
                'nose_radius_mm': params['nose_radius'],
                'clearance_angle': params['clearance_angle'],
            }
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@app.route('/preview', methods=['POST'])
def preview():
    """Generate preview data (vertices) for 3D.js rendering"""
    data = request.json

    if not data or 'code' not in data:
        return jsonify({'error': 'Insert code required'}), 400

    try:
        params = parse_insert_code(data['code'])

        # Return basic geometry data for Three.js preview
        return jsonify({
            'code': data['code'],
            'geometry': {
                'type': params['shape_info']['name'],
                'ic_size': params['ic_size'],
                'thickness': params['thickness'],
                'nose_radius': params['nose_radius'],
                'sides': params['shape_info']['sides'],
                'angle': params['shape_info']['angle'],
            }
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    print("ToolsFinder CAD Generation Service")
    print(f"Output directory: {OUTPUT_DIR}")
    app.run(host='0.0.0.0', port=5001, debug=True)
