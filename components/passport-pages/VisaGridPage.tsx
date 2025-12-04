import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { staggerContainer, itemSpringUp } from "../../utils/animations";
import {
  FiCheck,
  FiCamera,
  FiEdit,
  FiFilter,
  FiCalendar,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Event } from "../../data/events";
import { useTilt } from "../../hooks/useTilt";
import SkeletonLoader from "../SkeletonLoader";
import Pagination from "../Pagination";

const Stamp: React.FC<{ text: string; color: string; rotation: number }> = ({
  text,
  color,
  rotation,
}) => (
  <motion.div
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center pointer-events-none z-10`}
    initial={{ scale: 2, opacity: 0, rotate: rotation + 20 }}
    animate={{ scale: 1, opacity: 1, rotate: rotation }}
    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
  >
    <div
      className={`w-full h-full border-4 ${color} rounded-full flex items-center justify-center`}
    >
      <span
        className={`text-lg md:text-xl font-black uppercase ${color} tracking-wider`}
      >
        {text}
      </span>
    </div>
  </motion.div>
);

const SkeletonEventCard: React.FC = () => (
  <div className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 flex flex-col h-full">
    {/* For Event Name */}
    <SkeletonLoader className="h-5 w-3/4 rounded-md mb-2" />

    {/* For Date/Time and Location info */}
    <div className="space-y-1 mt-1">
      <SkeletonLoader className="h-4 w-5/6 rounded-md" />
      <SkeletonLoader className="h-4 w-1/2 rounded-md" />
    </div>

    <div className="flex-grow" />

    {/* For Button area */}
    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700/50">
      <SkeletonLoader className="h-8 w-full rounded-md" />
    </div>
  </div>
);

const EventCard: React.FC<{ event: Event; isHighlighted: boolean }> = ({
  event,
  isHighlighted,
}) => {
  const navigate = useNavigate();
  const { registerForEvent } = useAuth();
  const isCompleted = event.completed;
  const isRegistered = event.registered && !isCompleted;
  const isLocked = !isCompleted && !isRegistered;

  const cardRef = React.useRef<HTMLDivElement>(null);
  const { rotateX, rotateY } = useTilt(cardRef);

  React.useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/activity/${event.id}`);
  };



  const handleFeedback = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/feedback/${event.id}`);
  };

  return (
    <motion.div
      id={`event-card-${event.id}`}
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}

      whileTap={{ scale: 0.98 }}
      variants={itemSpringUp}
      className={`relative p-3 rounded-lg border-2 flex flex-col h-full transition-all duration-300 overflow-hidden cursor-pointer
                ${isCompleted
          ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
          : ""
        }
                ${isRegistered
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700"
          : ""
        }
                ${isLocked
          ? "bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 hover:border-brand-passport-accent/50"
          : ""
        }
            `}
      onClick={() => navigate(`/activity/${event.id}`)}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        transition: { duration: 0.2 },
      }}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: isHighlighted
          ? [
            "0 0 0px 0px rgba(255, 193, 7, 0)",
            "0 0 15px 5px rgba(255, 193, 7, 0.7)",
            "0 0 0px 0px rgba(255, 193, 7, 0)",
          ]
          : "none",
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        boxShadow: { duration: 2, ease: "easeInOut" },
      }}
    >
      <AnimatePresence>
        {isRegistered && (
          <Stamp
            text="Registered"
            color="text-blue-400 border-blue-400"
            rotation={-15}
          />
        )}
        {isCompleted && (
          <Stamp
            text="Completed"
            color="text-green-500 border-green-500"
            rotation={-15}
          />
        )}
      </AnimatePresence>

      <div
        className="relative z-20 flex flex-col h-full"
        style={{ transform: "translateZ(20px)" }}
      >
        <h4 className="font-bold text-sm text-brand-passport-primary dark:text-gray-200">
          {event.name}
        </h4>
        <div className="space-y-1 text-xs text-brand-passport-subtle dark:text-gray-400 mt-1">
          <div className="flex items-center gap-1.5">
            <FiCalendar size={12} />
            <span>
              {event.date}, {event.time}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiMapPin size={12} />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex-grow" />

        <div className="mt-3 pt-2 border-t border-current/10">
          {isLocked && (
            <button
              onClick={handleRegister}
              className="w-full bg-brand-yellow text-brand-dark-blue text-xs font-bold py-2 px-2 rounded-md hover:bg-yellow-300 transition-colors"
            >
              Register Now
            </button>
          )}
          {(isRegistered || isCompleted) && (
            <button
              onClick={
                event.feedback
                  ? (e) => {
                    e.stopPropagation();
                  }
                  : handleFeedback
              }
              disabled={!!event.feedback}
              className="w-full bg-gray-200 dark:bg-gray-600 text-xs font-bold py-2 px-2 rounded-md transition-colors flex items-center justify-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {event.feedback ? (
                <>
                  <FiCheck size={12} /> Feedback Given
                </>
              ) : (
                <>
                  <FiEdit size={12} />
                  Give Feedback
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="relative py-1.5 px-4 rounded-full text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-passport-primary"
  >
    <span
      className={`relative z-10 ${isActive
        ? "text-brand-passport-primary"
        : "text-brand-passport-subtle hover:text-brand-passport-primary"
        }`}
    >
      {label}
    </span>
    {isActive && (
      <motion.div
        layoutId="visa-filter-highlight"
        className="absolute inset-0 bg-brand-passport-accent/40 rounded-full"
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
    )}
  </button>
);

const VisaGridPage: React.FC<{ highlightEventId?: string }> = ({
  highlightEventId,
}) => {
  const { events } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<
    "all" | "registered" | "completed" | "Engagement" | "Intercollegiate"
  >("all");
  const [highlightedId, setHighlightedId] = React.useState<string | undefined>(
    highlightEventId
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    // Clear the highlight after the animation plays
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(undefined), 2500);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300); // Simulate render/filter time
    return () => clearTimeout(timer);
  }, [filter]);

  const filteredEvents = React.useMemo(() => {
    if (filter === "registered") {
      return events.filter((e) => e.registered && !e.completed);
    }
    if (filter === "completed") {
      return events.filter((e) => e.completed);
    }
    if (filter === "Engagement") {
      return events.filter((e) => e.category === "Engagement");
    }
    if (filter === "Intercollegiate") {
      return events.filter((e) => e.category === "Intercollegiate");
    }
    return events;
  }, [events, filter]);

  const totalPages = filteredEvents.length > 0 ? Math.ceil(filteredEvents.length / pageSize) : 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));



  return (
    <motion.div
      className="w-full h-full bg-transparent p-4 md:p-6 flex flex-col"
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      animate="visible"
      exit="hidden"
      key={`${filter}-${filteredEvents.length}`}  // ✅ forces proper re-render

    >
      <motion.div
        variants={itemSpringUp}
        className="flex flex-wrap justify-between items-center gap-3 mb-4 border-b-2 border-brand-passport-subtle dark:border-gray-700 pb-2"
      >
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-brand-passport-primary dark:text-gray-100">
            My Activity VISA Passport
          </h3>
          <p className="text-xs text-brand-passport-subtle dark:text-gray-400">
            Track your progress and collect your event stamps!
          </p>
          {!isLoading && (
            <p className="text-[11px] md:text-xs text-brand-passport-subtle dark:text-gray-500">
              Showing {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <div className="flex flex-col items-stretch sm:flex-row sm:items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 overflow-x-auto max-w-full no-scrollbar">
            <FilterButton
              label="All"
              isActive={filter === "all"}
              onClick={() => { setFilter("all"); setCurrentPage(1); }}
            />
            <FilterButton
              label="Registered"
              isActive={filter === "registered"}
              onClick={() => { setFilter("registered"); setCurrentPage(1); }}
            />
            <FilterButton
              label="Completed"
              isActive={filter === "completed"}
              onClick={() => { setFilter("completed"); setCurrentPage(1); }}
            />
            <FilterButton
              label="Engagement"
              isActive={filter === "Engagement"}
              onClick={() => { setFilter("Engagement"); setCurrentPage(1); }}
            />
            <FilterButton
              label="Intercollegiate"
              isActive={filter === "Intercollegiate"}
              onClick={() => { setFilter("Intercollegiate"); setCurrentPage(1); }}
            />
          </div>
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-end">
              <Pagination currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </motion.div>
      <div
        className="overflow-y-auto flex-grow pr-2 -mr-2 passport-scrollbar"
        style={{ perspective: "1000px", minHeight: "400px" }}
      >
        <AnimatePresence>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonEventCard key={i} />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <motion.div
              key={filter}
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {paginatedEvents.map((event) => {
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    isHighlighted={event.id === highlightedId}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center text-brand-passport-subtle dark:text-gray-500"
            >
              <FiFilter size={40} />
              <p className="mt-2 font-semibold">No events match this filter.</p>
              <p className="text-sm">Try selecting another category!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div >
  );
};

export default VisaGridPage;
