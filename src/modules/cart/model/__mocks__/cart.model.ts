import { MockModel } from "@core/objection-js/mocks";
import { cartStub } from '../../test/stubs/cart.stub';

export class CartModel extends MockModel {
    static stub = cartStub();
}