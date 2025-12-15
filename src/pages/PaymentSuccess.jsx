import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Receipt, Home, LayoutDashboard } from "lucide-react";
import axios from "axios";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  const applicationId = searchParams.get("application_id");

  useEffect(() => {
    updatePaymentStatus();
  }, [applicationId]);

  const updatePaymentStatus = async () => {
    if (!applicationId) {
      setLoading(false);
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/application/${applicationId}`,
        { paymentStatus: "paid" }
      );
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/application/${applicationId}`
      );
      setApplication(res.data);
    } catch (err) {
      console.error("Payment update failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const totalPaid =
    (application?.applicationFees || 0) + (application?.serviceCharge || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-20 mt-20">
      <Confetti width={width} height={height} recycle={false} gravity={0.25} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <CheckCircle className="w-14 h-14 text-emerald-600" />
          </motion.div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">
            Payment Successful
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Your scholarship application has been submitted successfully. We’re
            excited to support your academic journey 🎓
          </p>
        </div>

        {/* Application Details */}
        {application && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-lg">Payment Summary</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">University</span>
                <span className="font-medium">
                  {application.universityName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Degree</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {application.degree}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-gray-500">Application Fee</span>
                <span>${application.applicationFees || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Charge</span>
                <span>${application.serviceCharge || 0}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-semibold">
                <span>Total Paid</span>
                <span className="text-emerald-600">${totalPaid}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          Our team will review your application shortly. You’ll receive updates
          via email once the review process starts.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/dashboard/my-applications")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            <LayoutDashboard className="w-5 h-5" />
            My Applications
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-50 transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
