/* =====================================================
   HANORA - PRODUCTS / CART / EMAILJS
   نسخه بدون سیستم لاگین
   ===================================================== */

let cart = [];


/* =====================================================
   EMAILJS CONFIG
   ===================================================== */

const EMAILJS_PUBLIC_KEY = "DmbbqZJaC08wVQpvR";
const EMAILJS_SERVICE_ID = "service_2owmemf";
const EMAILJS_TEMPLATE_ID = "template_4xu77tc";


/* =====================================================
   شروع صفحه
   ===================================================== */

window.addEventListener("DOMContentLoaded", () => {

    // شروع EmailJS
    if (typeof emailjs !== "undefined") {

        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

    } else {

        console.warn(
            "EmailJS library is not loaded."
        );

    }

    updateCartDisplay();

});


/* =====================================================
   نمایش سبد خرید
   ===================================================== */

function updateCartDisplay() {

    const cartList =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const emptyMsg =
        document.getElementById("emptyCartMsg");


    if (!cartList) {

        if (cartCount) {
            cartCount.textContent = cart.length;
        }

        return;
    }


    cartList.innerHTML = "";


    cart.forEach((item, index) => {

        const li =
            document.createElement("li");


        li.className =
            "list-group-item d-flex justify-content-between align-items-center px-0";


        li.innerHTML = `

            <span>

                <strong>
                    ${escapeHtml(item.name)}
                </strong>

                ${
                    item.flavor
                        ? `
                            <small class="d-block text-muted mt-1">
                                🍓 طعم: ${escapeHtml(item.flavor)}
                            </small>
                        `
                        : ""
                }

            </span>


            <button
                type="button"
                class="btn btn-sm btn-outline-danger rounded-pill px-3"
                onclick="removeFromCart(${index})"
            >
                حذف
            </button>

        `;


        cartList.appendChild(li);

    });


    /* تعداد محصولات */

    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }


    /* پیام سبد خالی */

    if (emptyMsg) {

        emptyMsg.style.display =
            cart.length === 0
                ? "block"
                : "none";

    }

}


/* =====================================================
   افزودن محصول بدون طعم
   ===================================================== */

function addToCart(productName) {

    if (!productName) {

        console.error(
            "Product name is missing."
        );

        return;
    }


    cart.push({

        name: productName,

        flavor: null

    });


    updateCartDisplay();

    showAddedButton();

}


/* =====================================================
   افزودن محصول با طعم
   ===================================================== */

function addProductWithFlavor(
    productName,
    selectId
) {

    if (!productName) {

        console.error(
            "Product name is missing."
        );

        return;
    }


    const select =
        document.getElementById(selectId);


    if (!select) {

        console.error(
            "Flavor select not found:",
            selectId
        );

        return;
    }


    const flavor =
        select.value.trim();


    if (!flavor) {

        alert(
            "لطفاً ابتدا طعم مورد نظر را انتخاب کنید."
        );

        select.focus();

        return;
    }


    cart.push({

        name: productName,

        flavor: flavor

    });


    updateCartDisplay();

    showAddedButton();

}


/* =====================================================
   افکت دکمه افزودن
   ===================================================== */

function showAddedButton(button = null) {

    const btn =
        button ||
        document.activeElement;


    if (
        !btn ||
        btn.tagName !== "BUTTON"
    ) {

        return;
    }


    const original =
        btn.innerHTML;


    btn.innerHTML =
        "✓ اضافه شد";


    btn.disabled = true;


    setTimeout(() => {

        btn.innerHTML =
            original;

        btn.disabled = false;

    }, 1200);

}


/* =====================================================
   حذف محصول
   ===================================================== */

function removeFromCart(index) {

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {

        return;
    }


    cart.splice(index, 1);


    updateCartDisplay();

}


/* =====================================================
   ثبت سفارش با EmailJS
   ===================================================== */

