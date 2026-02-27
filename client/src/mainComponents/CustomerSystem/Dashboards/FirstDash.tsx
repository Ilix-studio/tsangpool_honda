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
import { useGetVehiclesByPhoneQuery } from "@/redux-store/services/customer/customerVehicleApi";
import { useAuthForCustomer } from "@/hooks/useAuthforCustomer";
import { IPopulatedCustomerVehicle } from "@/types/superAd_Cu.types";

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ vehicle }: { vehicle: IPopulatedCustomerVehicle }) {
  const navigate = useNavigate();

  const modelName =
    vehicle.stockConcept?.bikeInfo?.modelName ?? vehicle.modelName ?? "Unknown Model";
  const category = vehicle.stockConcept?.bikeInfo?.category ?? "—";
  const color = vehicle.stockConcept?.bikeInfo?.color ?? vehicle.color ?? "—";
  const year = vehicle.stockConcept?.bikeInfo?.yearOfManufacture ?? "—";
  const serviceType = vehicle.serviceStatus?.serviceType ?? "—";

  const serviceColor: Record<string, string> = {
    "Up to Date": "bg-green-100 text-green-700",
    "Due Soon": "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
    Regular: "bg-blue-100 text-blue-700",
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-red-300 hover:shadow-sm transition-all"
      onClick={() => navigate(`/admin/customer-vehicle/${vehicle._id}`)}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <Bike className="w-4 h-4 text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{modelName}</p>
          <p className="text-xs text-gray-500 truncate">
            {category} · {color} · {year}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {vehicle.numberPlate && (
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded font-mono">
            {vehicle.numberPlate}
          </span>
        )}
        <span
          className={`text-xs px-2 py-0.5 rounded font-medium ${
            serviceColor[serviceType] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {serviceType}
        </span>
        {vehicle.insurance && (
          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Shield className="w-3 h-3" /> Insured
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
      className="w-full h-full flex flex-col items-start gap-3 bg-white border border-gray-200 rounded-lg p-5 hover:border-red-300 hover:shadow-sm transition-all text-left group"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm group-hover:text-red-600 transition-colors">
          {label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
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

type Tab = "tab1" | "tab2";

export default function FirstDash() {
  const { customer } = useAuthForCustomer();

  // Auto-seed from logged-in customer; admin can override with manual search

  const [committedPhone, ] = useState(
    customer?.phoneNumber ?? ""
  );
  const [activeTab, setActiveTab] = useState<Tab>("tab1");


  

  // Fires immediately on mount if customer.phoneNumber is available
  const { data, isFetching, isError } = useGetVehiclesByPhoneQuery(
    committedPhone,
    { skip: committedPhone.length === 0 }
  );

  const hasVehicles =
    committedPhone.length > 0 &&
    !isFetching &&
    data?.customerFound &&
    (data?.count ?? 0) > 0;

  const noVehicles =
    committedPhone.length > 0 &&
    !isFetching &&
    (!data?.customerFound || (data?.count ?? 0) === 0);

  // Lock to Tab 2 when no vehicles found
  const effectiveTab: Tab = noVehicles ? "tab2" : activeTab;





  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

  

      <div className="flex-1 px-6 py-5">

        {/* ── Tab bar — hidden Tab 1 when no vehicles ── */}
        <div className="flex border-b border-gray-200 mb-5">
          {/* Tab 1 only rendered when there are vehicles */}
          {hasVehicles && (
            <button
              onClick={() => setActiveTab("tab1")}
              className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 -mb-px transition-colors ${
                effectiveTab === "tab1"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Vehicles
              <span className="ml-1.5 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                {data?.count}
              </span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("tab2")}
            className={`flex-1 py-2.5 text-sm font-medium text-center border-b-2 -mb-px transition-colors ${
              effectiveTab === "tab2"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Actions
          </button>
        </div>

        {/* ── Alerts ── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Failed to fetch. Please try again.
          </div>
        )}

        {noVehicles && data && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4 text-sm text-yellow-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {data.customerFound
              ? `Customer (${committedPhone}) has no active vehicles.`
              : `No customer found for ${committedPhone}.`}{" "}
            Showing actions below.
          </div>
        )}

        {/* ── Tab 1: vehicles (left) + action cards (right) ── */}
        {effectiveTab === "tab1" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Left: vehicle list */}
            <div className="space-y-3">
              {isFetching &&
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}

              {!isFetching && hasVehicles &&
                data?.data.map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}

              {!isFetching && committedPhone.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                  <List className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">No phone number available</p>
                </div>
              )}
            </div>

            {/* Right: action cards */}
            <div className="flex flex-col gap-4">
              {ACTION_CARDS.map((card) => (
                <ActionCard key={card.to} {...card} />
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 2: two action cards side by side ── */}
        {effectiveTab === "tab2" && (
          <div className="grid grid-cols-2 gap-4">
            {ACTION_CARDS.map((card) => (
              <ActionCard key={card.to} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}