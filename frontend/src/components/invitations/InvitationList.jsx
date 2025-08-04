import useAuthStore from "../../zustand_store/authStore";
import React, {useCallback, useEffect, useState} from "react";
import {USERS_LIST_URL} from "../../settings";
import InvitationsDump from "./InvitationListDump";
import useGlobalStore from "../../zustand_store/globalInfoStore";


const InvitationList = () => {
        const token = useAuthStore(state => state.token);
        const backendReceivedURL = `${USERS_LIST_URL}friend-request-receive`
        const backendSentURL = `${USERS_LIST_URL}friend-request-send`;
        const [friendsInvitations, setFriendsInvitations] = useState([]);
        const setMessage = useGlobalStore((state) => state.setMessage);
        const setType = useGlobalStore((state) => state.setType);
        const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});
        const [isSelectedReceived, setIsSelectedReceived] = useState(true);

        const fetchInvitations = useCallback(async (url, page) => {
                try {
                    const res = await fetch(`${url}/?page=${page}`, {
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
                } catch (err) {
                    console.error(err.message);
                }
            }, [token]
        );

        const deleteFriendInvitation = async (id) => {
            try {
                const res = await fetch(`${USERS_LIST_URL}friend-request-delete/${id}/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie uda³o siê usun±æ zaproszenia");
                }

                const data = await res.json();
                const key = Object.keys(data)[0];
                const message = data[key];
                setFriendsInvitations(friendsInvitations.filter(invitation => invitation.id !== id));
                setMessage(message);
                setType(key);

            } catch (err) {
                console.error(err.message);
            }
        }

        const handleDelete = (projectId) => {
            deleteFriendInvitation(projectId);
        };

        const handlePageChange = (page) => {
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
            }));
            fetchInvitations(page);
        }

        useEffect(() => {
                isSelectedReceived ?
                    fetchInvitations(backendReceivedURL, pagination.currentPage) :
                    fetchInvitations(backendSentURL, pagination.currentPage);
            },
            [token, isSelectedReceived, fetchInvitations, backendReceivedURL, backendSentURL, pagination.currentPage]
        );


// ******************************************************************************
// todo: tymczasowe zdjêcia ? zamieniæ na prawdziwe zdjêcia userów
        const fetchFriendsWithPhotos = useCallback(async () => {
                    const user = isSelectedReceived ? "sender" : "receiver";
                    try {
                        const res = await fetch("https://picsum.photos/v2/list");
                        const data = await res.json();

                        setFriendsInvitations((prevFriends) =>
                            prevFriends.map((friend, index) => ({
                                ...friend,
                                [user]: {
                                    ...friend[user],
                                    profile_picture: data[index % data.length].download_url,
                                },
                            }))
                        );
                    } catch (error) {
                        console.error("B³±d podczas pobierania zdjêæ:", error);
                    }
                }, [isSelectedReceived]
            )
        ;
        useEffect(() => {
                fetchFriendsWithPhotos()
            },
            [fetchFriendsWithPhotos]
        )
        ;
// ******************************************************************************


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
                console.error(err.message);
            }
        };

        const handleAccept = (projectId) => {
            acceptFriendInvitations(projectId);
        };


        return (
            <InvitationsDump
                invitations={friendsInvitations}
                handleAccept={handleAccept}
                pagination={pagination}
                handleChange={handlePageChange}
                handleDelete={handleDelete}
                setIsSelectedReceived={setIsSelectedReceived}
            />
        )
    }
;