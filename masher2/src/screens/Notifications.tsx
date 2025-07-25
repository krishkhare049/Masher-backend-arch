
import { useEffect, useState } from "react";
// import withObservables from "@nozbe/with-observables";
import { withObservables } from '@nozbe/watermelondb/react'
import { Q } from "@nozbe/watermelondb";
import { notificationsCollection } from "../../index.native";
import BaseNotifications from "./BaseNotifications";
import { useDispatch } from "react-redux";
import { hideTabBar, showTabBar } from "../uiSlice";
const PAGE_SIZE = 30;

function Notifications() {
  // const dispatch = useDispatch();
  // // Hide bottom bar-
  // useEffect(() => {
  //   dispatch(hideTabBar());

  //   return () => {
  //     dispatch(showTabBar()); // Show tab bar again on unmount
  //   };
  // }, []);

  const [page, setPage] = useState(1);

  const EnhancedNotifications = withObservables(["page"], () => ({
    notifications: notificationsCollection.query(
      // Q.sortBy("created_at", "desc"),
      Q.sortBy("created_at", Q.desc),
      Q.skip((page - 1) * PAGE_SIZE),
      Q.take(PAGE_SIZE)
    ),
  }))(BaseNotifications);

  return <EnhancedNotifications page={page} setPage={setPage} />;
}

export default Notifications;
