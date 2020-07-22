chrome.storage.local.get(
    {
        url: "",
        key: "",
        secret: "",
    },
    function (config) {
        let KEY = config.key;
        let SECRET = config.secret;
        let WORDPRESS_URL = config.url;

        // wait until page is loaded (element exists) and then call replaceImages method with all data needed
        let checkExist = setInterval(() => {
            let order_id_element = document.body.querySelector("div.modal-header span.colValue.editData");
            if (order_id_element) {
               clearInterval(checkExist);
               replaceImages(+order_id_element.innerHTML, WORDPRESS_URL, KEY, SECRET);
            }
        }, 100); // check every 100ms
    }
);

function replaceImages(order_id, WORDPRESS_URL, KEY, SECRET) {
    let product_url = `${WORDPRESS_URL}/wp-json/wc/v3/orders/${order_id}?consumer_key=${KEY}&consumer_secret=${SECRET}`;

    let items = document.body
        .querySelector("#details #orderDetailsBody")
        .querySelectorAll("tr.detailRow");

    fetch(product_url)
        .then((res) => res.json())
        .then((out) => {
            let products = out.line_items;

            for (let product in products) {
                let meta_data = products[product].meta_data;
                let zakeke_data = meta_data.find((obj) => {
                    return obj.key === "zakeke_data";
                });
                if (zakeke_data) {
                    let previews = zakeke_data.value.previews;
                    let imageString = "";

                    for (let pre in previews) {
                        if (+pre !== 0)
                            imageString +=
                                '<img src="' +
                                previews[pre].url +
                                '" height="200px" width="200px"/>';
                    }

                    if (imageString !== "") {
                        items[product]
                            .querySelectorAll("td")[0]
                            .querySelector(
                                "span.detailImg"
                            ).innerHTML = imageString;
                    }
                }
            }
        })
        .catch((err) => {
            alert(
                "Failed to fetch data. Did you configure the plugin correctly?"
            );
            console.error(err);
        });
}