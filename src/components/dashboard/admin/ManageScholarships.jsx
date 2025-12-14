// src/components/dashboard/admin/ManageScholarships.jsx
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
        updatedData
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
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Manage Scholarships
              </h1>
              <p className="text-gray-600 mt-2">
                View, edit, or remove scholarships
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-semibold text-lg shadow-md">
              Total: {scholarships.length}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="text-left">#</th>
                    <th>Scholarship</th>
                    <th>University</th>
                    <th>Category</th>
                    <th>Degree</th>
                    <th>Fee</th>
                    <th>Deadline</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s, idx) => (
                    <tr key={s._id} className="hover:bg-gray-50 transition">
                      <td className="font-medium">{idx + 1}</td>
                      <td>
                        <div className="font-semibold text-gray-800 text-md">
                          {s.scholarshipName}
                        </div>
                        <div className="text-md text-gray-500">
                          {s.subjectCategory}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          
                          <div>
                            <div className="font-medium text-md">
                              {s.universityName}
                            </div>
                            <div className="text-md text-gray-500">
                              {s.universityCity}, {s.universityCountry}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`text-center text-md font-medium ${
                            s.scholarshipCategory === "Full fund"
                              ? "text-green-500"
                              : s.scholarshipCategory === "Partial"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {s.scholarshipCategory}
                        </span>
                      </td>
                      <td>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-md font-medium">
                          {s.degree}
                        </span>
                      </td>
                      <td className="font-bold text-blue-500">
                        ${s.applicationFees}
                      </td>
                      <td className="text-md font-medium">
                        {format(new Date(s.applicationDeadline), "dd MMM yyyy")}
                      </td>
                      <td>
                        <div className="flex justify-center gap-">
                          <Link
                            to={`/scholarship-details/${s._id}`}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => setEditingScholarship(s)}
                            className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition"
                          >
                            <FaEdit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                            disabled={deleteMutation.isPending}
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setEditingScholarship(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-3xl font-bold text-gray-800">
                Edit Scholarship
              </h2>
              <button
                onClick={() => setEditingScholarship(null)}
                className="p-3 hover:bg-gray-100 rounded-full transition"
              >
                <FiX size={24} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    University Logo (Optional)
                  </label>
                  <div className="flex gap-4 items-center">
                    <img
                      src={editingScholarship.universityImage}
                      alt="Current"
                      className="w-20 h-20 rounded-xl object-cover shadow-lg"
                    />
                    <input
                      type="file"
                      name="universityImage"
                      accept="image/*"
                      className="flex-1 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  name="scholarshipDescription"
                  defaultValue={editingScholarship.scholarshipDescription}
                  rows={6}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingScholarship(null)}
                  className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition"
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
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      name={name}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
      required={!name.includes("tuition") && !name.includes("stipend")}
      {...props}
    />
  </div>
);

const Select = ({ label, name, options, defaultValue }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default ManageScholarships;
