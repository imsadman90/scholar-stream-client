import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendar,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [role, isRoleLoading] = useRole();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState(user?.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || "");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPreviewUrl(user.photoURL || "");
    }
  }, [user]);

  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime)
    : null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire("Error", "Please select an image file", "error");
        return;
      }
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "Image size should be less than 5MB", "error");
        return;
      }
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToImageBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.data.url;
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      return Swal.fire("Error", "Name is required", "error");
    }

    setLoading(true);

    try {
      let photoURL = user.photoURL;

      // Upload new photo if selected
      if (photoFile) {
        photoURL = await uploadToImageBB(photoFile);
      }

      // Update Firebase profile
      await updateUserProfile(name, photoURL);

      // Update MongoDB profile
      const { data } = await axiosSecure.patch(`/users/${user.email}`, {
        displayName: name,
        photoURL: photoURL,
      });

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Profile updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsEditing(false);
        setPhotoFile(null);
      } else {
        Swal.fire("Warning", "Profile update had issues", "warning");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.displayName || "");
    setPhotoFile(null);
    setPreviewUrl(user?.photoURL || "");
    setIsEditing(false);
  };

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-cyan-400 border-opacity-80"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                Account
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-slate-400 mt-1">
                View and update your information.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-white/10">
                    <img
                      src={
                        previewUrl ||
                        user?.photoURL ||
                        "https://i.pravatar.cc/200"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-1 cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-white backdrop-blur">
                    <FaCamera />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>

                <div className="text-center md:text-left space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs uppercase tracking-[0.2em]">
                    {role || "User"}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {user?.displayName || "User Name"}
                  </h2>
                  <p className="text-slate-300 text-sm">
                    Manage your personal details and account photo.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoTile
                  icon={<FaUser />}
                  label="Full Name"
                  value={user?.displayName || "N/A"}
                  tone="from-cyan-500/10 via-cyan-500/5"
                />
                <InfoTile
                  icon={<FaEnvelope />}
                  label="Email Address"
                  value={user?.email || "N/A"}
                  tone="from-emerald-500/10 via-emerald-500/5"
                />
                <InfoTile
                  icon={<FaUserTag />}
                  label="Role"
                  value={role || "User"}
                  tone="from-indigo-500/10 via-indigo-500/5"
                />
                <InfoTile
                  icon={<FaCalendar />}
                  label="Member Since"
                  value={
                    createdAt ? format(createdAt, "MMMM d, yyyy") : "Unknown"
                  }
                  tone="from-amber-500/10 via-amber-500/5"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {isEditing && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-white/10 text-slate-100 shadow-2xl">
              <h3 className="font-bold text-xl mb-6 text-white">
                Edit Profile
              </h3>

              <div className="space-y-5">
                <div className="form-control">
                  <label className="label">
                    <span className="text-sm text-slate-300">Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-sm text-slate-300">
                      Profile Photo
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/20 bg-white/10">
                      <img
                        src={
                          previewUrl ||
                          user?.photoURL ||
                          "https://i.pravatar.cc/200"
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="file-input file-input-bordered w-full max-w-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-action mt-8">
                <button
                  onClick={handleCancel}
                  className="btn btn-ghost text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button onClick={handleCancel}>close</button>
            </form>
          </dialog>
        )}
      </div>
    </div>
  );
};

const InfoTile = ({ icon, label, value, tone }) => (
  <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-4 shadow-lg overflow-hidden">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${tone} to-transparent pointer-events-none`}
    />
    <div className="relative flex items-start gap-3">
      <div className="text-cyan-300 text-xl mt-1">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        <p className="text-lg font-semibold text-white mt-1 break-words">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default Profile;
