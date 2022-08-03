import { MockModel } from "@core/objection-js/mocks";
import { orderItemStub } from '../../test/stubs/orderItem.stub';

export class OrderItemModel extends MockModel {
    static stub = orderItemStub();
}