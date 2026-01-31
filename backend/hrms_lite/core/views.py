from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceCreateSerializer, AttendanceSerializer


class EmployeeListCreateAPIView(APIView):
    """
    GET: List all employees
    POST: Create new employee (with duplicate checks)
    """

    def get(self, request):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response({
            "success": True,
            "data": serializer.data,
            "count": employees.count()
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        # Extra safety check (although serializer already validates uniqueness)
        employee_id = serializer.validated_data['employee_id']
        email = serializer.validated_data['email']

        if employee_id and Employee.objects.filter(employee_id=employee_id).exists():
            return Response({
                "success": False,
                "message": "Employee ID already exists"
            }, status=status.HTTP_400_BAD_REQUEST)

        if Employee.objects.filter(email=email).exists():
            return Response({
                "success": False,
                "message": "Email already in use"
            }, status=status.HTTP_400_BAD_REQUEST)

        employee = serializer.save()
        return Response({
            "success": True,
            "message": "Employee created successfully",
            "data": EmployeeSerializer(employee).data
        }, status=status.HTTP_201_CREATED)


class EmployeeDeleteAPIView(APIView):
    """
    DELETE: Remove an employee by ID
    """

    def delete(self, request, id):
        employee = get_object_or_404(Employee, id=id)

        employee.delete()  # CASCADE will remove related attendances

        return Response({
            "success": True,
            "message": f"Employee {employee.full_name} ({employee.employee_id}) deleted successfully"
        }, status=status.HTTP_200_OK)


class AttendanceCreateAPIView(APIView):
    """
    POST: Mark attendance for an employee
    """

    def post(self, request):
        serializer = AttendanceCreateSerializer(data=request.data)

        if not serializer.is_valid():
            # Customize the response
            errors = serializer.errors
            first_error = next(iter(errors.values()))[0] if errors else "Invalid data"

            return Response({
                "success": False,
                "message": first_error,  # e.g. "Attendance for this date is already marked..."
            }, status=status.HTTP_400_BAD_REQUEST)

        attendance = serializer.save()

        return Response({
            "success": True,
            "message": f"Attendance marked for {attendance.employee.full_name} on {attendance.date}",
            "data": AttendanceSerializer(attendance).data
        }, status=status.HTTP_201_CREATED)
        
class EmployeeAttendanceAPIView(APIView):
    """
    GET: View all attendance records for a specific employee
    """

    def get(self, request, employee_id):
        employee = get_object_or_404(Employee, id=employee_id)

        attendances = Attendance.objects.filter(employee=employee).order_by('-date')
        serializer = AttendanceSerializer(attendances, many=True)

        return Response({
            "success": True,
            "employee": EmployeeSerializer(employee).data,
            "attendance_records": serializer.data,
            "total_records": attendances.count()
        }, status=status.HTTP_200_OK)