import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { Message } from '@org/data-access';
import { AdminAccountService } from '../../service/account.service';
import { AdminChangePassword } from './change-password';

describe('AdminChangePassword', () => {
  const credentials = {
    currentPassword: 'old-test-password',
    newPassword: 'new-test-password',
    confirmPassword: 'new-test-password',
  };
  let api: { changePassword: ReturnType<typeof vi.fn> };
  let message: { show: ReturnType<typeof vi.fn> };
  let component: AdminChangePassword;
  beforeEach(async () => {
    api = { changePassword: vi.fn() };
    message = { show: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [AdminChangePassword],
      providers: [
        provideTranslateService(),
        { provide: AdminAccountService, useValue: api },
        { provide: Message, useValue: message },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AdminChangePassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  it('rejects mismatched passwords before making a request', () => {
    component.form.setValue({
      ...credentials,
      confirmPassword: 'different-password',
    });
    component.save();
    expect(api.changePassword).not.toHaveBeenCalled();
    expect(component.form.hasError('passwordMismatch')).toBe(true);
  });
  it('prevents duplicate requests and clears the form only on success', () => {
    const response = new Subject<unknown>();
    api.changePassword.mockReturnValue(response);
    component.form.setValue(credentials);
    component.save();
    component.save();
    expect(api.changePassword).toHaveBeenCalledTimes(1);
    expect(component.isSubmitting()).toBe(true);
    response.next({ status: true });
    response.complete();
    expect(component.isSubmitting()).toBe(false);
    expect(component.form.controls.newPassword.value).toBe('');
  });
  it('retains the form and reports a server rejection', () => {
    api.changePassword.mockReturnValue(
      of({ status: false, message: 'Incorrect password' }),
    );
    component.form.setValue(credentials);
    component.save();
    expect(message.show).toHaveBeenCalledWith('error', 'Incorrect password');
    expect(component.form.getRawValue()).toEqual(credentials);
  });
});
