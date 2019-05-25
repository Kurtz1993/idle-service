import { IdleService, IdleEvents } from "../lib";

const service = new IdleService();

service.start();

document.getElementById("resume").addEventListener("click", service.start.bind(service));

service.on(IdleEvents.UserIsBack, () => {
  console.log("User is back!");
});

service.on(IdleEvents.UserHasTimedOut, () => {
  console.log("User has timed out!");
});
