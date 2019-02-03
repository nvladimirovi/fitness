import { LoginRouterModule } from './login-router.module';

describe('LoginRouterModule', () => {
  let loginRouterModule: LoginRouterModule;

  beforeEach(() => {
    loginRouterModule = new LoginRouterModule();
  });

  it('should create an instance', () => {
    expect(loginRouterModule).toBeTruthy();
  });
});
