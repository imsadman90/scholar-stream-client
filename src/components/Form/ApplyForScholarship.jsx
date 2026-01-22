import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaGraduationCap,
  FaUser,
  FaUniversity,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ApplyForScholarship = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [scholarship, setScholarship] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await axiosSecure.get(`/scholarships/${id}`);
        setScholarship(response.data);
      } catch (error) {
        toast.error("Failed to load scholarship details");
      }
    };
    if (id) fetchScholarship();
  }, [id, axiosSecure]);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    country: "",
    currentEducationLevel: "",
    institution: "",
    gpa: "",
    fieldOfStudy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const applicationData = {
        scholarshipId: scholarship._id,
        userId: user.uid,
        userName: formData.fullName,
        userEmail: user.email,
        universityName: scholarship.universityName,
        scholarshipCategory: scholarship.scholarshipCategory,
        degree: scholarship.degree,
        applicationFees: scholarship.applicationFees || 0,
        serviceCharge: scholarship.serviceCharge || 0,
        applicationStatus: "pending",
        paymentStatus: "unpaid",
        applicationDate: new Date().toISOString(),
        feedback: "",
        ...formData,
      };

      const response = await axiosSecure.post(`/application`, applicationData);

      if (response.data.insertedId) {
        toast.success("Application submitted successfully!");

        if (scholarship.applicationFees > 0 || scholarship.serviceCharge > 0) {
          navigate(`/dashboard/payment-page/${response.data.insertedId}`);
        } else {
          await axiosSecure.patch(`/application/${response.data.insertedId}`, {
            paymentStatus: "paid",
          });
          navigate("/dashboard/my-applications");
        }
      }
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const totalFee = (
    (scholarship.applicationFees || 0) + (scholarship.serviceCharge || 0)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-4 mt-20 text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white mb-4 shadow-lg shadow-cyan-500/30">
            <FaGraduationCap className="text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            Apply for Scholarship
          </h1>
          <p className="text-slate-200/80 mt-2">
            Complete the form carefully before submitting
          </p>
        </motion.div>

        {/* Scholarship Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-lg shadow-black/20"
        >
          <h2 className="text-2xl font-bold text-white">
            {scholarship.scholarshipName}
          </h2>
          <p className="flex items-center gap-2 text-slate-200/80">
            <FaUniversity />
            {scholarship.universityName}
          </p>

          <div className="grid sm:grid-cols-4 gap-4 text-sm pt-2">
            <Info label="Degree" value={scholarship.degree} />
            <Info label="Category" value={scholarship.scholarshipCategory} />
            <Info
              label="Deadline"
              value={new Date(
                scholarship.applicationDeadline,
              ).toLocaleDateString()}
            />
            <Info
              label="Fee"
              value={totalFee === 0 ? "FREE" : `$${totalFee}`}
              highlight
            />
          </div>
        </motion.div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <Section title="Personal Information" icon={<FaUser />}>
            <Input
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input name="email" label="Email" value={formData.email} readOnly />
            <Input
              name="phone"
              label="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="dateOfBirth"
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <Select
              name="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
            <Input
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Section>

          {/* Education */}
          <Section title="Educational Background" icon={<FaGraduationCap />}>
            <Select
              name="currentEducationLevel"
              label="Education Level"
              value={formData.currentEducationLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>High School</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Postgraduate</option>
            </Select>

            <Input
              name="institution"
              label="Institution"
              value={formData.institution}
              onChange={handleChange}
              required
            />
            <Input
              name="gpa"
              label="GPA / CGPA"
              value={formData.gpa}
              onChange={handleChange}
              required
            />
            <Input
              name="fieldOfStudy"
              label="Field of Study"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              required
            />
          </Section>

          {/* Submit */}
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-lg shadow-black/20">
            <div>
              <p className="text-sm text-slate-200/70">Total Payable</p>
              <p className="text-2xl font-black">
                {totalFee === 0 ? (
                  <span className="flex items-center gap-2 text-emerald-300">
                    <FaCheckCircle /> FREE
                  </span>
                ) : (
                  `$${totalFee}`
                )}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 shadow-lg shadow-black/30 transition-all disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : totalFee > 0
                  ? "Proceed to Payment"
                  : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reusable UI */
const Section = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 shadow-lg shadow-black/20"
  >
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
      {icon} {title}
    </h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </motion.div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-slate-200/90">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-slate-200/90">
      {label}
    </label>
    <select
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition cursor-pointer"
    >
      {children}
    </select>
  </div>
);

const Info = ({ label, value, highlight }) => (
  <div className="text-center bg-white/5 border border-white/10 rounded-xl p-3">
    <p className="text-slate-300 text-xs">{label}</p>
    <p
      className={`font-semibold text-white ${
        highlight ? "text-emerald-300" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

export default ApplyForScholarship;
