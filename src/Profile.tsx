import { FC, useEffect, useState } from "react";
import axios from "axios";
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

interface LikedEventsResponse {
  events: AppEvent[];
  currentPage: number;
  totalPages: number;
}

function getInitials(email?: string | null): string {
  return email ? email.charAt(0).toUpperCase() : "";
}

const Profile: FC = () => {
  const { user } = useAuth();
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
        console.error("Error fetching liked events:", err);
        setError("Failed to fetch liked events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedEvents();
  }, [user]);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;

    setIsLoading(true);
    try {
      const idToken = user ? await user.getIdToken() : "";
      const response = await axios.get<LikedEventsResponse>(
        `https://partynbackend-production.up.railway.app/events/liked?page=${newPage}&size=20`,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (response.data && response.data.events) {
        setLikedEvents(
          response.data.events.map((event: AppEvent) => ({
            id: event.id,
            name: event.title,
          }))
        );
        setCurrentPage(response.data.currentPage || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setLikedEvents([]);
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      console.error("Error fetching liked events:", err);
      setError("Failed to fetch liked events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  if (!user) {
    return <p className="text-white">Please log in.</p>;
  }

  return (
    <div className="relative min-h-screen flex flex-col pt-28 pb-16 items-center z-10">
      <div className="absolute inset-0 area z-0"></div>

      {/* Profile Card */}
      <div className="relative w-full max-w-md mx-4">
        {/* Back Rectangle */}
        <div className="absolute w-full h-full translate-x-1 translate-y-1 bg-[#E4DD3B] z-0"></div>

        <div className="relative z-10 w-full bg-black border border-white/70 p-5 flex flex-col text-white">
          {/* User Section */}
          <div className="flex items-center space-x-3 mb-5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-12 w-12 rounded-full border border-[#E4DD3B]"
              />
            ) : (
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg border border-[#E4DD3B] bg-black">
                {getInitials(user.email)}
              </div>
            )}
            <div className="overflow-hidden">
              <h2 className="text-base font-montserrat-bolder truncate">
                {user.displayName || user.email}
              </h2>
              <p className="text-white/60 text-xs font-montserrat-medium truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <h3 className="text-xs tracking-wide font-montserrat-bolder text-[#E4DD3B] uppercase">
              My Events
            </h3>
            <div className="flex-grow ml-3 h-px bg-white/20"></div>
          </div>

          {/* Events List */}
          <div className="mb-3">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 py-2 text-xs font-montserrat-medium">
                {error}
              </p>
            ) : likedEvents.length > 0 ? (
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs">
                {likedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group cursor-pointer border-l-2 border-transparent hover:border-[#E4DD3B] pl-2 py-1 transition-all"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="font-montserrat-medium text-white group-hover:text-[#E4DD3B] transition-colors">
                      {event.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-2 text-center text-xs font-montserrat-medium text-white/60">
                No saved events
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-1 mt-2 text-xs border-t border-white/10 pt-3">
              {currentPage > 0 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-2 py-1 text-white/80 hover:text-[#E4DD3B] transition-colors font-montserrat-medium"
                >
                  ← Prev
                </button>
              )}
              <div className="mx-2 text-white/40">
                Page {currentPage + 1} of {totalPages}
              </div>
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-2 py-1 text-white/80 hover:text-[#E4DD3B] transition-colors font-montserrat-medium"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
