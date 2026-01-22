import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const image_hosting_key = import.meta.env.VITE_IMAGEBB_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddScholarship = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (scholarshipData) => {
      const res = await axiosSecure.post("/scholarships", scholarshipData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Scholarship added successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["scholarships/top"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add scholarship");
    },
  });

  const onSubmit = async (data) => {
    const imageFile = data.universityImage[0];

    try {
      let universityImageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgRes = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });
        const imgData = await imgRes.json();
        universityImageUrl = imgData.data.display_url;
      }

      const scholarshipData = {
        scholarshipName: data.scholarshipName,
        universityName: data.universityName,
        universityImage: universityImageUrl || data.universityImageUrl,
        universityCountry: data.universityCountry,
        universityCity: data.universityCity,
        universityWorldRank: parseInt(data.universityWorldRank),
        subjectCategory: data.subjectCategory,
        scholarshipCategory: data.scholarshipCategory,
        degree: data.degree,
        tuitionFees: data.tuitionFees ? parseFloat(data.tuitionFees) : null,
        applicationFees: parseFloat(data.applicationFees),
        serviceCharge: parseFloat(data.serviceCharge),
        applicationDeadline: data.applicationDeadline,
        scholarshipDescription: data.scholarshipDescription,
        stipendAmount: data.stipendAmount || null,
        scholarshipPostDate: new Date().toISOString(),
        postedUserEmail: user?.email,
      };

      await mutateAsync(scholarshipData);
    } catch (err) {
      toast.error("Image upload failed or server error");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
              Admin
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              Add New Scholarship
            </h1>
            <p className="text-slate-400 mt-2">
              Publish scholarships with complete details, fees, and deadlines.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Scholarship Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Scholarship Name
                </label>
                <input
                  {...register("scholarshipName", { required: "Required" })}
                  type="text"
                  placeholder="Global Excellence Scholarship"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
                {errors.scholarshipName && (
                  <span className="text-rose-400 text-xs">
                    {errors.scholarshipName.message}
                  </span>
                )}
              </div>

              {/* University Name */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  University Name
                </label>
                <input
                  {...register("universityName", { required: "Required" })}
                  type="text"
                  placeholder="Harvard University"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* University Image - File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  University Logo/Image
                </label>
                <input
                  {...register("universityImage", {})}
                  type="file"
                  accept="image/*"
                  className="w-full file:mr-3 file:rounded-md file:border-0 file:px-4 file:py-2 file:bg-gradient-to-r file:from-cyan-500 file:to-emerald-500 file:text-slate-950 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none"
                />
                <small className="text-slate-400">Or paste URL below</small>
              </div>

              {/* Or Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Image URL (optional)
                </label>
                <input
                  {...register("universityImageUrl")}
                  type="url"
                  placeholder="https://example.com/logo.jpg"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* Country & City */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Country
                </label>
                <input
                  {...register("universityCountry", { required: "Required" })}
                  type="text"
                  placeholder="USA"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  City
                </label>
                <input
                  {...register("universityCity", { required: "Required" })}
                  type="text"
                  placeholder="Cambridge"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* World Rank */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  World Rank
                </label>
                <input
                  {...register("universityWorldRank", { required: "Required" })}
                  type="number"
                  placeholder="1"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* Subject Category */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Subject Category
                </label>
                <select
                  {...register("subjectCategory", { required: "Required" })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                >
                  <option value="">Select Subject</option>
                  {[
                    "Computer Science",
                    "Engineering",
                    "Business",
                    "Medicine",
                    "Law",
                    "Arts",
                    "Science",
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                  ].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scholarship Category */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Scholarship Type
                </label>
                <select
                  {...register("scholarshipCategory")}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                >
                  <option>Full fund</option>
                  <option>Partial</option>
                  <option>Self-fund</option>
                </select>
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Degree
                </label>
                <select
                  {...register("degree")}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                >
                  <option>Diploma</option>
                  <option>Bachelor</option>
                  <option>Masters</option>
                  <option>PhD</option>
                </select>
              </div>

              {/* Fees */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Application Fees ($)
                </label>
                <input
                  {...register("applicationFees", { required: "Required" })}
                  type="number"
                  step="0.01"
                  placeholder="50"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Service Charge ($)
                </label>
                <input
                  {...register("serviceCharge", { required: "Required" })}
                  type="number"
                  step="0.01"
                  placeholder="20"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Application Deadline *
                </label>
                <input
                  {...register("applicationDeadline", { required: "Required" })}
                  type="date"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* Optional Fields */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Tuition Fees (Optional)
                </label>
                <input
                  {...register("tuitionFees")}
                  type="number"
                  placeholder="50000"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Stipend (Optional)
                </label>
                <input
                  {...register("stipendAmount")}
                  type="text"
                  placeholder="$1500/month"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  {...register("scholarshipDescription", {
                    required: "Required",
                  })}
                  rows={5}
                  placeholder="Write full details..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/30 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:translate-y-[-1px] transition"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Adding Scholarship...
                  </>
                ) : (
                  "Add Scholarship"
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
};

export default AddScholarship;
