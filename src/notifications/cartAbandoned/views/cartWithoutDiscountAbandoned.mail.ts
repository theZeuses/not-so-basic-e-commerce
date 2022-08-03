export const mailView = (payload: any) : string => {
    return `
        <h5>Dear ${payload.name}</h5>
        <br>
        <p>
            You have an unfinished cart. Complete your order to get limited time discounts.
        </p>
        <br>
        <br>
        <h5>Regards</h5>
        <h6>BasicCom</h6>
    `;
}