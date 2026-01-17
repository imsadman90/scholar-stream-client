import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import {
  FaUserShield,
  FaUserTie,
  FaUserGraduate,
  FaTrash,
} from "react-icons/fa";
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

  const filteredUsers =
    filterRole === "All"
      ? users
      : users.filter((user) => user.role === filterRole);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-400">
          Manage Users{" "}
          <span className="text-3xl font-normal text-gray-600">
            ({users.length})
          </span>
        </h1>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow dark:bg-base-200 dark:border dark:border-gray-500">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700 dark:bg-base-200">
              <th className="px-6 py-4 dark:text-gray-400">User</th>
              <th className="px-6 py-4 dark:text-gray-400">Email</th>
              <th className="px-6 py-4 dark:text-gray-400">Role</th>
              <th className="px-6 py-4 text-center dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition dark:hover:bg-base-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-7 h-7">
                          <img
                            src={user.photoURL || "https://i.pravatar.cc/150"}
                            alt={user.name}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={user.role || "student"}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="select select-sm select-bordered w-32"
                      disabled={updateRoleMutation.isPending}
                    >
                      <option value="student">Student</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="btn text-red-500 border-none"
                      disabled={deleteUserMutation.isPending}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
