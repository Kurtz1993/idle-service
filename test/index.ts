import service, { IdleEvents } from "../lib";

service.start();

document.getElementById("resume").addEventListener("click", service.start.bind(service));

service.on(IdleEvents.UserIsBack, () => {
  console.log("User is back!");
});

service.on(IdleEvents.UserHasTimedOut, () => {
  console.log("User has timed out!");
});
