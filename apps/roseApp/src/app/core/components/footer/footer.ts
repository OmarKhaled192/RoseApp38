import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

    
  email = '';

  onSubscribe(): void {
    if (this.email && this.email.includes('@')) {
      alert(
        `Thank you! Your 20% discount coupon will be sent to ${this.email}`,
      );
      this.email = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
  
}
