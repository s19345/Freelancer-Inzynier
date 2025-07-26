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

    useEffect(() => {
        const fetchFriendsInvitations = async () => {
            try {
                const res = await fetch(`${USERS_LIST_URL}friend-request-receive/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie uda�o si� pobra� zaprosze�");
                }

                const data = await res.json();
                setFriendsInvitations(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);

            }
        };
        fetchFriendsInvitations();
    }, [token]);

    useEffect(() => {
        // todo: tymczasowe zdj�cia zamieni� na prawdziwe zdj�cia user�w
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
                console.error("B��d podczas pobierania zdj��:", error);
            }
        };

        fetchFriendsWithPhotos();
    }, []);

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
                throw new Error("Nie uda�o si� zaakceptowa� zaproszenia");
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
        console.log(`Accepted project ${projectId}`);
        acceptFriendInvitations(projectId);
    };


    return <InvitationsDump invitations={friendsInvitations} handleAccept={handleAccept}/>
}

export default InvitationList;