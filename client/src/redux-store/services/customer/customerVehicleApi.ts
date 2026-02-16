import { apiSlice } from "../apiSlice";
import { handleApiError } from "@/lib/apiConfig";
import {
  PopulatedCustomerVehicleListResponse,
  PopulatedCustomerVehicleResponse,
  ServiceHistoryResponse,
} from "../BikeSystemApi2/AdminVehicleApi";

export const customerVehicleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get my vehicles (authenticated customer)
    getMyVehicles: builder.query<PopulatedCustomerVehicleListResponse, void>({
      query: () => `/customer-vehicles/my-vehicles`,
      extraOptions: { isCustomer: true },
      providesTags: ["CustomerVehicle"],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get customer vehicle by ID (with populated data)
    getCustomerVehicleById: builder.query<
      PopulatedCustomerVehicleResponse,
      string
    >({
      query: (vehicleId) => `/customer-vehicles/${vehicleId}`,
      extraOptions: { isCustomer: true },
      providesTags: (_result, _error, vehicleId) => [
        { type: "CustomerVehicle", id: vehicleId },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Get vehicle service history
    getVehicleServiceHistory: builder.query<ServiceHistoryResponse, string>({
      query: (vehicleId) => `/customer-vehicles/${vehicleId}/service-history`,
      extraOptions: { isCustomer: true },
      providesTags: (_result, _error, vehicleId) => [
        { type: "ServiceHistory", id: vehicleId },
      ],
      transformErrorResponse: (response) => handleApiError(response),
    }),

    // Check vehicle eligibility for services
    checkVehicleEligibility: builder.query<
      {
        success: boolean;
        data: { eligible: boolean; reasons?: string[] };
        message?: string;
      },
      { vehicleId: string; serviceType: string }
    >({
      query: ({ vehicleId, serviceType }) =>
        `/customer-vehicles/${vehicleId}/check-eligibility?serviceType=${serviceType}`,
      extraOptions: { isCustomer: true },
      transformErrorResponse: (response) => handleApiError(response),
    }),
  }),
});

// Export CUSTOMER hooks only
export const {
  useGetMyVehiclesQuery,
  useGetCustomerVehicleByIdQuery,
  useGetVehicleServiceHistoryQuery,
  useCheckVehicleEligibilityQuery,
  useLazyGetMyVehiclesQuery,
  useLazyGetCustomerVehicleByIdQuery,
  useLazyGetVehicleServiceHistoryQuery,
  useLazyCheckVehicleEligibilityQuery,
} = customerVehicleApi;
