import json
import os
import random
import datetime
import uuid
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum

class AdoptionStatus(Enum):
    AVAILABLE = "Available"
    PENDING = "Pending"
    ADOPTED = "Adopted"
    ON_HOLD = "On Hold"

class StaffRole(Enum):
    VETERINARIAN = "Veterinarian"
    CARETAKER = "Caretaker"
    MANAGER = "Manager"
    VOLUNTEER = "Volunteer"
    RECEPTIONIST = "Receptionist"

@dataclass
class Pet:
    name: str
    species: str
    age: int
    weight: float
    personality: str
    price: float
    for_sale: bool
    happiness: int
    training: List[str]
    special_needs: str
    adoption_status: str
    arrival_date: str
    hidden_talent: str
    pet_id: str = None

    def __post_init__(self):
        if self.pet_id is None:
            self.pet_id = f"PET-{uuid.uuid4().hex[:8].upper()}"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Pet':
        return cls(**data)

@dataclass
class Staff:
    name: str
    role: str
    experience: int
    specialty: str
    shift: str
    email: str
    phone: str
    salary: float
    staff_id: str = None

    def __post_init__(self):
        if self.staff_id is None:
            self.staff_id = f"STAFF-{uuid.uuid4().hex[:8].upper()}"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Staff':
        return cls(**data)

@dataclass
class Adopter:
    name: str
    email: str
    phone: str
    experience: str
    preferred_species: str
    budget: float
    living_situation: str
    family_size: int
    has_other_pets: bool
    adopter_id: str = None

    def __post_init__(self):
        if self.adopter_id is None:
            self.adopter_id = f"ADOPTER-{uuid.uuid4().hex[:8].upper()}"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Adopter':
        return cls(**data)

