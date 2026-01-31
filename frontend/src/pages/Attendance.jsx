import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col, Badge, Spinner } from 'react-bootstrap';
import api from '../api/api';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: today,
    status: 'Present',
  });

  // Load employees list once
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('employees/');
        setEmployees(res.data.data || res.data || []);
      } catch (err) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to load employees list. Please check your connection.',
          icon: 'error',
          confirmButtonText: 'OK',
          position: 'center',
        });
      }
    };
    fetchEmployees();
  }, []);

  // Load attendance records when employee is selected
  useEffect(() => {
    if (!selectedEmployeeId) {
      setAttendanceRecords([]);
      return;
    }

    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`employees/${selectedEmployeeId}/attendance/`);
        setAttendanceRecords(res.data.attendance_records || []);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load attendance records';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedEmployeeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select an employee first',
        icon: 'warning',
        confirmButtonText: 'OK',
        position: 'center',
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        employee: parseInt(selectedEmployeeId),
        date: formData.date,
        status: formData.status,
      };

      const res = await api.post('attendance/', payload);

      if (res.data.success) {
        // Refresh the attendance list
        const refreshRes = await api.get(`employees/${selectedEmployeeId}/attendance/`);
        setAttendanceRecords(refreshRes.data.attendance_records || []);

        // Reset form to today's date
        setFormData({
          date: today,
          status: 'Present',
        });

        Swal.fire({
          title: 'Success!',
          text: 'Attendance marked successfully.',
          icon: 'success',
          timer: 2200,
          showConfirmButton: false,
          position: 'center',
        });
      }
    } catch (err) {
      let userMsg = 'Failed to mark attendance. Please try again.';

      // Extract the most meaningful message from backend
      if (err.response?.status === 400) {
        const data = err.response.data;

        // Priority: specific field error (duplicate date case)
        if (data.errors?.date) {
          userMsg = data.errors.date[0] || data.errors.date;
        }
        // Other field errors
        else if (data.errors?.employee) {
          userMsg = data.errors.employee[0] || 'Invalid employee selection.';
        }
        else if (data.errors?.status) {
          userMsg = data.errors.status[0] || 'Invalid status value.';
        }
        else if (data.errors?.non_field_errors) {
          userMsg = data.errors.non_field_errors[0];
        }
        // General message fallback
        else if (data.message && data.message !== 'Validation failed') {
          userMsg = data.message;
        }
      } else if (err.response?.data?.message) {
        userMsg = err.response.data.message;
      } else if (err.message) {
        userMsg = err.message;
      }

      Swal.fire({
        title: 'Cannot Mark Attendance',
        html: `<strong>${userMsg}</strong>`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        position: 'center',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePresentDays = () => {
    return attendanceRecords.filter(r => r.status === 'Present').length;
  };

  return (
    <Container>
      <h2 className="mb-4 fw-bold text-center text-primary">Attendance Management</h2>

      {/* Mark Attendance Form */}
      <Card className="mb-5 shadow">
        <Card.Header as="h5" className="bg-light">
          Mark Attendance
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="employee">
                  <Form.Label>Select Employee</Form.Label>
                  <Form.Select
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    required
                    disabled={submitting}
                  >
                    <option value="">-- Choose employee --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.employee_id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    max={today}  // ← No future dates allowed
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <div className="d-flex gap-4 mt-2">
                    <Form.Check
                      inline
                      type="radio"
                      id="present"
                      label="Present"
                      name="status"
                      value="Present"
                      checked={formData.status === 'Present'}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="absent"
                      label="Absent"
                      name="status"
                      value="Absent"
                      checked={formData.status === 'Absent'}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="success"
              type="submit"
              className="w-100"
              disabled={submitting || !selectedEmployeeId}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Marking...
                </>
              ) : (
                'Mark Attendance'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Attendance Records */}
      {selectedEmployeeId && (
        <Card className="shadow">
          <Card.Header className="d-flex justify-content-between align-items-center bg-light">
            <h5 className="mb-0">
              Attendance Records for{' '}
              <strong>
                {employees.find(e => e.id === parseInt(selectedEmployeeId))?.full_name || 'Selected Employee'}
              </strong>
            </h5>
            <Badge bg="info" className="fs-6 px-3 py-2">
              Total Present Days: {calculatePresentDays()}
            </Badge>
          </Card.Header>

          <Card.Body>
            {loading ? (
              <Loader />
            ) : error ? (
              <ErrorAlert message={error} />
            ) : attendanceRecords.length === 0 ? (
              <EmptyState message="No attendance records yet for this employee." />
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(record => (
                      <tr key={record.id}>
                        <td className="fw-medium">{record.date}</td>
                        <td>
                          {record.status === 'Present' ? (
                            <span className="text-success fw-medium">
                              <CheckCircle size={18} className="me-1" /> Present
                            </span>
                          ) : (
                            <span className="text-danger fw-medium">
                              <XCircle size={18} className="me-1" /> Absent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}