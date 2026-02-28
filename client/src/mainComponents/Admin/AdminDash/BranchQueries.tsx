import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Plus,
  Building2,
  Users,
  User,
  ArrowUpRight,
  Activity,
  Eye,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useGetBranchesQuery } from "@/redux-store/services/branchApi";
import { useGetAllBranchManagersQuery } from "@/redux-store/services/branchManagerApi";
import { Link } from "react-router-dom";
import { useGetVisitorStatsQuery } from "@/redux-store/services/visitorApi";
import RecentMotorcycles from "./RecentMotocycles";
import { useGetAllCustomersQuery } from "@/redux-store/services/customer/customerApi";

// ─── helpers ────────────────────────────────────────────────────────────────
const formatTimeAgo = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const h = Math.floor(diff / 36e5);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "Just now";
};

// ─── stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value?: number | string;
  icon: React.ElementType;
  loading?: boolean;
  description: string;
  action: { label: string; href: string };
  accent: string;
  index: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  description,
  action,
  accent,
  index,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
    className='group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300'
  >
    {/* accent bar */}
    <div
      className='absolute top-0 left-0 h-1 w-full'
      style={{ background: accent }}
    />

    {/* subtle grid texture */}
    <div
      className='absolute inset-0 opacity-[0.025] pointer-events-none'
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 20px)",
      }}
    />

    <div className='relative p-5 flex flex-col gap-4'>
      {/* header */}
      <div className='flex items-start justify-between'>
        <div
          className='flex items-center justify-center w-11 h-11 rounded-xl'
          style={{ background: `${accent}18` }}
        >
          <Icon className='w-5 h-5' style={{ color: accent }} />
        </div>

        <Link to={action.href}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors'
          >
            <ArrowUpRight className='w-3.5 h-3.5 text-gray-500' />
          </motion.div>
        </Link>
      </div>

      {/* value */}
      <div>
        <p className='text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1'>
          {title}
        </p>
        {loading ? (
          <div className='h-9 w-20 bg-gray-100 animate-pulse rounded-lg' />
        ) : value !== undefined ? (
          <p className='text-4xl font-black text-gray-900 leading-none tabular-nums'>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        ) : (
          <p className='text-sm text-gray-500 italic'>{description}</p>
        )}
        {value !== undefined && (
          <p className='text-xs text-gray-400 mt-1'>{description}</p>
        )}
      </div>

      {/* action */}
      <Link to={action.href}>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-between px-3 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all group/btn'
        >
          <span className='flex items-center gap-1.5 text-xs font-medium'>
            <Plus className='w-3 h-3' />
            {action.label}
          </span>
          <ChevronRight className='w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity' />
        </Button>
      </Link>
    </div>
  </motion.div>
);

// ─── visitor metric tile ─────────────────────────────────────────────────────
interface MetricTileProps {
  label: string;
  value: string | number;
  bg: string;
  text: string;
  sub: string;
  index: number;
}

const MetricTile = ({
  label,
  value,
  bg,
  text,
  sub,
  index,
}: MetricTileProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.35 + index * 0.07, duration: 0.4 }}
    className={`relative overflow-hidden rounded-2xl p-5 ${bg} flex flex-col justify-between min-h-[110px]`}
  >
    <p className={`text-xs font-semibold uppercase tracking-widest ${sub}`}>
      {label}
    </p>
    <p className={`text-3xl font-black tabular-nums ${text}`}>{value}</p>
  </motion.div>
);

