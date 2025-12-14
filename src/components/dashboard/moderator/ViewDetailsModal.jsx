import {
  FaEye,
  FaUser,
  FaEnvelope,
  FaGraduationCap,
  FaUniversity,
  FaCalendar,
  FaDollarSign,
  FaComment,
} from "react-icons/fa";

const ViewDetailsModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application)
    return null;

  return (
    <div className="modal modal-open fixed  items-start pt-10 inset-0 flex justify-center">
      <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-2xl mb-6 flex items-center gap-2">
          <FaEye className="text-primary" />
          Application Details
        </h3>

        <div className="space-y-6 z-50">
          {/* Applicant Information */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaUser className="text-primary" />
              Applicant Information
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm opacity-70">Full Name</p>
                <p className="font-semibold">{application.userName}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Email</p>
                <p className="font-semibold flex items-center gap-1">
                  <FaEnvelope className="text-xs" />
                  {application.userEmail}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Phone</p>
                <p className="font-semibold">{application.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Address</p>
                <p className="font-semibold">{application.address || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Scholarship Information */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaGraduationCap className="text-primary" />
              Scholarship Information
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm opacity-70">University</p>
                <p className="font-semibold flex items-center gap-1">
                  <FaUniversity className="text-xs" />
                  {application.universityName}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Subject/Category</p>
                <p className="font-semibold">
                  {application.scholarshipCategory}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Degree</p>
                <div className="badge badge-primary">{application.degree}</div>
              </div>
              <div>
                <p className="text-sm opacity-70">Application Deadline</p>
                <p className="font-semibold flex items-center gap-1">
                  <FaCalendar className="text-xs" />
                  {application.applicationDeadline || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <FaDollarSign className="text-primary" />
              Financial Information
            </h4>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <p className="text-sm opacity-70">Application Fees</p>
                <p className="font-semibold">
                  ${application.applicationFees || 0}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Service Charge</p>
                <p className="font-semibold">
                  ${application.serviceCharge || 0}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Total Amount</p>
                <p className="font-bold text-lg text-primary">
                  $
                  {(application.applicationFees || 0) +
                    (application.serviceCharge || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-3">Status & Timeline</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm opacity-70">Application Status</p>
                <div
                  className={`badge badge-lg ${
                    application.applicationStatus === "completed"
                      ? "badge-success"
                      : application.applicationStatus === "rejected"
                      ? "badge-error"
                      : application.applicationStatus === "processing"
                      ? "badge-warning"
                      : "badge-info"
                  }`}
                >
                  {application.applicationStatus || "pending"}
                </div>
              </div>
              <div>
                <p className="text-sm opacity-70">Payment Status</p>
                <div
                  className={`badge badge-lg ${
                    application.paymentStatus === "paid"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {application.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </div>
              </div>
              <div>
                <p className="text-sm opacity-70">Applied Date</p>
                <p className="font-semibold">
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Last Updated</p>
                <p className="font-semibold">
                  {application.updatedAt
                    ? new Date(application.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {application.feedback && (
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FaComment className="text-primary" />
                Feedback
              </h4>
              <p className="text-sm">{application.feedback}</p>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