async function sendOrderEmail(event) {

    /*
       جلوگیری از رفرش شدن صفحه
    */

    if (event) {

        event.preventDefault();

    }


    /* =====================================================
       بررسی سبد
       ===================================================== */

    if (cart.length === 0) {

        alert(
            "سبد خرید شما خالی است!"
        );

        return false;
    }


    /* =====================================================
       دریافت فیلدهای فرم
       ===================================================== */

    const nameInput =
        document.getElementById("userName");


    const phoneInput =
        document.getElementById("userPhone");


    const form =
        document.getElementById("emailForm");


    const submitButton =
        document.querySelector(
            "#emailForm button[type='submit']"
        );


    const thankMessage =
        document.getElementById(
            "thankMessage"
        );


    /* =====================================================
       بررسی فرم
       ===================================================== */

    if (
        !nameInput ||
        !phoneInput ||
        !form
    ) {

        alert(
            "خطایی در فرم سفارش رخ داده است."
        );

        return false;
    }


    /* =====================================================
       دریافت اطلاعات مشتری
       ===================================================== */

    const name =
        nameInput.value.trim();


    const phone =
        phoneInput.value.trim();


    /* =====================================================
       بررسی اطلاعات
       ===================================================== */

    if (
        !name ||
        !phone
    ) {

        alert(
            "لطفاً نام و شماره تماس را وارد کنید."
        );

        return false;
    }


    /* =====================================================
       ساخت لیست محصولات
       ===================================================== */

    const productsText =
        cart
            .map((item, index) => {

                if (item.flavor) {

                    return (
                        `${index + 1}. ` +
                        `${item.name} | ` +
                        `طعم: ${item.flavor}`
                    );

                }


                return (
                    `${index + 1}. ` +
                    `${item.name}`
                );

            })
            .join("\n");


    /* =====================================================
       تعداد کل محصولات
       ===================================================== */

    const totalItems =
        cart.length;


    /* =====================================================
       تاریخ و ساعت
       ===================================================== */

    const now =
        new Date();


    const orderDate =
        now.toLocaleDateString(
            "fa-IR"
        );


    const orderTime =
        now.toLocaleTimeString(
            "fa-IR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    /* =====================================================
       شماره سفارش
       ===================================================== */

    const orderNumber =
        "HN-" +
        Date.now()
            .toString()
            .slice(-8);


    /* =====================================================
       اطلاعات ارسال به EmailJS
       ===================================================== */

    const templateParams = {

        order_number:
            orderNumber,


        customer_name:
            name,


        customer_phone:
            phone,


        /*
           چون سایت لاگین ندارد،
           ایمیل مشتری نداریم.
        */

        customer_email:
            "",


        products:
            productsText,


        total_items:
            totalItems,


        order_date:
            orderDate,


        order_time:
            orderTime,


        message:
            productsText

    };


    /* =====================================================
       حالت ارسال
       ===================================================== */

    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-2"
            ></span>

            در حال ارسال...

        `;

    }


    if (thankMessage) {

        thankMessage.textContent =
            "";

    }


    /* =====================================================
       ارسال سفارش
       ===================================================== */

    try {

        /* بررسی EmailJS */

        if (
            typeof emailjs ===
            "undefined"
        ) {

            throw new Error(
                "EmailJS library is not loaded."
            );

        }


        /* ارسال ایمیل */

        const response =
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );


        console.log(
            "EmailJS SUCCESS:",
            response
        );


        /* =====================================================
           موفقیت
           ===================================================== */

        if (thankMessage) {

            thankMessage.innerHTML = `

                ✅ سفارش شما با موفقیت ثبت شد.

                <br>

                <small>

                    شماره سفارش:

                    <strong>
                        ${escapeHtml(orderNumber)}
                    </strong>

                </small>

                <br>

                <small>
                    به‌زودی با شما تماس می‌گیریم.
                </small>

            `;

        }


        /* پاک کردن فرم */

        form.reset();


        /* خالی کردن سبد */

        cart = [];


        updateCartDisplay();


        /* اسکرول به پیام */

        if (thankMessage) {

            thankMessage.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }


    } catch (error) {

        console.error(
            "EmailJS ERROR:",
            error
        );


        /*
           اگر ارسال شکست خورد،
           سبد خرید پاک نمی‌شود.
        */

        if (thankMessage) {

            thankMessage.innerHTML = `

                ❌ ارسال سفارش انجام نشد.

                <br>

                <small>
                    لطفاً دوباره تلاش کنید.
                </small>

            `;

        }


        alert(
            "ارسال سفارش با خطا مواجه شد. لطفاً دوباره امتحان کنید."
        );


    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;


            submitButton.innerHTML =
                "ثبت سفارش";

        }

    }


    return false;

}


/* =====================================================
   جلوگیری از HTML Injection
   ===================================================== */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}