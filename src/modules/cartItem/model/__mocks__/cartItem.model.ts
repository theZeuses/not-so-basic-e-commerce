import { MockModel } from "@core/objection-js/mocks";
import { cartItemStub } from '../../test/stubs/cartItem.stub';

export class CartItemModel extends MockModel {
    static stub = cartItemStub();
}