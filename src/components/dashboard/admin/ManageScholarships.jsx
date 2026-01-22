import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  FiX,
  FiGlobe,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from "react-icons/fi";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

const image_hosting_key = import.meta.env.VITE_IMAGEBB_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editingScholarship, setEditingScholarship] = useState(null);

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/scholarships/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["scholarships"]);
      toast.success("Scholarship deleted!");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Scholarship?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const imageFile = form.universityImage.files[0];

    try {
      let universityImageUrl = editingScholarship.universityImage;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) universityImageUrl = data.data.display_url;
      }

      const updatedData = {
        scholarshipName: form.scholarshipName.value,
        universityName: form.universityName.value,
        universityImage: universityImageUrl,
        universityCountry: form.universityCountry.value,
        universityCity: form.universityCity.value,
        universityWorldRank: parseInt(form.universityWorldRank.value),
        subjectCategory: form.subjectCategory.value,
        scholarshipCategory: form.scholarshipCategory.value,
        degree: form.degree.value,
        applicationFees: parseFloat(form.applicationFees.value),
        serviceCharge: parseFloat(form.serviceCharge.value),
        applicationDeadline: form.applicationDeadline.value,
        scholarshipDescription: form.scholarshipDescription.value,
        tuitionFees: form.tuitionFees.value
          ? parseFloat(form.tuitionFees.value)
          : null,
        stipendAmount: form.stipendAmount.value || null,
      };

      await axiosSecure.patch(
        `/scholarships/${editingScholarship._id}`,
        updatedData,
      );
      queryClient.invalidateQueries(["scholarships"]);
      queryClient.invalidateQueries(["scholarships/top"]);
      setEditingScholarship(null);
      toast.success("Scholarship updated successfully!");
    } catch (err) {
      toast.error("Image upload failed or server error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
                Admin
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Manage Scholarships
              </h1>
              <p className="text-slate-400 mt-2">
                View, edit, or remove scholarships.
              </p>
            </div>
            <div className="px-5 py-3 rounded-xl bg-white/10 border border-white/15 text-cyan-200 font-semibold shadow-lg">
              Total: {scholarships.length}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 text-slate-100">
                  <tr>
                    <th className="text-left font-semibold">#</th>
                    <th className="font-semibold">Scholarship</th>
                    <th className="font-semibold">University</th>
                    <th className="font-semibold">Category</th>
                    <th className="font-semibold">Degree</th>
                    <th className="font-semibold">Fee</th>
                    <th className="font-semibold">Deadline</th>
                    <th className="text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s, idx) => (
                    <motion.tr
                      key={s._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="hover:bg-white/5"
                    >
                      <td className="font-semibold text-slate-200">
                        {idx + 1}
                      </td>
                      <td>
                        <div className="font-semibold text-white text-md">
                          {s.scholarshipName}
                        </div>
                        <div className="text-sm text-slate-400">
                          {s.subjectCategory}
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-slate-100">
                          {s.universityName}
                        </div>
                        <div className="text-sm text-slate-400">
                          {s.universityCity}, {s.universityCountry}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                            s.scholarshipCategory === "Full fund"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                              : s.scholarshipCategory === "Partial"
                                ? "bg-amber-500/15 text-amber-200 border-amber-300/30"
                                : "bg-rose-500/15 text-rose-200 border-rose-300/30"
                          }`}
                        >
                          {s.scholarshipCategory}
                        </span>
                      </td>
                      <td>
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-100 text-xs font-semibold">
                          {s.degree}
                        </span>
                      </td>
                      <td className="font-semibold text-cyan-200">
                        ${s.applicationFees}
                      </td>
                      <td className="text-slate-200 font-medium">
                        {format(new Date(s.applicationDeadline), "dd MMM yyyy")}
                      </td>
                      <td>
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            to={`/scholarship-details/${s._id}`}
                            className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-cyan-200 text-xs font-semibold hover:border-cyan-300/50 hover:text-white transition"
                          >
                            <span className="flex items-center gap-1">
                              <Eye size={15} /> View
                            </span>
                          </Link>
                          <button
                            onClick={() => setEditingScholarship(s)}
                            className="px-3 py-2 rounded-lg bg-amber-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
                          >
                            <span className="flex items-center gap-1">
                              <FaEdit size={14} /> Edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="px-3 py-2 rounded-lg bg-rose-500/80 text-white text-xs font-semibold shadow-md hover:translate-y-[-1px] transition"
                            disabled={deleteMutation.isPending}
                          >
                            <span className="flex items-center gap-1">
                              <FaTrash size={14} /> Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Edit Modal with Blur */}
      {editingScholarship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setEditingScholarship(null)}
          />

          {/* Modal */}
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white/5 border-b border-white/10 px-8 py-6 flex justify-between items-center rounded-t-3xl backdrop-blur-lg">
              <h2 className="text-2xl font-semibold text-white">
                Edit Scholarship
              </h2>
              <button
                onClick={() => setEditingScholarship(null)}
                className="p-3 hover:bg-white/10 rounded-full transition"
              >
                <FiX size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Scholarship Name *"
                  name="scholarshipName"
                  defaultValue={editingScholarship.scholarshipName}
                />
                <Input
                  label="University Name *"
                  name="universityName"
                  defaultValue={editingScholarship.universityName}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-200 mb-3">
                    University Logo (Optional)
                  </label>
                  <div className="flex gap-4 items-center">
                    <img
                      src={editingScholarship.universityImage}
                      alt="Current"
                      className="w-20 h-20 rounded-xl object-cover shadow-lg border border-white/10"
                    />
                    <input
                      type="file"
                      name="universityImage"
                      accept="image/*"
                      className="flex-1 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-emerald-500 file:text-slate-950 text-sm rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Leave empty to keep current image
                  </p>
                </div>

                <Input
                  label={
                    <>
                      <FiGlobe className="inline mr-2" /> Country *
                    </>
                  }
                  name="universityCountry"
                  defaultValue={editingScholarship.universityCountry}
                />
                <Input
                  label={
                    <>
                      <FiMapPin className="inline mr-2" /> City *
                    </>
                  }
                  name="universityCity"
                  defaultValue={editingScholarship.universityCity}
                />
                <Input
                  label="World Rank *"
                  name="universityWorldRank"
                  type="number"
                  defaultValue={editingScholarship.universityWorldRank}
                />
                <Input
                  label="Subject Category *"
                  name="subjectCategory"
                  defaultValue={editingScholarship.subjectCategory}
                />

                <Select
                  label="Scholarship Type"
                  name="scholarshipCategory"
                  options={["Full fund", "Partial", "Self-fund"]}
                  defaultValue={editingScholarship.scholarshipCategory}
                />
                <Select
                  label="Degree"
                  name="degree"
                  options={["Diploma", "Bachelor", "Masters", "PhD"]}
                  defaultValue={editingScholarship.degree}
                />

                <Input
                  label={
                    <>
                      <FiDollarSign className="inline mr-2" /> Application Fee
                      ($)*
                    </>
                  }
                  name="applicationFees"
                  type="number"
                  step="0.01"
                  defaultValue={editingScholarship.applicationFees}
                />
                <Input
                  label={
                    <>
                      <FiDollarSign className="inline mr-2" /> Service Charge
                      ($)*
                    </>
                  }
                  name="serviceCharge"
                  type="number"
                  step="0.01"
                  defaultValue={editingScholarship.serviceCharge}
                />
                <Input
                  label={
                    <>
                      <FiCalendar className="inline mr-2" /> Deadline *
                    </>
                  }
                  name="applicationDeadline"
                  type="date"
                  defaultValue={
                    editingScholarship.applicationDeadline.split("T")[0]
                  }
                />
                <Input
                  label="Tuition Fees (Optional)"
                  name="tuitionFees"
                  type="number"
                  defaultValue={editingScholarship.tuitionFees || ""}
                  placeholder="Leave blank if none"
                />
                <Input
                  label="Stipend (Optional)"
                  name="stipendAmount"
                  defaultValue={editingScholarship.stipendAmount || ""}
                  placeholder="e.g. $1500/month"
                  className="md:col-span-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-3">
                  Description *
                </label>
                <textarea
                  name="scholarshipDescription"
                  defaultValue={editingScholarship.scholarshipDescription}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none transition resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingScholarship(null)}
                  className="px-6 py-3 rounded-xl border border-white/15 text-slate-100 hover:border-rose-400/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Reusable Input & Select Components
const Input = ({ label, name, className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-slate-200 mb-2">
      {label}
    </label>
    <input
      name={name}
      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
      required={!name.includes("tuition") && !name.includes("stipend")}
      {...props}
    />
  </div>
);

const Select = ({ label, name, options, defaultValue }) => (
  <div>
    <label className="block text-sm font-medium text-slate-200 mb-2">
      {label}
    </label>
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default ManageScholarships;
