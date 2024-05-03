export const generateSocketService = (componentName: string) => {
  let template;

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const className =
    capitalizeFirstLetter(componentName || "") + "SocketService";

  template = `import { DolphSocketServiceHandler } from '@dolphjs/dolph/classes';
import { Dolph } from '@dolphjs/dolph/common';

export class ${className} extends DolphSocketServiceHandler<Dolph> {
  constructor() {
    super();
    this.socketService;
    this.handleEvents();
  }

  private handleEvents() {
    this.socket.on('connection', (socket) => {
      socket.emit('connected', 'connection successful');
    });
  }
}
    `;
  return template;
};
