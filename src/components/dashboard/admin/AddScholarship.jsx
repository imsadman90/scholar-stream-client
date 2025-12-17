import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          Add New Scholarship
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-xl shadow-xl p-8 max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Scholarship Name */}
            <div>
              <label className="label font-semibold mb-2">
                Scholarship Name
              </label>
              <input
                {...register("scholarshipName", { required: "Required" })}
                type="text"
                placeholder="e.g., Global Excellence Scholarship"
                className="input input-bordered w-full"
              />
              {errors.scholarshipName && (
                <span className="text-red-500 text-sm">
                  {errors.scholarshipName.message}
                </span>
              )}
            </div>

            {/* University Name */}
            <div>
              <label className="label font-semibold mb-2">
                University Name
              </label>
              <input
                {...register("universityName", { required: "Required" })}
                type="text"
                placeholder="e.g., Harvard University"
                className="input input-bordered w-full"
              />
            </div>

            {/* University Image - File Upload */}
            <div>
              <label className="label font-semibold mb-2">
                University Logo/Image
              </label>
              <input
                {...register("universityImage", {
                  // required: "Please upload an image",
                })}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />
              <small className="text-gray-500 mb-2">Or paste URL below</small>
            </div>

            {/* Or Image URL */}
            <div>
              <label className="label font-semibold mb-2">
                Or Image URL (if not uploading)
              </label>
              <input
                {...register("universityImageUrl")}
                type="url"
                placeholder="https://example.com/logo.jpg"
                className="input input-bordered w-full"
              />
            </div>

            {/* Country & City */}
            <div>
              <label className="label font-semibold mb-2">Country</label>
              <input
                {...register("universityCountry", { required: "Required" })}
                type="text"
                placeholder="USA"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label font-semibold mb-2">City</label>
              <input
                {...register("universityCity", { required: "Required" })}
                type="text"
                placeholder="Cambridge"
                className="input input-bordered w-full"
              />
            </div>

            {/* World Rank */}
            <div>
              <label className="label font-semibold mb-2">World Rank</label>
              <input
                {...register("universityWorldRank", { required: "Required" })}
                type="number"
                placeholder="1"
                className="input input-bordered w-full"
              />
            </div>

            {/* Subject Category */}
            <div>
              <label className="label font-semibold mb-2">
                Subject Category
              </label>
              <select
                {...register("subjectCategory", { required: "Required" })}
                className="select select-bordered w-full"
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
              <label className="label font-semibold mb-2">
                Scholarship Type
              </label>
              <select
                {...register("scholarshipCategory")}
                className="select select-bordered w-full"
              >
                <option>Full fund</option>
                <option>Partial</option>
                <option>Self-fund</option>
              </select>
            </div>

            {/* Degree */}
            <div>
              <label className="label font-semibold mb-2">Degree</label>
              <select
                {...register("degree")}
                className="select select-bordered w-full"
              >
                <option>Diploma</option>
                <option>Bachelor</option>
                <option>Masters</option>
                <option>PhD</option>
              </select>
            </div>

            {/* Fees */}
            <div>
              <label className="label font-semibold mb-2">
                Application Fees ($)
              </label>
              <input
                {...register("applicationFees", { required: "Required" })}
                type="number"
                step="0.01"
                placeholder="50"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label font-semibold mb-2">
                Service Charge ($)
              </label>
              <input
                {...register("serviceCharge", { required: "Required" })}
                type="number"
                step="0.01"
                placeholder="20"
                className="input input-bordered w-full"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="label font-semibold mb-2">
                Application Deadline *
              </label>
              <input
                {...register("applicationDeadline", { required: "Required" })}
                type="date"
                className="input input-bordered w-full"
              />
            </div>

            {/* Optional Fields */}
            <div>
              <label className="label font-semibold mb-2">
                Tuition Fees (Optional)
              </label>
              <input
                {...register("tuitionFees")}
                type="number"
                placeholder="50000"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label font-semibold mb-2">
                Stipend (Optional)
              </label>
              <input
                {...register("stipendAmount")}
                type="text"
                placeholder="$1500/month"
                className="input input-bordered w-full"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label font-semibold mb-2">Description</label>
              <textarea
                {...register("scholarshipDescription", {
                  required: "Required",
                })}
                rows={5}
                placeholder="Write full details..."
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary btn-wide text-lg"
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
        </form>
      </div>
    </>
  );
};

export default AddScholarship;
