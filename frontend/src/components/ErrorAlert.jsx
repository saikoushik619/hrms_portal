import Alert from 'react-bootstrap/Alert';

export default function ErrorAlert({ message }) {
  return (
    <Alert variant="danger" className="mt-3">
      {message || 'Something went wrong. Please try again.'}
    </Alert>
  );
}