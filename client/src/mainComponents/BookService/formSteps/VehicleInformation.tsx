import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ServiceFormValues } from "../../../lib/form-schema";
import { useGetMyVehiclesQuery } from "@/redux-store/services/customer/customerVehicleApi";
import { IPopulatedCustomerVehicle } from "@/types/superAd_Cu.types";

interface VehicleInformationProps {
  form: UseFormReturn<ServiceFormValues>;
}

export const VehicleInformation = ({ form }: VehicleInformationProps) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = form;

  const watchedValues = watch();

  const { data: vehiclesResponse, isLoading } = useGetMyVehiclesQuery();
  const myVehicles: IPopulatedCustomerVehicle[] = vehiclesResponse?.data ?? [];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    setValue("bikeModel", vehicleId);

    const vehicle = myVehicles.find((v) => v._id === vehicleId);
    if (vehicle?.serviceStatus?.kilometers) {
      setValue("mileage", vehicle.serviceStatus.kilometers.toString());
    }
  };

  return (
    <motion.div
      key='step1'
      initial='hidden'
      animate='visible'
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      variants={fadeInUp}
      className='space-y-4'
    >
      <h3 className='text-lg font-medium'>Vehicle Information</h3>

      <div className='space-y-2'>
        <Label htmlFor='bikeModel'>Your Motorcycle</Label>
        <select
          id='bikeModel'
          value={watchedValues.bikeModel ?? ""}
          onChange={handleVehicleSelect}
          disabled={isLoading}
          className={`w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.bikeModel ? "border-red-500" : "border-input"
          }`}
        >
          <option value='' disabled>
            {isLoading ? "Loading your vehicles..." : "Select your motorcycle"}
          </option>
          {myVehicles.map((vehicle) => (
            <option key={vehicle._id} value={vehicle._id}>
              {vehicle.modelName}
            </option>
          ))}
        </select>
        {errors.bikeModel && (
          <p className='text-red-500 text-sm'>{errors.bikeModel.message}</p>
        )}
      </div>

      {isLoading && (
        <div className='flex items-center justify-center py-4'>
          <div className='animate-spin h-6 w-6 border-2 border-red-600 rounded-full border-t-transparent' />
          <span className='ml-2 text-sm text-muted-foreground'>
            Loading your vehicles...
          </span>
        </div>
      )}

      {!isLoading && myVehicles.length === 0 && (
        <div className='p-4 bg-amber-50 rounded-lg'>
          <p className='text-sm text-amber-600'>
            No vehicles found in your account. Please add a vehicle to your
            profile first.
          </p>
        </div>
      )}
    </motion.div>
  );
};
