interface StatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Solved';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'In Progress':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Solved':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}
    >
      {status}
    </span>
  );
}
