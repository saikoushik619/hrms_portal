export default function EmptyState({ message = "No records found" }) {
  return (
    <div className="text-center py-5 text-muted">
      <p className="lead">{message}</p>
    </div>
  );
}