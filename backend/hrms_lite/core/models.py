from django.db import models

# Create your models here.
# core/models.py

from django.db import models


class Employee(models.Model):
    """
    Employee record with exactly the fields mentioned:
    - Employee ID (unique)
    - Full Name
    - Email Address (valid format via EmailField)
    - Department
    """
    employee_id = models.CharField(
        max_length=50,  # reasonable length, adjustable if needed
        unique=True,
        help_text="Unique Employee ID"
    )
    full_name = models.CharField(
        max_length=100,
        help_text="Full Name"
    )
    email = models.EmailField(
        help_text="Email Address (must be valid format)"
    )
    department = models.CharField(
        max_length=100,
        help_text="Department"
    )

    def __str__(self):
        return f"{self.full_name} ({self.employee_id})"

    class Meta:
        ordering = ['full_name']


class Attendance(models.Model):
    """
    Attendance record for an employee with:
    - Date
    - Status (Present / Absent)
    Linked to Employee via ForeignKey.
    """
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendances'
    )
    date = models.DateField(
        help_text="Date of attendance"
    )
    status = models.CharField(
        max_length=10,
        choices=[('Present', 'Present'), ('Absent', 'Absent')],
        help_text="Status: Present or Absent"
    )

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"

    class Meta:
        unique_together = ['employee', 'date']  # Prevent duplicate attendance per day per employee
        ordering = ['-date']