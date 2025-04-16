import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import Footer from "../shared/Footer";
import "../index.css";
import { getEvent } from "../shared/reducers/event.ts";
import { likeEvent, unlikeEvent } from "../shared/reducers/like.ts";
import { Event } from "../shared/reducers/event.ts";
import { LoadingFallback } from "../shared/Loading.tsx";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { CalendarIcon } from "@heroicons/react/24/outline";

const EventDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dgptexs0w",
    },
  });

  const getCloudinaryUrl = (publicId: string, width = 800, height = 600) => {
    return cld
      .image(publicId)
      .resize(fill().width(width).height(height))
      .toURL();
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const fetchedEvent = await getEvent(id, user?.uid);
        setEvent(fetchedEvent);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Error fetching event details. Please try again later.");
      }
    };

    fetchEvent();
    window.scrollTo(0, 0);
  }, [id, user, location.key]);

  const handleLike = async () => {
    if (!user) {
      return navigate("/auth?mode=login");
    }
    if (isLiking || !event) return;

    setIsLiking(true);
    const wasLiked = event.likedByUser;

    // Optimistic UI update
    setEvent({
      ...event,
      likeCount: wasLiked ? event.likeCount - 1 : event.likeCount + 1,
      likedByUser: !wasLiked,
    });

    try {
      const idToken = await user.getIdToken();
      const userId = user.uid;

      const updatedEvent = wasLiked
        ? await unlikeEvent(event.id, userId, idToken)
        : await likeEvent(event.id, userId, idToken);

      setEvent(updatedEvent);
    } catch (err) {
      console.error("Error toggling like:", err);
      setEvent({
        ...event,
        likeCount: wasLiked ? event.likeCount + 1 : event.likeCount - 1,
        likedByUser: wasLiked,
      });
      alert("Failed to update like status. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }
  if (!event) {
    return <LoadingFallback />;
  }

  const cloudinaryUrl = getCloudinaryUrl(event.imageUrl);

  return (
    <div className="relative min-h-screen flex flex-col text-white font-montserrat-medium">
      <div className="absolute inset-0 area z-0"></div>

      <div className="relative py-10 sm:max-w-6xl w-full sm:mx-auto px-8 flex-grow">
        <div className="relative">
          <img
            src={cloudinaryUrl}
            alt={event.title}
            className="w-full h-[250px] object-cover rounded-lg mb-4 filter blur-sm "
          />
          <div className="absolute top-6 right-6 z-20 flex flex-col items-center space-y-2">
            <div
              className={`flex items-center justify-center bg-black/60 border border-white/40 h-10 w-10 rounded-full ${
                isLiking
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-[#E4DD3B]/80 hover:bg-black/80"
              } ${
                event.likedByUser ? "bg-[#E4DD3B]/10 border-[#E4DD3B]/70" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              title="Save this event"
            >
              <svg
                width="18"
                height="18"
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

            <a
              href={event.fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center text-white font-montserrat-medium bg-black/60 border border-white/40 hover:border-[#E4DD3B]/80 hover:bg-black/80 transition-all h-10 w-10 rounded-full"
              title="View on Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="#E4DD3B"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.125v-3.622h3.125v-2.672c0-3.097 1.894-4.785 4.659-4.785 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.762v2.312h3.592l-.467 3.622h-3.125v9.294h6.125c.731 0 1.324-.593 1.324-1.324v-21.351c0-.732-.593-1.325-1.324-1.325z" />
              </svg>
            </a>
          </div>

          {/* Date Bubble */}
          <div className="absolute top-4 left-4 z-20">
            <div
              className="flex-shrink-0 w-16 h-16 rounded-full bg-black text-white border-2 text-[0.9rem]
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
              <h1 className="text-lg sm:text-[1.6rem] font-dela-gothic-one text-white uppercase">
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
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E4DD3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      stroke="#E4DD3B"
                    />
                    <circle cx="12" cy="10" r="3" stroke="#E4DD3B" />
                  </svg>
                  <p className="text-[1rem] text-white font-montserrat-medium ml-3">
                    {event.venue}
                  </p>
                </div>

                <div className="flex items-center mt-2.5">
                  <CalendarIcon className="h-6 w-6 text-[#E4DD3B]" />
                  <p className="text-[1rem] text-white font-montserrat-medium ml-3">
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
                    width="24"
                    height="24"
                    viewBox="0 0 512 512"
                    fill="none"
                    stroke="#E4DD3B"
                    strokeWidth="0"
                    className="text-[#E4DD3B]"
                  >
                    <g fill="#E4DD3B">
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
                  <p className="text-[1rem] text-white font-montserrat-medium ml-3">
                    {event.ticket > 0 ? `€${event.ticket}` : "FREE"}
                  </p>
                </div>

                {/* People Saved/Bookmarked */}
                <div className="flex items-center mt-2.5">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E4DD3B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <p className="text-[1rem] text-white font-montserrat-medium ml-3">
                    {event.likeCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="md:col-span-2 relative self-start flex min-h-full">
            <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0"></div>
            <div className="relative z-10 bg-black border border-white/70 p-4 flex-grow">
              <p className="text-sm sm:text-base text-white font-montserrat leading-relaxed">
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
