export const mailView = (payload: any) : string => {
    return `
        <h5>Dear ${payload.name}</h5>
        <br>
        <p>
            Your order with id, ${payload.order_id} has been successfully confirmed.
            <br>
            Wait by your door since the package will be on your step anytime soon.
        </p>
        <br>
        <br>
        <h5>Regards</h5>
        <h6>BasicCom</h6>
    `;
}