import { ScaleLoader } from "react-spinners";

const Loading = ({ smallHeight }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
};

export default Loading;
