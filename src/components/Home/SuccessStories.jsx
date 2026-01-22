import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";

const SuccessStories = () => {
  const scrollRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const stories = [
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
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 10);
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
    <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/3 h-80 w-80 bg-emerald-500 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 bg-cyan-500 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur text-xs uppercase tracking-[0.25em] font-semibold">
            Success stories
          </div>
          <h2 className="text-4xl md:text-5xl font-black mt-5">
            From Dreams to Reality
          </h2>
          <p className="text-lg text-slate-200/80 mt-3 max-w-2xl mx-auto">
            Meet 10 scholars who achieved the impossible through determination
            and ScholarStream
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4"
              style={{ scrollPadding: "0 1.5rem" }}
            >
              {stories.map((story, idx) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex-none w-full sm:w-96 md:w-80 lg:w-96 snap-start"
                >
                  <div className="relative rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden h-full p-6 flex flex-col hover:shadow-xl transition-shadow">
                    {/* Gradient accent */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-3xl" />

                    {/* Header with image and basic info */}
                    <div className="relative flex items-start gap-4 mb-4">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="h-16 w-16 rounded-2xl object-cover border-2 border-white/20 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {story.name}
                        </h3>
                        <p className="text-sm text-slate-300">{story.from}</p>
                        <div className="flex items-center gap-0.5 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-300 text-amber-300"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-white/10 to-transparent mb-4" />

                    {/* Scholarship details */}
                    <div className="relative space-y-3 mb-4 flex-1">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">
                          University
                        </p>
                        <p className="text-sm font-semibold text-cyan-200">
                          {story.university}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">
                          Program
                        </p>
                        <p className="text-sm text-slate-200">{story.degree}</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-white/10">
                        <span className="text-xs font-bold text-emerald-200">
                          Award:
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {story.amount}
                        </span>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="relative border-l-2 border-purple-400/50 pl-4 py-3">
                      <p className="text-sm italic text-slate-100">
                        "{story.quote}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white/15 transition-all z-10 ${
              canScrollPrev ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`absolute -right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white/15 transition-all z-10 ${
              canScrollNext ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
