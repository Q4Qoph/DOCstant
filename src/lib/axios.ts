import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("Unauthorized!!");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let triggerTrialExpiredModal: (() => void) | null = null

export const setTrialExpiredModalTrigger = (trigger: () => void) => {
  triggerTrialExpiredModal = trigger
}

// Response interceptor to handle trial expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data

    if (
      error.response?.status === 400 &&
      typeof message === "string" &&
      message.includes("Kindly pay for your Subscription") || message.includes("Kindly Pay for your Subscription")
    ) {
      // Fire a global event so any component can listen for it
      window.dispatchEvent(new CustomEvent("show-payment-modal"))
    }

    // Check if the error indicates trial expiration (existing logic)
    if (
      error.response?.status === 402 ||
      error.response?.data?.code === "TRIAL_EXPIRED" ||
      error.response?.data?.message?.includes("trial expired")
    ) {
      // Trigger the trial expired modal
      if (triggerTrialExpiredModal) {
        triggerTrialExpiredModal()
      }
    }

    return Promise.reject(error)
  },
)

export default api;