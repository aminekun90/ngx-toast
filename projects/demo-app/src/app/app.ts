import { Component, inject } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ToastContainerComponent, ToastService } from 'ngx-toast';
import { ToastPlayground } from './components/ToastPlayground';
@Component({
  selector: 'app-root',
  imports: [ToastContainerComponent,ToastPlayground],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public toastService = inject(ToastService);
  public version = "1.0.0";
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    this.version=this.toastService.version;
  }

  addToast(type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.show({
      type: type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      message: `This is a sample ${type} message provided by ngx-toast.`,
      duration: 4000,
      progressBar: true,
      position: 'bottom-right'
    });
  }
  gotoReact() {
    globalThis.location.href = "https://aminekun90.github.io/ngx-toast/react/";
  }
  gotoGithub() {
    globalThis.location.href = "https://github.com/aminekun90/ngx-toast/";
  }
  gotoNpm() {
    globalThis.location.href = "https://www.npmjs.com/package/@aminekun90/ngx-toast";
  }
}