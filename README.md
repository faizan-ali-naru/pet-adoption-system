# 🐾 Pet Adoption System

A modern web-based platform for managing pets, staff, adoptions, store inventory, outreach programs, and analytics.

## Features

- **Pet Management:** Register, view, interact with, and train pets.
- **Staff Scheduling:** Manage staff members and their schedules.
- **Adoption Center:** Track adopters and process adoption applications.
- **Pet Store:** View and manage store inventory.
- **Outreach Programs:** List and manage community events and programs.
- **Reports & Analytics:** View statistics and performance metrics.

## Getting Started

### Prerequisites

- Python 3.x
- Flask

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/faizan-ali-naru/pet-adoption-system.git
    cd pet-adoption-system
    ```

2. (Optional) Create a virtual environment:
    ```
    python -m venv env
    source env/bin/activate  # On Windows use `env\Scripts\activate`
    ```

3. Install the dependencies:
    ```
    pip install -r requirements.txt
    ```

4. Set up the database:
    ```
    flask db init
    flask db migrate
    flask db upgrade
    ```

5. Run the application:
    ```
    flask run
    ```

6. Access the application at `http://127.0.0.1:5000`.

## Usage

- **Register a Pet:** Navigate to the Pet Management section and fill out the registration form.
- **Schedule Staff:** Go to Staff Scheduling, select a staff member, and choose their available slots.
- **Adopt a Pet:** In the Adoption Center, view pets available for adoption and submit an application.
- **Manage Inventory:** Access the Pet Store section to add, remove, or update inventory items.
- **Outreach Events:** View upcoming events in the Outreach Programs section and register to participate.
- **View Reports:** Access the Reports & Analytics section to view various statistics and metrics.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Flask documentation
- SQLAlchemy documentation
- Jinja2 documentation
- Bootstrap documentation