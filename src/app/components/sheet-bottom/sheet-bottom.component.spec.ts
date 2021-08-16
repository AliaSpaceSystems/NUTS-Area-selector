import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetBottomComponent } from './sheet-bottom.component';

describe('SheetBottomComponent', () => {
  let component: SheetBottomComponent;
  let fixture: ComponentFixture<SheetBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
