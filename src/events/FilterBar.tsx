import { FC, useState, useRef, useEffect } from "react";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface EventItem {
  id: string;
  name: string;
  dateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  ticketPrice: number;
  likeCount: number;
  likedByUser: boolean;
  imageUrl: string;
}

interface FilterBarProps {
  events: EventItem[];
  venues: string[];
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  filterDate: string;
  setFilterDate: React.Dispatch<React.SetStateAction<string>>;
  filterVenue: string;
  setFilterVenue: React.Dispatch<React.SetStateAction<string>>;
  filterPrice: string;
  setFilterPrice: React.Dispatch<React.SetStateAction<string>>;
  sortByLikes: string;
  setSortByLikes: React.Dispatch<React.SetStateAction<string>>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onSearchKeyPress: (e: React.KeyboardEvent) => void;
}

const FilterBar: FC<FilterBarProps> = ({
  venues,
  searchText,
  setSearchText,
  filterDate,
  setFilterDate,
  filterVenue,
  setFilterVenue,
  filterPrice,
  setFilterPrice,
  sortByLikes,
  setSortByLikes,
  onApplyFilters,
  onClearFilters,
  onSearchKeyPress,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    return filterDate ? new Date(filterDate) : new Date();
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (filterDate) {
      setCurrentMonth(new Date(filterDate));
    }
  }, [filterDate]);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setFilterPrice("");
    setSortByLikes("");

    if (value.startsWith("price_")) {
      setFilterPrice(value.replace("price_", ""));
    } else if (value.startsWith("likes_")) {
      setSortByLikes(value.replace("likes_", ""));
    }
  };

  const getCombinedSortValue = () => {
    if (filterPrice) return `price_${filterPrice}`;
    if (sortByLikes) return `likes_${sortByLikes}`;
    return "";
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    const monthName = currentMonth.toLocaleString("default", { month: "long" });

    days.push(
      <div
        key="header"
        className="flex justify-between items-center mb-2 text-white border-b border-white/20 pb-2"
      >
        <button
          onClick={prevMonth}
          className="text-[#E4DD3B] px-2 hover:bg-white/10 rounded"
        >
          &lt;
        </button>
        <div className="font-medium text-sm">{`${monthName} ${year}`}</div>
        <button
          onClick={nextMonth}
          className="text-[#E4DD3B] px-2 hover:bg-white/10 rounded"
        >
          &gt;
        </button>
      </div>
    );

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    days.push(
      <div
        key="weekdays"
        className="grid grid-cols-7 text-center text-white/70 text-xs mb-1"
      >
        {dayNames.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
    );

    const dayCells = [];
    for (let i = 0; i < firstDay; i++) {
      dayCells.push(<div key={`empty-${i}`} className="py-1"></div>);
    }

    const selectedDate = filterDate ? new Date(filterDate) : null;
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDateToYYYYMMDD(date);

      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      dayCells.push(
        <div
          key={day}
          onClick={() => {
            setFilterDate(dateString);
            setIsDatePickerOpen(false);
          }}
          className={`py-1 text-center text-xs cursor-pointer ${
            isSelected
              ? "bg-[#E4DD3B] text-black font-medium rounded-full"
              : isToday
              ? "border border-[#E4DD3B]/70 text-white rounded-full"
              : "text-white hover:bg-white/10 rounded-full"
          }`}
        >
          {day}
        </div>
      );
    }

    days.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {dayCells}
      </div>
    );

    return days;
  };

  return (
    <div className="mx-auto my-2 bg-black border border-white/70 shadow-md overflow-hidden xs:w-100 md:w-150 lg:w-160 2xl:w-260">
      <div className="p-3 flex items-end justify-between">
        {/* Filters Container */}
        <div className="flex items-end space-x-4 md:w-[28.5rem] 2xl:w-[40rem] text-xs 2xl:text-lg">
          {/* Search Filter */}
          <div className="w-30.5 lg:w-[8rem] 2xl:w-[20rem]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-3.5 w-3.5 text-[#E4DD3B]" />
              </div>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={onSearchKeyPress}
                className="block w-full pl-7 py-1.5 border-b border-white/50 bg-black text-white placeholder-gray-400 focus:outline-none focus:border-[#E4DD3B] transition-colors"
                placeholder="Search..."
                aria-label="Search events"
              />
            </div>
          </div>

          {/* Venue Filter */}
          <div className="lg:w-[9rem] 2xl:w-[20rem]" style={{ zIndex: 30 }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#E4DD3B]"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    stroke="#E4DD3B"
                  />
                  <circle cx="12" cy="10" r="3" stroke="#E4DD3B" />
                </svg>
              </div>
              <select
                value={filterVenue}
                onChange={(e) => setFilterVenue(e.target.value)}
                className={`bg-black/50 border-b border-white/50 p-1.5 pl-7 w-full focus:outline-none focus:border-[#E4DD3B] transition-colors cursor-pointer appearance-none pr-7 ${
                  filterVenue ? "text-white" : "text-gray-400"
                }`}
                aria-label="Filter by venue"
              >
                <option value="">Venues</option>
                {venues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon className="h-3 w-3 text-[#E4DD3B]" />
              </div>
            </div>
          </div>

          {/* Date Filter */}
          <div className="lg:w-[10rem] 2xl:w-[20rem] relative"
            ref={datePickerRef}
            style={{ zIndex: 30 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CalendarIcon className="h-3.5 w-3.5 text-[#E4DD3B]" />
              </div>
              <div
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="bg-black/50 border-b border-white/50 text-white p-1.5 pl-7 w-full cursor-pointer flex justify-between items-center"
              >
                <span
                  className={`truncate mr-2 ${
                    filterDate ? "text-white" : "text-gray-400"
                  }`}
                >
                  {filterDate ? formatDisplayDate(filterDate) : "Select date"}
                </span>
                <ChevronDownIcon className="h-3 w-3 text-[#E4DD3B] flex-shrink-0" />
              </div>

              {/* Custom calendar picker dropdown */}
              {isDatePickerOpen && (
                <div
                  className="fixed w-[220px] bg-black border border-white/50 shadow-lg mt-1 p-2"
                  style={{
                    zIndex: 39,
                    top: datePickerRef.current
                      ? datePickerRef.current.getBoundingClientRect().bottom +
                        window.scrollY
                      : 0,
                    left: datePickerRef.current
                      ? datePickerRef.current.getBoundingClientRect().left +
                        window.scrollX
                      : 0,
                  }}
                >
                  {renderCalendar()}

                  {filterDate && (
                    <div
                      className="mt-2 pt-2 border-t border-white/20 text-white/70 text-xs text-center cursor-pointer hover:bg-white/10"
                      onClick={() => {
                        setFilterDate("");
                        setIsDatePickerOpen(false);
                      }}
                    >
                      Clear date
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sorting */}
          <div className="lg:w-[8rem] 2xl:w-[20rem]" style={{ zIndex: 20 }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <ArrowsUpDownIcon className="h-3.5 w-3.5 text-[#E4DD3B]" />
              </div>
              <select
                value={getCombinedSortValue()}
                onChange={handleSortChange}
                className={`bg-black/50 border-b border-white/50 p-1.5 pl-7 w-full focus:outline-none focus:border-[#E4DD3B] transition-colors cursor-pointer appearance-none pr-7 ${
                  getCombinedSortValue() ? "text-white" : "text-gray-400"
                }`}
                aria-label="Sort events"
              >
                <option value="">Sort by</option>
                <optgroup label="Price">
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </optgroup>
                <optgroup label="Likes">
                  <option value="likes_asc">Likes: Low to High</option>
                  <option value="likes_desc">Likes: High to Low</option>
                </optgroup>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon className="h-3 w-3 text-[#E4DD3B]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0 whitespace-nowrap">
          <button
            onClick={onClearFilters}
            className="flex items-center justify-center px-2.5 py-1 2xl:px-3 2xl:py-1.5  bg-transparent text-white border border-white/50 hover:border-[#E4DD3B] transition-all duration-200 text-xs 2xl:text-sm"
          > 
            <XMarkIcon className="h-3.5 w-3.5 mr-1.5 text-[#E4DD3B]" />
            <span className="font-montserrat-medium tracking-wide">Reset</span>
          </button>

          <button
            onClick={onApplyFilters}
            className="px-3 py-1 2xl:px-4 2xl:py-1.5 bg-transparent border border-[#E4DD3B] text-[#E4DD3B] font-montserrat-medium hover:bg-[#E4DD3B]/10 transition-all duration-200 text-xs 2xl:text-sm tracking-wide"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
