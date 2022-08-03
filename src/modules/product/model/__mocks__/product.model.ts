import { MockModel } from "@core/objection-js/mocks";
import { productStub } from '../../test/stubs/product.stub';

export class ProductModel extends MockModel {
    static stub = productStub();
}