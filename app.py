from flask import Flask, render_template, jsonify, request
from system import PetAdoptionSystem
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
system = PetAdoptionSystem()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/pets', methods=['GET'])
def get_pets():
    return jsonify(system.get_all_pets())

@app.route('/api/pets', methods=['POST'])
def add_pet():
    data = request.json
    required_fields = ['name', 'species', 'age', 'weight', 'personality', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    try:
        pet = system.add_pet(
            name=data['name'],
            species=data['species'],
            age=int(data['age']),
            weight=float(data['weight']),
            personality=data['personality'],
            price=float(data['price']),
            for_sale=data.get('for_sale', True),
            special_needs=data.get('special_needs', 'None')
        )
        return jsonify({"success": True, "pet": pet.to_dict()}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/pets/<pet_id>/interact', methods=['POST'])
def interact_pet(pet_id):
    data = request.json
    if 'interaction_type' not in data:
        return jsonify({"success": False, "message": "Missing interaction_type"}), 400
    
    result = system.interact_with_pet(pet_id, data['interaction_type'])
    return jsonify(result)

@app.route('/api/pets/<pet_id>/train', methods=['POST'])
def train_pet(pet_id):
    data = request.json
    if 'skill' not in data:
        return jsonify({"success": False, "message": "Missing skill"}), 400
    
    result = system.train_pet(pet_id, data['skill'])
    return jsonify(result)

@app.route('/api/pets/sample', methods=['POST'])
def generate_sample_pets():
    count = request.json.get('count', 5)
    pets = system.generate_sample_pets(count)
    return jsonify({"success": True, "count": len(pets)})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(system.get_statistics())

# --- Staff Scheduling APIs ---
@app.route('/api/staff', methods=['GET'])
def get_staff():
    return jsonify(system.get_all_staff())

@app.route('/api/staff', methods=['POST'])
def add_staff():
    data = request.json
    required_fields = ['name', 'role', 'experience', 'specialty', 'shift', 'email', 'phone', 'salary']
    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    try:
        staff = system.add_staff(
            name=data['name'],
            role=data['role'],
            experience=int(data['experience']),
            specialty=data['specialty'],
            shift=data['shift'],
            email=data['email'],
            phone=data['phone'],
            salary=float(data['salary'])
        )
        return jsonify({"success": True, "staff": staff.to_dict()}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# --- Adoption Center APIs ---
@app.route('/api/adopters', methods=['GET'])
def get_adopters():
    return jsonify(system.get_all_adopters())

@app.route('/api/adopters', methods=['POST'])
def add_adopter():
    data = request.json
    required_fields = ['name', 'email', 'phone', 'experience', 'preferred_species', 'budget', 'living_situation', 'family_size', 'has_other_pets']
    if not all(field in data for field in required_fields):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    try:
        adopter = system.add_adopter(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            experience=data['experience'],
            preferred_species=data['preferred_species'],
            budget=float(data['budget']),
            living_situation=data['living_situation'],
            family_size=int(data['family_size']),
            has_other_pets=bool(data['has_other_pets'])
        )
        return jsonify({"success": True, "adopter": adopter.to_dict()}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# --- Pet Store APIs (Placeholder) ---
@app.route('/api/store/items', methods=['GET'])
def get_store_items():
    # Return a placeholder list for now
    return jsonify([
        {"item_id": "ITEM-001", "name": "Dog Food", "price": 20.0, "stock": 50},
        {"item_id": "ITEM-002", "name": "Cat Toy", "price": 8.5, "stock": 100}
    ])

# --- Outreach Programs APIs (Placeholder) ---
@app.route('/api/outreach', methods=['GET'])
def get_outreach_programs():
    return jsonify([
        {"program_id": "OUT-001", "name": "School Visit", "date": "2025-09-10", "volunteers_needed": 5},
        {"program_id": "OUT-002", "name": "Adoption Fair", "date": "2025-09-20", "volunteers_needed": 10}
    ])

# --- Reports APIs (Placeholder) ---
@app.route('/api/reports', methods=['GET'])
def get_reports():
    stats = system.get_statistics()
    return jsonify([
        {"title": "Total Pets", "value": stats["total_pets"]},
        {"title": "Total Staff", "value": stats["total_staff"]},
        {"title": "Total Adopters", "value": stats["total_adopters"]},
        {"title": "Average Happiness", "value": f"{stats['average_happiness']}%"}
    ])

if __name__ == '__main__':
    os.makedirs('pet_adoption_data', exist_ok=True)
    app.run(debug=True)