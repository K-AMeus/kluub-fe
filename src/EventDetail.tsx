import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './authentication/AuthContext';
import Footer from './shared/Footer';
import './index.css';

interface EventType {
    id: string;
    name: string;
    description: string;
    location: string;
    dateTime: string;
    endDateTime: string;
    imageUrl: string;
    ticketPrice: number;
    likeCount: number;
    likedByUser: boolean;
}

const EventDetail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [isLiking, setIsLiking] = useState<boolean>(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const config = user
                    ? { headers: { Authorization: `Bearer ${await user.getIdToken()}` } }
                    : {};
                const response = await axios.get<EventType>(
                    `https://partynbackend-production.up.railway.app/events/${id}`,
                    config
                );
                setEvent(response.data);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Error fetching event details. Please try again later.');
            }
        };

        fetchEvent();
        window.scrollTo(0, 0);
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            return navigate('/auth?mode=login');
        }
        if (isLiking || !event) return;

        setIsLiking(true);
        const currentLikeStatus = event.likedByUser;

        // Optimistic UI update
        setEvent({
            ...event,
            likeCount: currentLikeStatus ? event.likeCount - 1 : event.likeCount + 1,
            likedByUser: !currentLikeStatus,
        });

        try {
            const response = await axios.post<EventType>(
                `https://partynbackend-production.up.railway.app/events/${id}/like`,
                {},
                { headers: { Authorization: `Bearer ${await user.getIdToken()}` } }
            );
            setEvent(response.data);
        } catch (err) {
            console.error('Error toggling like:', err);
            // revert optimistic update
            setEvent({
                ...event,
                likeCount: currentLikeStatus
                    ? event.likeCount + 1
                    : event.likeCount - 1,
                likedByUser: currentLikeStatus,
            });
            alert('Failed to update like status. Please try again.');
        } finally {
            setIsLiking(false);
        }
    };

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>;
    }
    if (!event) {
        return <p className="text-white text-center">Loading...</p>;
    }

    return (
        <div className="relative min-h-screen flex flex-col text-white font-montserrat-medium">
            <div className="absolute inset-0 area z-0">
            </div>

            <div className="relative py-12 sm:max-w-6xl w-full sm:mx-auto px-8 flex-grow">
                <div className="relative">
                    <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-96 object-cover rounded-lg mb-4 filter blur-sm"
                    />
                    {/* Date Bubble */}
                    <div className="absolute top-4 left-4 z-20">
                        <div
                            className="flex-shrink-0 w-20 h-20 rounded-full bg-black text-white border-2 text-[1.1rem]
                         border-white p-3 font-bold font-montserrat-medium"
                            style={{ transform: 'rotate(-15deg)' }}
                        >
                            <div className="text-center">
                                <p>{new Date(event.dateTime).getDate()}</p>
                                <p>
                                    {new Date(event.dateTime).toLocaleString('default', {
                                        month: 'short',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Overlay Title */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4 border-2 border-white">
                        <h1 className="text-lg sm:text-[2.00rem] font-dela-gothic-one text-white uppercase">
                            {event.name}
                        </h1>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Info + Like */}
                    <div className="relative self-start inline-block">
                        <div className="absolute w-full h-full translate-x-1.5 translate-y-1.5 bg-[#E4DD3B] z-0"></div>
                        <div className="relative z-10 p-4 bg-black border-2 border-white space-y-4">
                            {/* Location */}
                            <div className="flex items-center space-x-2">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#FFFFFF" />
                                    <circle cx="12" cy="10" r="3" stroke="#FFFFFF" />
                                </svg>
                                <p className="text-[1.1rem] text-white font-montserrat-medium ml-2">
                                    {event.location}
                                </p>
                            </div>

                            {/* Time */}
                            <div className="flex items-center space-x-2">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                                        fill="#FFFFFF"
                                    />
                                    <path
                                        d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
                                        fill="#FFFFFF"
                                    />
                                </svg>
                                <p className="text-[1.1rem] text-white font-montserrat-medium ml-2">
                                    {new Date(event.dateTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}{' '}
                                    -{' '}
                                    {new Date(event.endDateTime).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </p>
                            </div>

                            {/* Ticket Price */}
                            <div className="flex items-center space-x-2">
                                <svg
                                    version="1.0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 512 512"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <g
                                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                        fill="white"
                                        stroke="#FFFFFF"
                                        strokeWidth={200}
                                    >
                                        <path
                                            d="M3920 4683 c-8 -3 -775 -289 -1705 -636 -1054 -393 -1712 -633 -1747 -639 -173 -24 -324 -129 -403 -279 -57 -109 -65 -161 -65 -447 0 -334 -5 -326 190 -335 166 -8 266 -54 356 -164 64 -79 88 -149 88 -263 0 -114 -24 -184 -88 -263 -90 -110 -190 -156 -356 -164 -195 -9 -190 -1 -190 -335 0 -286 8 -338 65 -447 59 -113 168 -207 290 -254 60 -22 64 -22 765 -27 388 -3 1353 -3 2145 0 l1440 5 60 22 c124 47 230 140 290 254 57 109 65 161 65 452 l0 259 -34 34 c-33 33 -36 34 -113 34 -167 0 -272 38 -366 131 -168 168 -168 431 0 597 93 92 201 132 359 132 151 0 154 7 154 332 0 279 -8 335 -59 436 -71 141 -197 241 -356 281 l-40 11 -188 552 c-118 349 -198 567 -215 592 -36 52 -105 102 -166 121 -48 14 -145 19 -176 8z m130 -218 c16 -8 34 -24 40 -35 15 -27 340 -991 340 -1007 0 -11 -291 -13 -1647 -13 -905 0 -1643 3 -1640 6 12 13 2833 1063 2855 1063 13 1 36 -6 52 -14z m-2340 -1341 c0 -70 2 -78 29 -105 21 -21 39 -29 65 -29 81 0 116 43 116 144 l0 66 1373 -2 1372 -3 53 -24 c65 -29 143 -113 168 -178 14 -38 18 -89 22 -240 l4 -193 -34 0 c-66 -1 -175 -30 -258 -71 -162 -79 -293 -244 -334 -419 -20 -83 -20 -217 0 -300 41 -175 172 -340 334 -419 83 -41 192 -70 258 -71 l34 0 -4 -192 c-4 -152 -8 -203 -22 -241 -25 -65 -103 -149 -168 -178 l-53 -24 -1372 -3 -1373 -2 0 66 c0 101 -35 144 -116 144 -26 0 -44 -8 -65 -29 -27 -27 -29 -35 -29 -106 l0 -76 -627 3 -628 3 -53 24 c-65 29 -143 113 -168 178 -14 38 -18 89 -22 241 l-4 192 34 0 c66 1 175 30 258 71 162 79 293 244 334 419 20 83 20 217 0 300 -41 175 -172 340 -334 419 -83 40 -192 70 -257 71 l-33 0 0 165 c0 165 10 246 37 299 21 41 92 115 127 133 78 41 91 42 724 42 l612 1 0 -76z"/>
                                        <path
                                            d="M1774 2650 c-12 -4 -31 -21 -43 -36 -20 -25 -21 -37 -21 -243 0 -240 2 -251 65 -277 46 -19 100 -2 125 39 18 29 20 52 20 234 0 111 -4 213 -10 227 -11 29 -65 66 -95 65 -11 0 -30 -4 -41 -9z"/>
                                        <path
                                            d="M1783 1748 c-17 -4 -41 -20 -52 -34 -20 -25 -21 -40 -21 -245 l0 -219 28 -30 c50 -57 146 -42 172 26 6 14 10 116 10 227 0 184 -2 205 -20 235 -11 17 -21 32 -22 32 -2 0 -17 4 -33 8 -17 5 -44 5 -62 0z"/>
                                    </g>
                                </svg>
                                <p className="text-[1.1rem] text-white font-montserrat-medium ml-2">
                                    {event.ticketPrice > 0 ? `€${event.ticketPrice}` : 'FREE'}
                                </p>
                            </div>

                            {/* Like Button */}
                            <div
                                className={`flex items-center cursor-pointer mt-4 ${
                                    isLiking ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike();
                                }}
                            >
                                <div className="relative flex items-center space-x-2">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M20.8401 4.60999C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.60999L12.0001 5.66999L10.9401 4.60999C9.90843 3.5783 8.50915 2.9987 7.05012 2.9987C5.59109 2.9987 4.19181 3.5783 3.16012 4.60999C2.12843 5.64169 1.54883 7.04096 1.54883 8.49999C1.54883 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6053C22.3096 9.93789 22.4519 9.22248 22.4519 8.49999C22.4519 7.77751 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.60999Z"
                                            fill={event.likedByUser ? '#FFFFFF' : 'none'}
                                            stroke={event.likedByUser ? '#FFFFFF' : '#FFFFFF'}
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                        />
                                    </svg>
                                    <p className="text-[1.1rem] font-montserrat-medium text-white">
                                        {event.likeCount}
                                    </p>
                                    {isLiking && (
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
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

                            {/* Facebook Link */}
                            <div className="mt-2">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-[1.1rem] text-white font-montserrat-medium"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.125v-3.622h3.125v-2.672c0-3.097 1.894-4.785 4.659-4.785 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.762v2.312h3.592l-.467 3.622h-3.125v9.294h6.125c.731 0 1.324-.593 1.324-1.324v-21.351c0-.732-.593-1.325-1.324-1.325z"/>
                                    </svg>
                                    <span>FB Event</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Description */}
                    <div className="md:col-span-2 relative self-start flex min-h-full">
                        <div className="absolute w-full h-full -translate-x-1.5 -translate-y-1.5 bg-[#E4DD3B] z-0"></div>
                        <div className="relative z-10 bg-black border-2 border-white p-4 flex-grow">
                            <p className="text-sm sm:text-base text-white font-montserrat font-light leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full z-50">
                <Footer />
            </div>
        </div>
    );
};

export default EventDetail;
