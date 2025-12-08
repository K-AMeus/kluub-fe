import { FC, memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Event } from "../shared/reducers/event";
import { Icon } from "../components/icons";

interface EventCardProps {
  event: Event;
  imageUrl: string;
  onClick: (eventId: string) => void;
}

const EventCard: FC<EventCardProps> = memo(({ event, imageUrl, onClick }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(event.id);
    }
  };

  return (
    <div className="xs:w-100 md:w-150 lg:w-160 2xl:w-260 mx-auto relative group mb-0 z-30">
      <div
        role="button"
        tabIndex={0}
        aria-label={`View details for ${event.title}`}
        className="relative z-10 bg-black text-white font-montserrat-medium flex flex-col sm:flex-row w-full h-[320px] sm:h-[200px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E4DD3B] focus:ring-offset-2 focus:ring-offset-black"
        onClick={() => onClick(event.id)}
        onKeyPress={handleKeyPress}
      >
        {/* Image Container */}
        <div className="relative w-full sm:w-1/4 h-100 sm:h-full mb-3 sm:mb-0 sm:-ml-2 sm:-mt-2">
          <div className="w-full h-full bg-white/10 relative">
            <LazyLoadImage
              src={imageUrl}
              alt={event.title}
              effect="blur"
              className="absolute inset-0 w-full h-full object-cover borde r border-[#fff] rounded-xl"
              wrapperClassName="!absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Main Info */}
        <div className="w-full sm:w-5/12 flex flex-col justify-start pl-0 sm:pl-6 md:pl-4 2xl:pl-8 text-left">
          <h2 className="text-md sm:text-[0.85rem] md:text-[0.8rem] 2xl:text-[1.2rem] font-dela-gothic-one text-white uppercase truncate pr-8 sm:pr-0">
            {event.title}
          </h2>
          <div className="flex-grow overflow-hidden">

          </div>
          <p className="text-xs hidden sm:block sm:text-[0.6rem] 2xl:text-xs text-[#E4DD3B] font-montserrat-medium mt-1.5 transition-colors">
            Read More →
          </p>
        </div>

        {/* Side Info */}
        <div className="text-[0.75rem] sm:text-[0.65rem] md:text-[0.65rem] 2xl:text-[0.9rem] w-full sm:w-1/3 flex flex-col pl-0 sm:pl-4 md:pl-3 2xl:pl-6 mt-3 sm:mt-0">
          <div className="w-full flex flex-col space-y-2">
              {/* Location */}
              <div className="flex items-center">

                <Icon.Location />
                <p className="text-white font-montserrat-medium ml-2 truncate">
                  {event.venue}
                </p>
              </div>

              {/* Times */}
              <div className="flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E4DD3B] flex-shrink-0" />
                <p className="text-white font-montserrat-medium ml-2 truncate">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon.Ticket />
                  <p className="text-white font-montserrat-medium ml-2">
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
                  <div className="flex items-center justify-center h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#E4DD3B]">
                    <Icon.Facebook />
                  </div>
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

export default EventCard;
