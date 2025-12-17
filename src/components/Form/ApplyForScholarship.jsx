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
    <div className="min-h-screen bg-gray-50 py-20 px-4 mt-20">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-4">
            <FaGraduationCap className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">Apply for Scholarship</h1>
          <p className="text-gray-600 mt-2">
            Complete the form carefully before submitting
          </p>
        </motion.div>

        {/* Scholarship Summary */}
        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-xl font-bold">{scholarship.scholarshipName}</h2>
          <p className="flex items-center gap-2 text-gray-600">
            <FaUniversity />
            {scholarship.universityName}
          </p>

          <div className="grid sm:grid-cols-4 gap-4 text-sm pt-4">
            <Info label="Degree" value={scholarship.degree} />
            <Info label="Category" value={scholarship.scholarshipCategory} />
            <Info
              label="Deadline"
              value={new Date(
                scholarship.applicationDeadline
              ).toLocaleDateString()}
            />
            <Info
              label="Fee"
              value={totalFee === 0 ? "FREE" : `$${totalFee}`}
              highlight
            />
          </div>
        </div>

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
          <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Payable</p>
              <p className="text-2xl font-bold">
                {totalFee === 0 ? (
                  <span className="flex items-center gap-2 text-green-600">
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
              className="btn btn-primary btn-lg"
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
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      {icon} {title}
    </h3>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="input input-bordered w-full" />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select {...props} className="select select-bordered w-full">
      {children}
    </select>
  </div>
);

const Info = ({ label, value, highlight }) => (
  <div className="text-center">
    <p className="text-gray-500 text-xs">{label}</p>
    <p className={`font-semibold ${highlight ? "text-primary" : ""}`}>
      {value}
    </p>
  </div>
);

export default ApplyForScholarship;
