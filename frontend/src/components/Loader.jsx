import Spinner from 'react-bootstrap/Spinner';

export default function Loader() {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}