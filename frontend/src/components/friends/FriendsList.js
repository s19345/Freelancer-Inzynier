import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {USERS_LIST_URL} from "../../settings";
import FriendsDump from "./FriendsListDump"
import useGlobalStore from "../../zustand_store/globalInfoStore";

const FriendList = () => {
    const token = useAuthStore(state => state.token);
    const [friends, setFriends] = useState([]);
    const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});
    const [pageSize, setPageSize] = useState(10);
    const [newFriendsSearching, setNewFriendsSearching] = useState(false);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const fetchFriends = useCallback(async (page) => {
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
                    throw new Error("Nie uda³o siê pobraæ znajomych");
                }

                const data = await res.json();
                setFriends(data.results);
                setPagination({
                    next: data.next,
                    prev: data.previous,
                    pages: data.total_pages,
                    currentPage: data.current_page
                });
            } catch (err) {
                console.error(err.message);
            }
        }
    }, [token, newFriendsSearching, pageSize]);

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
            setMessage("Nie uda³o siê wys³aæ zaproszenia (b³±d sieci)");
            setType("error");
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
    }, [fetchFriends, pagination.currentPage]);

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