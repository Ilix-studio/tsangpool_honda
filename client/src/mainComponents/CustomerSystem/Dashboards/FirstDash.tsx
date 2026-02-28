import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bike,
  Tag,
  UserPlus,
  AlertCircle,
  Shield,
  ChevronRight,
  List,
} from "lucide-react";
import { useGetMyVehiclesQuery } from "@/redux-store/services/customer/customerVehicleApi";
import { IPopulatedCustomerVehicle } from "@/types/superAd_Cu.types";

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ vehicle }: { vehicle: IPopulatedCustomerVehicle }) {
  const navigate = useNavigate();

  const stock = vehicle.stockConcept;
  const modelName = stock?.modelName ?? "Unknown Model";
  const category = stock?.category ?? "—";
  const color = stock?.color ?? "—";
  const variant = stock?.variant ?? "";
  const year = stock?.yearOfManufacture ?? "—";

  const vasCount = vehicle.activeValueAddedServices?.filter(
    (s) => s.isActive
  ).length;

  return (
    <div
      className='bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-red-300 hover:shadow-sm transition-all'
      onClick={() => navigate(`/customer/vehicle/${vehicle._id}`)}
    >
      <div className='flex items-center gap-3'>
        <div className='w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0'>
          <Bike className='w-4 h-4 text-red-600' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='font-semibold text-gray-900 text-sm truncate'>
            {modelName}
          </p>
          <p className='text-xs text-gray-500 truncate'>
            {category} · {color}
            {variant ? ` · ${variant}` : ""} · {year}
          </p>
        </div>
        <ChevronRight className='w-4 h-4 text-gray-400 shrink-0' />
      </div>

      <div className='mt-3 flex flex-wrap gap-1.5'>
        {vehicle.numberPlate && (
          <span className='bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-mono'>
            {vehicle.numberPlate}
          </span>
        )}
        {vehicle.insurance && (
          <span className='bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1'>
            <Shield className='w-3 h-3' /> Insured
          </span>
        )}
        {vasCount > 0 && (
          <span className='bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded font-medium'>
            {vasCount} VAS Active
          </span>
        )}
        {vehicle.isPaid && (
          <span className='bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded font-medium'>
            Paid
          </span>
        )}
        {vehicle.isFinance && (
          <span className='bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded font-medium'>
            Finance
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Action Card ──────────────────────────────────────────────────────────────

function ActionCard({
  icon: Icon,
  label,
  description,
  to,
  iconBg,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  to: string;
  iconBg: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className='w-full h-full flex flex-col items-start gap-3 bg-white border border-gray-200 rounded-lg p-5 hover:border-red-300 hover:shadow-sm transition-all text-left group'
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
      >
        <Icon className='w-5 h-5' />
      </div>
      <div>
        <p className='font-semibold text-gray-900 text-sm group-hover:text-red-600 transition-colors'>
          {label}
        </p>
        <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>
          {description}
        </p>
      </div>
    </button>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTION_CARDS = [
  {
    icon: UserPlus,
    label: "Initialize with new vehicle",
    description: "Update customer details with a new vehicle",
    to: "/customer/initialize",
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    icon: Tag,
    label: "Attach Stickers",
    description: "Assign Scanfleet safety stickers to a vehicle",
    to: "/customer/attach-stickers",
    iconBg: "bg-purple-50 text-purple-600",
  },
] as const;

// ─── Main ─────────────────────────────────────────────────────────────────────

type Tab = "vehicles" | "actions";

export default function FirstDash() {
  const [activeTab, setActiveTab] = useState<Tab>("vehicles");

  const { data, isFetching, isError } = useGetMyVehiclesQuery();

  const vehicles = data?.data ?? [];
  const hasVehicles = !isFetching && vehicles.length > 0;
  const noVehicles = !isFetching && vehicles.length === 0;

  const effectiveTab: Tab = noVehicles ? "actions" : activeTab;

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <div className='flex-1 px-6 py-5'>
        {/* Tab bar */}
        <div className='flex border-b border-gray-200 mb-5'>
          {hasVehicles && (
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 -mb-px transition-colors ${
                effectiveTab === "vehicles"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Vehicles
              <span className='ml-1.5 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold'>
                {vehicles.length}
              </span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("actions")}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 -mb-px transition-colors ${
              effectiveTab === "actions"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Actions
          </button>
        </div>

        {/* Alerts */}
        {isError && (
          <div className='bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-700 flex items-center gap-2'>
            <AlertCircle className='w-4 h-4 shrink-0' />
            Failed to fetch vehicles. Please try again.
          </div>
        )}

        {noVehicles && !isError && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 text-sm text-yellow-800 flex items-center gap-2'>
            <AlertCircle className='w-4 h-4 shrink-0' />
            No active vehicles found. Use the actions below to get started.
          </div>
        )}

        {/* Vehicles tab */}
        {effectiveTab === "vehicles" && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              {isFetching &&
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='bg-white border border-gray-200 rounded-lg p-4 animate-pulse'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-9 h-9 rounded-full bg-gray-100 shrink-0' />
                      <div className='flex-1 space-y-2'>
                        <div className='h-3.5 bg-gray-100 rounded w-3/4' />
                        <div className='h-3 bg-gray-100 rounded w-1/2' />
                      </div>
                    </div>
                  </div>
                ))}

              {!isFetching &&
                vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}

              {!isFetching && vehicles.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center text-gray-400'>
                  <List className='w-8 h-8 mb-2 opacity-30' />
                  <p className='text-xs'>No vehicles found</p>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-4'>
              {ACTION_CARDS.map((card) => (
                <ActionCard key={card.to} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* Actions tab */}
        {effectiveTab === "actions" && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {ACTION_CARDS.map((card) => (
              <ActionCard key={card.to} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
