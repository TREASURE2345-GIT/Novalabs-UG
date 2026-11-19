import { useAuth } from '@hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="text-purple-100">Monitor platform-wide performance and manage all content.</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <OverviewCard label="Total Schools" value="120" icon="🏫" color="bg-blue-100" />
        <OverviewCard label="Active Users" value="31.5K" icon="👥" color="bg-green-100" />
        <OverviewCard label="Experiments Run" value="156.8K" icon="🧪" color="bg-orange-100" />
        <OverviewCard label="Platform Uptime" value="99.8%" icon="✓" color="bg-green-100" />
      </div>

      {/* Key Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard
          title="Student Performance Trends"
          data={[
            { label: 'Biology', score: '85%' },
            { label: 'Chemistry', score: '78%' },
            { label: 'Physics', score: '82%' },
            { label: 'Agriculture', score: '76%' },
          ]}
        />
        <AnalyticsCard
          title="School Participation"
          data={[
            { label: 'Fully Active', score: '89 schools' },
            { label: 'Partially Active', score: '28 schools' },
            { label: 'Inactive', score: '3 schools' },
          ]}
        />
      </div>

      {/* Regional Distribution */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <RegionCard region="Central" schools={28} students="7,840" />
          <RegionCard region="Eastern" schools={22} students="6,120" />
          <RegionCard region="Northern" schools={18} students="5,040" />
          <RegionCard region="Western" schools={31} students="8,680" />
          <RegionCard region="Southwestern" schools={15} students="4,200" />
          <RegionCard region="Other" schools="6" students="1,680" />
        </div>
      </div>

      {/* Admin Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            title="User Management"
            description="Create accounts, manage roles, disable users"
            action="Manage Users"
          />
          <ActionCard
            title="Content Management"
            description="Create experiments, manage simulations, update resources"
            action="Manage Content"
          />
          <ActionCard
            title="School Administration"
            description="Register schools, manage subscriptions, view analytics"
            action="Manage Schools"
          />
          <ActionCard
            title="System Logs"
            description="View activity logs, error tracking, performance metrics"
            action="View Logs"
          />
          <ActionCard
            title="Backups & Maintenance"
            description="Schedule backups, perform maintenance, system updates"
            action="Maintenance"
          />
          <ActionCard
            title="Reports & Export"
            description="Generate reports, export data, compliance documents"
            action="Generate Reports"
          />
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="card">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function AnalyticsCard({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; score: string }>;
}) {
  return (
    <div className="card">
      <h3 className="font-bold text-lg text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <p className="text-gray-700">{item.label}</p>
            <p className="font-bold text-gray-900">{item.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionCard({
  region,
  schools,
  students,
}: {
  region: string;
  schools: number | string;
  students: string;
}) {
  return (
    <div className="card text-center">
      <p className="font-bold text-lg text-gray-900">{region}</p>
      <p className="text-2xl font-bold text-blue-600 mt-2">{schools}</p>
      <p className="text-xs text-gray-600">Schools</p>
      <p className="text-sm text-gray-700 mt-2">{students}</p>
      <p className="text-xs text-gray-600">Students</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="card hover:shadow-lg transition">
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium text-sm">
        {action}
      </button>
    </div>
  );
}
