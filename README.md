
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
workout-meal-planner/
├── backend/                # Django REST API
│   ├── manage.py
│   ├── planner/            # Main Django app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── backend/            # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── db.sqlite3
│   └── requirements.txt
├── frontend/               # React UI
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── pages/
│   │   ├── components/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🌱 Branching Strategy

Our team follows a **main + dev + feature branch** strategy:

| Branch      | Purpose                                           |
|-------------|---------------------------------------------------|
| main        | Stable, production-ready code. Deployed when ready |
| dev         | Integration branch for tested feature branches     |
| prashanna   | Personal branch for backend work (Prashanna)       |
| binita      | Personal branch for frontend work (Binita)         |

---

### Typical Workflow

1️⃣ Always start by pulling latest `dev`:

```bash
git fetch origin
git checkout dev
git pull origin dev
```

2️⃣ Work in your personal branch:

```bash
git checkout prashanna
# OR
git checkout binita
```

3️⃣ Make changes → commit & push:

```bash
git add .
git commit -m "feat: Implement <feature>"
git push origin <branch-name>
```

4️⃣ Create PR → merge into `dev` after testing

5️⃣ Finally, after project testing → `dev` will be merged into `main`

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone & Setup

```bash
git clone https://github.com/PrashannaChand/Byayamshala.git
cd Byayamshala
git checkout dev
git pull origin dev
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start      # Runs on http://localhost:3000
```

### 3️⃣ Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
source venv/bin/activate    # macOS/Linux
# OR
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # Runs on http://localhost:8000
```

---

## 🛠️ API Endpoints

| Endpoint         | Method   | Description              |
|------------------|----------|--------------------------|
| /api/workouts/   | GET      | List all workout plans   |
| /api/meals/      | GET      | List all meal plans      |
| /api/progress/   | GET      | User's weight progress   |
| /api/progress/   | POST     | Add new progress entry   |
| /api/user/       | GET/POST | User data (BMI info)     |

---

## 🏗️ Technology Stack

**Frontend:**
- React.js (Vite or Create React App)
- Axios for API calls
- Chart.js or Recharts for progress visualization
- Responsive design with CSS

**Backend:**
- Django + Django REST Framework
- SQLite (development) → can migrate to PostgreSQL for production

---

## 🤝 Team Members

- **Prashanna Chand** — Backend Developer (Django REST API)
- **Binita Pokhrel** — Frontend Developer (React)

---

## 🤝 Contributing

- Work on your personal branch (`prashanna` or `binita`)
- Commit early, push often, and open PRs for feedback
- Regularly merge to `dev` after testing
- Keep `dev` stable at all times
- Merge to `main` only when preparing production releases

---
