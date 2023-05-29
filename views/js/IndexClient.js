const socket = io();

let fileURL;

//  Formularios
const formLogin = document.querySelector("#formLogin");
const formContentChat = document.querySelector(".bodyChat");
const formShowUsers = document.querySelector("#formShowUsers");
const formChatGrupal = document.querySelector("#formChatGrupal");

//  Textbox's
const txtUserNickName = document.querySelector("#userNickName");
const txtUserMessage = document.querySelector("#userMessage");

//  File - Image
const userFile = document.querySelector("#userFile");

//  Button's
const btnrRegisterUser = document.querySelector("#registerUser");
const btnSendMessage = document.querySelector("#sendMessage");
const btnSendFile = document.querySelector("#sendFile");

//  Print
const printUsersActive = document.querySelector("#usersActive");
const printMessages = document.querySelector("#messages");

formContentChat.style.display = "none";
formShowUsers.style.display = "none";
formChatGrupal.style.display = "none";

socket.on("login", () => {
  alert(
    "¡Bienvenido " +
      txtUserNickName.value.trim() +
      "!\nRecuerda, respetar a los demás usuarios."
  );
  formLogin.style.display = "none";
  formContentChat.style.display = "flex";
  formShowUsers.style.display = "block";
  formChatGrupal.style.display = "block";
document.querySelector("#userChat").innerHTML=txtUserNickName.value+"<br /><p class='text-dark fs-6'>en línea</p>";
document.querySelector("#UserNick").value=txtUserNickName.value;
if (document.getElementById("av1").checked==true)
{
  document.getElementById("imgUserchat").src=document.getElementById("av1").value;
}
if (document.getElementById("av2").checked==true)
{
  document.getElementById("imgUserchat").src=document.getElementById("av2").value;
}
if (document.getElementById("av3").checked==true)
{
  document.getElementById("imgUserchat").src=document.getElementById("av3").value;

}
if (document.getElementById("av4").checked==true)
{
  document.getElementById("imgUserchat").src=document.getElementById("av4").value;
}
});

socket.on("userExists", () => {
  alert(
    "El nickname: " +
      txtUserNickName.value.trim() +
      " ya está en uso, intenta con otro."
  );
  txtUserNickName.value = "";
});

socket.on("activeSessions", (users) => {
  printUsersActive.innerHTML = "";
  for (const user in users) {
    printUsersActive.insertAdjacentHTML("beforeend", `<li>${user}</li>`);
  }
});

socket.on("sendMessage", ({ message, user, image }) => {
  if(user==document.querySelector("#UserNick").value)
  {
    printMessages.insertAdjacentHTML(
      "beforeend",
      `<div class="message my_message "><p>${message}<br /><span>${user}</span></p></div>`
    );
    if (image !== undefined) {
      const imagen = document.createElement("img");
      imagen.src = image;
      printMessages.appendChild(imagen);
    }
    printMessages.scrollTop = printMessages.scrollHeight;
  }
  else
  {
    printMessages.insertAdjacentHTML(
      "beforeend",
      `<div class="message frnd_message "><p>${message}<br /><span>${user}</span></p></div>`
    );
    if (image !== undefined) {
      const imagen = document.createElement("img");
      imagen.src = image;
      printMessages.appendChild(imagen);
    }
    printMessages.scrollTop = printMessages.scrollHeight;
  }
 
});

txtUserNickName.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    btnrRegisterUser.click();
  }
});

btnrRegisterUser.addEventListener("click", () => {
  if (txtUserNickName.value.trim() != "") {
    let username = txtUserNickName.value.trim();
    socket.emit("register", username);
  }
});

btnSendMessage.addEventListener("click", () => {
  if (fileURL != undefined) {
    if (txtUserMessage.value.startsWith("-private:")) {
      const selectUser = txtUserMessage.value.split(" ")[1];
      const message = txtUserMessage.value.substr(selectUser.length + 10);
      socket.emit("sendMessagesPrivate", {
        message,
        image: fileURL,
        selectUser,
      });
    } else {
      socket.emit("sendMessage", {
        message: txtUserMessage.value.trim(),
        image: fileURL,
      });
    }
  } else {
    if (txtUserMessage.value.trim() != "") {
      if (txtUserMessage.value.startsWith("-private:")) {
        const selectUser = txtUserMessage.value.split(" ")[1];
        const message = txtUserMessage.value.substr(selectUser.length + 10);
        socket.emit("sendMessagesPrivate", {
          message,
          image: fileURL,
          selectUser,
        });
      } else {
        socket.emit("sendMessage", {
          message: txtUserMessage.value.trim(),
          image: fileURL,
        });
      }
    }
  }

  txtUserMessage.value = "";
  fileURL = undefined;
  printMessages.scrollTop = printMessages.scrollHeight;
});

txtUserMessage.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (fileURL != undefined) {
      if (txtUserMessage.value.startsWith("-private:")) {
        const selectUser = txtUserMessage.value.split(" ")[1];
        const message = txtUserMessage.value.substr(selectUser.length + 10);
        socket.emit("sendMessagesPrivate", {
          message,
          image: fileURL,
          selectUser,
        });
      } else {
        socket.emit("sendMessage", {
          message: txtUserMessage.value.trim(),
          image: fileURL,
        });
      }
    } else {
      if (txtUserMessage.value.trim() != "") {
        if (txtUserMessage.value.startsWith("-private:")) {
          const selectUser = txtUserMessage.value.split(" ")[1];
          const message = txtUserMessage.value.substr(selectUser.length + 10);
          socket.emit("sendMessagesPrivate", {
            message,
            image: fileURL,
            selectUser,
          });
        } else {
          socket.emit("sendMessage", {
            message: txtUserMessage.value.trim(),
            image: fileURL,
          });
        }
      }
    }
    txtUserMessage.value = "";
    fileURL = undefined;
  }

  printMessages.scrollTop = printMessages.scrollHeight;
});

btnSendFile.addEventListener("click", () => {
  userFile.click();
});

userFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    fileURL = reader.result;
  };
  reader.readAsDataURL(file);
  fileURL
    ? alert("Error al adjuntar, seleccione nuevamente.")
    : alert("Foto adjunta, lista para enviar.");
});
