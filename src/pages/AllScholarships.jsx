// src/pages/AllScholarships.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

import { Link } from "react-router-dom";
import { format } from "date-fns";

const AllScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDegree, setFilterDegree] = useState("");
  const [sortBy, setSortBy] = useState("applicationFees"); // default sort

  const {
    data: scholarships = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get("/scholarships");
      return res.data;
    },
  });

  // Filtering & Searching
  const filtered = scholarships
    .filter((s) => {
      const matchesSearch =
        s.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.universityName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || s.scholarshipCategory === filterCategory;
      const matchesDegree = !filterDegree || s.degree === filterDegree;
      return matchesSearch && matchesCategory && matchesDegree;
    })
    .sort((a, b) => {
      if (sortBy === "applicationFees")
        return a.applicationFees - b.applicationFees;
      if (sortBy === "deadline")
        return (
          new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
        );
      if (sortBy === "rank")
        return a.universityWorldRank - b.universityWorldRank;
      return 0;
    });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <>
      <div className="container mx-auto px-4 py-12 mt-20">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">
          All Scholarships ({filtered.length})
        </h1>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by scholarship or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered"
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select select-bordered"
            >
              <option value="">All Categories</option>
              <option>Full fund</option>
              <option>Partial</option>
              <option>Self-fund</option>
            </select>

            <select
              value={filterDegree}
              onChange={(e) => setFilterDegree(e.target.value)}
              className="select select-bordered"
            >
              <option value="">All Degrees</option>
              <option>Bachelor</option>
              <option>Masters</option>
              <option>PhD</option>
              <option>Diploma</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered"
            >
              <option value="applicationFees">Sort: Lowest Fee First</option>
              <option value="deadline">Sort: Deadline Soonest</option>
              <option value="rank">Sort: Best Rank</option>
            </select>
          </div>
        </div>

        {/* Scholarships Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-2xl text-gray-600">No scholarships found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((scholarship) => (
              <div
                key={scholarship._id}
                className="card bg-white shadow-xl hover:shadow-2xl transition"
              >
                <figure className="px-6 pt-6">
                  <img
                    src={scholarship.universityImage}
                    alt={scholarship.universityName}
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">
                    {scholarship.scholarshipName}
                  </h2>
                  <p className="font-semibold">{scholarship.universityName}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {scholarship.universityCity},{" "}
                      {scholarship.universityCountry}
                    </p>
                    <p>Rank: #{scholarship.universityWorldRank}</p>
                    <p>Degree: {scholarship.degree}</p>
                    <p className="font-bold text-primary">
                      Application Fee: ${scholarship.applicationFees}
                    </p>
                    <p>
                      Deadline:{" "}
                      {format(
                        new Date(scholarship.applicationDeadline),
                        "dd MMM yyyy"
                      )}
                    </p>
                  </div>
                  <div className="card-actions mt-4">
                    <Link
                      to={`/scholarship-details/${scholarship._id}`}
                      className="btn btn-primary w-full"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllScholarships;
