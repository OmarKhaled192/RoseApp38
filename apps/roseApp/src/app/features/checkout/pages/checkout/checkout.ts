import { Component } from '@angular/core';
import { RelatedProduct } from '../../../product/pages/related-product/related-product';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from "@angular/router";
import { SummaryCheckout } from "./summary-checkout/summary-checkout";

@Component({
  selector: 'app-checkout',
  imports: [RelatedProduct, TranslatePipe, RouterModule, SummaryCheckout],
  templateUrl: './checkout.html'
})
export class Checkout {}