class PetAdoptionSystem:
    def __init__(self, data_dir: str = "pet_adoption_data"):
        self.data_dir = data_dir
        self.pets_file = os.path.join(data_dir, "pets.json")
        self.staff_file = os.path.join(data_dir, "staff.json")
        self.adopters_file = os.path.join(data_dir, "adopters.json")
        
        os.makedirs(data_dir, exist_ok=True)
        
        self.pets: Dict[str, Pet] = {}
        self.staff: Dict[str, Staff] = {}
        self.adopters: Dict[str, Adopter] = {}
        
        self.personality_types = [
            "Adventure Paws", "Cuddle Champion", "Zen Master",
            "Playful Spirit", "Gentle Guardian", "Curious Explorer"
        ]
        self.species_list = ["Dog", "Cat", "Rabbit", "Guinea Pig", "Bird", "Hamster", "Ferret"]
        self.hidden_talents = [
            "Painting", "Singing", "Puzzle Solving", "Yoga", "Dancing", 
            "Magic Tricks", "Photography", "Cooking", "Gardening", "Reading"
        ]
        self.training_skills = [
            "Sit", "Stay", "Roll Over", "Fetch", "Shake Hands",
            "Spin", "Play Dead", "High Five", "Dance", "Speak"
        ]
        
        self.load_data()

    def save_data(self):
        try:
            with open(self.pets_file, 'w') as f:
                json.dump({pet_id: pet.to_dict() for pet_id, pet in self.pets.items()}, f, indent=2)
            with open(self.staff_file, 'w') as f:
                json.dump({staff_id: staff.to_dict() for staff_id, staff in self.staff.items()}, f, indent=2)
            with open(self.adopters_file, 'w') as f:
                json.dump({adopter_id: adopter.to_dict() for adopter_id, adopter in self.adopters.items()}, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving data: {e}")
            return False

    def load_data(self):
        try:
            if os.path.exists(self.pets_file):
                with open(self.pets_file, 'r') as f:
                    self.pets = {pet_id: Pet.from_dict(data) for pet_id, data in json.load(f).items()}
            if os.path.exists(self.staff_file):
                with open(self.staff_file, 'r') as f:
                    self.staff = {staff_id: Staff.from_dict(data) for staff_id, data in json.load(f).items()}
            if os.path.exists(self.adopters_file):
                with open(self.adopters_file, 'r') as f:
                    self.adopters = {adopter_id: Adopter.from_dict(data) for adopter_id, data in json.load(f).items()}
        except Exception as e:
            print(f"Error loading data: {e}")

    def add_pet(self, name: str, species: str, age: int, weight: float, 
                personality: str, price: float, for_sale: bool = True,
                special_needs: str = "None") -> Pet:
        pet = Pet(
            name=name,
            species=species,
            age=age,
            weight=weight,
            personality=personality,
            price=price,
            for_sale=for_sale,
            happiness=random.randint(70, 100),
            training=[],
            special_needs=special_needs,
            adoption_status=AdoptionStatus.AVAILABLE.value,
            arrival_date=datetime.date.today().isoformat(),
            hidden_talent=random.choice(self.hidden_talents)
        )
        self.pets[pet.pet_id] = pet
        self.save_data()
        return pet

    def add_staff(self, name, role, experience, specialty, shift, email, phone, salary):
        staff = Staff(
            name=name,
            role=role,
            experience=experience,
            specialty=specialty,
            shift=shift,
            email=email,
            phone=phone,
            salary=salary
        )
        self.staff[staff.staff_id] = staff
        self.save_data()
        return staff

    def add_adopter(self, name, email, phone, experience, preferred_species, budget, living_situation, family_size, has_other_pets):
        adopter = Adopter(
            name=name,
            email=email,
            phone=phone,
            experience=experience,
            preferred_species=preferred_species,
            budget=budget,
            living_situation=living_situation,
            family_size=family_size,
            has_other_pets=has_other_pets
        )
        self.adopters[adopter.adopter_id] = adopter
        self.save_data()
        return adopter

    def get_pet(self, pet_id: str) -> Optional[Pet]:
        return self.pets.get(pet_id)

    def update_pet_happiness(self, pet_id: str, happiness_change: int) -> bool:
        if pet_id in self.pets:
            pet = self.pets[pet_id]
            pet.happiness = max(0, min(100, pet.happiness + happiness_change))
            self.save_data()
            return True
        return False

    def train_pet(self, pet_id: str, skill: str) -> Dict[str, Any]:
        if pet_id not in self.pets:
            return {"success": False, "message": "Pet not found"}
        
        pet = self.pets[pet_id]
        
        if skill in pet.training:
            return {"success": False, "message": f"{pet.name} already knows {skill}"}
        
        if skill not in self.training_skills:
            return {"success": False, "message": "Invalid training skill"}
        
        success_rate = 0.5 + (pet.happiness / 100) * 0.4
        success = random.random() < success_rate
        
        if success:
            pet.training.append(skill)
            happiness_gain = random.randint(5, 15)
            pet.happiness = min(100, pet.happiness + happiness_gain)
            self.save_data()
            return {
                "success": True, 
                "message": f"{pet.name} learned {skill}! Happiness increased by {happiness_gain}%",
                "new_happiness": pet.happiness
            }
        else:
            happiness_loss = random.randint(1, 5)
            pet.happiness = max(0, pet.happiness - happiness_loss)
            self.save_data()
            return {
                "success": False,
                "message": f"{pet.name} couldn't learn {skill} this time. Try again when happier!",
                "new_happiness": pet.happiness
            }

    def interact_with_pet(self, pet_id: str, interaction_type: str) -> Dict[str, Any]:
        if pet_id not in self.pets:
            return {"success": False, "message": "Pet not found"}
        
        pet = self.pets[pet_id]
        
        interactions = {
            "play": [
                f"{pet.name} brings you a favorite toy and wags tail excitedly! 🎾",
                f"{pet.name} playfully ignores you but watches curiously. 👀",
                f"{pet.name} does a happy dance and spins in circles! 💃"
            ],
            "treat": [
                f"{pet.name} gently takes the treat and gives you loving eyes. 🥰",
                f"{pet.name} jumps excitedly and does a trick for the treat! 🎪",
                f"{pet.name} carefully hides the treat for later. 🕵️"
            ],
            "pet": [
                f"{pet.name} purrs/makes happy sounds and leans into your hand. 😸",
                f"{pet.name} gives you a paw and looks up lovingly. 🐾",
                f"{pet.name} rolls over for belly rubs! 🤸"
            ]
        }
        
        if interaction_type not in interactions:
            return {"success": False, "message": "Invalid interaction type"}
        
        response = random.choice(interactions[interaction_type])
        happiness_gain = random.randint(3, 12)
        pet.happiness = min(100, pet.happiness + happiness_gain)
        self.save_data()
        
        return {
            "success": True,
            "response": response,
            "happiness_gain": happiness_gain,
            "new_happiness": pet.happiness
        }

    def generate_sample_pets(self, count: int = 5) -> List[Pet]:
        sample_names = ["Buddy", "Luna", "Charlie", "Bella", "Max", "Lucy", "Rocky", "Daisy"]
        pets = []
        for _ in range(count):
            pet = self.add_pet(
                name=f"{random.choice(sample_names)}-{random.randint(100, 999)}",
                species=random.choice(self.species_list),
                age=random.randint(1, 12),
                weight=round(random.uniform(5, 80), 1),
                personality=random.choice(self.personality_types),
                price=round(random.uniform(50, 500), 2),
                for_sale=random.choice([True, False]),
                special_needs=random.choice(["None", "Dietary", "Medical", "Behavioral"])
            )
            pets.append(pet)
        return pets

    def get_statistics(self) -> Dict[str, Any]:
        total_pets = len(self.pets)
        available_pets = len([p for p in self.pets.values() if p.adoption_status == AdoptionStatus.AVAILABLE.value])
        adopted_pets = len([p for p in self.pets.values() if p.adoption_status == AdoptionStatus.ADOPTED.value])
        
        avg_happiness = 0
        if total_pets > 0:
            avg_happiness = sum(pet.happiness for pet in self.pets.values()) / total_pets
        
        species_breakdown = {}
        for pet in self.pets.values():
            species_breakdown[pet.species] = species_breakdown.get(pet.species, 0) + 1
        
        return {
            "total_pets": total_pets,
            "available_pets": available_pets,
            "adopted_pets": adopted_pets,
            "pending_adoptions": total_pets - available_pets - adopted_pets,
            "average_happiness": round(avg_happiness, 1),
            "total_staff": len(self.staff),
            "total_adopters": len(self.adopters),
            "species_breakdown": species_breakdown
        }

    def get_all_pets(self) -> List[Dict[str, Any]]:
        return [pet.to_dict() for pet in self.pets.values()]

    def get_all_staff(self) -> List[Dict[str, Any]]:
        return [staff.to_dict() for staff in self.staff.values()]

    def get_all_adopters(self) -> List[Dict[str, Any]]:
        return [adopter.to_dict() for adopter in self.adopters.values()]