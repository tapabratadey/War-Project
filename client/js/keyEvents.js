import { socket } from "./game.js";

export function keyEvents() {
  window.addEventListener("keydown", function (e) {
    if (e.key === "d" || e.key === "ArrowRight") {
      e.preventDefault();
      socket.emit("keyPress", { inputId: "right", state: true });
    }
    if (e.key === "a" || e.key === "ArrowLeft") {
      e.preventDefault();
      socket.emit("keyPress", { inputId: "left", state: true });
    }
    if (e.key === "w" || e.key === "ArrowUp") {
      e.preventDefault();
      socket.emit("keyPress", { inputId: "up", state: true });
    }
    if (e.key === "s" || e.key === "ArrowDown") {
      e.preventDefault();
      socket.emit("keyPress", { inputId: "down", state: true });
    }
    if (e.key === " ") {
      e.preventDefault();
      socket.emit("keyPress", { inputId: "shoot", state: true });
    }
  });

  window.addEventListener("keyup", function (e) {
    if (e.key === "d" || e.key === "ArrowRight") {
      socket.emit("keyPress", { inputId: "right", state: false });
    }
    if (e.key === "a" || e.key === "ArrowLeft") {
      socket.emit("keyPress", { inputId: "left", state: false });
    }
    if (e.key === "w" || e.key === "ArrowUp") {
      socket.emit("keyPress", { inputId: "up", state: false });
    }
    if (e.key === "s" || e.key === "ArrowDown") {
      socket.emit("keyPress", { inputId: "down", state: false });
    }
    if (e.key === " ") {
      socket.emit("keyPress", { inputId: "shoot", state: false });
    }
  });
}
