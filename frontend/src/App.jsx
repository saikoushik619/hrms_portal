import { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';  // we'll create this next

function App() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white py-3 mb-4">
        <Container>
          <h1 className="mb-0">HRMS Lite</h1>
          <p className="mb-0 lead">Internal Employee & Attendance Management</p>
        </Container>
      </header>

      {/* Navigation Tabs */}
      <Container>
        <Nav variant="tabs" defaultActiveKey="employees" className="mb-4">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'employees'}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'attendance'}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Page Content */}
        {activeTab === 'employees' && <Employees />}
        {activeTab === 'attendance' && <Attendance />}
      </Container>
    </div>
  );
}

export default App;