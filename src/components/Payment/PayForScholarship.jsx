import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCreditCard, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const PaymentForScholarship = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState(null);

  const fetchApplicationDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/application/${id}`
      );
      setApplication(response.data);
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const paymentInfo = {
        applicationId: id,
        scholarshipName: application.scholarshipName || "Scholarship",
        universityName: application.universityName,
        degree: application.degree,
        applicationFees: application.applicationFees || 0,
        serviceCharge: application.serviceCharge || 0,
        totalAmount:
          (application.applicationFees || 0) + (application.serviceCharge || 0),
        customer: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      };

      console.log("Creating checkout session with:", paymentInfo);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        paymentInfo
      );

      console.log("Checkout session created:", data);

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-3xl font-bold mb-4">Application Not Found</h2>
        <button
          onClick={() => navigate("/dashboard/my-applications")}
          className="btn btn-primary"
        >
          Go to My Applications
        </button>
      </div>
    );
  }

  const totalAmount =
    (application.applicationFees || 0) + (application.serviceCharge || 0);

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <FaCreditCard className="text-6xl text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Payment Checkout</h1>
            <p className="text-lg text-base-content/70">
              Review your payment details before proceeding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Summary */}
            <div className="md:col-span-2 space-y-6">
              {/* Application Details */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    Application Details
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-base-300">
                      <span className="text-base-content/70">University</span>
                      <span className="font-semibold">
                        {application.universityName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-base-300">
                      <span className="text-base-content/70">Degree</span>
                      <span className="badge badge-primary">
                        {application.degree}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-base-300">
                      <span className="text-base-content/70">Category</span>
                      <span className="badge badge-secondary">
                        {application.scholarshipCategory}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-base-300">
                      <span className="text-base-content/70">Applied By</span>
                      <span className="font-semibold">
                        {application.userName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Email</span>
                      <span className="font-semibold">
                        {application.userEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">
                    Customer Information
                  </h2>

                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={user?.photoURL || "https://i.pravatar.cc/100"}
                          alt="Profile"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user?.displayName}</p>
                      <p className="text-sm text-base-content/70">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="alert alert-info">
                <FaShieldAlt className="text-2xl" />
                <div>
                  <h3 className="font-bold">Secure Payment</h3>
                  <div className="text-sm">
                    Your payment is processed securely through Stripe. We never
                    store your card details.
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <div className="card bg-gradient-to-br from-primary to-secondary text-white shadow-xl sticky top-24">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                      <span className="text-white/80">Application Fee</span>
                      <span className="font-bold text-xl">
                        ${application.applicationFees || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/20">
                      <span className="text-white/80">Service Charge</span>
                      <span className="font-bold text-xl">
                        ${application.serviceCharge || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3">
                      <span className="text-xl font-semibold">
                        Total Amount
                      </span>
                      <span className="text-3xl font-bold">${totalAmount}</span>
                    </div>
                  </div>

                  <div className="divider"></div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="btn btn-accent btn-lg w-full gap-2"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        Pay ${totalAmount}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/my-applications")}
                    className="btn btn-ghost btn-sm w-full mt-2"
                    disabled={processing}
                  >
                    Cancel
                  </button>

                  {/* Payment Methods */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-white/70 mb-3">We accept</p>
                    <div className="flex justify-center gap-3">
                      <div className="bg-white/20 px-3 py-2 rounded">
                        <span className="text-xs font-bold">VISA</span>
                      </div>
                      <div className="bg-white/20 px-3 py-2 rounded">
                        <span className="text-xs font-bold">MC</span>
                      </div>
                      <div className="bg-white/20 px-3 py-2 rounded">
                        <span className="text-xs font-bold">AMEX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="card bg-base-200 shadow">
                <div className="card-body p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-success" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-success" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-success" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentForScholarship;
