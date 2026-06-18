import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RoseApp } from './app/remote-entry/entry';

bootstrapApplication(RoseApp, appConfig).catch((err) => console.error(err));
