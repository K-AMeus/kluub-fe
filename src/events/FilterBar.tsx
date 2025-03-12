import { FC, useMemo } from "react";

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
  filterDate: string;
  setFilterDate: React.Dispatch<React.SetStateAction<string>>;
  filterVenue: string;
  setFilterVenue: React.Dispatch<React.SetStateAction<string>>;
  filterPrice: string;
  setFilterPrice: React.Dispatch<React.SetStateAction<string>>;
  sortByLikes: string;
  setSortByLikes: React.Dispatch<React.SetStateAction<string>>;
}

const FilterBar: FC<FilterBarProps> = ({
  events,
  filterDate,
  setFilterDate,
  filterVenue,
  setFilterVenue,
  filterPrice,
  setFilterPrice,
  sortByLikes,
  setSortByLikes,
}) => {
  const uniqueVenues = useMemo(
    () => Array.from(new Set(events.map((e) => e.location))),
    [events]
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 my-4">
      {/* Filter by Date */}
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="bg-black border-2 border-white text-white p-2"
        aria-label="Filter by date"
      />

      {/* Filter by Venue */}
      <select
        value={filterVenue}
        onChange={(e) => setFilterVenue(e.target.value)}
        className="bg-black border-2 border-white text-white p-2"
        aria-label="Filter by venue"
      >
        <option value="">All Venues</option>
        {uniqueVenues.map((venue) => (
          <option key={venue} value={venue}>
            {venue}
          </option>
        ))}
      </select>

      {/* Filter by Price */}
      <select
        value={filterPrice}
        onChange={(e) => setFilterPrice(e.target.value)}
        className="bg-black border-2 border-white text-white p-2"
        aria-label="Filter by price"
      >
        <option value="">All Prices</option>
        <option value="free">Free</option>
        <option value="paid">Paid</option>
      </select>

      {/* Sort by Likes */}
      <select
        value={sortByLikes}
        onChange={(e) => setSortByLikes(e.target.value)}
        className="bg-black border-2 border-white text-white p-2"
        aria-label="Sort by likes"
      >
        <option value="">Sort by Likes</option>
        <option value="asc">Likes: Low to High</option>
        <option value="desc">Likes: High to Low</option>
      </select>
    </div>
  );
};

export default FilterBar;
