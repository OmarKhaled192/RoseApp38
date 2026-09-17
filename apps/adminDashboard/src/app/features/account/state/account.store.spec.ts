import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AuthenticationService } from '@org/auth';
import { Message } from '@org/data-access';
import {
  AdminAccountService,
  AdminAccountUploadService,
} from '../service/account.service';
import { AdminAccountStore } from './account.store';

describe('Admin account operations', () => {
  const profile = {
    firstName: 'Test',
    lastName: 'Admin',
    phone: '+201012345678',
    photo: '',
  };
  let api: {
    getProfile: ReturnType<typeof vi.fn>;
    updateProfile: ReturnType<typeof vi.fn>;
    deleteAccount: ReturnType<typeof vi.fn>;
  };
  let upload: { post: ReturnType<typeof vi.fn> };
  let auth: {
    getUserData: ReturnType<typeof vi.fn>;
    setUserData: ReturnType<typeof vi.fn>;
    removeToken: ReturnType<typeof vi.fn>;
  };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let message: { show: ReturnType<typeof vi.fn> };
  let store: InstanceType<typeof AdminAccountStore>;

  beforeEach(() => {
    api = {
      getProfile: vi.fn(() => ({
        value: signal(undefined),
        isLoading: signal(false),
        error: signal(undefined),
        reload: vi.fn(),
      })),
      updateProfile: vi.fn(),
      deleteAccount: vi.fn(),
    };
    upload = { post: vi.fn() };
    auth = {
      getUserData: vi.fn(() => ({ ...profile, role: 'ADMIN' })),
      setUserData: vi.fn(),
      removeToken: vi.fn(),
    };
    router = { navigateByUrl: vi.fn() };
    message = { show: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        AdminAccountStore,
        { provide: AdminAccountService, useValue: api },
        { provide: AdminAccountUploadService, useValue: upload },
        { provide: AuthenticationService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: Message, useValue: message },
      ],
    });
    store = TestBed.inject(AdminAccountStore);
  });

  it('keeps saving active until completion and ignores duplicate submissions', () => {
    const pending = new Subject<unknown>();
    api.updateProfile.mockReturnValue(pending);
    store.save({ profile, file: null });
    store.save({ profile, file: null });
    expect(store.isSaving()).toBe(true);
    expect(api.updateProfile).toHaveBeenCalledTimes(1);
    pending.next({ status: true, payload: {} });
    pending.complete();
    expect(store.isSaving()).toBe(false);
    expect(auth.setUserData).toHaveBeenCalledWith(
      expect.objectContaining(profile),
    );
  });

  it('allows retry after an HTTP failure', () => {
    const pending = new Subject<unknown>();
    api.updateProfile
      .mockReturnValueOnce(pending)
      .mockReturnValue(of({ status: true, payload: {} }));
    store.save({ profile, file: null });
    pending.error({ error: { message: 'Temporary error' } });
    expect(store.isSaving()).toBe(false);
    store.save({ profile, file: null });
    expect(api.updateProfile).toHaveBeenCalledTimes(2);
    expect(store.savedVersion()).toBe(1);
  });

  it('does not update session data after a rejected save', () => {
    api.updateProfile.mockReturnValue(
      of({ status: false, message: 'Rejected' }),
    );
    store.save({ profile, file: null });
    expect(auth.setUserData).not.toHaveBeenCalled();
    expect(message.show).toHaveBeenCalledWith('error', 'Rejected');
  });

  it('waits for image upload before submitting the profile with its returned URL', () => {
    const pending = new Subject<unknown>();
    upload.post.mockReturnValue(pending);
    api.updateProfile.mockReturnValue(of({ status: true, payload: {} }));
    const file = new File(['test'], 'photo.png', { type: 'image/png' });
    store.save({ profile, file });
    expect(api.updateProfile).not.toHaveBeenCalled();
    expect(upload.post.mock.calls[0][0].get('image')).toBe(file);
    pending.next({ status: true, payload: { url: '/uploaded-photo.png' } });
    pending.complete();
    expect(api.updateProfile).toHaveBeenCalledWith({
      ...profile,
      photo: '/uploaded-photo.png',
    });
    expect(store.user()?.photo).toBe('/uploaded-photo.png');
  });

  it('preserves the session on delete failure, then logs out after a successful retry', () => {
    api.deleteAccount
      .mockReturnValueOnce(of({ status: false, message: 'Rejected' }))
      .mockReturnValueOnce(of(null));
    store.deleteAccount();
    expect(auth.removeToken).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    store.deleteAccount();
    expect(auth.removeToken).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    expect(store.user()).toBeNull();
  });
});
