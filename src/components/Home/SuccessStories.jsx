import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const SuccessStories = () => {
  const scrollRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const stories = [
    // ... your stories array (unchanged)
    {
      id: 1,
      name: "Md. Arif Hossain",
      from: "Dhaka, Bangladesh",
      university: "Massachusetts Institute of Technology (MIT)",
      degree: "B.Sc. in Computer Science & Engineering",
      scholarship: "MIT International Excellence Scholarship",
      amount: "Fully Funded + $80,000 stipend",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote:
        "From a small coaching center in Mirpur to MIT — this platform made the impossible possible.",
    },
    {
      id: 2,
      name: "Rahimul Islam",
      from: "Chittagong, Bangladesh",
      university: "Stanford University",
      degree: "M.S. in Artificial Intelligence",
      scholarship: "Knight-Hennessy Scholars Program",
      amount: "Fully Funded",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      quote:
        "I applied to 47 scholarships and got rejected from 46. This one application changed everything.",
    },
    {
      id: 3,
      name: "Shakib Al Hasan",
      from: "Sylhet, Bangladesh",
      university: "University of Oxford",
      degree: "MSc in Financial Economics",
      scholarship: "Rhodes Scholarship 2025",
      amount: "Fully Funded",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
      quote:
        "First Rhodes Scholar from Sylhet Division. Proud moment for my family and my country.",
    },
    {
      id: 4,
      name: "Tanjim Ahmed",
      from: "Rajshahi, Bangladesh",
      university: "Harvard University",
      degree: "A.B. in Physics",
      scholarship: "Harvard Financial Aid (100%)",
      amount: "$88,000 per year",
      image: "https://randomuser.me/api/portraits/men/83.jpg",
      quote:
        "My father is a rickshaw puller. Today his son studies at Harvard. Dreams do come true.",
    },
    {
      id: 5,
      name: "Fahad Bin Farid",
      from: "Khulna, Bangladesh",
      university: "California Institute of Technology (Caltech)",
      degree: "B.S. in Electrical Engineering",
      scholarship: "Caltech Merit Scholarship",
      amount: "Full Tuition + Living Expenses",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote:
        "Scored 1590 SAT using free YouTube videos. This platform connected me to Caltech.",
    },
    {
      id: 6,
      name: "Nafees Iqbal",
      from: "Comilla, Bangladesh",
      university: "Princeton University",
      degree: "A.B. in Public Policy",
      scholarship: "Princeton International Scholarship",
      amount: "100% Need-Based Aid",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      quote:
        "Princeton doesn't care where you're from — only where you're going. Thank you Scholar Stream!",
    },
    {
      id: 7,
      name: "Zubayer Ahmed",
      from: "Barisal, Bangladesh",
      university: "Yale University",
      degree: "B.A. in Economics",
      scholarship: "Yale International Scholarship",
      amount: "Full Ride",
      image: "https://randomuser.me/api/portraits/men/68.jpg",
      quote:
        "From a flood-affected village in Barisal to Yale University. Never let your background define your future.",
    },
    {
      id: 8,
      name: "Omar Faruque",
      from: "Mymensingh, Bangladesh",
      university: "University of Cambridge",
      degree: "MPhil in Development Studies",
      scholarship: "Gates Cambridge Scholarship",
      amount: "Fully Funded",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      quote:
        "One of only 80 Gates Scholars worldwide in 2025. Bangladesh made it!",
    },
    {
      id: 9,
      name: "Imran Khan",
      from: "Rangpur, Bangladesh",
      university: "University of Toronto",
      degree: "B.A.Sc. in Engineering Science",
      scholarship: "Lester B. Pearson International Scholarship",
      amount: "Fully Funded for 4 years",
      image: "https://randomuser.me/api/portraits/men/90.jpg",
      quote:
        "First Pearson Scholar from Bangladesh in 7 years. Proud to represent my country.",
    },
    {
      id: 10,
      name: "Sajid Rahman",
      from: "Jessore, Bangladesh",
      university: "ETH Zurich",
      degree: "M.Sc. in Robotics",
      scholarship: "Excellence Scholarship & Opportunity Programme (ESOP)",
      amount: "CHF 48,000 + Tuition Waiver",
      image: "https://randomuser.me/api/portraits/men/14.jpg",
      quote:
        "Left my job at a local startup to pursue a Master's at the #1 university in Europe. Best decision ever.",
    },
  ];

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 10); // small tolerance
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollButtons();
    container.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  return (
    <section className="mt-20 mb-10">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Success{" "}
            </span>
            Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            10 inspiring young men who proved that no dream is too big
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4"
              style={{ scrollPadding: "0 1.5rem" }}
            >
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex-none w-full sm:w-96 md:w-80 lg:w-96 snap-start"
                >
                  <div className="rounded-2xl shadow-xl overflow-hidden h-full bg-gray-100 p-5 flex flex-col">
                    <div className="flex justify-start gap-5 items-center">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-20 h-20 rounded-full object-cover ml-3"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {story.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{story.from}</p>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="font-semibold mt-2 text-lg">
                        {story.university}
                      </p>
                      <p className="text-gray-700 text-sm">{story.degree}</p>
                      <p className="mt-2 text-green-600 font-bold text-lg">
                        {story.amount}
                      </p>
                      <div className="flex mt-2 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-4 italic text-gray-800 flex-1">
                        "{story.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Hidden when not needed */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute -left-5 top-1/2 -translate-y-1/2 bg-slate-200 rounded-full p-3 shadow-2xl z-10 transition-opacity ${
              canScrollPrev ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-8 h-8 text-black" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute -right-5 top-1/2 -translate-y-1/2 bg-slate-200 rounded-full p-3 shadow-2xl z-10 transition-opacity ${
              canScrollNext ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-8 h-8 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
