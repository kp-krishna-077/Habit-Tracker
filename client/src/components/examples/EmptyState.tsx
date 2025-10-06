import EmptyState from '../EmptyState';

export default function EmptyStateExample() {
  return (
    <div className="p-4 space-y-8">
      <EmptyState type="habits" onAction={() => console.log('Add habit')} />
      <EmptyState type="achievements" />
    </div>
  );
}
