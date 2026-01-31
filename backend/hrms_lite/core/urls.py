from django.urls import path
from .views import (
    EmployeeListCreateAPIView,
    EmployeeDeleteAPIView,
    AttendanceCreateAPIView,
    EmployeeAttendanceAPIView,
)

urlpatterns = [
    # Employees
    path('employees/', EmployeeListCreateAPIView.as_view(), name='employees-list-create'),
    path('employees/<int:id>/', EmployeeDeleteAPIView.as_view(), name='employee-delete'),

    # Attendance
    path('attendance/', AttendanceCreateAPIView.as_view(), name='attendance-create'),
    path('employees/<int:employee_id>/attendance/', EmployeeAttendanceAPIView.as_view(), name='employee-attendance'),
]