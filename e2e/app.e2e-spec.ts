import { BusyBusPage } from './app.po';

describe('busy-bus App', () => {
  let page: BusyBusPage;

  beforeEach(() => {
    page = new BusyBusPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