// ─── main ────────────────────────────────────────────────────────────────────
const BranchQueries = () => {
  const { data: branchesData, isLoading: branchesLoading } =
    useGetBranchesQuery();
  const { data: branchManagersData, isLoading: managersLoading } =
    useGetAllBranchManagersQuery();
  const { data: visitorStatsData } = useGetVisitorStatsQuery();
  const { data: customersData, isLoading: customersLoading } =
    useGetAllCustomersQuery({ limit: 1 });

  const stats: Omit<StatCardProps, "index">[] = [
    {
      title: "Customers",
      value: customersData?.pagination?.total ?? 0,
      icon: User,
      loading: customersLoading,
      description: "Total registered",
      accent: "#f97316",
      action: { label: "Open Sign-up form", href: "/admin/customers/signup" },
    },
    {
      title: "Branches",
      value: branchesData?.count ?? 0,
      icon: Building2,
      loading: branchesLoading,
      description: "Service locations",
      accent: "#3b82f6",
      action: { label: "Add Branch", href: "/admin/branches/add" },
    },
    {
      title: "Branch Managers",
      value: branchManagersData?.count ?? 0,
      icon: Users,
      loading: managersLoading,
      description: "Active managers",
      accent: "#8b5cf6",
      action: { label: "Add Manager", href: "/admin/branches/managers" },
    },
    {
      title: "Value-Added Services",
      icon: TrendingUp,
      loading: false,
      description: "Activate VAS on vehicles",
      accent: "#10b981",
      action: { label: "Open VAS Manager", href: "/admin/vas/select" },
    },
    {
      title: "Stock Queries",
      icon: Activity,
      loading: false,
      description: "Vehicles in branch",
      accent: "#f59e0b",
      action: { label: "Open Stock Manager", href: "/admin/stockC/select" },
    },
  ];

  const vs = visitorStatsData?.data;
  const growth = vs?.weeklyStats?.growth ?? 0;

  return (
    <div className='space-y-8'>
      {/* ── stat cards ── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} index={i} />
        ))}
      </div>

      {/* ── visitor analytics ── */}
      {vs && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden'
        >
          {/* panel header */}
          <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
            <div className='flex items-center gap-2.5'>
              <div className='w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center'>
                <Eye className='w-4 h-4 text-orange-500' />
              </div>
              <div>
                <h3 className='text-sm font-bold text-gray-900'>
                  Visitor Analytics
                </h3>
                <p className='text-xs text-gray-400'>
                  Real-time traffic overview
                </p>
              </div>
            </div>

            {vs.lastVisit && (
              <div className='hidden sm:flex items-center gap-1.5 text-xs text-gray-400'>
                <Clock className='w-3 h-3' />
                Last visit: {formatTimeAgo(vs.lastVisit)}
              </div>
            )}
          </div>

          {/* metric tiles */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 p-6'>
            <MetricTile
              index={0}
              label='Total Visitors'
              value={vs.totalVisitors?.toLocaleString() ?? "0"}
              bg='bg-orange-50'
              text='text-orange-900'
              sub='text-orange-400'
            />
            <MetricTile
              index={1}
              label='Today'
              value={vs.todayVisitors ?? 0}
              bg='bg-blue-50'
              text='text-blue-900'
              sub='text-blue-400'
            />
            <MetricTile
              index={2}
              label='This Week'
              value={vs.weeklyStats?.thisWeek ?? 0}
              bg='bg-green-50'
              text='text-green-900'
              sub='text-green-400'
            />
            <MetricTile
              index={3}
              label='Weekly Growth'
              value={`${growth >= 0 ? "+" : ""}${growth}%`}
              bg={growth >= 0 ? "bg-emerald-50" : "bg-red-50"}
              text={growth >= 0 ? "text-emerald-900" : "text-red-900"}
              sub={growth >= 0 ? "text-emerald-400" : "text-red-400"}
            />
          </div>

          {/* bottom bar */}
          <div className='px-6 pb-4'>
            <div className='h-1.5 w-full bg-gray-100 rounded-full overflow-hidden'>
              <motion.div
                className='h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600'
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    ((vs.todayVisitors ?? 0) /
                      Math.max(vs.totalVisitors ?? 1, 1)) *
                      100 *
                      10,
                    100
                  )}%`,
                }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className='text-xs text-gray-400 mt-1.5'>
              Today's share of total traffic
            </p>
          </div>
        </motion.div>
      )}

      {/* ── recent motorcycles ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        <RecentMotorcycles />
      </motion.div>
    </div>
  );
};

export default BranchQueries;
