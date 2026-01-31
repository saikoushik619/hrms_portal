import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Spinner } from 'react-bootstrap';
import api from '../api/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('employees/');
      setEmployees(res.data.data || res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load employees';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setSubmitting(true);

  try {
    const res = await api.post('employees/', formData);

    if (res.data.success) {
      setEmployees([res.data.data, ...employees]);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });

      Swal.fire({
        title: 'Success!',
        text: 'Employee added successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'center',
      });
    }
  } catch (err) {
    let userFriendlyMsg = 'Failed to add employee. Please check the details.';

    // Extract the most meaningful message from backend
    if (err.response?.status === 400) {
      const data = err.response.data;

      if (data.message && data.message !== 'Validation failed') {
        userFriendlyMsg = data.message;
      } else if (data.errors) {
        // Show first validation error (most important one)
        const firstErrorKey = Object.keys(data.errors)[0];
        const firstErrorMsg = data.errors[firstErrorKey]?.[0] || '';

        if (firstErrorMsg) {
          userFriendlyMsg = firstErrorMsg;
        } else if (data.errors.non_field_errors) {
          userFriendlyMsg = data.errors.non_field_errors[0];
        }
      }
    } else if (err.response?.data?.message) {
      userFriendlyMsg = err.response.data.message;
    }

    // Show beautiful popup with exact message
    await Swal.fire({
      title: 'Error',
      html: `<strong>${userFriendlyMsg}</strong>`,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545',
      position: 'center',
    });
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the employee and all related attendance records!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      position: 'center',
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);

    try {
      await api.delete(`employees/${id}/`);
      setEmployees(employees.filter((emp) => emp.id !== id));

      await Swal.fire({
        title: 'Deleted!',
        text: 'Employee removed successfully.',
        icon: 'success',
        timer: 2200,
        showConfirmButton: false,
        position: 'center',
      });
    } catch (err) {
      let errorMsg = 'Failed to delete employee.';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      await Swal.fire({
        title: 'Error!',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        position: 'center',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-5 text-center fw-bold text-primary">HRMS Lite - Employee Management</h1>

      {/* Add Employee Form */}
      <Card className="mb-5 shadow">
        <Card.Header as="h5" className="bg-light">
          Add New Employee
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label className="fw-medium">Employee ID (unique)</Form.Label>
                <Form.Control
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="E001, HR-001, etc."
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="fw-medium">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="fw-medium">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@company.com"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="fw-medium">Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Engineering / HR / Finance"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding Employee...
                  </>
                ) : (
                  'Add Employee'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Employee List */}
      <Card className="shadow">
        <Card.Header as="h5" className="bg-light">
          All Employees
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorAlert message={error} />
          ) : employees.length === 0 ? (
            <EmptyState message="No employees found. Add one above." />
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>Employee ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="fw-medium">{emp.employee_id}</td>
                      <td>{emp.full_name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(emp.id)}
                          disabled={deletingId === emp.id}
                        >
                          {deletingId === emp.id ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-1" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 size={16} className="me-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}