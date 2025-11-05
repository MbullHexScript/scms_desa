interface PriorityBadgeProps {
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getPriorityColor = () => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-red-500 text-white';
      case 'Sedang':
        return 'bg-yellow-500 text-white';
      case 'Rendah':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor()}`}
    >
      {priority}
    </span>
  );
}
