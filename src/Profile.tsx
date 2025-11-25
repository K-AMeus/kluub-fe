import { FC, useEffect, useState } from "react";
import { useAuth } from "./authentication/AuthContext";
import Footer from "./shared/Footer";
import { getLikedEvents } from "./shared/reducers/like";
import { Event as AppEvent } from "./shared/reducers/event";
import { PageableResponse } from "./shared/helpers";
import { useNavigate } from "react-router-dom";

interface EventItem {
  id: string;
  name: string;
}

function getInitials(email?: string | null): string {
  return email ? email.charAt(0).toUpperCase() : "";
}

const Profile: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [likedEvents, setLikedEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikedEvents = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = (await getLikedEvents(
          user.uid
        )) as PageableResponse<AppEvent>;

        setLikedEvents(
          data.content.map((event: AppEvent) => ({
            id: event.id,
            name: event.title,
          }))
        );
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching liked events:", err);
        }
        setError("Failed to fetch liked events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedEvents();
  }, [user]);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    if (!user) return;

    setIsLoading(true);
    try {
      const data = (await getLikedEvents(
        user.uid,
        newPage,
        20
      )) as PageableResponse<AppEvent>;

      setLikedEvents(
        data.content.map((event: AppEvent) => ({
          id: event.id,
          name: event.title,
        }))
      );
      setCurrentPage(data.page || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching liked events:", err);
      }
      setError("Failed to fetch liked events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`, { state: { fromProfile: true } });
  };

  if (!user) {
    return <p className="text-white">Please log in.</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-black">
      <div className="absolute inset-0 area z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-28 pb-32">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-dela-gothic-one text-white mb-2">
            MY PROFILE
          </h1>
          <div className="w-24 h-1 bg-[#E4DD3B] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Profile Info Card */}
          <div className="relative">
            <div className="relative z-10 bg-black border border-white/70 p-6">
              <div className="relative">
                <div className="absolute w-full h-full translate-x-2 translate-y-2 bg-[#E4DD3B] z-0"></div>
                <div className="relative z-10 bg-black border border-white/70 p-6">
                  <div className="flex flex-col items-center text-center">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-20 w-20 rounded-full border-2 border-[#E4DD3B] mb-4"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl border-2 border-[#E4DD3B] bg-black text-white mb-4">
                        {getInitials(user.email)}
                      </div>
                    )}
                    <h2 className="text-lg font-montserrat-bolder text-white mb-1">
                      {user.displayName || "User"}
                    </h2>
                    <p className="text-sm text-white/60 font-montserrat-medium">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    await logout();
                    navigate("/");
                  } catch (error) {
                    if (process.env.NODE_ENV === "development") {
                      console.error("Error logging out:", error);
                    }
                  }
                }}
                className="w-full py-2.5 mt-6 text-sm font-montserrat-medium text-white border border-[#E4DD3B] hover:bg-[#E4DD3B]/10 transition-colors uppercase tracking-wider"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Saved Events Card */}
          <div className="md:col-span-2 relative">
            <div className="absolute w-full h-full -translate-x-2 -translate-y-2 bg-[#E4DD3B] z-0"></div>
            <div className="relative z-10 bg-black border border-white/70 p-6">
              <div className="flex items-center mb-6">
                <h3 className="text-lg font-dela-gothic-one text-white uppercase">
                  Saved Events
                </h3>
                <div className="flex-grow ml-4 h-px bg-white/20"></div>
              </div>

              {/* Events List */}
              <div className="min-h-[300px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <p className="text-white font-montserrat-bolder mb-2">
                      Loading saved events...
                    </p>
                    <svg
                      className="animate-spin h-6 w-6 text-[#E4DD3B]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-red-500 text-sm font-montserrat-medium">
                      {error}
                    </p>
                  </div>
                ) : likedEvents.length > 0 ? (
                  <div className="space-y-2">
                    {likedEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event.id)}
                        className="group cursor-pointer"
                      >
                        <div className="p-3 border border-white/20 bg-black transition-all duration-200 hover:border-white/70">
                          <p className="font-montserrat-medium text-white text-sm">
                            {event.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <p className="text-white/60 font-montserrat-medium mb-4">
                      No saved events yet
                    </p>
                    <button
                      onClick={() => navigate("/events")}
                      className="px-6 py-2 text-sm font-montserrat-medium text-[#E4DD3B] border border-[#E4DD3B] hover:bg-[#E4DD3B]/10 transition-colors"
                    >
                      Browse Events
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 text-sm font-montserrat-medium transition-colors ${
                      currentPage === 0
                        ? "text-white/40 cursor-not-allowed"
                        : "text-white hover:text-[#E4DD3B]"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-white/60 font-montserrat-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className={`px-4 py-2 text-sm font-montserrat-medium transition-colors ${
                      currentPage >= totalPages - 1
                        ? "text-white/40 cursor-not-allowed"
                        : "text-white hover:text-[#E4DD3B]"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
