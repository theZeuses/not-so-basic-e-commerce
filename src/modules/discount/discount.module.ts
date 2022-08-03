import { Router } from 'express';
import { DiscountController } from '@modules/discount/discount.controller';
import { DiscountRouter } from '@modules/discount/discount.router';
import { DiscountService } from '@modules/discount/discount.service';
import { DiscountModel } from '@modules/discount/model/discount.model';

export class DiscountModule {
    public readonly discountService: DiscountService;
    public readonly router: Router;

    constructor(
        private readonly discountModel: typeof DiscountModel
    ){
        this.discountService = new DiscountService(this.discountModel);
        const discountController = new DiscountController(this.discountService);
        const discountRouter = new DiscountRouter(discountController, Router());

        this.router = Router();
        this.router.use('/api/v1/discounts', discountRouter.v1ApiRoute());
    }
}