import { FC, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import Footer from "../shared/Footer";
import "../index.css";
import { likeEvent, unlikeEvent } from "../shared/reducers/like.ts";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useEventDetail } from "./useEvents";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../shared/queryClient";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import {
  BackArrowIcon,
  BookmarkIcon,
  LoadingSpinnerIcon,
  LocationIcon,
  TicketIcon,
  FacebookIcon,
} from "../components/icons";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dgptexs0w",
  },
});

const getCloudinaryUrl = (publicId: string, width = 800, height = 600) => {
  return cld.image(publicId).resize(fill().width(width).height(height)).toURL();
};

const EventDetailSkeleton = () => (
  <div className="relative min-h-screen flex flex-col text-white font-montserrat-medium">
    <div className="absolute inset-0 area z-0"></div>

    <div className="relative py-10 sm:max-w-6xl w-full sm:mx-auto px-8 flex-grow">
      {/* Back Button Skeleton */}
      <div className="mb-6 flex items-center">
        <div className="h-5 w-24 bg-white/10 animate-pulse rounded" />
      </div>

      {/* Image Container Skeleton */}
      <div className="relative">
        <div className="w-full h-[250px] bg-white/10 animate-pulse rounded-lg mb-4" />

        {/* Action Buttons Skeleton */}
        <div className="absolute top-6 right-6 z-20 flex flex-col items-center space-y-2">
          <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse border border-white/40" />
        </div>

        {/* Date Bubble Skeleton */}
        <div className="absolute top-4 left-4 z-20">
          <div className="h-16 w-16 rounded-full bg-white/10 animate-pulse border-2 border-white/70" />
        </div>

        {/* Title Overlay Skeleton */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 border-2 border-white/70">
          <div className="bg-black/70 px-6 py-4 border border-white/40 backdrop-blur-sm max-w-[90%]">
            <div className="h-8 w-64 bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="relative self-start inline-block">
          <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0"></div>
          <div className="relative z-10 p-4 bg-black border border-white/70">
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-32 bg-white/10 animate-pulse ml-3" />
              </div>

              {/* Time */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-40 bg-white/10 animate-pulse ml-3" />
              </div>

              {/* Price & Facebook */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                  <div className="h-5 w-24 bg-white/10 animate-pulse ml-3" />
                </div>
                <div className="w-5 h-5 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Description Skeleton */}
        <div className="md:col-span-2 relative self-start flex min-h-full">
          <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0"></div>
          <div className="relative z-10 bg-black border border-white/70 p-4 flex-grow">
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 animate-pulse" />
              <div className="h-4 w-4/6 bg-white/10 animate-pulse" />
              <div className="h-4 w-full bg-white/10 animate-pulse" />
              <div className="h-4 w-3/4 bg-white/10 animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="h-20"></div>

    <div className="w-full mt-auto">
      <Footer />
    </div>
  </div>
);

const EventDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: event, isError, error, isLoading } = useEventDetail(id!);

  const handleLike = async () => {
    if (!user) {
      return navigate("/auth?mode=login");
    }
    if (isLiking || !event) return;

    setIsLiking(true);
    const wasLiked = event.likedByUser;

    try {
      const userId = user.uid;

      const updatedEvent = wasLiked
        ? await unlikeEvent(event.id, userId)
        : await likeEvent(event.id, userId);

      // Update the event in the cache
      queryClient.setQueryData(queryKeys.events.detail(event.id), updatedEvent);

      // Update the event in the events list cache if it exists
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    } catch (err) {
      // TODO: Replace with proper error logging service in production
      if (process.env.NODE_ENV === "development") {
        console.error("Error toggling like:", err);
      }
      alert("Failed to update like status. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Check if we came from profile page using location state
  const isFromProfile = location.state?.fromProfile === true;

  if (isError) {
    return (
      <p className="text-red-500 text-center">
        {error?.message ||
          "Error fetching event details. Please try again later."}
      </p>
    );
  }

  if (isLoading || !event) {
    return <EventDetailSkeleton />;
  }

  const cloudinaryUrl = getCloudinaryUrl(event.imageUrl);

  return (
    <div className="relative min-h-screen flex flex-col text-white font-montserrat-medium">
      <div className="absolute inset-0 area z-0"></div>

      <div className="relative py-10 sm:max-w-6xl w-full sm:mx-auto px-8 flex-grow">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-white hover:text-[#E4DD3B] transition-colors"
        >
          <BackArrowIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          <span className="font-montserrat-medium text-[0.8rem] sm:text-base">
            {isFromProfile ? "Back to Profile" : "Back to Events"}
          </span>
        </button>

        <div className="relative">
          <img
            src={cloudinaryUrl}
            alt={event.title}
            className="w-full h-[250px] object-cover rounded-lg mb-4 filter blur-sm"
          />
          <div className="absolute top-6 right-6 z-20">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full border-2 border-[#E4DD3B] hover:bg-[#E4DD3B]/10 transition-colors ${
                isLiking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${event.likedByUser ? "bg-[#E4DD3B]/10" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              title="Save this event"
            >
              <BookmarkIcon
                className="text-[#E4DD3B]"
                filled={event.likedByUser}
              />
              {isLiking && (
                <LoadingSpinnerIcon className="h-4 w-4 text-white absolute" />
              )}
            </div>
          </div>

          {/* Date Bubble */}
          <div className="absolute top-4 left-4 z-20">
            <div
              className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black text-white border-2 text-[0.7rem] sm:text-[0.9rem]
                         border-white/70 p-2 font-bold font-montserrat-medium"
              style={{ transform: "rotate(-15deg)" }}
            >
              <div className="text-center">
                <p>{new Date(event.openTime).getDate()}</p>
                <p>
                  {new Date(event.openTime).toLocaleString("default", {
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Overlay Title */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 border-2 border-white/70">
            <div className="bg-black/70 px-6 py-4 border border-white/40 backdrop-blur-sm max-w-[90%]">
              <h1 className="text-md sm:text-[1.6rem] font-dela-gothic-one text-white uppercase">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Info + Like */}
          <div className="relative self-start inline-block">
            <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0"></div>
            <div className="relative z-10 p-4 bg-black border border-white/70">
              <div className="mb-4">
                {/* Location */}
                <div className="flex items-center">
                  <LocationIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-[0.8rem] sm:text-[1rem] text-white font-montserrat-medium ml-2.5">
                    {event.venue}
                  </p>
                </div>

                <div className="flex items-center mt-2.5">
                  <CalendarIcon className="h-4 w-4 sm:h-6 sm:w-6 text-[#E4DD3B]" />
                  <p className="text-[0.8rem] sm:text-[1rem] text-white font-montserrat-medium ml-2.5">
                    {new Date(event.openTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    -{" "}
                    {new Date(event.closeTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>

                {/* Ticket Price & Facebook Link */}
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center">
                    <TicketIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                    <p className="text-[0.8rem] sm:text-[1rem] text-white font-montserrat-medium ml-2.5">
                      {event.ticket > 0 ? `€${event.ticket}` : "FREE"}
                    </p>
                  </div>

                  <a
                    href={event.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center cursor-pointer hover:text-[#E4DD3B] transition-colors"
                    title="View on Facebook"
                  >
                    <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="md:col-span-2 relative self-start flex min-h-full">
            <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0"></div>
            <div className="relative z-10 bg-black border border-white/70 p-4 flex-grow">
              <p className="text-[0.7rem] sm:text-base text-white font-montserrat leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20"></div>

      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default EventDetail;
