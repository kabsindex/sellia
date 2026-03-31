type InsightStyleSet = {
  card: string;
  icon: string;
  title: string;
  text: string;
  action: string;
  button: string;
};

const insightStyles: Record<string, InsightStyleSet> = {
  indigo: {
    card: 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100',
    icon: 'bg-indigo-100 text-indigo-600',
    title: 'text-indigo-900',
    text: 'text-indigo-800',
    action: 'text-indigo-600 hover:text-indigo-800',
    button: 'text-indigo-600 border-indigo-200 hover:bg-indigo-50',
  },
  green: {
    card: 'bg-gradient-to-br from-green-50 to-white border-green-100',
    icon: 'bg-green-100 text-green-600',
    title: 'text-green-900',
    text: 'text-green-800',
    action: 'text-green-600 hover:text-green-800',
    button: 'text-green-600 border-green-200 hover:bg-green-50',
  },
  orange: {
    card: 'bg-gradient-to-br from-orange-50 to-white border-orange-100',
    icon: 'bg-orange-100 text-orange-600',
    title: 'text-orange-900',
    text: 'text-orange-800',
    action: 'text-orange-600 hover:text-orange-800',
    button: 'text-orange-600 border-orange-200 hover:bg-orange-50',
  },
  red: {
    card: 'bg-gradient-to-br from-red-50 to-white border-red-100',
    icon: 'bg-red-100 text-red-600',
    title: 'text-red-900',
    text: 'text-red-800',
    action: 'text-red-600 hover:text-red-800',
    button: 'text-red-600 border-red-200 hover:bg-red-50',
  },
};

export function getInsightColorClasses(color: string): InsightStyleSet {
  return insightStyles[color] ?? insightStyles.indigo;
}
