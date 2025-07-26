import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {USERS_LIST_URL} from "../../settings";
import FriendsDump from "./FriendsListDump"

const FriendList = () => {
    const token = useAuthStore(state => state.token);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch(`${USERS_LIST_URL}friends/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie uda³o siê pobraæ klientów");
                }

                const data = await res.json();
                setFriends(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [token]);


    useEffect(() => {
        // todo, tymczasowy kod do pobierania zdjêæ profilowych z otwartego api. zamieniæ na prawdziwe zdjêcia userów
        const fetchFriendsWithPhotos = async () => {
            try {
                const res = await fetch("https://picsum.photos/v2/list");
                const data = await res.json();

                setFriends((prevFriends) =>
                    prevFriends.map((friend, index) => ({
                        ...friend,
                        profile_picture: data[index % data.length].download_url,
                    }))
                );
            } catch (error) {
                console.error("B³±d podczas pobierania zdjêæ:", error);
            }
        };

        fetchFriendsWithPhotos();
    }, []);

    return <FriendsDump collaborators={friends}/>
}

export default FriendList;