import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const SkeletonCard = () => (
  <div className="card bg-white shadow-xl dark:bg-base-100">
    <figure className="px-6 pt-6">
      <div className="rounded-xl h-48 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </figure>
    <div className="card-body">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse mb-2" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
      </div>
      <div className="card-actions mt-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
      </div>
    </div>
  </div>
);

const AllScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDegree, setFilterDegree] = useState("");
  const [sortBy, setSortBy] = useState("applicationFees");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/scholarships`,
      );
      return res.data;
    },
  });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterDegree]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto px-4 py-12 mt-20 dark:bg-base-300">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">
        All Scholarships {!isLoading && `(${filtered.length})`}
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 dark:bg-base-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by scholarship or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered"
            disabled={isLoading}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="select select-bordered"
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <option value="applicationFees">Sort: Lowest Fee First</option>
            <option value="deadline">Sort: Deadline Soonest</option>
            <option value="rank">Sort: Best Rank</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl dark:bg-base-200">
          <p className="text-2xl text-gray-600 dark:text-gray-400">
            No scholarships found
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((scholarship) => (
              <div
                key={scholarship._id}
                className="card bg-white shadow-xl hover:shadow-2xl transition dark:bg-base-100"
              >
                <figure className="px-6 pt-6">
                  <img
                    src={scholarship.universityImage}
                    alt={scholarship.universityName}
                    className="rounded-xl h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg dark:text-gray-400">
                    {scholarship.scholarshipName}
                  </h2>
                  <p className="font-semibold dark:text-gray-400">
                    {scholarship.universityName}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1 dark:text-gray-400">
                    <p className="dark:text-gray-400">
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
                        "dd MMM yyyy",
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

          <div className="flex justify-center gap-2 mt-8">
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous page
            </button>
            <button
              className="join-item btn btn-outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next page
            </button>
          </div>
          <p className="text-center mt-2 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
        </>
      )}
    </div>
  );
};

export default AllScholarships;
