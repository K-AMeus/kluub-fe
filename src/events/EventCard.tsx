import { FC } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Event } from "../shared/reducers/event";

interface EventCardProps {
  event: Event;
  imageUrl: string;
  onClick: (eventId: string) => void;
}

const EventCard: FC<EventCardProps> = ({ event, imageUrl, onClick }) => {
  return (
    <div className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto relative group mb-10">
      <div className="absolute w-full h-[400px] sm:h-[300px] translate-x-2 translate-y-2 bg-[#E4DD3B] z-0 transition-transform duration-200 group-hover:-translate-x-0 group-hover:-translate-y-0" />
      <div
        className="relative z-10 bg-black text-white border border-white/70 p-5 md:pb-2 2xl:pb-5 font-montserrat-medium flex flex-col sm:flex-row w-full h-[500px] sm:h-[300px] cursor-pointer"
        onClick={() => onClick(event.id)}
      >
        {/* Image Container */}
        <div className="relative w-full sm:w-1/3 h-48 sm:h-full mb-4 sm:-ml-2 sm:-mt-2">
          <div className="w-full h-full bg-white/10 relative">
            <LazyLoadImage
              src={imageUrl}
              alt={event.title}
              effect="blur"
              className="absolute inset-0 w-full h-full object-cover border-2 border-[#E4DD3B]"
              wrapperClassName="!absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Main Info */}
        <div className="w-full sm:w-1/3 flex flex-col justify-start pl-0 sm:pl-12 md:pl-6 2xl:pl-12 mt-3 sm:mt-1 text-left">
          <h2 className="text-md sm:text-[1rem] md:text-[0.9rem] 2xl:text-[1.5rem] font-dela-gothic-one text-white uppercase truncate pr-8 sm:pr-0">
            {event.title}
          </h2>
          <div className="flex-grow overflow-hidden">
            <p
              className="leading-[1.25] text-[0.7rem] sm:text-[0.65rem] 2xl:text-[0.9rem] text-balance text-white font-montserrat mt-3 line-clamp-4 sm:line-clamp-5"
              style={{ wordSpacing: "0.03em" }}
            >
              {event.description}
            </p>
          </div>
          <p className="text-xs hidden sm:block sm:text-xs 2xl:text-sm text-[#E4DD3B] font-montserrat-medium mt-2 transition-colors">
            Read More →
          </p>
        </div>

        {/* Side Info */}
        <div className="text-[0.8rem] sm:text-[0.7rem] md:text-[0.7rem] 2xl:text-[1rem] w-full sm:w-1/3 flex flex-col justify-between pl-0 sm:pl-8 md:pl-4 2xl:pl-8 mt-4 sm:mt-4">
          <div className="w-full flex flex-col justify-between h-full">
            <div className="space-y-3">
              {/* Location */}
              <div className="flex items-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4DD3B]"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-white font-montserrat-medium ml-2.5 truncate">
                  {event.venue}
                </p>
              </div>

              {/* Times */}
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#E4DD3B]" />
                <p className="text-white font-montserrat-medium ml-2.5 truncate">
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
              <div className="flex items-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 512 512"
                  fill="none"
                  stroke="#E4DD3B"
                  strokeWidth="0"
                  className="text-[#E4DD3B]"
                >
                  <g fill="#E4DD3B" stroke="#E4DD3B" strokeWidth="10">
                    <path d="M430.337,231.065H81.674c-29.701,0-53.858,24.16-53.858,53.862v49.884v15.976l15.806,2.262c9.135,1.31,16.03,9.258,16.03,18.483c0,9.225-6.891,17.173-16.022,18.482l-15.814,2.262v15.978v49.892c0,29.693,24.157,53.854,53.858,53.854h348.663c29.701,0,53.862-24.161,53.862-53.854v-49.558V391l-17.571-0.822c-9.982-0.463-17.808-8.655-17.808-18.645c0-9.982,7.826-18.174,17.815-18.646l17.564-0.83v-17.58v-49.55C484.199,255.225,460.038,231.065,430.337,231.065z M465.765,334.477c-19.686,0.936-35.371,17.14-35.371,37.056c0,19.923,15.685,36.135,35.371,37.055v49.558c0,19.565-15.864,35.428-35.428,35.428H81.674c-19.569,0-35.432-15.863-35.432-35.428v-49.892c17.991-2.579,31.836-18.011,31.836-36.722c0-18.703-13.846-34.135-31.836-36.721v-49.884c0-19.573,15.863-35.436,35.432-35.436h348.663c19.564,0,35.428,15.863,35.428,35.436V334.477z" />
                    <rect x="133.621" y="439.419" width="12.19" height="31.8" />
                    <rect x="133.621" y="383.564" width="12.19" height="31.792" />
                    <rect x="133.621" y="327.7" width="12.19" height="31.8" />
                    <rect x="133.621" y="271.846" width="12.19" height="31.799" />
                    <polygon points="111.245,180.758 100.592,186.68 116.053,214.461 126.702,208.539" />
                    <path d="M497.524,179.025l-24.095-43.311l-8.558-15.36l-15.749,7.826c-8.948,4.442-19.768,1.09-24.617-7.639c-4.865-8.721-2.001-19.687,6.492-24.95l14.952-9.266l-8.558-15.368l-24.088-43.294C398.863,1.714,366.006-7.658,340.047,6.79L35.374,176.299c-25.955,14.44-35.318,47.305-20.878,73.256l0.875,1.578c3.27-6.394,7.43-12.243,12.324-17.409c-4.803-15.643,1.762-33.044,16.636-41.326l304.681-169.51c17.1-9.518,38.674-3.368,48.192,13.732l24.088,43.302c-16.751,10.38-22.575,32.182-12.895,49.582c9.681,17.401,31.271,23.942,48.925,15.172l24.095,43.312c7.273,13.056,5.337,28.692-3.571,39.601c4.776,3.961,8.989,8.558,12.65,13.569C505.4,224.524,508.979,199.615,497.524,179.025z" />
                  </g>
                </svg>
                <p className="text-white font-montserrat-medium ml-2.5">
                  {event.ticket > 0 ? `€${event.ticket}` : "FREE"}
                </p>
              </div>

              {/* People Saved */}
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p className="text-white font-montserrat-medium ml-2.5">
                  {event.likeCount}
                </p>
              </div>
            </div>

            {/* Facebook Link */}
            <a
              href={event.fbLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center mt-4 sm:mt-auto pt-3 border-t border-white/10 cursor-pointer hover:text-[#E4DD3B] transition-colors"
              title="View on Facebook"
            >
              <div className="flex items-center justify-center h-4 w-4 sm:h-6 sm:w-6 text-[#E4DD3B]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-6 sm:h-6"
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
    </div>
  );
};

export default EventCard;
