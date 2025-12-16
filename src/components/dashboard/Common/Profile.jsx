import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaCalendar,
  FaEdit,
  FaSave,
  FaTimes,
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
      // Validate file size (max 5MB)
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
      }
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
      console.error("Update error:", err);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline btn-primary gap-2"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="avatar">
                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img
                    src={
                      previewUrl ||
                      user?.photoURL ||
                      "https://i.pravatar.cc/200"
                    }
                    alt="Profile"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">
                  {user?.displayName || "User Name"}
                </h2>
                {role && !isRoleLoading && (
                  <span className="badge badge-primary badge-lg capitalize">
                    {role}
                  </span>
                )}
              </div>
            </div>

            <div className="divider"></div>

            {/* Profile Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <FaUser className="text-2xl text-primary" />
                  <div>
                    <p className="text-sm text-base-content/60">Full Name</p>
                    <p className="font-semibold">
                      {user?.displayName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <FaEnvelope className="text-2xl text-secondary" />
                  <div>
                    <p className="text-sm text-base-content/60">
                      Email Address
                    </p>
                    <p className="font-semibold">{user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <FaUserTag className="text-2xl text-accent" />
                  <div>
                    <p className="text-sm text-base-content/60">Role</p>
                    <p className="font-semibold capitalize">
                      {isRoleLoading ? "Loading..." : role || "user"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-base-100 rounded-lg">
                  <FaCalendar className="text-2xl text-success" />
                  <div>
                    <p className="text-sm text-base-content/60">Member Since</p>
                    <p className="font-semibold">
                      {createdAt
                        ? format(createdAt, "MMMM d, yyyy")
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-6">Edit Profile</h3>

            <div className="space-y-5">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>

              {/* Photo Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Profile Photo</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-20 rounded-full ring ring-primary ring-offset-2">
                      <img
                        src={
                          previewUrl ||
                          user?.photoURL ||
                          "https://i.pravatar.cc/200"
                        }
                        alt="Preview"
                      />
                    </div>
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
              <button onClick={handleCancel} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="btn btn-primary min-w-32"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>

          {/* Backdrop click to close */}
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCancel}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Profile;
