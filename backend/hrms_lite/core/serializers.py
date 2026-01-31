from rest_framework import serializers
from .models import Employee, Attendance

from datetime import date

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department']

    def validate_employee_id(self, value):
        # This runs during is_valid() — blocks duplicates even on update (though we don't have update)
        if Employee.objects.filter(employee_id=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("Employee ID already exists.")
        return value

    def validate_email(self, value):
        if Employee.objects.filter(email=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("Email already in use.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'date', 'status']
        read_only_fields = ['id']


class AttendanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['employee', 'date', 'status']

    def validate_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Future dates are not allowed for attendance marking.")
        return value
    
    def validate(self, data):
        employee = data['employee']
        date = data['date']

        if Attendance.objects.filter(employee=employee, date=date).exists():
            raise serializers.ValidationError(
                {
                    "date": "Attendance for this date is already marked. You cannot mark it again."
                }
            )

        return data