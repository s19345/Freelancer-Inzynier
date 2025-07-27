import useAuthStore from "../../zustand_store/authStore";
import React, {useEffect, useState} from "react";
import {USERS_LIST_URL} from "../../settings";
import InvitationsDump from "./InvitationListDump";
import useGlobalStore from "../../zustand_store/globalInfoStore";


const InvitationList = () => {
    const token = useAuthStore(state => state.token);
    const [friendsInvitations, setFriendsInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);
    const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});


    const fetchFriendsInvitations = async (page) => {
            try {
                const res = await fetch(`${USERS_LIST_URL}friend-request-receive/?page=${page}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie uda³o siê pobraæ zaproszeñ");
                }

                const data = await res.json();
                setFriendsInvitations(data.results);
                setPagination({
                    next: data.next,
                    prev: data.previous,
                    pages: data.total_pages,
                    currentPage: data.current_page
                });

            } catch
                (err) {
                setError(err.message);
            } finally {
                setLoading(false);

            }
        }
    ;


    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
        fetchFriendsInvitations(page);
    }

    useEffect(() => {
        fetchFriendsInvitations(pagination.currentPage);
    }, [token]);


    useEffect(() => {
            // todo: tymczasowe zdjêcia zamieniæ na prawdziwe zdjêcia userów
            const fetchFriendsWithPhotos = async () => {
                try {
                    const res = await fetch("https://picsum.photos/v2/list");
                    const data = await res.json();

                    setFriendsInvitations((prevFriends) =>
                        prevFriends.map((friend, index) => ({
                            ...friend,
                            sender: {
                                ...friend.sender,
                                profile_picture: data[index % data.length].download_url,
                            },
                        }))
                    );
                } catch (error) {
                    console.error("B³±d podczas pobierania zdjêæ:", error);
                }
            };

            fetchFriendsWithPhotos();
        },
        [friendsInvitations]
    );

    const acceptFriendInvitations = async (id) => {
        try {
            const res = await fetch(`${USERS_LIST_URL}friend-request-receive/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({id: id}),
            });

            if (!res.ok) {
                throw new Error("Nie uda³o siê zaakceptowaæ zaproszenia");
            }

            const data = await res.json();
            const key = Object.keys(data)[0];
            const message = data[key];
            setFriendsInvitations(friendsInvitations.filter(invitation => invitation.id !== id));
            setMessage(message);
            setType(key);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);

        }
    };

    const handleAccept = (projectId) => {
        acceptFriendInvitations(projectId);
    };

    return (
        <InvitationsDump invitations={friendsInvitations} handleAccept={handleAccept} pagination={pagination}
                         handleChange={handlePageChange}/>
    )
};

export default InvitationList;