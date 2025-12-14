import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaTimesCircle, FaRedo, FaHome, FaClipboardList } from "react-icons/fa";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const applicationId = searchParams.get("application_id");

  const handleRetry = () => {
    if (applicationId) {
      navigate(`/checkout/${applicationId}`);
    } else {
      navigate("/dashboard/my-applications");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 py-20 mt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center"
          >
            <FaTimesCircle className="w-14 h-14 text-red-600" />
          </motion.div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Unfortunately, your payment could not be processed.
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="alert alert-warning mb-6 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6 mt-1"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="text-left ml-2">
            <h3 className="font-bold">Possible Reasons:</h3>
            <ul className="text-sm list-disc list-inside mt-1">
              <li>Insufficient funds</li>
              <li>Card declined by bank</li>
              <li>Incorrect card details</li>
              <li>Payment cancelled by user</li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-red-50 rounded-xl p-6 mb-6 text-sm text-red-700">
          <h3 className="font-bold mb-2">Need Help?</h3>
          <p className="mb-2">
            If you continue to experience issues, please contact your bank or
            try a different payment method.
          </p>
          <div className="flex justify-center">
            <div className="badge badge-outline">
              Support: support@scholarstream.com
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={handleRetry}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            <FaRedo className="w-5 h-5" /> Retry Payment
          </button>
          <button
            onClick={() => navigate("/dashboard/my-applications")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-600 text-red-600 font-medium hover:bg-red-50 transition"
          >
            <FaClipboardList className="w-5 h-5" /> My Applications
          </button>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost btn-sm mt-4 flex justify-center w-full"
        >
          <FaHome className="w-4 h-4 mr-1" /> Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
