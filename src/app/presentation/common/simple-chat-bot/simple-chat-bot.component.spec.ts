import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleChatBotComponent } from './simple-chat-bot.component';

describe('SimpleChatBotComponent', () => {
  let component: SimpleChatBotComponent;
  let fixture: ComponentFixture<SimpleChatBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleChatBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleChatBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
