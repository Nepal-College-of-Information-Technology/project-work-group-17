# 💪 Workout & Meal Planner App

A smart, responsive **personal fitness web app**. It helps users:

✅ Calculate BMI based on height & weight  
✅ Browse and select workout plans  
✅ Browse and select meal plans  
✅ Log weekly weight progress  
✅ Visualize weight progress with charts  

---

## 🗂️ Repository Structure

```
(workout-meal-planner/)
├── backend/ # Django REST API
│ ├── manage.py
│ ├── planner/ # Main Django app
│ │ ├── models.py
│ │ ├── serializers.py
│ │ ├── views.py
│ │ ├── urls.py
│ │ └── admin.py
│ ├── backend/ # Django project settings
│ │ ├── settings.py
│ │ ├── urls.py
│ │ └── wsgi.py
│ ├── db.sqlite3
│ └── requirements.txt
├── frontend/ # React UI
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── pages/
│ │ ├── components/
│ ├── public/
│ └── package.json
├── .gitignore
└── README.md
```
---

## 🌱 Branching Strategy

Our team follows a **main + dev** branch strategy:

| Branch | Purpose |
|--------|---------|
| main   | Stable, production-ready code. Deployed when ready. |
| dev    | Active development branch. All feature work is integrated here. |

### Feature Branch Workflow

1️⃣ Always start by pulling latest `dev`:
bash
git fetch origin
git checkout dev
git pull origin dev

2️⃣ Create a feature branch:
bash
Copy
Edit
git checkout -b feature/<your-name>-<task>

3️⃣ Work on your feature → stage, commit, and push:
bash
Copy
Edit
git add .
git commit -m "feat: Implement <brief description>"
git push origin feature/<your-name>-<task>

4️⃣ Open a Pull Request (PR) against dev

5️⃣ Review and merge after approval & testing
```
🚀 Getting Started (Local Setup)
```
1️⃣ Clone & Setup
bash
Copy
Edit
git clone https://github.com/PrashannaChand/Byayamshala.git
cd Byayamshala
git checkout dev
git pull origin dev
```
```
2️⃣ Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start      # Runs on http://localhost:3000
```
```
3️⃣ Backend Setup
bash
Copy
Edit
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate    # macOS/Linux
# OR
venv\Scripts\activate       # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # Runs on http://localhost:8000
```
```
🛠️ API Endpoints
Endpoint	Method	Description
/api/workouts/	GET	List all workout plans
/api/meals/	GET	List all meal plans
/api/progress/	GET	User's weight progress
/api/progress/	POST	Add new progress entry
/api/user/	GET/POST	User data (BMI info, etc)
```
```
🏗️ Technology Stack
Frontend:

React.js (Vite or Create React App)

Axios for API calls

Chart.js or Recharts for progress visualization

Responsive design with CSS

Backend:

Django + Django REST Framework

SQLite (development) → can migrate to PostgreSQL for production
```
```
🤝 Team Members
Prashanna Chand — Backend Developer (Django REST API)

Binita Pokhrel — Frontend Developer (React)
```
```
🤝 Contributing
Create feature branches off dev for each task

Commit early, push often, and open PRs for feedback

Assign reviewers, test, and merge only after approval

Keep dev stable at all times

Merge to main only when preparing release builds

```
