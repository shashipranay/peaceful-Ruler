document.addEventListener("DOMContentLoaded", function () {
    const cart = [];

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productCard = this.closest(".card");
            const productName = productCard.querySelector(".card-title").textContent;
            const productPrice = productCard.querySelector("p strong").textContent;

            cart.push({ name: productName, price: productPrice });
            localStorage.setItem("cart", JSON.stringify(cart));

            alert(`${productName} added to cart!`);
        });
    });
});
