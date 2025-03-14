import { FC, useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./authentication/AuthContext";
import { getAuth } from "firebase/auth";
import { createEvent } from "./shared/reducers/event";

const AdminPanel: FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [ticket, setTicket] = useState(0);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [topPick, setTopPick] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const auth = getAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const idTokenResult = await auth.currentUser?.getIdTokenResult();
        setIsAdmin(!!idTokenResult?.claims.admin);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user, auth]);

  if (isAdmin === null) {
    return <div className="text-white">Loading admin status...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const openTimeUTC = new Date(openTime).toISOString();
      const closeTimeUTC = new Date(closeTime).toISOString();
      const eventData = {
        title,
        description,
        venue,
        city,
        likeCount: 0,
        fbLink: "",
        imageUrl: "",
        ticket,
        openTime: openTimeUTC,
        closeTime: closeTimeUTC,
        topPick,
      };

      await createEvent(eventData, file || undefined);

      setSuccess("Event posted successfully!");
      setError(null);

      setTitle("");
      setDescription("");
      setVenue("");
      setCity("");
      setTicket(0);
      setOpenTime("");
      setCloseTime("");
      setTopPick(false);
      setFile(null);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to post event");
      setSuccess(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-purple-950 to-orange-700 py-6 flex items-center justify-center sm:py-12">
      <div className="relative w-full max-w-4xl bg-gray-950 bg-opacity-80 text-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Post a New Event
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="title">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="dateTime">
              Start Date and Time
            </label>
            <input
              type="datetime-local"
              id="openTime"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="endDateTime"
            >
              End Date and Time
            </label>
            <input
              type="datetime-local"
              id="closeTime"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="ticketPrice"
            >
              Ticket Price
            </label>
            <input
              type="number"
              id="ticket"
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <p className="block text-sm font-bold mb-2">City</p>
            <div className="flex space-x-4">
              <label htmlFor="city-tallinn">
                <input
                  type="radio"
                  id="city-tallinn"
                  name="city"
                  value="Tallinn"
                  checked={city === "Tallinn"}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                Tallinn
              </label>
              <label htmlFor="city-tartu">
                <input
                  type="radio"
                  id="city-tartu"
                  name="city"
                  value="Tartu"
                  checked={city === "Tartu"}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                Tartu
              </label>
              <label htmlFor="city-parnu">
                <input
                  type="radio"
                  id="city-parnu"
                  name="city"
                  value="Pärnu"
                  checked={city === "Pärnu"}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                Pärnu
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="topPick"
              checked={topPick}
              onChange={(e) => setTopPick(e.target.checked)}
              className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
            />
            <label className="block text-sm font-bold" htmlFor="topPick">
              Top Pick
            </label>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="file">
              Upload Image
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
