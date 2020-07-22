// Saves options to chrome.storage
function save_options() {
    var url = document.getElementById("url").value;
    var key = document.getElementById("key").value;
    var secret = document.getElementById("secret").value;

    chrome.storage.local.set(
        {
            url,
            key,
            secret,
        },
        function () {
            var status = document.getElementById("status");
            status.textContent = "Options saved.";
            setTimeout(function () {
                status.textContent = "";
            }, 750);
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.local.get(
        {
            url: "",
            key: "",
            secret: "",
        },
        function (items) {
            document.getElementById("url").value = items.url;
            document.getElementById("key").value = items.key;
            document.getElementById("secret").value = items.secret;
        }
    );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
