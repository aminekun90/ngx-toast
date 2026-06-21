import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ToastComponent } from './ngx-toast';

@Component({
  standalone: true,
  imports: [ToastComponent],
  template: `<ngx-toast-item [toast]="mockToast"></ngx-toast-item>`
})
class TestHostComponent {
  mockToast: any = {
    id: 1,
    type: 'success',
    title: 'Test Title',
    message: 'Test message',
    closing: false,
    position: 'bottom-right',
    progressBar: true,
    progressAnimation: 'increasing',
    toastClass: '',
    icon: ['fas', 'check-circle'],
    pauseOnHover: true
  };
}

describe('ToastComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ToastComponent, FontAwesomeModule],
    }).compileComponents();

    // ✅ Crucial : On injecte la librairie d'icônes dans le contexte du test
    const library = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const element = fixture.nativeElement.querySelector('ngx-toast-item');
    expect(element).toBeTruthy();
  });
});