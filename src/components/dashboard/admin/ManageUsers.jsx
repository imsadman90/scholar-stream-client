import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import {
  FaUserShield,
  FaUserTie,
  FaUserGraduate,
  FaTrash,
  FaFilter,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filterRole, setFilterRole] = useState("All");

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Role updated successfully!");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await axiosSecure.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully!");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const handleRoleChange = (userId, newRole) => {
    if (newRole === users.find((u) => u._id === userId)?.role) return;

    Swal.fire({
      title: "Change Role?",
      text: `Make this user a ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRoleMutation.mutate({ userId, newRole });
      }
    });
  };

  const handleDelete = (userId, userName) => {
    Swal.fire({
      title: "Delete User?",
      text: `Permanently delete ${userName || "this user"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(userId);
      }
    });
  };

  const filteredUsers = useMemo(() => {
    if (filterRole === "All") return users;
    return users.filter((user) => user.role === filterRole);
  }, [filterRole, users]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <div className="mb-8 lg:mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
              Admin
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mt-1">
              Manage Users
            </h1>
            <p className="text-slate-400 mt-1">
              Control roles and clean up inactive accounts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="text-xs text-slate-300">Total Users</div>
              <div className="text-xl font-semibold text-white">
                {users.length}
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="text-xs text-slate-300">Filtered</div>
              <div className="text-xl font-semibold text-cyan-300">
                {filteredUsers.length}
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
              <FaFilter className="text-cyan-300" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-transparent text-slate-100 text-sm focus:outline-none"
              >
                <option className="bg-slate-900" value="All">
                  All Roles
                </option>
                <option className="bg-slate-900" value="admin">
                  Admin
                </option>
                <option className="bg-slate-900" value="moderator">
                  Moderator
                </option>
                <option className="bg-slate-900" value="student">
                  Student
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 px-4 py-3 text-sm font-semibold text-slate-300 border-b border-white/10 bg-white/5">
            <div className="col-span-4">User</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No users found</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredUsers.map((user, idx) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.02 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 hover:bg-white/5"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/15 overflow-hidden bg-white/10">
                      <img
                        src={user.photoURL || "https://i.pravatar.cc/150"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-semibold leading-tight">
                        {user.name || "Unnamed User"}
                      </p>
                      <div className="flex items-center gap-2 text-xs mt-1 text-slate-400">
                        {user.role === "admin" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                            <FaUserShield /> Admin
                          </span>
                        )}
                        {user.role === "moderator" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-400/30">
                            <FaUserTie /> Moderator
                          </span>
                        )}
                        {(!user.role || user.role === "student") && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
                            <FaUserGraduate /> Student
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4 flex items-center text-slate-200 text-sm break-all">
                    {user.email}
                  </div>

                  <div className="col-span-2 flex items-center">
                    <select
                      defaultValue={user.role || "student"}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                      disabled={updateRoleMutation.isPending}
                    >
                      <option className="bg-slate-900" value="student">
                        Student
                      </option>
                      <option className="bg-slate-900" value="moderator">
                        Moderator
                      </option>
                      <option className="bg-slate-900" value="admin">
                        Admin
                      </option>
                    </select>
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-400/40 text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 transition"
                      disabled={deleteUserMutation.isPending}
                    >
                      <FaTrash />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
