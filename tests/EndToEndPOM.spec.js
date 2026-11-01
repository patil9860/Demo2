const { test, expect } = require('@playwright/test');
const { PageManager } = require('../pagesTS/PageManager');

const dataset = require("../utils/data.json");

for (const data of dataset) {

    test.only(`Saucedemo End to end order for ${data.TargetProduct}`, async ({ page }) => {

        const pm = new PageManager(page);

        // Login
        await pm.LoginPage.goto();
        await pm.LoginPage.login(data.username, data.password);

        await expect(page).toHaveURL(
            "https://www.saucedemo.com/inventory.html"
        );

        // Add to cart
        await pm.Inventory.addtocart(data.TargetProduct);
        console.log("Item in the cart is verified");

        await pm.Inventory.gotocart();

        // Proceed to checkout
        console.log("Cart Is Verified");

        await pm.CartPage.ProccedToCheckout();

        await expect(page.locator(".title"))
            .toHaveText("Checkout: Your Information");

        console.log(
            await page.locator(".title").textContent()
        );

        // Fill customer information
        await expect(page).toHaveURL(
            "https://www.saucedemo.com/checkout-step-one.html"
        );

        await pm.CheckoutPage.FillCustomerInformation(
            data.name,
            data.last,
            data.code
        );

        await pm.CheckoutPage.ContinueToOverview();

        await expect(page.locator(".title"))
            .toHaveText("Checkout: Overview");

        console.log(
            await page.locator(".title").textContent()
        );

        await pm.CheckoutPage.Finishorder();

        // Order completed
        await expect(page.locator(".title"))
            .toHaveText("Checkout: Complete!");

        await pm.OrderCompleted.GetConfirmationText();

        await expect(page.locator(".complete-header"))
            .toHaveText("Thank you for your order!");

        console.log(
            await page.locator(".complete-header").textContent()
        );
    });
}