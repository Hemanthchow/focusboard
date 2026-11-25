import { CheckCircle2, Circle, Clock } from 'lucide-react';

// Each status has its own icon and label, so colour is never the only signal.
const CONFIG = {
  'To do': { Icon: Circle, tone: 'todo' },
  'In progress': { Icon: Clock, tone: 'progress' },
  Completed: { Icon: CheckCircle2, tone: 'done' },
};

export default function StatusBadge({ status }) {
  const { Icon, tone } = CONFIG[status] ?? CONFIG['To do'];
  return (
    <span className={`chip chip--status-${tone}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  );
}
