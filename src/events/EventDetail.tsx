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

              {/* Price */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-24 bg-white/10 animate-pulse ml-3" />
              </div>

              {/* Likes */}
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#E4DD3B]/20 animate-pulse" />
                <div className="h-5 w-16 bg-white/10 animate-pulse ml-3" />
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
      const idToken = await user.getIdToken();
      const userId = user.uid;

      const updatedEvent = wasLiked
        ? await unlikeEvent(event.id, userId, idToken)
        : await likeEvent(event.id, userId, idToken);

      // Update the event in the cache
      queryClient.setQueryData(queryKeys.events.detail(event.id), updatedEvent);

      // Update the event in the events list cache if it exists
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    } catch (err) {
      console.error("Error toggling like:", err);
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={event.likedByUser ? "#E4DD3B" : "none"}
                stroke="#E4DD3B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              {isLiking && (
                <svg
                  className="animate-spin h-4 w-4 text-white absolute"
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E4DD3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke="#E4DD3B"
                    />
                    <circle cx="12" cy="10" r="3" stroke="#E4DD3B" />
                  </svg>
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

                {/* Ticket Price */}
                <div className="flex items-center mt-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 512 512"
                    fill="none"
                    stroke="#E4DD3B"
                    strokeWidth="0"
                    className="w-4 h-4 sm:w-6 sm:h-6 text-[#E4DD3B]"
                  >
                    <g fill="#E4DD3B" stroke="#E4DD3B" strokeWidth="10">
                      <path
                        d="M430.337,231.065H81.674c-29.701,0-53.858,24.16-53.858,53.862v49.884v15.976l15.806,2.262
                        c9.135,1.31,16.03,9.258,16.03,18.483c0,9.225-6.891,17.173-16.022,18.482l-15.814,2.262v15.978v49.892
                        c0,29.693,24.157,53.854,53.858,53.854h348.663c29.701,0,53.862-24.161,53.862-53.854v-49.558V391l-17.571-0.822
                        c-9.982-0.463-17.808-8.655-17.808-18.645c0-9.982,7.826-18.174,17.815-18.646l17.564-0.83v-17.58v-49.55
                        C484.199,255.225,460.038,231.065,430.337,231.065z M465.765,334.477c-19.686,0.936-35.371,17.14-35.371,37.056
                        c0,19.923,15.685,36.135,35.371,37.055v49.558c0,19.565-15.864,35.428-35.428,35.428H81.674c-19.569,0-35.432-15.863-35.432-35.428
                        v-49.892c17.991-2.579,31.836-18.011,31.836-36.722c0-18.703-13.846-34.135-31.836-36.721v-49.884
                        c0-19.573,15.863-35.436,35.432-35.436h348.663c19.564,0,35.428,15.863,35.428,35.436V334.477z"
                      />
                      <rect
                        x="133.621"
                        y="439.419"
                        width="12.19"
                        height="31.8"
                      />
                      <rect
                        x="133.621"
                        y="383.564"
                        width="12.19"
                        height="31.792"
                      />
                      <rect x="133.621" y="327.7" width="12.19" height="31.8" />
                      <rect
                        x="133.621"
                        y="271.846"
                        width="12.19"
                        height="31.799"
                      />
                      <polygon points="111.245,180.758 100.592,186.68 116.053,214.461 126.702,208.539" />
                      <path
                        d="M497.524,179.025l-24.095-43.311l-8.558-15.36l-15.749,7.826c-8.948,4.442-19.768,1.09-24.617-7.639
                        c-4.865-8.721-2.001-19.687,6.492-24.95l14.952-9.266l-8.558-15.368l-24.088-43.294C398.863,1.714,366.006-7.658,340.047,6.79
                        L35.374,176.299c-25.955,14.44-35.318,47.305-20.878,73.256l0.875,1.578c3.27-6.394,7.43-12.243,12.324-17.409
                        c-4.803-15.643,1.762-33.044,16.636-41.326l304.681-169.51c17.1-9.518,38.674-3.368,48.192,13.732l24.088,43.302
                        c-16.751,10.38-22.575,32.182-12.895,49.582c9.681,17.401,31.271,23.942,48.925,15.172l24.095,43.312
                        c7.273,13.056,5.337,28.692-3.571,39.601c4.776,3.961,8.989,8.558,12.65,13.569C505.4,224.524,508.979,199.615,497.524,179.025z"
                      />
                    </g>
                  </svg>
                  <p className="text-[0.8rem] sm:text-[1rem] text-white font-montserrat-medium ml-2.5">
                    {event.ticket > 0 ? `€${event.ticket}` : "FREE"}
                  </p>
                </div>

                {/* People Saved */}
                <div className="flex items-center mt-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E4DD3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <p className="text-[0.8rem] sm:text-[1rem] text-white font-montserrat-medium ml-2.5">
                    {event.likeCount}
                  </p>
                </div>

                {/* Facebook Link */}
                <a
                  href={event.fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center mt-4 pt-3 border-t border-white/10 cursor-pointer hover:text-[#E4DD3B] transition-colors"
                  title="View on Facebook"
                >
                  <div className="flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 text-[#E4DD3B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.125v-3.622h3.125v-2.672c0-3.097 1.894-4.785 4.659-4.785 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.762v2.312h3.592l-.467 3.622h-3.125v9.294h6.125c.731 0 1.324-.593 1.324-1.324v-21.351c0-.732-.593-1.325-1.324-1.325z" />
                    </svg>
                  </div>
                  <span className="text-inherit font-montserrat-medium ml-2.5 transition-colors text-[0.7rem] sm:text-[0.9rem]">
                    Facebook Event
                  </span>
                </a>
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
