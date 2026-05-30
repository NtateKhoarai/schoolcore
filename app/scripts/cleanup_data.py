from app.database import SessionLocal
from app.models.student import Student
from app.models.result import Result

db = SessionLocal()

print("Starting data cleanup...")

# =========================
# CLEAN STUDENTS
# =========================
students = db.query(Student).all()

for s in students:

    if s.student_id:
        s.student_id = s.student_id.upper().replace(" ", "")

    if s.class_name:
        s.class_name = s.class_name.upper().replace(" ", "")

    if s.first_name:
        s.first_name = s.first_name.strip().title()

    if s.last_name:
        s.last_name = s.last_name.strip().title()

# =========================
# CLEAN RESULTS
# =========================
results = db.query(Result).all()

for r in results:

    if r.student_id:
        r.student_id = r.student_id.upper().replace(" ", "")

    if r.term:
        r.term = r.term.strip().title()

    if r.subject:
        r.subject = r.subject.strip().title()

    if r.teacher:
        r.teacher = r.teacher.strip().title()

# =========================
# SAVE CHANGES
# =========================
db.commit()

print("✅ CLEANUP COMPLETE - DATABASE IS NOW STANDARDISED")