import { useState, useEffect } from "react";

const FeedbackModal = ({ isOpen, onClose, onSubmit, application }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (isOpen && application) {
      setFeedback(application.feedback || "");
    }
  }, [isOpen, application]);

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback("");
  };

  const handleClose = () => {
    setFeedback("");
    onClose();
  };

  if (!isOpen || !application) return null;

  return (
    <div className="modal modal-open items-start pt-20 inset-0">
      <div className="modal-box min-w-3xl">
        <h3 className="font-bold text-lg mb-4">Add Feedback</h3>
        <p className="text-sm text-base-content/70 mb-4">
          Applicant: <strong>{application.userName}</strong>
        </p>
        <textarea
          className="textarea textarea-bordered w-full h-32"
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="modal-action">
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit Feedback
          </button>
          <button onClick={handleClose} className="btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
