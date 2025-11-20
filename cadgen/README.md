# ToolsFinder CAD Generator

Parametric 3D CAD generator for cutting tool inserts based on ISO 1832 standard.

## Setup

```bash
cd cadgen
pip install -r requirements.txt
```

## Run the service

```bash
python app.py
```

Service runs on http://localhost:5001

## API Endpoints

### Generate STEP/STL file

```bash
POST /generate
Content-Type: application/json

{
  "code": "CNMG120408",
  "format": "step",  // or "stl"
  "branding": true
}
```

Returns: STEP file download

### Parse insert code

```bash
POST /parse
Content-Type: application/json

{
  "code": "CNMG120408"
}
```

Returns:
```json
{
  "code": "CNMG120408",
  "parameters": {
    "shape": "C",
    "shape_name": "Rhombus 80°",
    "ic_size_mm": 12,
    "thickness_mm": 4,
    "nose_radius_mm": 0.8,
    "clearance_angle": 0
  }
}
```

## CLI Usage

```bash
python insert_generator.py CNMG120408
python insert_generator.py TNMG160404 output.step
```

## Supported Insert Types

- **C** - 80° Rhombus (CNMG, CCMT)
- **D** - 55° Rhombus (DNMG, DCMT)
- **T** - Triangle (TNMG, TCMT)
- **V** - 35° Rhombus (VNMG, VCMT)
- **S** - Square (SNMG, SCMT)
- **W** - Trigon (WNMG)
- **R** - Round

## ISO 1832 Code Format

```
CNMG 120408
│││  │││││
│││  ││││└─ Nose radius (08 = 0.8mm)
│││  ││└└── Thickness (04 = 4.0mm)
│││  └└──── Inscribed circle (12 = 12mm)
││└──────── Type (G = with hole, chipbreaker both sides)
│└───────── Tolerance (M = ±0.08-0.18mm)
└────────── Shape (C = 80° rhombus)
```
