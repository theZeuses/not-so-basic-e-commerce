export const discountedMailView = (payload: any) : string => {
    return `
        <h5>Dear ${payload.name}</h5>
        <br>
        <p>
            At least ${payload.discounted_product_count} products from your cart are being sold at a lower price than regular.
            Confirm your order before the discounts expire.
            <br>
        </p>
        <br>
        <br>
        <h5>Regards</h5>
        <h6>BasicCom</h6>
    `;
}