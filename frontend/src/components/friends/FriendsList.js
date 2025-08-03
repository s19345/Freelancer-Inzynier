import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {USERS_LIST_URL} from "../../settings";
import FriendsDump from "./FriendsListDump"
import useGlobalStore from "../../zustand_store/globalInfoStore";

const FriendList = () => {
    const token = useAuthStore(state => state.token);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});
    const [pageSize, setPageSize] = useState(10);
    const [newFriendsSearching, setNewFriendsSearching] = useState(false);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const fetchFriends = async (page) => {
        const url = newFriendsSearching ? USERS_LIST_URL : USERS_LIST_URL + "friends/";
        if (page) {
            try {
                const res = await fetch(`${url}?page=${page}&page_size=${pageSize}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie uda³o siê pobraæ klientów");
                }

                const data = await res.json();
                const photosRes = await fetch("https://picsum.photos/v2/list");
                const photos = await photosRes.json();


                // __________________________________________________________
                // todo, tymczasowy kod do pobierania zdjêæ profilowych z otwartego api. zamieniæ na prawdziwe zdjêcia userów
                const friendsWithPhotos = data.results.map((friend, index) => ({
                    ...friend,
                    profile_picture: photos[index % photos.length].download_url,
                }));
                // __________________________________________________________
                setFriends(friendsWithPhotos);
                setPagination({
                    next: data.next,
                    prev: data.previous,
                    pages: data.total_pages,
                    currentPage: data.current_page
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleInvite = async (friend) => {
        try {
            const res = await fetch(`${USERS_LIST_URL}friend-request-send/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({receiver: friend}),
            });

            const data = await res.json();

            if (!res.ok) {
                setType(data.key || "error");
                setMessage(data.error || "Nie uda³o siê wys³aæ zaproszenia");
                return;
            }

            setType(data.key || "success");
            setMessage(data.value || "Zaproszenie wys³ane");


        } catch (error) {
            setError("Nie uda³o siê wys³aæ zaproszenia (b³±d sieci)");
        }
    };


    const changePageSize = (newSize) => {
        setPageSize(newSize);
        setPagination(prev => ({...prev, currentPage: 1}));
    }

    const toggleNewFriendsSearching = () => {
        setNewFriendsSearching(prev => !prev);
        setPagination(prev => ({...prev, currentPage: 1}));
    };

    useEffect(() => {
        fetchFriends(pagination.currentPage);
    }, [token, newFriendsSearching, pagination.currentPage, pageSize]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
        fetchFriends(page);
    }


    return <FriendsDump
        toggleNewFriendsSearching={toggleNewFriendsSearching}
        collaborators={friends}
        pagination={pagination}
        handleChange={handlePageChange}
        newFriendsSearching={newFriendsSearching}
        pageSize={pageSize}
        changePageSize={changePageSize}
        handleInvite={handleInvite}
    />
}

export default FriendList;