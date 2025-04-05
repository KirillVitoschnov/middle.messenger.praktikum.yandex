import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { addActiveClass } from './addActiveClass';

describe('Функция addActiveClass', () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="chat-block"></div>
          <div class="chat-block active"></div>
          <div class="chat-block"></div>
        </body>
      </html>
    `);
    document = dom.window.document;
    (global as any).document = document;
  });

  it('должна снять класс "active" со всех .chat-block и добавить к нужному', () => {
    const chatBlocks = document.querySelectorAll('.chat-block');
    const targetBlock = chatBlocks[2];

    const fakeEvent = {
      preventDefault: () => {},
      target: targetBlock,
    } as unknown as Event;

    addActiveClass(fakeEvent);

    expect(chatBlocks[0].classList.contains('active')).to.be.false;
    expect(chatBlocks[1].classList.contains('active')).to.be.false;
    expect(chatBlocks[2].classList.contains('active')).to.be.true;
  });

  it('не должна падать, если event.target не внутри .chat-block', () => {
    const outsideEl = document.createElement('span');
    document.body.appendChild(outsideEl);

    const fakeEvent = {
      preventDefault: () => {},
      target: outsideEl,
    } as unknown as Event;

    let errorCaught = false;
    try {
      addActiveClass(fakeEvent);
    } catch (error) {
      errorCaught = true;
    }

    const chatBlocks = document.querySelectorAll('.chat-block');
    chatBlocks.forEach((block) => {
      expect(block.classList.contains('active')).to.be.false;
    });

    expect(errorCaught).to.be.true;
  });
});
