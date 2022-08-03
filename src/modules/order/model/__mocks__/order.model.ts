import { MockModel } from "@core/objection-js/mocks";
import { orderStub } from '../../test/stubs/order.stub';

export class OrderModel extends MockModel {
    static stub = orderStub();
}