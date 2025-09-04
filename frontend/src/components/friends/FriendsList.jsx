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
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({});

    const fetchFriends = useCallback(async (page, filters) => {
        setIsLoading(true);
        const url = newFriendsSearching ? USERS_LIST_URL : USERS_LIST_URL + "friends/";
        if (page) {
            try {
                const params = new URLSearchParams({
                    page,
                    page_size: pageSize,
                    ...filters,
                });
                const res = await fetch(`${url}?${params.toString()}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Nie udało się pobrać znajomych");
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
            } finally {
                setIsLoading(false);
            }
        }
    }, [token, newFriendsSearching, pageSize]);

    const changeCurrentPage = (newPage) => {
        if (newPage !== pagination.currentPage) {
            setPagination(prev => ({...prev, currentPage: newPage}));
        }
    }

    const handleInvite = async (friendId) => {
        try {
            const res = await fetch(`${USERS_LIST_URL}friend-request-send/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({receiver: friendId}),
            });

            const data = await res.json();

            if (!res.ok) {
                setType(data.key || "error");
                setMessage(data.error || "Nie udało się wysłać zaproszenia");
                return;
            }

            setType(data.key || "success");
            setMessage(data.value || "Zaproszenie wysłane");
            setFriends((prevFriends) =>
                prevFriends.map((f) =>
                    f.id === friendId ? {...f, request_sent: true} : f
                )
            );

        } catch (error) {
            setMessage("Nie udało się wysłać zaproszenia (błąd sieci)");
            setType("error");
        }
    };

    const changePageSize = (newSize) => {
        setPageSize(newSize);
        changeCurrentPage(1);
    }

    const toggleNewFriendsSearching = () => {
        setFriends([])
        setNewFriendsSearching(prev => !prev);
        changeCurrentPage(1);
    };

    useEffect(() => {
        fetchFriends(pagination.currentPage, filters);
    }, [fetchFriends, pagination.currentPage, filters]);

    const handlePageChange = (page) => {
        if (!isLoading) {
            changeCurrentPage(page);
        }
    }

    const changeFilter = (filters) => {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([key, value]) => value.trim() !== ""
            )
        );
        changeCurrentPage(1);
        setFilters(cleanedFilters);
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
        changeFilter={changeFilter}
        isLoading={isLoading}
    />
}

export default FriendList;